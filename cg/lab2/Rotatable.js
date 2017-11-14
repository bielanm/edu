const angleSpeedStep = Math.PI*2/360;

class RotatableOverPoint extends Moveable {

    constructor() {
        super();
        this.rotationPoint = new Point(0, 0, 0);
        this.ifRotateOverPoint = false;
        this.rotationR = 7;
        this.alpha = 0;
        this.betta = Math.PI/2;
        this.rotationSpeedAlpha = angleSpeedStep*100;
        this.rotationSpeedBetta = angleSpeedStep*100;
    }

    setRotationPoint(point) {
        this.ifRotateOverPoint = true;
        this.rotationPoint = point;
        return this;
    }

    move(T) {
        if(!this.ifRotateOverPoint)
            return super.move(T);

        this.alpha += this.rotationSpeedAlpha*T;
        this.betta += this.rotationSpeedBetta*T;

        const y = this.rotationPoint.y + Math.cos(this.betta)*this.rotationR,
            xzRadius = Math.abs(Math.sin(this.betta)*this.rotationR),
            x = this.rotationPoint.x + Math.sin(this.alpha)*xzRadius,
            z = this.rotationPoint.z + Math.cos(this.alpha)*xzRadius;

        console.log(`X = ${x}, Y = ${y}, Z = ${z}`);

        this.setPosition(new Point(x, y, z));
        return this;
    }

    increaseRotationSpeedAlpha() {
        this.rotationSpeedAlpha += angleSpeedStep;
    }

    increaseRotationSpeedBetta() {
        this.rotationSpeedBetta += angleSpeedStep;
    }

    increaseTranslationSpeedR() {
        this.r += translationInitSpeed;
    }

    decreaseRotationSpeedAlpha() {
        this.rotationSpeedAlpha -= angleSpeedStep;
    }

    decreaseRotationSpeedBetta() {
        this.rotationSpeedBetta -= angleSpeedStep;
    }

    decreaseTranslationSpeedR() {
        this.r -= translationInitSpeed;
    }
}