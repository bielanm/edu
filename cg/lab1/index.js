execute(() => {
    const canvas = document.getElementById('canvas.lab#1'),
        gl = canvas.getContext('webgl'),
        vertexShader = createShader(gl, 'vertex.lab#1'),
        fragmentShader = createShader(gl, 'fragment.lab#1'),
        program = createProgram(gl, vertexShader, fragmentShader),
        triangleBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);

    const points = [
        // -0.5, -0.5,
        // 0, 0,
        // -0.5, 0,
        //
        // 0.5, 0,
        // 0, 0,
        // 0.5, -0.5,
        //
        // -0.25, -0.25,
        // 0, 0,
        // 0.25, -0.25,

        -0.25 + 0.5, 0.25 + 0.5,
        -0.25 + 0.5, -0.25 + 0.5,
        0.25 + 0.5, 0.25 + 0.5,
        0.25 + 0.5, -0.25 + 0.5
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);
    gl.useProgram(program);

    const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

//    gl.drawArrays(gl.TRIANGLES, 0, 9);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
});