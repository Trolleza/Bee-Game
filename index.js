//Canvas Setup:
const btnStart = document.getElementById("startButton");
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 500;

let score = 0; //Variável de pontuação.
let gameFrame = 0; //Variável p/ atualizar Frames, como spritesheet
let gameSpeed = 1; //Variável para o background mexer.
let gameOver = false; //Começa como falso, pois ainda não teve GameOver.
let gaming = false;

//Mouse Interactivity:
let canvasPosition = canvas.getBoundingClientRect(); //Para linkar com a borda do canvas, e não com a borda da janela, e pegar o verdadeiro valor de x e y dentro do canvas.
const mouse = {
  x: canvas.width / 2, //Pega o meio da tela horizontalmente.
  y: canvas.height / 2, //Meio da tela verticalmente.
  click: false, //Para verificar se o botão do mouse foi clicado ou solto.
};

canvas.addEventListener("mousedown", (event) => {
  mouse.click = true; //torna o click do mouse verdadeiro quando ele clica.
  mouse.x = event.x - canvasPosition.left; //Diminuindo o canvas Position, traz o x real.
  mouse.y = event.y - canvasPosition.top; //Diminuindo o canvas Position, traz o y real.
  //console.log (mouse.x, mouse.y)
});
canvas.addEventListener("mouseup", (event) => {
  mouse.click = false; //Volta a tornar falso, quando o click para.
});

//Player:
const playerLeft = new Image();
playerLeft.src = "assets/spritesheetLeft.png";
const playerRight = new Image();
playerRight.src = "assets/spritesheetRight.png";

class Player {
  constructor() {
    this.x = 0; //Início do X move até o meio da tela para a posição da linha 15, ao iniciar o jogo.
    this.y = canvas.height / 2; //Meio da tela verticalmente. Move daqui p/ a linha 16.
    this.radius = 35; //Tamanho do Player em formato de bola.
    this.angle = 0; //Usado para rotacionar o Player p/ a direção da posição do mouse.
    //SPRITESHEET:
    this.frame = 0; //Varia de acordo com o tanto de imgns individuais que tem cada img, nesse caso de 0 a 5.
    this.frameX = 0; //COLUNAS DO SPRITESHEET, aqui temos: 0, 1, 2...5;
    this.frameY = 0; //LINHAS DO SPRITESHEET, aqui temos: 0;
    this.spriteWidth = 512; //(3072 / 6). width dividido por colunas.
    this.spriteHeight = 509; //(509 / 1). 
    //FIM SPRITESHEET VARIÁVEIS
  }

  update() {
    //Vai atualizar a posição atual do peixe, para a posição atual do mouse.
    const dx = this.x - mouse.x; //distanceX.
    const dy = this.y - mouse.y; //distanceY.
    let theta = Math.atan2(dy, dx); //Formula para o peixe encarar o ponto do mouse.
    this.angle = theta;
    if (mouse.x != this.x) {
      //Se a posição do mouse X for diferente da do Player, --.
      this.x -= dx / 20; //O player pode ir tanto p a direita quanto p a esquerda, pois o dx pode ser positivo ou negativo. Se fosse apenas -- seria só negativo.
    }
    if (mouse.y != this.y) {
      //Se a posição do mouse Y for diferente do Player, --.
      this.y -= dy / 20; //VELOCIDADE: divide por 20, para o peixe se mover mais lentamente, se não ele iria literalmente pular, de uma posição para outra.
    }
    //frameX DO SPRITESHEET:
    if (gameFrame % 2 == 0) {
      //VELOCIDADE: A cada 4 frames:
      this.frame++; //dou increase no frame.
      if (this.frame >= 6) this.frame = 0; //6 = tanto de abelhas, chegou no máximo, reseta pro 0.
      if (this.frame == 5) { //vai de 0 até 5 colunas.
        this.frameX = 0; //para reiniciar o ciclo.
      } else {
        this.frameX++;
      }
      //frameY DO SPRITESHEET:
      if (this.frame < 0) this.frameY = 0;} //quando começa o frame, ou seja no zero, o frameY está no zero, pois só tem uma única linha de spritesheetY.
      //FIM FRAMES SPRITESHEET
  }
  
