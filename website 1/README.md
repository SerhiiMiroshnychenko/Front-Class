# Облік витрат (Expense Tracking)

Простий веб-додаток для обліку витрат з можливістю запису витрат у Excel файл.

## Функціональність

- Відображення поточного часу
- Відображення сумарних витрат за категоріями (Продукти, Речі, Інше)
- Форма для додавання нових витрат
- Збереження витрат у Excel файл

## Вимоги

Для роботи додатку потрібно встановити:

1. Python 3.6 або вище
2. Необхідні Python-пакети:
   - Flask
   - pandas
   - openpyxl
   - flask-cors

## Встановлення залежностей

```
pip install flask pandas openpyxl flask-cors
```

## Запуск додатку

1. Відкрийте командний рядок у папці з проектом
2. Запустіть Python-сервер:

```
python server.py
```

3. Відкрийте веб-браузер і перейдіть за адресою:

```
http://localhost:5000
```

## Структура проекту

- `index.html` - HTML-сторінка з інтерфейсом користувача
- `styles.css` - CSS-стилі для оформлення сторінки
- `script.js` - JavaScript-код для динамічної функціональності
- `server.py` - Python-сервер для обробки запитів і роботи з Excel
- `expenses.xlsx` - Excel-файл для зберігання витрат (створюється автоматично)

## Використання

1. Виберіть категорію витрат зі списку
2. Введіть суму витрат
3. Натисніть кнопку "Записати"
4. Витрати будуть додані до Excel-файлу, а сумарні значення оновляться на сторінці