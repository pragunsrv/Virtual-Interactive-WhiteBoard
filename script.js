const canvas = document.getElementById('whiteboard');
const ctx = canvas.getContext('2d');
const brushSize = document.getElementById('brushSize');
const clearButton = document.getElementById('clearCanvas');
const saveButton = document.getElementById('saveCanvas');
const rectButton = document.getElementById('drawRectangle');
const circleButton = document.getElementById('drawCircle');
const textButton = document.getElementById('addText');
const textInput = document.getElementById('textInput');
const fontSizeInput = document.getElementById('fontSize');
const textColorInput = document.getElementById('textColor');
const moveButton = document.getElementById('moveMode');
const resizeButton = document.getElementById('resizeMode');
const deleteButton = document.getElementById('deleteShape');
const groupButton = document.getElementById('groupShapes');
const ungroupButton = document.getElementById('ungroupShapes');
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
let selectedShapes = [];
let isGrouping = false;
let groupId = 0;

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

fontSizeInput.addEventListener('input', (e) => {
    ctx.font = `${e.target.value}px Arial`;
});

textColorInput.addEventListener('input', (e) => {
    ctx.fillStyle = e.target.value;
});

backgroundColorInput.addEventListener('input', (e) => {
    canvas.style.backgroundColor = e.target.value;
});

clearButton.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    shapes = [];
});

saveButton.addEventListener('click', () => {
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'whiteboard.png';
    link.click();
});

rectButton.addEventListener('click', () => {
    drawShape = 'rectangle';
});

circleButton.addEventListener('click', () => {
    drawShape = 'circle';
});

textButton.addEventListener('click', () => {
    drawShape = 'text';
    textInput.style.display = 'block';
    textInput.focus();
});

textInput.addEventListener('blur', () => {
    textInput.style.display = 'none';
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

groupButton.addEventListener('click', () => {
    isGrouping = true;
    groupId = new Date().getTime(); // Unique groupId
    selectedShapes.forEach(shape => {
        shape.groupId = groupId;
    });
    selectedShapes = [];
});

ungroupButton.addEventListener('click', () => {
    isGrouping = false;
    shapes.forEach(shape => {
        if (shape.groupId === currentShape.groupId) {
            shape.groupId = null;
        }
    });
    currentShape.groupId = null;
    selectedShapes = [];
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
        if (currentShape) {
            if (mode === 'delete') {
                shapes = shapes.filter(shape => shape !== currentShape);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                redrawShapes();
                currentShape = null;
                return;
            }
            selectedShapes = shapes.filter(shape => shape.groupId === currentShape.groupId);
        }
    }
});

canvas.addEventListener('mouseup', () => {
    isDrawing = false;
    if (mode === 'draw') {
        if (drawShape === 'rectangle') {
            const newShape = { type: 'rectangle', x: lastX, y: lastY, width: canvas.mouseX - lastX, height: canvas.mouseY - lastY, color: currentColor, groupId };
            shapes.push(newShape);
            drawRectangle(lastX, lastY, canvas.mouseX - lastX, canvas.mouseY - lastY);
        } else if (drawShape === 'circle') {
            const radius = Math.sqrt(Math.pow(canvas.mouseX - lastX, 2) + Math.pow(canvas.mouseY - lastY, 2));
            const newShape = { type: 'circle', x: lastX, y: lastY, radius: radius, color: currentColor, groupId };
            shapes.push(newShape);
            drawCircle(lastX, lastY, radius);
        } else if (drawShape === 'text') {
            const text = textInput.value;
            if (text) {
                ctx.font = `${fontSizeInput.value}px Arial`;
                ctx.fillStyle = textColorInput.value;
                ctx.fillText(text, lastX, lastY);
                const newShape = { type: 'text', x: lastX, y: lastY, text, fontSize: fontSizeInput.value, color: textColorInput.value, groupId };
                shapes.push(newShape);
            }
            textInput.style.display = 'none';
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
    } else if (mode === 'move' || mode === 'resize') {
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
            }
            lastX = e.offsetX;
            lastY = e.offsetY;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            redrawShapes();
        }
    }
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
        ctx.beginPath();
        if (shape.type === 'rectangle') {
            ctx.rect(shape.x, shape.y, shape.width, shape.height);
            ctx.strokeStyle = shape.color;
            ctx.stroke();
        } else if (shape.type === 'circle') {
            ctx.arc(shape.x, shape.y, shape.radius, 0, Math.PI * 2);
            ctx.strokeStyle = shape.color;
            ctx.stroke();
        } else if (shape.type === 'text') {
            ctx.font = `${shape.fontSize}px Arial`;
            ctx.fillStyle = shape.color;
            ctx.fillText(shape.text, shape.x, shape.y);
        }
    });
}
