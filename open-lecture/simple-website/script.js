function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('clock').textContent = `${hours}:${minutes}:${seconds}`;
}

setInterval(updateClock, 1000);
updateClock();
let expenseTotals = {
    products: 0,   // Витрати на продукти
    clothes: 0,    // Витрати на речі
    other: 0       // Інші витрати
};

function updateExpenseDisplay() {
    document.getElementById('products-total').textContent = expenseTotals.products;
    document.getElementById('clothes-total').textContent = expenseTotals.clothes;
    document.getElementById('other-total').textContent = expenseTotals.other;
}

async function fetchExpenseTotals() {

    try {
        const response = await fetch('http://localhost:5000/get_totals');
        if (!response.ok) {
            throw new Error('Не вдалось отримати суми витрат');
        }
        const data = await response.json();
        expenseTotals = data;
        updateExpenseDisplay();

    } catch (error) {
        console.error('Помилка отримання сум витрат:', error);
    }
}

document.getElementById('expense-form').addEventListener('submit', async function (event) {
    event.preventDefault();
    const category = document.getElementById('category').value;
    const amount = parseFloat(document.getElementById('amount').value);
    if (!category || isNaN(amount) || amount <= 0) {
        alert('Будь ласка, виберіть категорію та введіть коректну суму');
        return;
    }
    try {
        const response = await fetch('http://localhost:5000/add_expense', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                category: category,
                amount: amount
            })
        });
        if (!response.ok) {
            throw new Error('Не вдалось додати витрату');
        }
        const data = await response.json();
        expenseTotals = data;
        updateExpenseDisplay();
        document.getElementById('expense-form').reset();
    } catch (error) {
        console.error('Помилка додавання витрати:', error);
        alert('Помилка при додаванні витрати. Спробуйте ще раз.');
    }
});
document.addEventListener('DOMContentLoaded', fetchExpenseTotals);
