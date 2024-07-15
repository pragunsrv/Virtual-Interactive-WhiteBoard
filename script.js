const canvas = document.getElementById('whiteboard');
const ctx = canvas.getContext('2d');
const brushSize = document.getElementById('brushSize');
const clearButton = document.getElementById('clearCanvas');
const saveButton = document.getElementById('saveCanvas');
const rectButton = document.getElementById('drawRectangle');
const circleButton = document.getElementById('drawCircle');
const textButton = document.getElementById('addText');
const textInput = document.getElementById('textInput');
const moveButton = document.getElementById('moveMode');
const resizeButton = document.getElementById('resizeMode');
const deleteButton = document.getElementById('deleteShape');
const colorBtns = document.querySelectorAll('.color-btn');
const backgroundColorInput = document.getElementById('backgroundColor');

canvas.width = 800;
canvas.height = 600;

let isDrawing = false;
let drawShape = 'line';
let lastX = 0;
let lastY = 0;
let currentColor = '#000000';
let shapes = [];
let currentShape = null;
let mode = 'draw'; // 'draw', 'move', 'resize', 'delete'

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

backgroundColorInput.addEventListener('input', (e) => {
    canvas.style.backgroundColor = e.target.value;
});

canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    lastX = e.offsetX;
    lastY = e.offsetY;
    if (mode === 'move' || mode === 'resize' || mode === 'delete') {
        currentShape = shapes.find(shape => 
            e.offsetX >= shape.x && e.offsetX <= shape.x + shape.width &&
            e.offsetY >= shape.y && e.offsetY <= shape.y + shape.height
        );
    }
});

canvas.addEventListener('mouseup', () => {
    isDrawing = false;
    if (mode === 'draw') {
        if (drawShape === 'rectangle') {
            shapes.push({ type: 'rectangle', x: lastX, y: lastY, width: canvas.mouseX - lastX, height: canvas.mouseY - lastY, color: currentColor });
            drawRectangle(lastX, lastY, canvas.mouseX - lastX, canvas.mouseY - lastY);
        } else if (drawShape === 'circle') {
            const radius = Math.sqrt(Math.pow(canvas.mouseX - lastX, 2) + Math.pow(canvas.mouseY - lastY, 2));
            shapes.push({ type: 'circle', x: lastX, y: lastY, radius: radius, color: currentColor });
            drawCircle(lastX, lastY, radius);
        }
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;
    canvas.mouseX = e.offsetX;
    canvas.mouseY = e.offsetY;
    if (mode === 'draw') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        redrawShapes();
        if (drawShape === 'line') {
            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();
        }
    } else if (mode === 'move' || mode === 'resize' || mode === 'delete') {
        if (currentShape) {
            if (mode === 'move') {
                const dx = e.offsetX - lastX;
                const dy = e.offsetY - lastY;
                currentShape.x += dx;
                currentShape.y += dy;
            } else if (mode === 'resize') {
                const dx = e.offsetX - lastX;
                const dy = e.offsetY - lastY;
                currentShape.width += dx;
                currentShape.height += dy;
            } else if (mode === 'delete') {
                shapes = shapes.filter(shape => shape !== currentShape);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                redrawShapes();
                currentShape = null;
                return;
            }
            lastX = e.offsetX;
            lastY = e.offsetY;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            redrawShapes();
        }
    }
});

clearButton.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    shapes = [];
});

saveButton.addEventListener('click', () => {
    const link = document.createElement('a');
    link.href = canvas.toDataURL();
    link.download = 'drawing.png';
    link.click();
});

rectButton.addEventListener('click', () => {
    drawShape = 'rectangle';
});

circleButton.addEventListener('click', () => {
    drawShape = 'circle';
});

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

moveButton.addEventListener('click', () => {
    mode = 'move';
});

resizeButton.addEventListener('click', () => {
    mode = 'resize';
});

deleteButton.addEventListener('click', () => {
    mode = 'delete';
});

function drawRectangle(x, y, width, height) {
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.strokeStyle = currentColor;
    ctx.stroke();
}

function drawCircle(x, y, radius) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.strokeStyle = currentColor;
    ctx.stroke();
}

function redrawShapes() {
    shapes.forEach(shape => {
        if (shape.type === 'rectangle') {
            ctx.beginPath();
            ctx.rect(shape.x, shape.y, shape.width, shape.height);
            ctx.strokeStyle = shape.color;
            ctx.stroke();
        } else if (shape.type === 'circle') {
            ctx.beginPath();
            ctx.arc(shape.x, shape.y, shape.radius, 0, Math.PI * 2);
            ctx.strokeStyle = shape.color;
            ctx.stroke();
        }
    });
}
