//Canvas Setup
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 500;

let spriteCount = 0;
let score = 0;
let gameFrame = 0;
ctx.font = '50px Georgia';

//Mouse Interactivity
let canvasPosition = canvas.getBoundingClientRect();

const mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    click: false
}

canvas.addEventListener('mousedown', (event) => {
    mouse.click = true;
    mouse.x = event.x - canvasPosition.left;
    mouse.y = event.y - canvasPosition.top;
});

canvas.addEventListener('mouseup', () => {
    mouse.click = false;

})


class Player {
    constructor() {
        this.x = 0
        this.y = canvas.height / 2;
        this.radius = 40;
        this.angle = 0;
        this.frame = 0;
        this.frameX = 0;
        this.frameY = 0;
    }

    update() {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        if (mouse.x != this.x) {
            this.x -= dx / 20; //aqui é a velocidade que o Player move no x, quanto maior o número da divisão, mais lento.
        }
        if (mouse.y != this.y) {
            this.y -= dy / 20; //também é a velociade que o Player move.
        }
    }

    draw() {
        if (mouse.click) {
            ctx.lineWidth = 0.2; //aqui cria uma linha, ligando o player ao mouse do usuário de 0.2px;
            ctx.beginPath(); //nome da linha.
            ctx.moveTo(this.x, this.y); //começo da linha, posição do player.
            ctx.lineTo(mouse.x, mouse.y); //final da linha, posição do mouse.
            ctx.stroke(); //o que vai juntar os dois pontos da linha.
        }
        ctx.fillStyle = 'orange';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.fillRect(this.x, this.y, this.radius, 10)
    }
}

const player = new Player;

//Bubbles
const bubblesArr = [];
class Bubble {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 100 + Math.random() * canvas.height; //esse canvas.height no começo, faz as bolhas nascerem de baixo do início do canvas, e o + 100 garante que a bolha inteira venha de baixo da tela, antes as bolhas nasciam randomicamente, podendo nascer no meio/final da tela.
        this.radius = Math.random() <= 0.5 ? 35 : 20; //quero as bolhas de dois tamanhos variados.
        this.speed = Math.random() * 5 + 1; //nº entre 1 e 6.
    }
    update() {
        this.y -= this.speed;
        const dx = this.x - player.x;
        const dy = this.y - player.y;
    }
    draw() {
        ctx.fillStyle = 'blue';
        ctx.beginPath() //começa a bola.
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI *2); //desenha círculo.
        ctx.fill(); //preencher a bola de azul
        ctx.closePath(); //termina a bola.
        ctx.stroke();
    }
}

function handleBubbles() {
    if (gameFrame % 50 == 0) { //Tradução: Rode a função a cada 50 Frames.
        bubblesArr.push(new Bubble()); //uma nova bolha é adicionada no array a cada 50 frames.
    }
    for (let i = 0; i < bubblesArr.length; i++) { //para cada nova bolha individual.
        bubblesArr[i].update(); //eu preciso dar update na bolha nova
        bubblesArr[i].draw(); //e preciso desenhar a bolha nova.
    } 
}

//Animation Loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleBubbles()
    player.update();
    player.draw();
    requestAnimationFrame(animate);
}
animate()
