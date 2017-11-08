const rotationSpeedStep = (Math.PI/5)/60,
    translationInitSpeed = 1/25;

class Figure {

    constructor(id, points) {
        this.id = id;
        this.sizing = 3;
        this.points = [];
        this.position = [0, 0, 0];
        this.rotation = [0, 0, 0];
        this.model = mat4.create();
        this.translationSpeedX = this.rotationSpeedX = 0;
        this.translationSpeedY = this.rotationSpeedY = 0;
        this.translationSpeedZ = this.rotationSpeedZ = 0;
        this.withColor(new Color(0, 0, 0, 1.0));

        points.forEach((point) => Array.prototype.push.apply(this.points, [point.x, point.y, point.z]));
        this.count = points.length;
    }

    getModel() {
        mat4.identity(this.model);
        mat4.translate(this.position);

        const [x, y, z] = this.rotation;
        mat4.rotateX(this.model, this.model, x);
        mat4.rotateY(this.model, this.model, y);
        mat4.rotateZ(this.model, this.model, z);

        return this.model;
    }

    getCount() {
        return this.points.length/3;
    }

    translate(dx, dy, dz) {
        const [x, y, z] = this.position;
        this.position = [x + dx, y + dy, z + dz];
        return this;
    }

    move(T) {
        this.translate(this.translationSpeedX*T, this.translationSpeedY*T, this.translationSpeedZ*T);
        return this;
    }

    rotation(T) {
        this.rotate(this.rotationSpeedX*T, this.rotationSpeedY*T, this.rotationSpeedZ*T);
        return this;
    }

    rotate(dx, dy, dz) {
        const [x, y, z] = this.rotation;
        this.rotation = [x + dx, y + dy, z + dz];
        return this;
    }

    increaseRotationSpeedX() {
        this.rotationSpeedX += rotationSpeedStep;
    }


    increaseRotationSpeedY() {
        this.rotationSpeedY += rotationSpeedStep;
    }

    increaseRotationSpeedZ() {
        this.rotationSpeedZ += rotationSpeedStep;
    }

    increaseTranslationSpeedX() {
        this.translationSpeedX += rotationSpeedStep;
    }


    increaseTranslationSpeedY() {
        this.translationSpeedY += rotationSpeedStep;
    }

    increaseTranslationSpeedZ() {
        this.translationSpeedZ += rotationSpeedStep;
    }

    withTexture(texture) {
        this.isTexture = true;
        this.texture = texture;
        return this;
    }

    withColor(color) {
        this.isTexture = false;
        this.color = color;
        return this;
    }

}