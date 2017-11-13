function getSurfacePoints (f, leftDown, rightUp, accuracy, projection) {
    const points = [],
        xStart = leftDown.x,
        xEnd = rightUp.x,
        xStep = (xEnd - xStart)/accuracy,
        yStart = leftDown.y,
        yEnd = rightUp.y,
        yStep = (yEnd - yStart)/accuracy,
        [px, py, pz] = projection;

    for(let i = 0; i < accuracy; i++) {
        let y1 = yStart + i*yStep,
            y2 = yStart + (i + 1)*yStep,
            ymiddle = (y1 + y2)/2;

        points.push(new Point(xStart*px, y1*py, f(xStart, y1)*pz));
        for(let j = 0; j < accuracy; j++) {
            let x1 = xStart + j*xStep,
                x2 = xStart + (j + 1)*xStep;

            points.push(new Point(x1*px, ymiddle*py, f(x1, ymiddle)*pz));
            points.push(new Point(x2*px, y1*py, f(x2, y1)*pz));
        }
        for(let j = accuracy; j > 0; j--) {
            let x1 = xStart + j*xStep,
                x2 = xStart + (j - 1)*xStep;

            points.push(new Point(x1*px, y2*py, f(x1, y2)*pz));
            points.push(new Point(x2*px, ymiddle*py, f(x2, ymiddle)*pz));
        }
        points.push(new Point(xStart*px, y2*py, f(xStart, y2)*pz));
    }

    return points;
}

class Surface extends Figure {

    constructor(id, f, leftDown, rightUp, accuracy) {
        super(id, getSurfacePoints(f, leftDown, rightUp, accuracy, [1, 1, 1]));
        this.f = f;
        this.leftDown = leftDown;
        this.rightUp = rightUp;
        this.accuracy = accuracy;
    }

    getTexturePoints() {
        const { accuracy } = this,
            points = [],
            xStep = 1/accuracy,
            yStep = 1/accuracy;

        for(let i = 0; i < accuracy; i++) {
            let y1 = i*yStep,
                y2 = (i + 1)*yStep,
                ymiddle = (y1 + y2)/2;

            points.push(0, y1);
            for(let j = 0; j < accuracy; j++) {
                let x1 = j*xStep,
                    x2 = (j + 1)*xStep;

                points.push(x1, ymiddle);
                points.push(x2, y1);
            }
            for(let j = accuracy; j > 0; j--) {
                let x1 = j*xStep,
                    x2 = (j - 1)*xStep;

                points.push(x1, y2);
                points.push(x2, ymiddle);
            }
            points.push(0, y2);
        }

        return points;
    }

    getProjection(vector) {
        this.getSurfacePoints(this.f, this.leftDown, this.rightUp, vector);
    }

}