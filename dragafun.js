const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
function drawCircle(x, y, radius) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fillStyle = "blue"; // Cambia el color como desees
  ctx.fill();
  ctx.closePath();
}
let circleX = 100;
let circleY = 100;
const circleRadius = 20;
let isDragging = false;

canvas.addEventListener("mousedown", (e) => {
  const mouseX = e.clientX - canvas.getBoundingClientRect().left;
  const mouseY = e.clientY - canvas.getBoundingClientRect().top;

  // Verifica si el clic está dentro del círculo
  if (
    Math.sqrt((mouseX - circleX) ** 2 + (mouseY - circleY) ** 2) <= circleRadius
  ) {
    isDragging = true;
  }
});

canvas.addEventListener("mousemove", (e) => {
  if (isDragging) {
    circleX = e.clientX - canvas.getBoundingClientRect().left;
    circleY = e.clientY - canvas.getBoundingClientRect().top;
    clearCanvas();
    drawCircle(circleX, circleY, circleRadius);
  }
});

canvas.addEventListener("mouseup", () => {
  isDragging = false;
});

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

drawCircle(circleX, circleY, circleRadius);
