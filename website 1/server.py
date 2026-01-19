import os
import pandas as pd
from datetime import datetime

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Path to the Excel file
EXCEL_FILE = 'expenses.xlsx'

# Function to create Excel file if it doesn't exist
def initialize_excel_file():
    if not os.path.exists(EXCEL_FILE):
        # Create a DataFrame with the required columns
        df = pd.DataFrame(columns=['Дата та час', 'Категорія', 'Сума'])
        # Save to Excel
        df.to_excel(EXCEL_FILE, index=False)
        print(f"Created new Excel file: {EXCEL_FILE}")

# Function to get current expense totals
def get_expense_totals():
    if not os.path.exists(EXCEL_FILE):
        return {"products": 0, "clothes": 0, "other": 0}

    try:
        df = pd.read_excel(EXCEL_FILE)

        # Map Ukrainian category names to English keys
        category_map = {
            'Продукти': 'products',
            'Речі': 'clothes',
            'Інше': 'other'
        }

        # Initialize totals
        totals = {"products": 0, "clothes": 0, "other": 0}

        # Calculate totals for each category
        for category_ua, category_en in category_map.items():
            category_total = df[df['Категорія'] == category_ua]['Сума'].sum()
            totals[category_en] = float(category_total)

        return totals

    except Exception as e:
        print(f"Error calculating expense totals: {e}")
        return {"products": 0, "clothes": 0, "other": 0}

# Serve static files (HTML, CSS, JS)
@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def static_files(path):
    return send_from_directory('.', path)

# API endpoint to get expense totals
@app.route('/get_totals', methods=['GET'])
def get_totals():
    return jsonify(get_expense_totals())

# API endpoint to add a new expense
@app.route('/add_expense', methods=['POST'])
def add_expense():
    try:
        data = request.json
        category = data.get('category')
        amount = data.get('amount')

        if not category or not amount:
            return jsonify({"error": "Missing category or amount"}), 400

        # Map English category keys to Ukrainian names
        category_map = {
            'products': 'Продукти',
            'clothes': 'Речі',
            'other': 'Інше'
        }

        category_ua = category_map.get(category)
        if not category_ua:
            return jsonify({"error": "Invalid category"}), 400

        # Get current timestamp
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        # Initialize Excel file if it doesn't exist
        initialize_excel_file()

        # Read existing data
        df = pd.read_excel(EXCEL_FILE)

        # Add new expense
        new_row = pd.DataFrame({
            'Дата та час': [timestamp],
            'Категорія': [category_ua],
            'Сума': [amount]
        })

        # Append to existing data
        df = pd.concat([df, new_row], ignore_index=True)

        # Save updated data
        df.to_excel(EXCEL_FILE, index=False)

        # Return updated totals
        return jsonify(get_expense_totals())

    except Exception as e:
        print(f"Error adding expense: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Initialize Excel file on startup
    initialize_excel_file()
    # Run the Flask app
    app.run(debug=True, port=5000)
