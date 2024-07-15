// Get the canvas element and its context
const canvas = document.getElementById('whiteboard');
const ctx = canvas.getContext('2d');

// Get the controls
const brushSize = document.getElementById('brushSize');
const clearButton = document.getElementById('clearCanvas');
const saveButton = document.getElementById('saveCanvas');
const rectButton = document.getElementById('drawRectangle');
const circleButton = document.getElementById('drawCircle');
const textButton = document.getElementById('addText');
const textInput = document.getElementById('textInput');
const colorBtns = document.querySelectorAll('.color-btn');

// Set canvas size
canvas.width = 800;
canvas.height = 600;

// Variables to track mouse position and drawing state
let isDrawing = false;
let drawShape = 'line';
let lastX = 0;
let lastY = 0;
let currentColor = '#000000';

// Set default drawing properties
ctx.strokeStyle = currentColor;
ctx.lineWidth = brushSize.value;

// Update drawing properties based on user input
colorBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        currentColor = e.target.getAttribute('data-color');
        ctx.strokeStyle = currentColor;
    });
});

brushSize.addEventListener('input', (e) => {
    ctx.lineWidth = e.target.value;
});

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
    if (drawShape === 'line') {
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
        [lastX, lastY] = [e.offsetX, e.offsetY];
    }
});

// Clear the canvas
clearButton.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Save the canvas as an image
saveButton.addEventListener('click', () => {
    const link = document.createElement('a');
    link.href = canvas.toDataURL();
    link.download = 'drawing.png';
    link.click();
});

// Switch to rectangle drawing
rectButton.addEventListener('click', () => {
    drawShape = 'rectangle';
    canvas.addEventListener('mouseup', (e) => {
        if (drawShape !== 'rectangle') return;
        const width = e.offsetX - lastX;
        const height = e.offsetY - lastY;
        ctx.beginPath();
        ctx.rect(lastX, lastY, width, height);
        ctx.stroke();
        drawShape = 'line'; // Reset to line drawing after rectangle
    });
});

// Switch to circle drawing
circleButton.addEventListener('click', () => {
    drawShape = 'circle';
    canvas.addEventListener('mouseup', (e) => {
        if (drawShape !== 'circle') return;
        const radius = Math.sqrt(Math.pow(e.offsetX - lastX, 2) + Math.pow(e.offsetY - lastY, 2));
        ctx.beginPath();
        ctx.arc(lastX, lastY, radius, 0, 2 * Math.PI);
        ctx.stroke();
        drawShape = 'line'; // Reset to line drawing after circle
    });
});

// Add and edit text on the canvas
textButton.addEventListener('click', () => {
    textInput.style.display = 'block';
    textInput.focus();
});

textInput.addEventListener('blur', () => {
    const text = textInput.value;
    if (text) {
        ctx.font = '20px Arial';
        ctx.fillStyle = currentColor;
        ctx.fillText(text, lastX, lastY);
        textInput.style.display = 'none';
        textInput.value = '';
    }
});