  draw() {
    //CÓDIGO DA LINHA QUE LIGA A ABELHA AO MOUSE
    // if (mouse.click) {
    //   //Se o mouse clique for verdadeiro.
    //   ctx.lineWidth = 0.2; //Espessura da linha.
    //   ctx.beginPath(); //Caminho de Início.
    //   ctx.moveTo(this.x, this.y); //Começo da linha que é a posição do player.
    //   ctx.lineTo(mouse.x, mouse.y); //Final da linha que é a posição do mouse.
    //   ctx.stroke(); //Conecta os dois pontos da linha.
    //   ctx.closePath();
    // }
    //COMENTANDO A BOLA PARÂMETRO DA ABELHA
    // ctx.fillStyle = "orange";
    // ctx.beginPath();
    // //o arc vai desenhar o círculo
    // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); //ângulo de start = 0 e o ângulo vai ser PI*2 para um círculo completo.
    // ctx.fill(); //Preencher o círculo.
    // ctx.closePath();
    // ctx.fillRect(this.x, this.y, this.radius, 10);
    //FIM DA BOLA PARÂMETRO DA ABELHA.

    ctx.save(); //salva as configurações do canvas atual
    ctx.translate(this.x, this.y); //Passo o X e o Y do Player p/ mover a rotação do ponto central, onde o player atualmente está, e então eu posso trocar na linha 83 e na linha 85 o this.x e o this.y por ZERO, pois a posição do player agora está refletida nesse translate.
    ctx.rotate(this.angle); //aqui na rotação eu passo o angulo da linha 42.

    if (this.x >= mouse.x) {
      //drawImage(Image, x, y, width, height, player.x, player.y, scaledown.width, scaledown.height)
      ctx.drawImage(
        playerLeft,
        this.frameX * this.spriteWidth,
        this.frameY * this.spriteHeight,
        this.spriteWidth,
        this.spriteHeight,
        0 - 55,
        0 - 50,
        this.spriteWidth / 5,
        this.spriteHeight / 5
      );
    } else {
      ctx.drawImage(
        playerRight,
        this.frameX * this.spriteWidth,
        this.frameY * this.spriteHeight,
        this.spriteWidth,
        this.spriteHeight,
        0 - 55,
        0 - 50,
        this.spriteWidth / 5,
        this.spriteHeight / 5
      );
    }
    ctx.restore(); //Depois de desenhar a imagem, chamamos o restore do canvas, e ele vai resetar todos os chamados de TRANSLATE(linha 78) e ROTATE(linha 79), para a forma que eles eram antes de serem chamados(por causa do SAVE, na linha 77). Dessa forma, apenas o Player terá translate e rotate, os outros elementos do jogo não.
  }
}
const player = new Player(); //CONVOCA o Player. (mas precisa do loop ainda, pra rodar.)
//FIM DO PLAYER

//Balloons
const balloonArr = []; //Começa com um array vazio.

// let x = Math.floor((Math.random() * 7) + 1);
// const balloonRandom = new Image();
// balloonRandom.src = `assets/balloonImg${x}.png`
// const balloonImages = [
//   balloonImg1,
//   balloonImg2,
//   balloonImg3,
//   balloonImg4,     //Se quiser random de uma ÚNICA cor,
//   balloonImg5,     //sempre que atualizar a página, muda a cor.
//   balloonImg6,
//   balloonImg7
// ];

const balloonsTypes = [];
const balloonImg1 = new Image(); //Variável do desenho do balão
balloonImg1.src = "assets/balloonImg1.png"; //fonte
balloonsTypes.push(balloonImg1);
const balloonImg2 = new Image();
balloonImg2.src = "assets/balloonImg2.png";
balloonsTypes.push(balloonImg2);
const balloonImg3 = new Image();
balloonImg3.src = "assets/balloonImg3.png";
balloonsTypes.push(balloonImg3);
const balloonImg4 = new Image();
balloonImg4.src = "assets/balloonImg4.png";
balloonsTypes.push(balloonImg4);
const balloonImg5 = new Image();
balloonImg5.src = "assets/balloonImg5.png";
balloonsTypes.push(balloonImg5);
const balloonImg6 = new Image();
balloonImg6.src = "assets/balloonImg6.png";
balloonsTypes.push(balloonImg6);
const balloonImg7 = new Image();
balloonImg7.src = "assets/balloonImg7.png";
balloonsTypes.push(balloonImg7);

