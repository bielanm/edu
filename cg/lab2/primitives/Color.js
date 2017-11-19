class Color {

    constructor(r, g, b, a = 1.0) {
        this.r = r/256;
        this.g = g/256;
        this.b = b/256;
        this.a = a
    }

    getOrigin() {
        const { r, g, b, a} = this;
        return { r: Math.floor(255*r), g: Math.floor(255*g), b: Math.floor(255*b), a }
    }
}