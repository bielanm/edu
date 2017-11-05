function run() {
    const canvas = document.getElementById('canvas'),
        loader = new GLoader(canvas),
        modelMatrix = mat4.create(),
        perspectiveMatrix = mat4.create(),
        cameraMatrix = mat4.create(),
        torVertexContaineer = new VertexContainer(3, getTorVertex(0.6, 0.3, 100)),
        torVertexTextureContaineer = new VertexContainer(2, getTorVertexTexture(100));

    loader.initVertexShader('vertex.lab#2');
    loader.initFragmentShader('fragment.lab#2');
    loader.initProgram();

    loader.initAttribute('vertexPosition');
    loader.initAttribute('vertexTexture');

    loader.initBuffer('vertexPosition', torVertexContaineer);
    loader.initBuffer('vertexTexture', torVertexTextureContaineer);
    loader.initTexture('torTexture', 'lab2/2.jpg');

    loader.initUniform('modelUniform');
    loader.initUniform('perspectiveUniform');
    loader.initUniform('cameraUniform');

    mat4.identity(modelMatrix);
    mat4.identity(cameraMatrix);
    mat4.identity(cameraMatrix);
    mat4.perspective(perspectiveMatrix, 45*Math.PI/180, loader.gl.viewportWidth / loader.gl.viewportHeight, 0.1, 100.0);

    function drawSceneCallback(ctx) {
        const { gl, program } = ctx;

        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.bindBuffer(gl.ARRAY_BUFFER, gl.buffers['vertexPosition']);
        gl.vertexAttribPointer(gl.attributes['vertexPosition'], torVertexContaineer.sizing, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, gl.buffers['vertexTexture']);
        gl.vertexAttribPointer(gl.attributes['vertexTexture'], torVertexTextureContaineer.sizing, gl.FLOAT, false, 0, 0);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, gl.textures['torTexture']);
        gl.uniform1i(program.samplerUniform, 0);

        ctx.setUniform('modelUniform', modelMatrix);
        ctx.setUniform('perspectiveUniform', perspectiveMatrix);
        ctx.setUniform('cameraUniform', cameraMatrix);
        gl.bindBuffer(gl.ARRAY_BUFFER, gl.buffers['vertexPosition']);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, torVertexContaineer.count);
    }

    function getTorVertex(R, r, steps) {
        const array = [];

        for(let i = 0; i <= steps; i++) {
            const alpha = 2*Math.PI*i/steps,
                nextAlpha = 2*Math.PI*(i+1)/steps;
            for(let j = 0; j <= steps; j++) {
                const betta = (2*Math.PI)*j/steps,
                    x1 = (R + r*Math.cos(betta))*Math.cos(alpha),
                    y1 = r*Math.sin(betta),
                    z1 = (R + r*Math.cos(betta))*Math.sin(alpha),
                    x2 = (R + r*Math.cos(betta))*Math.cos(nextAlpha),
                    y2 = r*Math.sin(betta),
                    z2 = (R + r*Math.cos(betta))*Math.sin(nextAlpha);

                array.push(x1, y1, z1, x2, y2, z2);
            }
        }
        return array;
    }

    function getTorVertexTexture(steps) {
        const array = [];

        for(let i = 0; i <= steps; i++) {
            const alpha = i/steps,
                nextAlpha = (i+1)/steps;
            for(let j = 0; j <= steps; j++) {
                const betta = j/steps,
                    x1 = alpha,
                    y1 = betta,
                    x2 = nextAlpha,
                    y2 = betta;

                array.push(x1, y1, x2, y2);
            }
        }
        return array;
    }

    let rotationInitSpeed = (Math.PI/5)/60,
        rotationSpeedX = 0,
        rotationSpeedY = 0,
        rotationSpeedZ = 0,
        translationInitSpeed = 1/25,
        translationSpeedX = 0,
        translationSpeedY = 0,
        translationSpeedZ = 0,
        cameraAlphaRotationSpeed = 0,
        cameraBettaRotationSpeed = 0,
        radiusChangeSpeed = 0;

    let recent = Date.now(),
        position = [0, 0, -3],
        rotation = [0, 1, 0],
        camera = { alpha: 0, betta: 0, radius: 0};
    function animate() {
        const now = Date.now(),
            T = (now - recent)/1000;

        let [dx, dy, dz] = [translationSpeedX*T, translationSpeedY*T, translationSpeedZ*T],
            [x, y, z] = position,
            [a, b, c] = rotation,
            [da, db, dc] = [rotationSpeedX*T, rotationSpeedY*T, rotationSpeedZ*T];
        position = [dx + x, dy + y, dz + z];
        rotation = [da + a, db + b, dc + c];

        mat4.translate(modelMatrix, modelMatrix, position);
        mat4.rotateX(modelMatrix, modelMatrix, a + da);
        mat4.rotateY(modelMatrix, modelMatrix, b + db);
        mat4.rotateZ(modelMatrix, modelMatrix, c + dc);

        camera.alpha += cameraAlphaRotationSpeed*T;
        camera.betta += cameraBettaRotationSpeed*T;
        camera.radius += radiusChangeSpeed*T;

        const zCamera = Math.cos(camera.alpha)*camera.radius,
            yCamera = Math.sin(camera.betta)*camera.radius,
            xCamera = Math.sin(camera.alpha)*camera.radius;

        console.log(`Camera: x=${xCamera}, y=${yCamera}, z=${zCamera}`);

        mat4.translate(cameraMatrix, cameraMatrix, [xCamera, yCamera, zCamera]);

        mat4.invert(cameraMatrix, cameraMatrix);

        recent = now;
    }

    const modelStack = mat4.create(),
        cameraStack = mat4.create();
    function tick() {
        requestAnimationFrame(tick);
        mat4.copy(modelStack, modelMatrix);
        mat4.copy(modelStack, cameraMatrix);
        animate();
        loader.drawScene(drawSceneCallback);
        mat4.copy(modelMatrix, modelStack);
        mat4.copy(cameraMatrix, cameraStack);
    }

    addKeydownListener(BUTTONS.W, () => rotationSpeedX += rotationInitSpeed);
    addKeydownListener(BUTTONS.S, () => rotationSpeedX -= rotationInitSpeed);
    addKeydownListener(BUTTONS.E, () => rotationSpeedY += rotationInitSpeed);
    addKeydownListener(BUTTONS.Q, () => rotationSpeedY -= rotationInitSpeed);
    addKeydownListener(BUTTONS.D, () => rotationSpeedZ += rotationInitSpeed);
    addKeydownListener(BUTTONS.A, () => rotationSpeedZ -= rotationInitSpeed);

    addKeydownListener(BUTTONS.H, () => translationSpeedX += translationInitSpeed);
    addKeydownListener(BUTTONS.F, () => translationSpeedX -= translationInitSpeed);
    addKeydownListener(BUTTONS.Y, () => translationSpeedY += translationInitSpeed);
    addKeydownListener(BUTTONS.R, () => translationSpeedY -= translationInitSpeed);
    addKeydownListener(BUTTONS.T, () => translationSpeedZ += translationInitSpeed);
    addKeydownListener(BUTTONS.G, () => translationSpeedZ -= translationInitSpeed);

    addKeydownListener(BUTTONS.left, () => cameraAlphaRotationSpeed -= rotationInitSpeed);
    addKeydownListener(BUTTONS.right, () => cameraAlphaRotationSpeed += rotationInitSpeed);
    addKeydownListener(BUTTONS.up, () => cameraBettaRotationSpeed += rotationInitSpeed);
    addKeydownListener(BUTTONS.down, () => cameraBettaRotationSpeed -= rotationInitSpeed);

    addWheelListener((event) => {
        const sign = (event.deltaY > 0) ? 1 : -1;
        radiusChangeSpeed += sign*translationInitSpeed;
    });
    tick();
}

resize();

