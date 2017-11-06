
class Tor {
    constructor(id, R, r, accuracy) {
        constructor(id, this.getPoints(r1, r2, accuracy));
        this.accuracy = accuracy;
        this.R = R;
        this.r = r;
    }

    getPoints (R, r, accuracy) {
        const array = [];

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

                array.push(new Point(x1, y1, z1), new Point(x2, y2, z2));
            }
        }
        return array;
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

                array.push(new Point(x1, y1, 0), new Point(x2, y2, 0));
            }
        }
        return array;
    }
}
