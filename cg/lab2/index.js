function run() {
    const canvas = document.getElementById('canvas'),
        loader = new GLoader(canvas),
        modelMatrix = mat4.create(),
        perspectiveMatrix = mat4.create(),
        cameraMatrix = mat4.create(),
        figures = [];

    figures.push(new Tor('tor1', 0.6, 0.3, 10).translate(new Point(0, 0, -7)).withTexture('lab2/space.jpg'));
    figures.push(new Tor('tor2', 0.7, 0.1, 20).translate(new Point(1, 0, -5)).withTexture('lab2/space.jpg'));
    figures.push(new Tor('tor3', 0.7, 0.1, 50).translate(new Point(-3, 0, -5)).withTexture('lab2/space.jpg'));

    loader.initVertexShader('vertex.lab#2');
    loader.initFragmentShader('fragment.lab#2');
    loader.initProgram();

    loader.initAttribute('vertexPosition');
    loader.initAttribute('vertexTexturePosition');

    figures.forEach((figure) => {
        loader.initBuffer(figure.id, figure.points);
        if(figure.isTexture) {
            const textureId = `${figure.id}Texture`;
            loader.initBuffer(textureId, figure.getTexturePoints());
            loader.initTexture(textureId, figure.texture);
        }
    });

    loader.initUniform('modelUniform');
    loader.initUniform('perspectiveUniform');
    loader.initUniform('cameraUniform');
    loader.initUniform('ifTextureUniform');
    loader.initUniform('textureUniform');
    loader.initUniform('colorUniform');

    mat4.identity(modelMatrix);
    mat4.identity(cameraMatrix);
    mat4.perspective(perspectiveMatrix, 45*Math.PI/180, loader.gl.viewportWidth / loader.gl.viewportHeight, 0.1, 100.0);


    const modelStack = mat4.create(),
        cameraStack = mat4.create();
    function drawSceneCallback(ctx) {
        const { gl, program } = ctx;

        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        gl.clearColor(1.0, 1.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        figures.forEach((figure) => {
            mat4.copy(modelStack, modelMatrix);
            mat4.copy(modelMatrix, figure.model);
            mat4.copy(cameraStack, cameraMatrix);

            gl.bindBuffer(gl.ARRAY_BUFFER, gl.buffers[figure.id]);
            gl.vertexAttribPointer(gl.attributes['vertexPosition'], figure.sizing, gl.FLOAT, false, 0, 0);
            if(figure.isTexture) {
                const textureId = `${figure.id}Texture`;
                gl.bindBuffer(gl.ARRAY_BUFFER, gl.buffers[textureId]);
                gl.vertexAttribPointer(gl.attributes['vertexTexturePosition'], 2, gl.FLOAT, false, 0, 0);

                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, gl.textures[textureId]);
            }

            const color = figure.color;
            ctx.setUniform1i('textureUniform', 0);
            ctx.setUniformMatrix('cameraUniform', cameraMatrix);
            ctx.setUniformMatrix('perspectiveUniform', perspectiveMatrix);
            ctx.setVec4Uniform('colorUniform', [color.r, color.g, color.b, color.t]);
            ctx.setUniformMatrix('modelUniform', modelMatrix);
            ctx.setFloatUniform('ifTextureUniform', figure.isTexture ? 1.0 : 0.0);

            gl.bindBuffer(gl.ARRAY_BUFFER, gl.buffers[figure.id]);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, figure.count);

            mat4.copy(modelMatrix, modelStack);
            mat4.copy(cameraMatrix, cameraStack);
        });
        // gl.bindBuffer(gl.ARRAY_BUFFER, gl.buffers['vertexTexture']);
        // gl.vertexAttribPointer(gl.attributes['vertexTexture'], torVertexTextureContaineer.sizing, gl.FLOAT, false, 0, 0);

        // gl.activeTexture(gl.TEXTURE0);
        // gl.bindTexture(gl.TEXTURE_2D, gl.textures['torTexture']);
        // gl.uniform1i(program.samplerUniform, 0);
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
        position = [0, 0, 0],
        rotation = [0, 0, 0],
        camera = { alpha: 0, betta: 0, radius: 0};
    function animate() {
        // const now = Date.now(),
        //     T = (now - recent)/1000;
        //
        // let [dx, dy, dz] = [translationSpeedX*T, translationSpeedY*T, translationSpeedZ*T],
        //     [x, y, z] = position,
        //     [a, b, c] = rotation,
        //     [da, db, dc] = [rotationSpeedX*T, rotationSpeedY*T, rotationSpeedZ*T];
        // position = [dx + x, dy + y, dz + z];
        // rotation = [da + a, db + b, dc + c];
        //
        // mat4.translate(modelMatrix, modelMatrix, position);
        // mat4.rotateX(modelMatrix, modelMatrix, a + da);
        // mat4.rotateY(modelMatrix, modelMatrix, b + db);
        // mat4.rotateZ(modelMatrix, modelMatrix, c + dc);
        //
        // camera.alpha += cameraAlphaRotationSpeed*T;
        // camera.betta += cameraBettaRotationSpeed*T;
        // camera.radius += radiusChangeSpeed*T;
        //
        // const zCamera = Math.cos(camera.betta)*Math.cos(camera.alpha)*camera.radius,
        //     xCamera = Math.cos(camera.betta)*Math.sin(camera.alpha)*camera.radius,
        //     yCamera = Math.sin(camera.betta)*camera.radius;
        //
        // let yRotationAngle = Math.atan2(xCamera, zCamera);
        //
        // mat4.translate(cameraMatrix, cameraMatrix, [xCamera, yCamera, zCamera]);
        // mat4.rotateY(cameraMatrix, cameraMatrix, yRotationAngle);
        //
        // mat4.invert(cameraMatrix, cameraMatrix);
        //
        // recent = now;
    }


    function tick() {
        requestAnimationFrame(tick);
        animate();
        loader.drawScene(drawSceneCallback);
    }

    // addKeydownListener(BUTTONS.W, () => rotationSpeedX += rotationInitSpeed);
    // addKeydownListener(BUTTONS.S, () => rotationSpeedX -= rotationInitSpeed);
    // addKeydownListener(BUTTONS.E, () => rotationSpeedY += rotationInitSpeed);
    // addKeydownListener(BUTTONS.Q, () => rotationSpeedY -= rotationInitSpeed);
    // addKeydownListener(BUTTONS.D, () => rotationSpeedZ += rotationInitSpeed);
    // addKeydownListener(BUTTONS.A, () => rotationSpeedZ -= rotationInitSpeed);
    //
    // addKeydownListener(BUTTONS.H, () => translationSpeedX += translationInitSpeed);
    // addKeydownListener(BUTTONS.F, () => translationSpeedX -= translationInitSpeed);
    // addKeydownListener(BUTTONS.Y, () => translationSpeedY += translationInitSpeed);
    // addKeydownListener(BUTTONS.R, () => translationSpeedY -= translationInitSpeed);
    // addKeydownListener(BUTTONS.T, () => translationSpeedZ += translationInitSpeed);
    // addKeydownListener(BUTTONS.G, () => translationSpeedZ -= translationInitSpeed);
    //
    // addKeydownListener(BUTTONS.left, () => cameraAlphaRotationSpeed -= rotationInitSpeed);
    // addKeydownListener(BUTTONS.right, () => cameraAlphaRotationSpeed += rotationInitSpeed);

    // addKeydownListener(BUTTONS.up, () => cameraBettaRotationSpeed += rotationInitSpeed);
    // addKeydownListener(BUTTONS.down, () => cameraBettaRotationSpeed -= rotationInitSpeed);

    // addWheelListener((event) => {
    //     const sign = (event.deltaY > 0) ? 1 : -1;
    //     radiusChangeSpeed += sign*translationInitSpeed;
    // });
    tick();
}

resize();

