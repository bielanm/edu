function getKonusPoints (h, r, accuracy, projection) {
    const angle = 2*Math.PI/accuracy,
        points = [],
        [px, py, pz] = projection,
        zero = new Point(0, 0, 0),
        vertex = new Point(0, h, 0);

    for (let i = 0; i < accuracy; i++) {
        const alpha = i*angle,
            betta = (i + 1)*angle,
            one = new Point(r*Math.sin(alpha)*px, 0, r*Math.cos(alpha)*pz),
            second = new Point(r*Math.sin(betta)*px, 0, r*Math.cos(betta)*pz);

        points.push(second, vertex, one, second, zero, one);
    }

    return points;
}

class Cone extends Figure {

    constructor(id, h, r, accuracy) {
        super(id, getKonusPoints(h, r, accuracy, [1, 1, 1]));
        this.h = h;
        this.r = r;
        this.accuracy = accuracy;
    }

    getTexturePoints() {
        const {accuracy} = this,
            step = 1/accuracy,
            vertex = [0.5, 0],
            points = [];

        for (let i = 0; i < accuracy; i++) {
            const one = [i*step, 0.7],
                second = [(i + 1)*step, 0.7],
                zero = [(i + 0.5)*step, 1];
            Array.prototype.push.apply(points, second);
            Array.prototype.push.apply(points, vertex);
            Array.prototype.push.apply(points, one);
            Array.prototype.push.apply(points, second);
            Array.prototype.push.apply(points, zero);
            Array.prototype.push.apply(points, one);
        }

        return points;
    }

    getProjection(vector) {
        this.getKonusPoints(this.R, this.r, this.accuracy, vector);
    }
}
