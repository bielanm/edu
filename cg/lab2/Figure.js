class Figure {

    constructor(id, points) {
        this.id = id;

        this.points = points.map((point) => [point.x, point.y, point.z]);
        this.sizing = 3;
        this.count = this.points.length/this.sizing

        this.model = mat4.create();
        mat4.identity(this.model);

        this.withColor(new Color(0, 0, 0, 1.0));
    }

    getCount() {
        return this.points.length/3;
    }

    translate(point) {
        mat4.translate(this.model, this.model, [point.x, point.y, point.z]);
        return this;
    }

    rotate(point) {
        mat4.rotateX(this.model, this.model, point.x);
        mat4.rotateY(this.model, this.model, point.y);
        mat4.rotateZ(this.model, this.model, point.z);

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

}