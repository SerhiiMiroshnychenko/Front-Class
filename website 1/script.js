// Clock functionality
function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    document.getElementById('clock').textContent = `${hours}:${minutes}:${seconds}`;
}

// Update clock every second
setInterval(updateClock, 1000);
updateClock(); // Initial call to display clock immediately

// Initialize expense totals
let expenseTotals = {
    products: 0,
    clothes: 0,
    other: 0
};

// Function to update expense display
function updateExpenseDisplay() {
    document.getElementById('products-total').textContent = expenseTotals.products;
    document.getElementById('clothes-total').textContent = expenseTotals.clothes;
    document.getElementById('other-total').textContent = expenseTotals.other;
}

// Function to fetch current expense totals from the server
async function fetchExpenseTotals() {
    try {
        const response = await fetch('http://localhost:5000/get_totals');
        if (!response.ok) {
            throw new Error('Failed to fetch expense totals');
        }

        const data = await response.json();
        expenseTotals = data;
        updateExpenseDisplay();
    } catch (error) {
        console.error('Error fetching expense totals:', error);
    }
}

// Handle form submission
document.getElementById('expense-form').addEventListener('submit', async function(event) {
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
            throw new Error('Failed to add expense');
        }

        const data = await response.json();
        expenseTotals = data;
        updateExpenseDisplay();

        // Reset form
        document.getElementById('expense-form').reset();

    } catch (error) {
        console.error('Error adding expense:', error);
        alert('Помилка при додаванні витрати. Спробуйте ще раз.');
    }
});

// Fetch initial expense totals when page loads
document.addEventListener('DOMContentLoaded', fetchExpenseTotals);
