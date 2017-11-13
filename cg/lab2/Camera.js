

class Camera extends Moveable {

    constructor() {
        super();

        this.model = mat4.create();
        this.lookAt = new Point(0, 0, 0);
        this.normal = new Vector(0, 1, 0);
    }

    withLookAt(point) {
        this.lookAt = point;
    }

    getModel() {
        const { x: lookAtX, y: lookAtY, z: lookAtZ } = this.lookAt,
            { x: normalX, y: normalY, z: normalZ } = this.normal;
        mat4.identity(this.model);
        mat4.lookAt(this.model, this.positionState, [lookAtX, lookAtY, lookAtZ], [normalX, normalY, normalZ]);
        return this.model;
    }
}