import { Server } from "socket.io";
import { Player } from "./player.js";
import Matter from "matter-js";


const playerA = new Player('left'),
      playerB = new Player('right')

const io = new Server(3000, {
    cors: { origin: '*' },
})

io.on('connection', (socket) => {
    if (io.engine.clientsCount == 1) {
        playerA.socket = socket
        socket.emit('side', 'left')
    } else if (io.engine.clientsCount == 2) {
        socket.emit('side', 'right')
        playerB.socket = socket
    } else {
        socket.disconnect()
    }
    console.log('number of connections=' + io.engine.clientsCount);
})

// module aliases
var Engine = Matter.Engine,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Composite = Matter.Composite,
    Events = Matter.Events

// create an engine
var engine = Engine.create({
    gravity: {
        scale: 0
    }
})

var screenWidth = 800,
    screenHeight = 600

var options = {
    inertia: Infinity, 
    restitution: 1,
    frictionAir: 0,
    friction: 0
}

var playerHeight = 50
var playerWidth = 10

// create two boxes and a ground
var ball = Bodies.circle(screenWidth / 2, screenHeight / 2, 10, options)
options.isStatic = true
var racketA = Bodies.rectangle(20, 200, playerWidth, playerHeight, options)
var racketB = Bodies.rectangle(780, 50, playerWidth, playerHeight, options)
var ground = Bodies.rectangle(400, 610, 810, 30, options)
var floor = Bodies.rectangle(400, 0, 810, 10, options)
var leftWall = Bodies.rectangle(0, 300, 20, 590, options)
var rightWall = Bodies.rectangle(800, 300, 20, 590, options)

// Atualiza a posição da raquete B com base na posição da bola
Events.on(engine, 'beforeUpdate', function(event) {
    var racketBPosition = racketB.position
    var ballPosition = ball.position
    if (ballPosition.y < racketBPosition.y) {
        Body.setPosition(racketB, { x: racketBPosition.x, y: racketBPosition.y - 20 })
    } else if (ballPosition.y > racketBPosition.y) {
        Body.setPosition(racketB, { x: racketBPosition.x, y: racketBPosition.y + 20 })
    }
})

var resetBallPosition = () => {
    Body.setPosition(ball, {
        x: screenWidth / 2,
        y: screenHeight / 2
    })
}

Events.on(engine, 'collisionStart', function(event) {
    var pairs = event.pairs;

    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i];

        if (pair.bodyA === ball && pair.bodyB === rightWall) {
            playerA.makeScore();
            console.log('playerAPoints=' + playerA.getScore())
            resetBallPosition()
        } else if (pair.bodyA === ball && pair.bodyB === leftWall) {
            playerB.makeScore();
            console.log('playerBPoints=' + playerB.getScore())
            resetBallPosition()
        }
    }
});

Body.applyForce(ball, {x: ball.position.x, y: ball.position.y}, {x: 0.003, y: 0.003})


// add all of the bodies to the world
Composite.add(engine.world, [playerA, playerB, ball, floor, ground, rightWall, leftWall])

// create runner
var runner = Runner.create()

// run the engine
Runner.run(runner, engine)