class Balloon {
  constructor() {
    this.x = Math.random() * canvas.width; //número random entre 0 e o width do canvas.
    this.y = canvas.height + 100 + Math.random() * canvas.height; // canvas.height + 100 p/ as balões nascerem na base do canvas, com garantia de 100px, p/ nascer escondida.
    this.radius = 40;
    //this.radius = Math.random() * (35 - 15) + 23; //largura das balões.
    this.speed = Math.random() * 5 + 1; //Random entre 1 e 6.
    this.distance; //Rastreia a distância entre as balões, e a balão e o player, para poder marcar o score e estourar a balão, quando o Player estiver perto o bastante.
    this.counted = false; //cada balão atribuía infinitamente pontos, se o player continuasse em cima dessa balão específico.
    this.sound = Math.random() <= 0.5 ? "sound1" : "sound2"; //random entre 2 sons, lembrando que o random vai de 0 até 0.99.
    // this.images = Math.random() * balloonImages.length;
    this.balloonsType = balloonsTypes[Math.floor(Math.random() * balloonsTypes.length)];
  }
  update() {
    this.y -= this.speed; //vai mover as balões para cima, em direção negativa, como se saissem do chão, dependendo da velocidade individual de cada balão.
    const dx = this.x - player.x; //dx = posição da balão.X - a posição do player.x.
    const dy = this.y - player.y; //dy = posição da balão.y - posição do player.y.
    this.distance = Math.sqrt(dx * dx + dy * dy); //CÁLCULO DA COLISÃO: quando uma balão trisca no raio do player, sqrt significa raiz quadrada do número.
  }

  draw() {
    //COMENTANDO A BOLA AZUL DE PARÂMETRO
    // ctx.fillStyle = "blue";
    // ctx.beginPath(); //Precisa sempre abrir o caminho.
    // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); //Para desenhar o círculo. O ângulo de start = 0 e o ângulo vai ser PI*2 para um círculo completo.
    // ctx.fill(); //Preenche o círculo da cor blue.
    // ctx.closePath(); //Fecha o caminho.
    // ctx.stroke();
    //FIM DO COMENTÁRIO DA BOLA AZUL DE PARÂMETRO

                          //IMAGE AREA-----   //CANVAS PLACE
    //ctx.drawImage(img, sourcex, sy, sw, sh, dx, dy, dw, dh);
    ctx.drawImage(
      this.balloonsType,
      this.x - 65,
      this.y - 57,
      this.radius * 3.25,
      this.radius * 3.25
    ); //desenho o balão (img, x, y, w, h)
  }
}

const balloonPop1 = document.createElement("audio"); //Declara som.
balloonPop1.src = "assets/balloon1.mp3"; //endereço do som.
balloonPop1.volume = 0.1;
const balloonPop2 = document.createElement("audio"); //Declara som.
balloonPop2.src = "assets/balloon2.mp3";
balloonPop2.volume = 0.1;

function handleBalloons() {
  if (gameFrame % 50 == 0) {
    //Se o gameFrame for dividido por 50, com sobra de 0, ou seja, rodará o gameFrame a cada 50 frames.
    balloonArr.push(new Balloon()); //Faz uma nova balão a cada 50 frames.
    //console.log(balloonArr.length);
  }
  for (let i = 0; i < balloonArr.length; i++) {
    balloonArr[i].update(); //para cada índice de balão, chama o update.
    balloonArr[i].draw(); // e o draw.
    if (balloonArr[i].y < 0 - balloonArr[i].radius * 2) {
      //Se a posição da balão for menor que 0 no Y, tira ela. Precisa diminuir o radius, para a balão só sumir, quando chegar na base dela, e não na metade, e *2, só por garantia.
      balloonArr.splice(i, 1); //i = index atual, 1 = só remove um elemento do array. Mas por alguma razão todas as balões começam a piscar, quando o slice é usado.
      i--; //para os balões pararem de piscar, preciso remover também o índice, não apenas usar splice.
    } else if (balloonArr[i].distance < balloonArr[i].radius + player.radius) {
      //Se a distância entre cada [i] do array, for menor que o seu raio + o raio do Player, ou seja, COLISÃO:
      //console.log('collision');
      if (!balloonArr[i].counted) {
        //Se a balão não tiver sido contada, ou seja, false.
        if (balloonArr[i].sound == "sound1") {
          //convoca som.
          balloonPop1.play();
        } else {
          balloonPop2.play();
        }
        score++; //sempre que uma colisão for detectada, aumenta o score em 1 ponto.
        balloonArr[i].counted = true; //torna essa balão contada em verdadeira, para não cair nesse if novamente.
        balloonArr.splice(i, 1); //Remove essa balão que o Player conseguiu pegar.
        i--; //só assim os balões não piscam.
      }
    }
  }
}
//FIM DOS BALLOONS

