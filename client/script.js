let racket = document.getElementById('player-left')
let gameBackground = document.getElementById('game-background')

function moveRacket(e) {
    racket.style.top = e.offsetY + 'px'
}

gameBackground.addEventListener('mousemove', moveRacket)