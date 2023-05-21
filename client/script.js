var socket = io('127.0.0.1:3000')
var playerSide
var oponentPosition = 0
var racketY = 0

socket.on('side', function(data) {
    playerSide = data
    console.log(data);
})

socket.on('state', (data) => {
    oponentPosition = (playerSide == 'left') ? data.right.position : data.left.position
    ballX = data.ball.x
    ballY = data.ball.y
})

// Obtém o elemento canvas e o contexto 2D
var canvas = document.getElementById('background');

var ctx = canvas.getContext('2d');

// Define as dimensões do canvas
canvas.width = 800;
canvas.height = 600;

// Define as dimensões das raquetes
var racketWidth = 10;
var racketHeight = 50;

// Função para desenhar as raquetes
function drawRacket(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

// Define as coordenadas e o raio da bolinha
var ballX = canvas.width / 2; // Coordenada X central
var ballY = canvas.height / 2; // Coordenada Y central
var ballRadius = 10;

// Função para desenhar a bolinha
function drawBall() {
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = 'white';
  ctx.fill();
  ctx.closePath();
}

// Manipulador de evento para capturar o movimento do mouse
canvas.addEventListener('mousemove', function(event) {
    var rect = canvas.getBoundingClientRect();
    var mouseY = event.clientY - rect.top;
  
    // Atualiza a posição da raquete de acordo com o movimento do mouse
    racketY = mouseY - racketHeight / 2;
    socket.emit('playerMove', { side: playerSide, position: racketY })
  });

// Função para desenhar o jogo
function drawGame() {
    // Limpa o canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Define a cor de fundo
    ctx.fillStyle = 'black';

    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Desenha as raquetes vermelha e azul
    if (playerSide == 'left') {
        drawRacket(10, racketY, racketWidth, racketHeight, 'red');
        drawRacket(canvas.width - racketWidth - 10, oponentPosition, racketWidth, racketHeight, 'blue');
    } else if (playerSide == 'right') {
        drawRacket(10, oponentPosition, racketWidth, racketHeight, 'red');
        drawRacket(canvas.width - racketWidth - 10, racketY, racketWidth, racketHeight, 'blue');
    }
    drawBall()
    requestAnimationFrame(drawGame);
}

// Chama a função para desenhar o jogo
drawGame();
