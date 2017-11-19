const angleSpeedStep = Math.PI*2/360;

class RotatableOverPoint extends Moveable {

    constructor() {
        super();
        this.rotationPoint = new Point(0, 0, 0);
        this.ifRotateOverPoint = false;

        this.alpha = Math.PI/2;
        this.betta = Math.PI/2;
        this.rotationSpeedAlpha = 0;
        this.rotationSpeedBetta = 0;
        this.lastDelta = 0;

        this.recalculateR();
    }

    recalculateR() {
        const [x, y, z] = this.positionState;
        this.rotationR = x*x + y*y + z*z;
    }

    translate(dx, dy, dz) {
        super.translate(dx, dy, dz);
        if(this.ifRotateOverPoint) {
            this.recalculateR();
        }
        return this;
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


        let previous = this.betta;
        this.alpha += this.rotationSpeedAlpha*T;
        this.betta += this.rotationSpeedBetta*T;

        if (!(0 < this.betta && this.betta < Math.PI)) {
            this.betta = previous;
        }

        const xzR = Math.sin(this.betta)*this.rotationR,
            y = this.rotationPoint.y + Math.cos(this.betta)*this.rotationR,
            x = this.rotationPoint.x + Math.cos(this.alpha)*xzR,
            z = this.rotationPoint.z + Math.sin(this.alpha)*xzR;

        this.setPosition(new Point(x, y, z));
        this.lastDelta = T;
        return this;
    }

    increaseRotationSpeedAlpha() {
        this.rotationSpeedAlpha += angleSpeedStep;
    }

    increaseRotationSpeedBetta() {
        this.rotationSpeedBetta += angleSpeedStep;
    }

    decreaseRotationSpeedAlpha() {
        this.rotationSpeedAlpha -= angleSpeedStep;

    }

    decreaseRotationSpeedBetta() {
        this.rotationSpeedBetta -= angleSpeedStep;
    }

    increaseRotationSpeedR() {
        this.rotationR += translationInitSpeed*this.lastDelta*10;
    }

    decreaseRotationSpeedR() {
        this.rotationR -= translationInitSpeed*this.lastDelta*10;
    }

}