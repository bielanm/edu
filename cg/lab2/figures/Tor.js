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

    getLightingNormal(projection = [1, 1, 1]) {
        const { accuracy, r, R } = this,
            array = [],
            [xP, yP, zP] = projection;

        for(let i = 0; i <= accuracy; i++) {
            const alpha = 2*Math.PI*i/accuracy,
                nextAlpha = 2*Math.PI*(i+1)/accuracy,
                p1 = new Point(R*Math.cos(alpha), 0, R*Math.sin(alpha)),
                p2 = new Point(R*Math.cos(nextAlpha), 0, R*Math.sin(nextAlpha));

            for(let j = 0; j <= accuracy; j++) {
                const betta = (2*Math.PI)*j/accuracy,
                    x1 = (R + r*Math.cos(betta))*Math.cos(alpha),
                    y1 = r*Math.sin(betta),
                    z1 = (R + r*Math.cos(betta))*Math.sin(alpha),
                    x2 = (R + r*Math.cos(betta))*Math.cos(nextAlpha),
                    y2 = r*Math.sin(betta),
                    z2 = (R + r*Math.cos(betta))*Math.sin(nextAlpha),
                    v1 = new Vector((x1-p1.x)*xP/(r*r), (y1-p1.y)*yP/(r*r), (z1-p1.z)*zP/(r*r)),
                    v2 = new Vector((x2-p2.x)*xP/(r*r), (y2-p2.y)*yP/(r*r), (z2-p2.z)*zP/(r*r));
                array.push(v1, v2);
            }
        }
        return array.pushReduce((vector) => [vector.x, vector.y, vector.z]);
    }

    getProjection(vector) {
        this.getTorPoints(this.R, this.r, this.accuracy, vector);
    }
}
