export class Player {
    constructor(side) {
        this.side = side
        this.points = 0
    }

    makeScore() {
        this.points++;
    }

    getScore() {
        return this.points
    }
}