//BACKGROUND
const background = new Image(); //cria o backgound
background.src = "assets/background1.jpg"; //mostra a source.

const bg = {
  x1: 0, //preciso de um x para o bg 1.
  x2: canvas.width, //e um X para a cópia do bg.
  y: 0, //Só queremos mexer o X.
  width: canvas.width,
  height: canvas.height,
};

function handleBackground() {
  //cria a função de chamamento.
  // bg.x1--; --> Também funciona, mas não muda a velocidade.
  bg.x1 -= gameSpeed; //faz o background deslocar p/ a esquerda no X.
  if (bg.x1 < -bg.width) bg.x1 = bg.width - 10; //condicional de loop.
  // bg.x2--; usaremos o gameSpeed para poder modificá-lo e poder alterar a velocidade do BG, ou mesmo deixá-lo estático, com 0;
  bg.x2 -= gameSpeed; //BG CÓPIA
  if (bg.x2 < -bg.width) bg.x2 = bg.width - 10; //bg CÓPIA.
  ctx.drawImage(background, bg.x1, bg.y, bg.width, bg.height);
  ctx.drawImage(background, bg.x2, bg.y, bg.width, bg.height);
}
//FIM DO BACKGROUND

//ENEMIES
const enemyImg = new Image();
enemyImg.src = "assets/enemy1.png";

class Enemy {
  constructor() {
    this.x = canvas.width + 200; //margem para não brotar direto.
    this.y = Math.random() * (canvas.height - 150) + 90; //margem.
    this.radius = 25; //tamanho da bola de neve.
    this.speed = Math.random() * 4 + 4; //Velocidade random entre 4 e 8.
    //SPRITESHEET:
    this.frame = 0; //Varia de acordo com o tanto de imgns individuais que tem cada img, nesse caso de 0 a 6.
    this.frameX = 0; //COLUNAS DO SPRITESHEET, aqui temos: 0, 1 e 2 (3);
    this.frameY = 0; //LINHAS DO SPRITESHEET, aqui temos: 0 e 1 (2);
    this.spriteWidth = 512; //(1536 / 3). width dividido por colunas.
    this.spriteHeight = 385.5; //(771 / 2).
    //FIM SPRITESHEET VARIÁVEIS
  }
  draw() {
    //CÓDIGO DA BOLA PARÂMETRO COMENTADO
    // ctx.fillStyle = 'white';
    // ctx.beginPath();
    // //o arc vai desenhar o círculo
    // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); //ângulo de start = 0 e o ângulo vai ser PI*2 para um círculo completo.
    // ctx.fill(); //preenche o círculo da cor branca.
    //FIM DO CÓDIGO DO ENEMY PARÂMETRO

    //DESENHANDO COM SPRITESHET: Preciso usar a versão de parâmetros mais longa, com 9 elementos.
    //Parâmetros: (Img, sourceX = (frameX*spriteWidth), sY = (frameY * spriteH.), sWidth = (cálculo do spriteWidth), sH = (cálculo SH), thisX - Number (para encaixar na esfera), thisY - N., W = spriteWidth / Number(se quiser enemy menor), H = spriteHeight / N.).
    ctx.drawImage(
      enemyImg,
      this.frameX * this.spriteWidth,
      this.frameY * this.spriteHeight,
      this.spriteWidth,
      this.spriteHeight,
      this.x - 31,
      this.y - 50,
      this.spriteWidth / 4,
      this.spriteHeight / 4
    );
  }
  update() {
    this.x -= this.speed; //A bola corre da direita para a esquerda.
    if (this.x < 0 - this.radius * 2) {
      //Se ela chegar no Width 0, vai voltar com tudo random de novo, para ficar imprevisível.
      this.x = canvas.width + 200;
      this.y = Math.random() * (canvas.height - 150) + 90;
      this.speed = Math.random() * 4 + 4; //VELOCIDADE DE NOVO.
    }
    //frameX DO SPRITESHEET:
    if (gameFrame % 4 == 0) {
      //VELOCIDADE: A cada 4 frames:
      this.frame++; //dou increase no frame.
      if (this.frame >= 6) this.frame = 0; //6 = tanto de bolas.
      if (this.frame == 2 || this.frame == 5 /*|| this.frame == 8*/) {
        this.frameX = 0; //para reiniciar o ciclo.
      } else {
        this.frameX++;
      }
      //frameY DO SPRITESHEET:
      if (this.frame < 2) this.frameY = 0;
      //2 pois tem três colunas, e 0 porque está na primeira linha.
      else if (this.frame < 5) this.frameY = 1;
      //5 pois soma com mais 3 colunas, e 1 porque está na segunda linhas.
      //else if (this.frame < 8) this.frameY = 2; ==> E assim vai.
      else this.frameY = 0;
      //FIM FRAMES SPRITESHEET
    }
    //Collision with Player:
    const dx = this.x - player.x; //distanciaX = bolax - playerx
    const dy = this.y - player.y;
    const distance = Math.sqrt(dx * dx + dy * dy); //Fórmula da distância X e Y.
    if (distance < this.radius + player.radius) {
      handleGameOver(); //Chama a função do GameOver.
    }
  }
}
const enemy1 = new Enemy(); //criamos UM inimigo.
function handleEnemies() {
  enemy1.draw();
  enemy1.update();
}
// const enemy2 = new Enemy(); //criamos UM inimigo.
// function handleEnemies() {
//   enemy2.update();
//   enemy2.draw();
// }
//FIM DOS ENEMIES

