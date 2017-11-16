
class Lighting extends RotatableOverPoint {

    constructor() {
        super();
        this.ambientColor = new Color(255, 255, 255, 1);
        this.directionalColor = new Color(0, 0, 0, 1);
        this.direction = new Vector(0, -1, 0);
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
        this.direction = new Vector(this.rotationPoint.x-this.positionState.x, this.rotationPoint.y-this.positionState.y, this.rotationPoint.z-this.positionState.z);
        this.normalize();

        console.log(`Direction: X=${x}, Y=${y}, Z=${z}`);
        let [px, py, pz] = this.positionState;
        console.log(`Position: X=${px}, Y=${py}, Z=${pz}`);

    }
}