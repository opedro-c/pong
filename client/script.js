// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Composite = Matter.Composite,
    Mouse = Matter.Mouse,
    MouseConstraint = Matter.MouseConstraint,
    Events = Matter.Events,
    Collision = Matter.Collision

// create an engine
var engine = Engine.create({
    gravity: {
        scale: 0
    }
})

// create a renderer
var renderer = Render.create({
    element: document.body,
    engine: engine,
    options: {
        wireframes: false, // Define se os corpos serão exibidos como arame (true) ou preenchidos (false)
    }
})

var options = {
    inertia: Infinity, 
    restitution: 1,
    frictionAir: 0,
    friction: 0
}

var playerHeight = 50
var playerWidth = 10

// create two boxes and a ground
var ball = Bodies.circle(renderer.options.width / 2, renderer.options.height / 2, 10, options)
options.isStatic = true
options.render = { fillStyle: 'red' }
var playerA = Bodies.rectangle(20, 200, playerWidth, playerHeight, options)
options.render = { fillStyle: 'blue' }
var playerB = Bodies.rectangle(780, 50, playerWidth, playerHeight, options)
options.render = { fillStyle: 'white' }
var ground = Bodies.rectangle(400, 610, 810, 30, options)
var floor = Bodies.rectangle(400, 0, 810, 10, options)
var leftWall = Bodies.rectangle(0, 300, 20, 590, options)
var rightWall = Bodies.rectangle(800, 300, 20, 590, options)

// add mouse control
var mouseX = 10,
    mouseY = 10,
    mouse = Mouse.create(renderer.canvas),
    mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.2,
            render: {
                visible: false
            }
        }
    })

// Atualiza as coordenadas do mouse quando o mouse se move
Events.on(mouseConstraint, 'mousemove', function(event) {
    mouseX = event.mouse.position.x
    mouseY = event.mouse.position.y
})

// Atualiza as coordenadas do mouse quando o mouse é arrastado
Events.on(mouseConstraint, 'mousedown', function(event) {
    mouseX = event.mouse.position.x
    mouseY = event.mouse.position.y
})

// Atualiza as coordenadas do mouse quando o mouse é solto
Events.on(mouseConstraint, 'mouseup', function(event) {
    mouseX = event.mouse.position.x
    mouseY = event.mouse.position.y
})

// Atualiza a posição da raquete B com base na posição da bola
Events.on(engine, 'beforeUpdate', function(event) {
    var playerBPosition = playerB.position
    var ballPosition = ball.position
    if (ballPosition.y < playerBPosition.y) {
        Matter.Body.setPosition(playerB, { x: playerBPosition.x, y: playerBPosition.y - 5 })
    } else if (ballPosition.y > playerBPosition.y) {
        Matter.Body.setPosition(playerB, { x: playerBPosition.x, y: playerBPosition.y + 5 })
    }
    Matter.Body.setPosition(playerA, { x: playerA.position.x, y: mouseY })
})

Body.applyForce(ball, {x: ball.position.x, y: ball.position.y}, {x: 0.003, y: 0.003})

// add all of the bodies to the world
Composite.add(engine.world, [playerA, playerB, ball, floor, ground, rightWall, leftWall, mouseConstraint])

// run the renderer
Render.run(renderer)

// create runner
var runner = Runner.create()

// run the engine
Runner.run(runner, engine)
