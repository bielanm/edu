const rotationSpeed = Math.PI/180/60;

class Figure extends RotatableOverPoint {

    constructor(id, points) {
        super();
        this.id = id;
        this.withColor(new Color(0, 0, 0, 1.0));

        this.model = mat4.create();
        this.rotationState = [0, 0, 0];
        this.rotationSpeedX = this.rotationSpeedY = this.rotationSpeedZ= 0;
        this.scaleX = this.scaleY = this.scaleZ = 1;

        this.sizing = 3;
        this.points = points.pushReduce((point) => [point.x, point.y, point.z]);
        this.count = points.length;

    }

    getModel() {
        const [x, y, z] = this.rotationState;

        mat4.identity(this.model);

        mat4.scale(this.model, this.model, [this.scaleX, this.scaleY, this.scaleZ]);
        mat4.translate(this.model, this.model, this.positionState);
        mat4.rotateX(this.model, this.model, x);
        mat4.rotateY(this.model, this.model, y);
        mat4.rotateZ(this.model, this.model, z);


        return this.model;
    }

    scale(scaleX, scaleY, scaleZ) {
        this.scaleX = scaleX*this.scaleX;
        this.scaleY = scaleY*this.scaleY;
        this.scaleZ = scaleZ*this.scaleZ;

        return this;
    }

    rotation(T) {
        this.rotate(this.rotationSpeedX*T, this.rotationSpeedY*T, this.rotationSpeedZ*T);
        return this;
    }

    rotate(dx, dy, dz) {
        const [x, y, z] = this.rotationState;
        this.rotationState = [x + dx, y + dy, z + dz];
        return this;
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

    getColor() {
        return this.color;
    }

    toggleTexture() {
        this.isTexture = !this.isTexture;
    }

    getTextureURL() {
        if(this.isTexture) {
            return this.texture;
        }

        const canvas = document.createElement("canvas");
        canvas.width = 512;
        canvas.height = 512;

        const ctx = canvas.getContext("2d"),
            { r, g, b, a } = this.color.getOrigin();
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        return canvas.toDataURL("image/png");
    }

    increaseRotationSpeedX() {
        this.rotationSpeedX += rotationSpeed;
    }

    increaseRotationSpeedY() {
        this.rotationSpeedY += rotationSpeed;
    }

    increaseRotationSpeedZ() {
        this.rotationSpeedZ += rotationSpeed;
    }

    decreaseRotationSpeedX() {
        this.rotationSpeedX -= rotationSpeed;
    }

    decreaseRotationSpeedY() {
        this.rotationSpeedY -= rotationSpeed;
    }

    decreaseRotationSpeedZ() {
        this.rotationSpeedZ -= rotationSpeed;
    }

}