function getSpherePoints (R, accuracy, projectionVector) {
    const array = [],
        [xP, yP, zP] = projectionVector;

    for(let i = 0; i <= accuracy; i++) {
        const alpha = 2*Math.PI*i/accuracy,
            nextAlpha = 2*Math.PI*(i+1)/accuracy;
        for(let j = 0; j <= accuracy; j++) {
            const betta = Math.PI*j/accuracy,
                Rxz = R*Math.sin(betta),
                y = R*Math.cos(betta),
                x1 = Rxz*Math.sin(alpha),
                z1 = Rxz*Math.cos(alpha),
                x2 = Rxz*Math.sin(nextAlpha),
                z2 = Rxz*Math.cos(nextAlpha);

            array.push(new Point(x1*xP, y*yP, z1*zP), new Point(x2*xP, y*yP, z2*zP));
        }
    }
    return array;
}

class Sphere extends Figure {

    constructor(id, R, accuracy) {
        super(id, getSpherePoints(R, accuracy, [1, 1, 1]));
        this.accuracy = accuracy;
        this.R = R;
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

    getLightingNormal(projection = [1, 1, 1]) {
        const { accuracy, R } = this,
            array = [],
            [xP, yP, zP] = projection;

        for(let i = 0; i <= accuracy; i++) {
            const alpha = 2*Math.PI*i/accuracy,
                nextAlpha = 2*Math.PI*(i+1)/accuracy;
            for(let j = 0; j <= accuracy; j++) {
                const betta = Math.PI*j/accuracy,
                    Rxz = R*Math.sin(betta),
                    y = R*Math.cos(betta),
                    x1 = Rxz*Math.sin(alpha),
                    z1 = Rxz*Math.cos(alpha),
                    x2 = Rxz*Math.sin(nextAlpha),
                    z2 = Rxz*Math.cos(nextAlpha);

                array.push(new Vector(x1*xP, y*yP, z1*zP), new Vector(x2*xP, y*yP, z2*zP));
            }
        }
        return array.pushReduce((vector) => [vector.x, vector.y, vector.z]);
    }

    getProjection(vector) {
        this.getTorPoints(this.R, this.r, this.accuracy, vector);
    }
}
