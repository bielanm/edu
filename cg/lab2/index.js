execute(() => {
    const canvas = document.getElementById('canvas.lab#2'),
        loader = new GLoader(canvas);

    loader.initVertexShader('vertex.lab#2');
    loader.initFragmentShader('fragment.lab#2');
    loader.initProgram();
    loader.initAttributes('vertexPosition');

    loader.initBuffer('vertexPosition');

    loader.initUniform('modelUniform');
    loader.initUniform('perspectiveUniform');

    const modelMatrix = mat4.create();
    const perspectiveMatrix = mat4.create();
    const vertexContaineer = new VertexContainer(3, getTorVertex(0.7, 0.2, 30));

    mat4.identity(modelMatrix);

    function drawSceneCallback(ctx) {
        const { gl } = ctx;

        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        gl.clearColor(0.0, 0.0, 0.0, 0.5);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        mat4.translate(modelMatrix, modelMatrix, [0, 0, -2.5]);
        mat4.perspective(perspectiveMatrix, 45*Math.PI/180, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0);
        const buffer = gl.buffers['vertexPosition'];
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexContaineer.source), gl.STATIC_DRAW);
        gl.vertexAttribPointer(gl.attributes[name], vertexContaineer.sizing, gl.FLOAT, false, 0, 0);

        ctx.setUniform('modelUniform', modelMatrix);
        ctx.setUniform('perspectiveUniform', perspectiveMatrix);

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertexContaineer.count);
    }
    loader.drawScene(drawSceneCallback);


    function getTorVertex(R, r, steps) {
        const array = [];

        for(let i = 0; i < steps; i++) {
            const alpha = 2*Math.PI*i/steps - Math.PI;
            for(let j = 0; j < steps; j++) {
                const betta = (2*Math.PI)*j/steps,
                    x = (R + r*Math.cos(alpha))*Math.cos(betta),
                    y = (R + r*Math.cos(alpha))*Math.sin(betta),
                    z = r*Math.cos(alpha);

                array.push(x, y, z);
            }
        }

        return array;
    }

});

