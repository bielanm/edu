const angleSpeedStep = Math.PI*2/360,
    ratationChange = 0.1;

class RotatableOverPoint extends Moveable {

    constructor() {
        super();
        this.rotationPoint = new Point(0, 0, 0);
        this.ifRotateOverPoint = false;
        this.rotationR = 7;
        this.alpha = Math.PI/2;
        this.betta = Math.PI/2;
        this.rotationSpeedAlpha = angleSpeedStep*100;
        this.rotationSpeedBetta = 0;
    }

    withAlpha(alpha) {
        this.alpha = alpha;
        return this;
    }

    withBetta(betta) {
        this.betta = betta;
        return this;
    }


    withRotationPoint(point) {
        this.ifRotateOverPoint = true;
        this.rotationPoint = point;
        return this;
    }

    withRotationRadius(rotationR) {
        this.rotationR = rotationR;
        return this;
    }

    move(T) {
        if(!this.ifRotateOverPoint)
            return super.move(T);

        this.alpha += this.rotationSpeedAlpha*T;
        this.betta += this.rotationSpeedBetta*T;

        const gamma = Math.PI/2 + this.alpha;

        const y = this.rotationPoint.y + Math.cos(this.betta)*this.rotationR,
            x = this.rotationPoint.x + Math.cos(this.alpha)*this.rotationR,
            z = this.rotationPoint.z + Math.cos(gamma)*this.rotationR;

        this.setPosition(new Point(x, y, z));
        return this;
    }

    increaseRotationSpeedAlpha() {
        this.rotationSpeedAlpha += angleSpeedStep;
    }

    increaseRotationSpeedBetta() {
        this.rotationSpeedBetta += angleSpeedStep;
    }

    increaseRotationSpeedR() {
        this.rotationR += translationInitSpeed;
    }

    decreaseRotationSpeedAlpha() {
        this.rotationSpeedAlpha -= angleSpeedStep;
    }

    decreaseRotationSpeedBetta() {
        this.rotationSpeedBetta -= angleSpeedStep;
    }

    decreaseRotationSpeedR() {
        this.rotationR -= translationInitSpeed;
    }

}