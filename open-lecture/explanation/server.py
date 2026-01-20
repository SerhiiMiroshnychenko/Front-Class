import os
import pandas as pd
from datetime import datetime

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Увімкнення CORS для всіх маршрутів

# Шлях до Excel-файлу
EXCEL_FILE = 'expenses.xlsx'

# Функція створення Excel-файлу, якщо він не існує
def initialize_excel_file():
    if not os.path.exists(EXCEL_FILE):
        # Створюємо DataFrame з потрібними колонками
        df = pd.DataFrame(columns=['Дата та час', 'Категорія', 'Сума'])
        # Зберігаємо в Excel
        df.to_excel(EXCEL_FILE, index=False)
        print(f"Створено новий Excel-файл: {EXCEL_FILE}")

# Функція отримання поточних сум витрат
def get_expense_totals():
    if not os.path.exists(EXCEL_FILE):
        return {"products": 0, "clothes": 0, "other": 0}

    try:
        df = pd.read_excel(EXCEL_FILE)

        # Мапа українських назв категорій на ключі для фронтенду
        category_map = {
            'Продукти': 'products',
            'Речі': 'clothes',
            'Інше': 'other'
        }

        # Ініціалізуємо суми
        totals = {"products": 0, "clothes": 0, "other": 0}

        # Рахуємо суми по кожній категорії
        for category_ua, category_en in category_map.items():
            category_total = df[df['Категорія'] == category_ua]['Сума'].sum()
            totals[category_en] = float(category_total)

        return totals

    except Exception as e:
        print(f"Помилка під час підрахунку сум витрат: {e}")
        return {"products": 0, "clothes": 0, "other": 0}

# Віддаємо статичні файли (HTML, CSS, JS)
@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def static_files(path):
    return send_from_directory('.', path)

# API для отримання сум витрат
@app.route('/get_totals', methods=['GET'])
def get_totals():
    return jsonify(get_expense_totals())

# API для додавання нової витрати
@app.route('/add_expense', methods=['POST'])
def add_expense():
    try:
        data = request.get_json(silent=True) or {}
        category = data.get('category')
        amount_raw = data.get('amount')

        if not category:
            return jsonify({"error": "Не вказано категорію"}), 400

        if amount_raw is None:
            return jsonify({"error": "Не вказано суму"}), 400

        try:
            amount = float(amount_raw)
        except (TypeError, ValueError):
            return jsonify({"error": "Сума має бути числом"}), 400

        if amount <= 0:
            return jsonify({"error": "Сума має бути більшою за нуль"}), 400

        # Мапа ключів з фронтенду на українські назви
        category_map = {
            'products': 'Продукти',
            'clothes': 'Речі',
            'other': 'Інше'
        }

        category_ua = category_map.get(category)
        if not category_ua:
            return jsonify({"error": "Некоректна категорія"}), 400

        # Поточна дата та час
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        # Ініціалізація Excel-файлу (якщо його немає)
        initialize_excel_file()

        # Читаємо наявні дані
        df = pd.read_excel(EXCEL_FILE)

        # Додаємо нову витрату
        new_row = pd.DataFrame({
            'Дата та час': [timestamp],
            'Категорія': [category_ua],
            'Сума': [amount]
        })

        # Додаємо рядок до наявних даних
        if df.empty:
            df = new_row
        else:
            df = pd.concat([df, new_row], ignore_index=True)

        # Зберігаємо оновлені дані
        df.to_excel(EXCEL_FILE, index=False)

        # Повертаємо оновлені суми
        return jsonify(get_expense_totals())

    except Exception as e:
        print(f"Помилка під час додавання витрати: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Ініціалізуємо Excel-файл при старті
    initialize_excel_file()
    # Запускаємо Flask-додаток
    app.run(debug=True, port=5000)
