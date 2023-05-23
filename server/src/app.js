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
        Body.applyForce(ball, {x: ball.position.x, y: ball.position.y}, {x: 0.003, y: 0.003})
        // run the engine
        Runner.run(runner, engine)
    } else {
        socket.disconnect()
    }

    socket.on('playerMove', (data) => {
        var side = data.side
        if (side == 'left') {
            Body.setPosition(racketA, {x: racketA.position.x, y: data.position})
        } else if (side == 'right') {
            Body.setPosition(racketB, {x: racketB.position.x, y: data.position})
        }
    })
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


var ball = Bodies.circle(screenWidth / 2, screenHeight / 2, 10, options)
options.isStatic = true
var racketA = Bodies.rectangle(10, 200, playerWidth, playerHeight, options)
var racketB = Bodies.rectangle(780, 50, playerWidth, playerHeight, options)
var ground = Bodies.rectangle(400, 600, 800, 1, options)
var ceiling = Bodies.rectangle(400, 0, 800, 1, options)
var leftWall = Bodies.rectangle(0, 300, 1, 600, options)
var rightWall = Bodies.rectangle(800, 300, 1, 600, options)


Events.on(engine, 'beforeUpdate', function(event) {
    io.emit('state', {
        ball: ball.position,
        left: {position: racketA.position.y, score: playerA.getScore()},
        right: {position: racketB.position.y, score: playerB.getScore()}
    })
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

// add all of the bodies to the world
Composite.add(engine.world, [racketA, racketB, ball, ceiling, ground, rightWall, leftWall])

// create runner
var runner = Runner.create()
