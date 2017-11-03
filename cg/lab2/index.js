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
    const torVertexContaineer = new VertexContainer(3, getTorVertex(0.3, 0.1, 100));

    mat4.identity(modelMatrix);
    mat4.translate(modelMatrix, modelMatrix, [0, 0, -3]);
    mat4.perspective(perspectiveMatrix, 45*Math.PI/180, loader.gl.viewportWidth / loader.gl.viewportHeight, 0.1, 100.0);

    function drawSceneCallback(ctx) {
        const { gl } = ctx;

        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        gl.clearColor(0.0, 0.0, 0.0, 0.5);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        const buffer = gl.buffers['vertexPosition'];
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(torVertexContaineer.source), gl.STATIC_DRAW);
        gl.vertexAttribPointer(gl.attributes[name], torVertexContaineer.sizing, gl.FLOAT, false, 0, 0);

        ctx.setUniform('modelUniform', modelMatrix);
        ctx.setUniform('perspectiveUniform', perspectiveMatrix);

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, torVertexContaineer.count);
    }

    function getTorVertex(R, r, steps) {
        const array = [];

        for(let i = 0; i <= steps; i++) {
            const alpha = 2*Math.PI*i/steps;
            for(let j = 0; j < steps; j++) {
                const betta = (2*Math.PI)*j/steps,
                    x = (R + r*Math.cos(betta))*Math.cos(alpha),
                    y = r*Math.sin(betta),
                    z = (R + r*Math.cos(betta))*Math.sin(alpha);

                array.push(x, y, z);
            }
        }

        return array;
    }

    let rotationInitSpeed = (Math.PI/10)/60,
        rotationSpeedX = 0,
        rotationSpeedY = 0,
        rotationSpeedZ = 0,
        translationInitSpeed = 1/50,
        translationSpeedX = 0,
        translationSpeedY = 0,
        translationSpeedZ = 0;

    let recent = Date.now();
    function animate() {
        const now = Date.now(),
            T = (now - recent)/1000;

        mat4.rotateX(modelMatrix, modelMatrix, rotationSpeedX*T);
        mat4.rotateY(modelMatrix, modelMatrix, rotationSpeedY*T);
        mat4.rotateZ(modelMatrix, modelMatrix, rotationSpeedZ*T);

        const translationVector = [translationSpeedX*T, translationSpeedY*T, translationSpeedZ*T]
        mat4.translate(modelMatrix, modelMatrix, translationVector);

        recent = now;
    }

    function tick() {
        requestAnimationFrame(tick);
        loader.drawScene(drawSceneCallback);
        animate();
    }

    addKeypressListener(BUTTONS.W, () => rotationSpeedX += rotationInitSpeed);
    addKeypressListener(BUTTONS.S, () => rotationSpeedX -= rotationInitSpeed);
    addKeypressListener(BUTTONS.D, () => rotationSpeedY += rotationInitSpeed);
    addKeypressListener(BUTTONS.A, () => rotationSpeedY -= rotationInitSpeed);
    addKeypressListener(BUTTONS.E, () => rotationSpeedZ += rotationInitSpeed);
    addKeypressListener(BUTTONS.Q, () => rotationSpeedZ -= rotationInitSpeed);

    addKeypressListener(BUTTONS.H, () => translationSpeedX += translationInitSpeed);
    addKeypressListener(BUTTONS.F, () => translationSpeedX -= translationInitSpeed);
    addKeypressListener(BUTTONS.Y, () => translationSpeedY += translationInitSpeed);
    addKeypressListener(BUTTONS.R, () => translationSpeedY -= translationInitSpeed);
    addKeypressListener(BUTTONS.T, () => translationSpeedZ += translationInitSpeed);
    addKeypressListener(BUTTONS.G, () => translationSpeedZ -= translationInitSpeed);

    tick();
});

