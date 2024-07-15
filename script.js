// Get the canvas element and its context
const canvas = document.getElementById('whiteboard');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = 800;
canvas.height = 600;

// Variables to track mouse position and drawing state
let isDrawing = false;
let lastX = 0;
let lastY = 0;

// Start drawing on mouse down
canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
});

// Stop drawing on mouse up
canvas.addEventListener('mouseup', () => {
    isDrawing = false;
});

// Draw on canvas while mouse is moving
canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    [lastX, lastY] = [e.offsetX, e.offsetY];
});
