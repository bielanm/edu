
class SphereLighting extends Sphere {

    constructor(R) {
        super('lighting', R, 50);
        this.ambientColor = new Color(255, 255, 255, 1);
        this.directionalColor = new Color(0, 0, 0, 1);
        this.direction = new Vector(1, 0, 0);
        this.adjusted = vec3.create();
        this.enabled = true;
        this.normalize();
    }

    isOn() {
        return this.enabled;
    }

    toogle() {
        this.enabled = !this.enabled;
    }

    getAmbientColor() {
        return [this.ambientColor.r, this.ambientColor.g, this.ambientColor.b];
    }

    getDirectionalColor() {
        return [this.directionalColor.r, this.directionalColor.g, this.directionalColor.b];
    }

    normalize() {
        vec3.normalize(this.adjusted, [this.direction.x, this.direction.y, this.direction.y]);
        vec3.scale(this.adjusted, this.adjusted, -1);
    }

    getAdjusted() {
        return this.adjusted;
    }

    withDirection(vector) {
        this.direction = vector;
        this.normalize();
        return this;
    }

    withDirectionColor(color) {
        this.directionalColor = color;
        return this;
    }

    withAmbientColor(color) {
        this.ambientColor = color;
        return this;
    }

    move(T) {
        super.move(T);
        const [x, y, z] = this.positionState;
        this.direction = new Vector(this.rotationPoint.x-x, this.rotationPoint.y-y, this.rotationPoint.z-z);
        this.normalize();
        return this;
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

                array.push(new Vector(-x1*xP, -y*yP, -z1*zP), new Vector(-x2*xP, -y*yP, -z2*zP));
            }
        }
        return array.pushReduce((vector) => [vector.x, vector.y, vector.z]);
    }
}