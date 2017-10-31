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

        this.init();
    }

    use(){
        this.gl.useProgram(this.program);
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

    setUniform(name, variable) {
        this.gl.uniformMatrix4fv(this.gl.uniform[name], false, variable);
    }

    initBuffer(name) {
        this.gl.attributes[name] = this.gl.getAttribLocation(this.program, name);
        this.gl.buffers[name] = this.gl.createBuffer();
        this.gl.enableVertexAttribArray(this.gl.attributes[name]);
    }

    flushBuffer(name, vertexContainer, type) {
        const buffer = this.gl.buffers[name];
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertexContainer.source), this.gl.STATIC_DRAW);
        this.gl.vertexAttribPointer(this.gl.attributes[name], vertexContainer.sizing, this.gl.FLOAT, false, 0, 0);
        this.gl.drawArrays(type, 0, vertexContainer.count);
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
            throw new Error(`Error during compiling shader ${id}.`);

        return shader;
    }
}