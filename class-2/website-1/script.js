const button = document.getElementById("colorButton");

function getRandomColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return { r, g, b };
}

function darkenColor({ r, g, b }, percent = 20) {
  const factor = 1 - percent / 100;
  return {
    r: Math.floor(r * factor),
    g: Math.floor(g * factor),
    b: Math.floor(b * factor)
  };
}

function rgbToString({ r, g, b }) {
  return `rgb(${r}, ${g}, ${b})`;
}

function getRandomSize(min = 10, max = 300) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

button.addEventListener("click", () => {
  const color = getRandomColor();
  const darker = darkenColor(color);

  const bgColor = rgbToString(color);
  const borderColor = rgbToString(darker);
  const size = getRandomSize();

  button.style.backgroundColor = bgColor;
  button.style.border = `1mm solid ${borderColor}`;
  button.style.width = `${size}px`;
  button.style.height = `${size}px`;
});



