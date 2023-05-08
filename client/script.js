// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite,
    Mouse = Matter.Mouse,
    MouseConstraint = Matter.MouseConstraint,
    Events = Matter.Events

// create an engine
var engine = Engine.create({
    gravity: {
        scale: 0
    }
});

// create a renderer
var renderer = Render.create({
    element: document.body,
    engine: engine
});


// create two boxes and a ground
var playerA = Bodies.rectangle(400, 200, 10, 50)
var playerB = Bodies.rectangle(450, 50, 10, 50)
var ball = Bodies.circle(500, 500, 10, 10)
var ground = Bodies.rectangle(400, 610, 810, 30, { isStatic: true })
var floor = Bodies.rectangle(400, 0, 810, 10, { isStatic: true })
var leftWall = Bodies.rectangle(0, 300, 20, 590, { isStatic: true })
var rightWall = Bodies.rectangle(800, 300, 20, 590, { isStatic: true })

// add mouse control
var mouse = Mouse.create(renderer.canvas),
    mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.2,
            render: {
                visible: false
            }
        }
    })


// add all of the bodies to the world
Composite.add(engine.world, [playerA, playerB, ball, floor, ground, rightWall, leftWall, mouseConstraint]);

// run the renderer
Render.run(renderer);

// create runner
var runner = Runner.create();

// run the engine
Runner.run(runner, engine);
