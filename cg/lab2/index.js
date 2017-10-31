execute(() => {
    const canvas = document.getElementById('canvas.lab#1'),
        loader = new GLoader(canvas);

    loader.initVertexShader('vertex.lab#2');
    loader.initFragmentShader('fragment.lab#2');
    loader.initProgram();

    loader.initBuffer('vertexPosition');

    loader.initUniform('modelUniform');
    loader.initUniform('perspectiveUniform');

    const modelMatrix = mat4.create();
    const perspectiveMatrix = mat4.create();
    const vertexContaineer = new VertexContainer(3, [
        0.0,  1.0,  0.0,
        -1.0, -1.0,  0.0,
        1.0, -1.0,  0.0
    ]);

    function drawSceneCallback(ctx) {
        const { gl } = ctx;

        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        mat4.identity(modelMatrix);
        mat4.perspective(perspectiveMatrix, 45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0);
        ctx.setUniform('modelUniform', modelMatrix);
        ctx.setUniform('perspectiveUniform', perspectiveMatrix);

        ctx.flushBuffer('vertexPosition', vertexContaineer, gl.TRIANGLES);
    }

    loader.use();
    loader.drawScene(drawSceneCallback);

});

