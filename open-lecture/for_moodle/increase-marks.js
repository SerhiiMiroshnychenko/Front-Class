(() => {
  // 1) Створюємо кнопку
  const btn = document.createElement('button');
  btn.textContent = 'Збільшити оцінки';
  btn.style.position = 'fixed';
  btn.style.left = '50%';
  btn.style.bottom = '20px';
  btn.style.transform = 'translateX(-50%)';
  btn.style.zIndex = '999999';
  btn.style.padding = '12px 18px';
  btn.style.fontSize = '16px';
  btn.style.border = '1px solid #333';
  btn.style.borderRadius = '10px';
  btn.style.background = '#fff';
  btn.style.cursor = 'pointer';
  btn.style.boxShadow = '0 6px 18px rgba(0,0,0,0.2)';

  // 2) Логіка: помножити всі "оцінки" в таблиці на 10
  function multiplyGradesBy10() {
    const gradeCells = document.querySelectorAll('table.user-grade td.column-grade');

    gradeCells.forEach((cell) => {
      const raw = (cell.textContent || '').trim();

      // Пропускаємо порожні/тире
      if (!raw || raw === '-' || raw === '–') return;

      // Moodle часто використовує кому як десятковий розділювач
      const normalized = raw.replace(/\s+/g, '').replace(',', '.');

      const num = Number(normalized);
      if (!Number.isFinite(num)) return;

      // Щоб при повторному натисканні не множити знову і знову —
      // збережемо оригінал у data-атрибут (демонстрація "стану" в DOM)
      if (!cell.dataset.origValue) {
        cell.dataset.origValue = raw;
      }

      const newValue = num * 10;

      // Повернемо кому як розділювач (щоб було "по-українськи")
      cell.textContent = String(newValue).replace('.', ',');
    });
  }

  btn.addEventListener('click', multiplyGradesBy10);

  // 3) Додаємо кнопку на сторінку
  document.body.appendChild(btn);
})();