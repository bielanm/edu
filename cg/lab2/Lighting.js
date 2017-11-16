
class Lighting extends RotatableOverPoint {

    constructor() {
        super();
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
    }
}