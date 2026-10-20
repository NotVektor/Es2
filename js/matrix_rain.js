// https://codepen.io/editor/ErycTheGreat/pen/01a0a3fb-726b-7385-b90c-16a6c19e023d
const canvas = document.getElementById("matrixCanvas");
const ctx = canvas.getContext("2d");

const matrixChars = "0123456789";
const fontSize = 16;
let columns, drops;

// Function to generate random colors
function getRandomColor() {
    const hue = Math.floor(Math.random() * 360);
    const saturation = Math.floor(Math.random() * 30) + 70; // 70-100%
    const lightness = Math.floor(Math.random() * 30) + 70; // 40-70%
    return `hsl(${hue}, ${saturation}%, 60%)`;
}

// Store colors for each column to maintain consistency
const columnColors = [];

// Properly scale canvas for high-DPR screens to prevent smudging and trail artifacts
function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    
    ctx.scale(dpr, dpr);

    columns = Math.floor(window.innerWidth / fontSize);
    drops = Array(columns).fill(1);
    
    // Regenerate column colors on resize
    columnColors.length = 0;
    for (let i = 0; i < columns; i++) {
        columnColors.push(getRandomColor());
    }
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Set initial solid background
ctx.fillStyle = "#000000";
ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

// Secret message setup
const secretMessage = "follow the white rabbit".split(""); 
let messageStartTime = null; 
let letterFadeProgress = Array(secretMessage.length).fill(0); 
const letterFadeSpeed = 1; 
const letterDelay = 1000;

// Generate random colors for each letter in the secret message
const messageLetterColors = secretMessage.map(() => getRandomColor());

function drawMatrix() {
    // Semi-transparent fade trail (from your live site code)
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)"; 
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    // Draw the Matrix characters with randomized colors per column
    ctx.font = fontSize + "px 'White Rabbit Local', sans-serif";
    
    for (let i = 0; i < drops.length; i++) {
        const text = matrixChars.charAt(Math.floor(Math.random() * matrixChars.length));
        ctx.fillStyle = columnColors[i];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > window.innerHeight && Math.random() > 0.975) {
            drops[i] = 0;
            columnColors[i] = getRandomColor(); 
        }
        drops[i]++;
    }

    // Secret message logic
    if (!messageStartTime) {
        messageStartTime = Date.now();
    }
    
    const elapsedTime = Date.now() - messageStartTime;
    if (elapsedTime >= 5000) {
        ctx.font = "400 18px 'White Rabbit Local', sans-serif"; 
        const textWidth = ctx.measureText(secretMessage.join("")).width;
        const xPos = (window.innerWidth - textWidth) / 2;
        const yPos = window.innerHeight / 2;

        secretMessage.forEach((char, index) => {
            const letterAppearTime = 3000 + index * letterDelay; 
            if (elapsedTime >= letterAppearTime) {
                if (letterFadeProgress[index] < 1) {
                    letterFadeProgress[index] += letterFadeSpeed; 
                }
                const rgbColor = messageLetterColors[index];
                const alpha = letterFadeProgress[index];
                // Extract HSL values and convert to rgba
                ctx.fillStyle = rgbColor.replace(')', `, ${alpha})`).replace('hsl', 'hsla');
                ctx.fillText(char, xPos + ctx.measureText(secretMessage.slice(0, index).join("")).width, yPos);
            }
        });
    }
}

let matrixInterval = setInterval(drawMatrix, 50);
