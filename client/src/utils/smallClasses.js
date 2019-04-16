function otherSide(side) {
    return side === "sente" ? "gote" : "sente";
}

function isOnBoard(square) {
    return square[0] < 10 && square[1] < 10 && square[0] > 0 && square[1] > 0;
}

class Vector {
    constructor (origin, target) {
        this.vector = [parseInt(target[0]-origin[0]), parseInt(target[1]-origin[1])];
        this.unitVector = this.vector.map(coordinate => {
            if (coordinate !== 0) return coordinate / Math.abs(coordinate);
            return 0;
        });

        this.magnitude = Math.abs(this.vector[1]) > Math.abs(this.vector[0]) ? Math.abs(this.vector[1]) : Math.abs(this.vector[0]);
    }

    static areEqual(vectorA, vectorB) {
        return vectorA.vector[0] === vectorB.vector[0] && vectorA.vector[1] === vectorB.vector[1];
    }

    static areSameDirection (vectorA, vectorB) {
        return vectorA.vector[0]/vectorA.vector[1] === vectorB.vector[0]/vectorB.vector[1] && Math.sign(vectorA.vector[0]) === Math.sign(vectorB.vector[0]);
    }

    static format (string) {
        return string.split("").map(e => parseInt(e));
    }
}

export {otherSide, Vector, isOnBoard};