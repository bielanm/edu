execute(() => {
    const canvas = document.getElementById('canvas.lab#1'),
        gl = canvas.getContext('webgl'),
        vertexShader = createShader(gl, 'vertex.lab#1'),
        fragmentShader = createShader(gl, 'fragment.lab#1'),
        program = createProgram(gl, vertexShader, fragmentShader),
        buffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    const triangles = [
        -0.625,     -0.5,
        -0.125,     0,
        -0.625,     0,

        0.375,      0,
        -0.125,     0,
        0.375,      -0.5,

        -0.875,     0.125,
        -0.625,     0.125,
        -0.625,     0.375,

        -0.875,     0.5,
        -0.875,     0.125,
        -0.7,       0.3
    ];

    const rectangles = [
        -0.875,     -0.125,
        -0.875,     0.125,
        -0.625,     -0.125,
        -0.625,     0.125,

        -0.625,     0,
        -0.625,     -0.25,
        0.375,      0,
        0.375,      -0.25,

        0.375,      0,
        0.5,        0.25,
        0.75,       0.125,
        0.875,      0.375
    ];

    function drawScene() {
        gl.clearColor(1, 0.25, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([...triangles, ...rectangles]), gl.STATIC_DRAW, 0, 0);
        gl.useProgram(program);

        const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

        gl.drawArrays(gl.TRIANGLES, 0, triangles.length/2);
        gl.drawArrays(gl.TRIANGLE_STRIP, triangles.length/2, rectangles.length/2 - 4);
        gl.drawArrays(gl.TRIANGLE_STRIP, triangles.length/2 + rectangles.length/2 - 4, 4);
    }

    function popAllpushAll(dest, source) {
        while(dest.length > 0) dest.pop();
        Array.prototype.push.apply(dest, source);
    }

    function updatePosition(callback) {
        const T = triangles.map(callback),
            R = rectangles.map(callback);

        popAllpushAll(triangles, T);
        popAllpushAll(rectangles, R);
        drawScene();
    }

    addKeydownListener(BUTTONS.rightPlus, () => updatePosition((dot, index) => (index % 2 == 1) ? dot + 0.125 : dot));
    addKeydownListener(BUTTONS.rightMinus, () => updatePosition((dot, index) => (index % 2 == 1) ? dot - 0.125 : dot));

    drawScene();

});

function createShader(gl, id) {
    const shaderScript = document.getElementById(id);
    let shaderSrc = "",
        currentChild = shaderScript.firstChild;

    while(currentChild) {
        if (currentChild.nodeType == currentChild.TEXT_NODE)
            shaderSrc += currentChild.textContent;
        currentChild = currentChild.nextSibling;
    }

    const types = {
        'x-shader/x-fragment': gl.FRAGMENT_SHADER,
        'x-shader/x-vertex': gl.VERTEX_SHADER
    };

    const shaderType = types[shaderScript.type],
        shader = gl.createShader(shaderType);

    gl.shaderSource(shader, shaderSrc);
    gl.compileShader(shader);

    return gl.getShaderParameter(shader, gl.COMPILE_STATUS)
        ? shader
        : gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    return gl.getProgramParameter(program, gl.LINK_STATUS)
        ? program
        : gl.deleteProgram(program);
}