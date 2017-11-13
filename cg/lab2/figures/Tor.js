function getTorPoints (R, r, accuracy, projectionVector) {
    const array = [],
        [xP, yP, zP] = projectionVector;

    for(let i = 0; i <= accuracy; i++) {
        const alpha = 2*Math.PI*i/accuracy,
            nextAlpha = 2*Math.PI*(i+1)/accuracy;
        for(let j = 0; j <= accuracy; j++) {
            const betta = (2*Math.PI)*j/accuracy,
                x1 = (R + r*Math.cos(betta))*Math.cos(alpha),
                y1 = r*Math.sin(betta),
                z1 = (R + r*Math.cos(betta))*Math.sin(alpha),
                x2 = (R + r*Math.cos(betta))*Math.cos(nextAlpha),
                y2 = r*Math.sin(betta),
                z2 = (R + r*Math.cos(betta))*Math.sin(nextAlpha);

            array.push(new Point(x1*xP, y1*yP, z1*zP), new Point(x2*xP, y2*yP, z2*zP));
        }
    }
    return array;
}

class Tor extends Figure {

    constructor(id, R, r, accuracy) {
        super(id, getTorPoints(R, r, accuracy, [1, 1, 1]));
        this.accuracy = accuracy;
        this.R = R;
        this.r = r;
    }

    getTexturePoints() {
        const array = [];

        for(let i = 0; i <= this.accuracy; i++) {
            const alpha = i/this.accuracy,
                nextAlpha = (i+1)/this.accuracy;
            for(let j = 0; j <= this.accuracy; j++) {
                const betta = j/this.accuracy,
                    x1 = alpha,
                    y1 = betta,
                    x2 = nextAlpha,
                    y2 = betta;

                array.push(x1, y1, x2, y2);
            }
        }
        return array;
    }

    getProjection(vector) {
        this.getTorPoints(this.R, this.r, this.accuracy, vector);
    }
}