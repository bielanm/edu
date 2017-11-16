const angleSpeedStep = Math.PI*2/360,
    ratationChange = 0.1;

class RotatableOverPoint extends Moveable {

    constructor() {
        super();
        this.rotationPoint = new Point(0, 0, 0);
        this.ifRotateOverPoint = false;

        this.alpha = Math.PI/2;
        this.betta = Math.PI/2;
        this.rotationSpeedAlpha = 0;
        this.rotationSpeedBetta = 0;
        this.rotationSpeedR = 0;

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

        this.rotationR += this.rotationSpeedR*T;
        this.alpha += this.rotationSpeedAlpha*T;
        this.betta += this.rotationSpeedBetta*T;

        this.alpha %= Math.PI*2;
        this.betta %= Math.PI*2;

        const xzR = Math.sin(this.betta)*this.rotationR,
            y = this.rotationPoint.y + Math.cos(this.betta)*this.rotationR,
            x = this.rotationPoint.x + Math.cos(this.alpha)*xzR,
            z = this.rotationPoint.z + Math.sin(this.alpha)*xzR;

        //console.log(`X=${x}, Y=${y}, Z=${z}, Alpha=${this.alpha*360/Math.PI/2}, Betta=${this.betta*360/Math.PI/2}`);
        this.setPosition(new Point(x, y, z));
        return this;
    }

    increaseRotationSpeedAlpha() {
        this.rotationSpeedAlpha += angleSpeedStep;
    }

    increaseRotationSpeedBetta() {
        this.rotationSpeedBetta += angleSpeedStep;
    }

    decreaseRotationSpeedAlpha() {
        const speed = this.rotationSpeedAlpha - angleSpeedStep;
        this.rotationSpeedAlpha = speed > 0 ? speed : 0;
    }

    decreaseRotationSpeedBetta() {
        const speed = this.rotationSpeedBetta - angleSpeedStep;
        this.rotationSpeedBetta = speed > 0 ? speed : 0;
    }

    increaseRotationSpeedR() {
        this.rotationSpeedR += translationInitSpeed;
    }

    decreaseRotationSpeedR() {
        this.rotationSpeedR -= angleSpeedStep;
    }

}