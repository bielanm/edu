const translationInitSpeed = 1/25;

class Moveable {

    constructor() {
        this.positionState = [0, 0, 0];
        this.translationSpeedX = 0;
        this.translationSpeedY = 0;
        this.translationSpeedZ = 0;
    }

    setPosition(point) {
        this.positionState = [point.x, point.y, point.z];
    }

    translate(dx, dy, dz) {
        const [x, y, z] = this.positionState;
        this.positionState = [x + dx, y + dy, z + dz];
        return this;
    }

    move(T) {
        this.translate(this.translationSpeedX*T, this.translationSpeedY*T, this.translationSpeedZ*T);
        return this;
    }

    increaseTranslationSpeedX() {
        this.translationSpeedX += translationInitSpeed;
    }

    increaseTranslationSpeedY() {
        this.translationSpeedY += translationInitSpeed;
    }

    increaseTranslationSpeedZ() {
        this.translationSpeedZ += translationInitSpeed;
    }

    decreaseTranslationSpeedX() {
        this.translationSpeedX -= translationInitSpeed;
    }

    decreaseTranslationSpeedY() {
        this.translationSpeedY -= translationInitSpeed;
    }

    decreaseTranslationSpeedZ() {
        this.translationSpeedZ -= translationInitSpeed;
    }
}