//GAME OVER & SCORE
function handleGameOver() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  gameSound.pause();

  ctx.fillStyle = "yellow";
  ctx.font = "70px 'Honeycombreg'";
  ctx.fillText("Game Over!", canvas.width / 4.8, 250);

  ctx.font = "50px 'Summerbee'";
  ctx.fillStyle = "white";
  ctx.fillText(`Your Final Score: ` + score, canvas.width / 3.4, 300);

  gameOver = true; //Torna o GAMEOVER true, pra parar o jogo.
}

function score1() {
  ctx.font = "30px 'Honeybeeregular'";
  ctx.fillStyle = "white"; //cor do score.
  ctx.fillText("Score: " + score, 15, 40); //P/ aparecer score, e a posição que eu quero.
}
//FIM DO GAMEOVER E SCORE

//GAME AUDIO:
const gameSound = new Audio();
gameSound.src = 'assets/song.mp3';
gameSound.volume = 0.7;
//FIM DO GAMEAUDIO

//Animation Loop - CONVOCO TUDO AQUI!
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); //Limpa o canvas no loop (x, y, w, h).
  gaming = true;
  gameSound.play();
  gameSound.loop = true;
  handleBackground(); //Convoca o background no loop.
  handleBalloons(); // Para criar as balões no loop.
  score1();
  player.update(); //Fazer update da posição do Player.
  player.draw(); //Desenha o Player e a linha entre o mouse e o player.
  handleEnemies(); //TEM QUE SER depois do Player.
  gameFrame++; //Vai adicionando o gameFrame em 1, a cada animação de Frame. E usaremos para eventos periódicos.
  //console.log(gameFrame)
  if (!gameOver) requestAnimationFrame(animate); //cria o LOOP do animate, caso não tenha sido GameOver, senão para tudo.
}

// animate(); //Precisa ser convocada para rodar o código.
//FIM DO ANIMATION LOOP

//A posição do mouse estragava, quando você redimensionava a tela, com a solução abaixo, a tela é atualizada:
window.addEventListener("resize", () => {
  canvasPosition = canvas.getBoundingClientRect();
});

btnStart.addEventListener("click", () => {
  if (gaming === false) {
    animate();
    btnStart.blur(); // blur tira o foco do botão start
  } else {
    window.location.reload();
  }
});
