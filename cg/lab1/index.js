execute(() => {
    const canvas = document.getElementById('canvas.lab#1'),
        gl = canvas.getContext('webgl'),
        vertexShader = createShader(gl, 'vertex.lab#1'),
        fragmentShader = createShader(gl, 'fragment.lab#1'),
        program = createProgram(gl, vertexShader, fragmentShader),
        triangleBuffer = gl.createBuffer();

    gl.clearColor(1, 0.25, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);

    const triangles = [
        -0.5 - 0.125, -0.5,
        0 - 0.125, 0,
        -0.5 - 0.125, 0,

        0.5 - 0.125, 0,
        0 - 0.125, 0,
        0.5 - 0.125, -0.5,

        -0.25 - 0.125, -0.25,
        0 - 0.125, 0,
        -1 - 0.125, -1,

        -0.75 - 0.125, 0.125,
        -0.5 - 0.125, 0.125,
        -0.5 - 0.125, 0.375,

        -0.75 - 0.125, 0.5,
        -0.75 - 0.125, 0.125,
        -0.575 - 0.125, 0.3
    ];

    const rectangles = [
        -0.75 - 0.125, -0.125,
        -0.75 - 0.125, 0.125,
        -0.5 - 0.125, -0.125,
        -0.5 - 0.125, 0.125,

        -0.5 - 0.125, 0,
        -0.5 - 0.125, -0.5/2,
        0.5 - 0.125, 0,
        0.5 - 0.125, -0.5/2,

        0.5 - 0.125, 0,
        0.5 + 0.125 - 0.125, 0.25,
        0.5 + 0.25 + 0.125 - 0.125, 0.125,
        0.5 + 0.25 + 0.125 + 0.125 - 0.125, 0.25 + 0.125
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([...triangles, ...rectangles]), gl.STATIC_DRAW, 0, 0);
    gl.useProgram(program);

    const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, triangles.length/2);
    gl.drawArrays(gl.TRIANGLE_STRIP, triangles.length/2, rectangles.length/2 - 4);
    gl.drawArrays(gl.TRIANGLE_STRIP, triangles.length/2 + rectangles.length/2 - 4, 4);
});