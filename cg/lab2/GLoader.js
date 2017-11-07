class GLoader {

    constructor(canvas) {
        if(!canvas)
            throw new Error('Not canvas element specified');

        this.gl = canvas.getContext('webgl');
        this.gl.viewportWidth = canvas.width;
        this.gl.viewportHeight = canvas.height;

        this.gl.uniform = {};
        this.gl.attributes = {};
        this.gl.buffers = {};
        this.gl.textures = {};

        this.init();
    }

    init() {
        this.gl.enable(this.gl.DEPTH_TEST);
    }

    drawScene(callback) {
        callback(this);
    }

    initUniform(name) {
        this.gl.uniform[name] = this.gl.getUniformLocation(this.program, name);
    }

    setUniformMatrix(name, variable) {
        this.gl.uniformMatrix4fv(this.gl.uniform[name], false, variable);
    }

    setFloatUniform(name, variable) {
        this.gl.uniform1f(this.gl.uniform[name], variable);
    }

    setVec4Uniform(name, variable) {
        this.gl.uniform4fv(this.gl.uniform[name],  variable);
    }

    setUniform1i(name, variable) {
        this.gl.uniform1i(this.gl.uniform[name], variable);
    }

    initBuffer(name, vertexConteiner) {
        this.gl.buffers[name] = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.gl.buffers[name]);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertexConteiner), this.gl.STATIC_DRAW);
    }

    initTexture(name, url) {

        const { gl } = this,
            texture = gl.createTexture();
        texture.image = new Image();
        texture.image.onload = () => {
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.bindTexture(gl.TEXTURE_2D, null);
        };

        texture.image.src = url;
        this.gl.textures[name] = texture;
    }

    initAttribute(name) {
        this.gl.attributes[name] = this.gl.getAttribLocation(this.program, name);
        this.gl.enableVertexAttribArray(this.gl.attributes[name]);
    }

    initVertexShader(id) {
        this.gl.vertexShader = this.createShader(id);
    }

    initFragmentShader(id) {
        this.gl.fragmentShader = this.createShader(id);
    }

    initProgram() {
        if(!(this.gl.fragmentShader && this.gl.vertexShader))
            throw new Error('Create shaders at first');

        this.program = this.createProgram();
        this.gl.useProgram(this.program);
    }

    createProgram() {
        const program = this.gl.createProgram();
        this.gl.attachShader(program, this.gl.vertexShader);
        this.gl.attachShader(program, this.gl.fragmentShader);
        this.gl.linkProgram(program);

        if(!this.gl.getProgramParameter(program, this.gl.LINK_STATUS))
            throw new Error(`Error during linking program.`);

        return program;
    }

    createShader(id) {
        const shaderScript = document.getElementById(id);
        let shaderSrc = "",
            currentChild = shaderScript.firstChild;

        while(currentChild) {
            if (currentChild.nodeType == currentChild.TEXT_NODE)
                shaderSrc += currentChild.textContent;
            currentChild = currentChild.nextSibling;
        }

        const types = {
            'x-shader/x-fragment': this.gl.FRAGMENT_SHADER,
            'x-shader/x-vertex': this.gl.VERTEX_SHADER
        };

        const shaderType = types[shaderScript.type],
            shader = this.gl.createShader(shaderType);

        this.gl.shaderSource(shader, shaderSrc);
        this.gl.compileShader(shader);

        if(!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS))
            throw new Error(`Error during compiling shader ${id}: ${this.gl.getShaderInfoLog(shader)}`);

        return shader;
    }
}