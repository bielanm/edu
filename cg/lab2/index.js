function run() {
    const canvas = document.getElementById('canvas'),
        loader = new GLoader(canvas),
        perspectiveMatrix = mat4.create(),
        normalMatrix = mat3.create(),
        camera = new Camera()
            .translate(0, 5, 0)
            .withNormal(new Vector(0, 1, 0))
            .withRotationPoint(new Point(0, 0, 0)),
        lighting = new Lighting()
            .withRotationPoint(new Point(0, 0, 0))
            // .withRotationRadius(7)
            .translate(5, 0, 0)
            .withAmbientColor(new Color(255, 0, 0))
            .withDirectionColor(new Color(0, 0, 255));

    //---------------
    const SCALE = 10;
    //---------------

    const figures = [
        new Tor('first', 3, 1, 5)
            .translate(7, 0, 0)
            .withTexture('img/space.jpg'),
        new Tor('second', 3, 1, 20)
            .translate(0, 0, -7)
            .withTexture('img/space.jpg'),
        new Tor('third', 3, 1, 100)
            .translate(-7, 0, 0)
            .withTexture('img/space.jpg')
    ];
    //figures.push(new Surface('sin(x)*cos(y)', (x, y) => Math.sin(x)*Math.cos(y), new Point(-5, 0, 0), new Point(5, 5, -10), 20).withTexture('img/grass.png').scale(1/SCALE, 1/SCALE, 1/SCALE).translate(0, -2.5, 0).rotate(Math.PI/2, 0, 0));
    figures.forEach((figure) => figure.scale(1/SCALE, 1/SCALE, 1/SCALE));

    loader.initVertexShader('vertex.lab#2');
    loader.initFragmentShader('fragment.lab#2');
    loader.initProgram();

    loader.initAttribute('vertexPosition');
    loader.initAttribute('vertexTexturePosition');
    loader.initAttribute('vertexNormal');

    figures.forEach((figure) => {
        loader.initBuffer(figure.id, figure.points);

        if(figure.isTexture) {
            const textureId = `${figure.id}Texture`;
            loader.initBuffer(textureId, figure.getTexturePoints());
            loader.initTexture(textureId, figure.texture);

            const normalId = `${figure.id}Normal`;
            loader.initBuffer(normalId, figure.getLightingNormal());
        }
    });

    loader.initUniform('modelUniform');
    loader.initUniform('perspectiveUniform');
    loader.initUniform('cameraUniform');
    loader.initUniform('ifTextureUniform');
    loader.initUniform('textureUniform');
    loader.initUniform('colorUniform');

    loader.initUniform('normalUniform');
    loader.initUniform('lightingDirection');
    loader.initUniform('useLighting');
    loader.initUniform('ambientColor');
    loader.initUniform('directionalColor');

    mat4.perspective(perspectiveMatrix, 45*Math.PI/180, loader.gl.viewportWidth / loader.gl.viewportHeight, 0.1, 100.0);
    function drawSceneCallback(ctx) {
        const { gl } = ctx;

        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        gl.clearColor(0, 0, 0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        figures.forEach((figure) => {

            gl.bindBuffer(gl.ARRAY_BUFFER, gl.buffers[figure.id]);
            gl.vertexAttribPointer(gl.attributes['vertexPosition'], figure.sizing, gl.FLOAT, false, 0, 0);
            if(figure.isTexture) {
                const textureId = `${figure.id}Texture`;
                gl.bindBuffer(gl.ARRAY_BUFFER, gl.buffers[textureId]);
                gl.vertexAttribPointer(gl.attributes['vertexTexturePosition'], 2, gl.FLOAT, false, 0, 0);

                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, gl.textures[textureId]);
            }

            const normalId = `${figure.id}Normal`;
            gl.bindBuffer(gl.ARRAY_BUFFER, gl.buffers[normalId]);
            gl.vertexAttribPointer(gl.attributes['vertexNormal'], 3, gl.FLOAT, false, 0, 0);

            const color = figure.color,
                modelMatrix = figure.getModel(),
                cameraMatrix = camera.getModel();

            mat3.fromMat4(normalMatrix, modelMatrix);
            mat3.invert(normalMatrix, normalMatrix);
            mat3.transpose(normalMatrix, normalMatrix);

            ctx.setUniform1i('textureUniform', 0);
            ctx.setUniformMatrix('cameraUniform', cameraMatrix);
            ctx.setUniformMatrix('perspectiveUniform', perspectiveMatrix);
            ctx.setUniformMatrix3('normalUniform', normalMatrix);
            ctx.setVec4Uniform('colorUniform', [color.r, color.g, color.b, color.t]);
            ctx.setUniformMatrix('modelUniform', modelMatrix);
            ctx.setFloatUniform('ifTextureUniform', figure.isTexture ? 1.0 : 0.0);

            ctx.setVec3Uniform('lightingDirection', lighting.getAdjusted());
            ctx.setUniform1i('useLighting', lighting.isOn());
            ctx.setVec3Uniform('ambientColor', lighting.getAmbientColor());
            ctx.setVec3Uniform('directionalColor', lighting.getDirectionalColor());

            gl.bindBuffer(gl.ARRAY_BUFFER, gl.buffers[figure.id]);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, figure.count);
        });
    }
    let recent = Date.now();
    function animate() {
        const now = Date.now(),
            T = (now - recent) / 1000;

        figures
            .map((figure) => figure.move(T))
            .map((figure) => figure.rotation(T));

        camera.move(T);
        lighting.move(T);

        recent = now;
    }

    const eventListener = new ButtonsListener();
    eventListener.addListener({
        id: 'Lighting',
        wheel: (event) => (event.deltaY > 0) ? lighting.increaseRotationSpeedR() : lighting.decreaseRotationSpeedR(),
        buttons: {
            [BUTTONS.W]: () => lighting.increaseRotationSpeedBetta(),
            [BUTTONS.S]: () => lighting.decreaseRotationSpeedBetta(),
            [BUTTONS.D]: () => lighting.increaseRotationSpeedAlpha(),
            [BUTTONS.A]: () => lighting.decreaseRotationSpeedAlpha()
        }
    });
    eventListener.addListener({
        id: 'Camera',
        wheel: (event) => (event.deltaY > 0) ? camera.increaseRotationSpeedR() : camera.decreaseRotationSpeedR(),
        buttons: {
            [BUTTONS.W]: () => camera.increaseRotationSpeedBetta(),
            [BUTTONS.S]: () => camera.decreaseRotationSpeedBetta(),
            [BUTTONS.D]: () => camera.increaseRotationSpeedAlpha(),
            [BUTTONS.A]: () => camera.decreaseRotationSpeedAlpha()
        }
    });
    figures.forEach((figure) => eventListener.addListener({
        id: figure.id,
        wheel: (event) => (event.deltaY > 0) ? figure.increaseRotationSpeedX() : figure.decreaseRotationSpeedX(),
        buttons: {
            [BUTTONS.up]: () => figure.increaseRotationSpeedY(),
            [BUTTONS.down]: () => figure.decreaseRotationSpeedY(),
            [BUTTONS.right]: () => figure.increaseRotationSpeedZ(),
            [BUTTONS.left]: () => figure.decreaseRotationSpeedZ()
        }
    }));

    eventListener.load();

    function tick() {
        requestAnimationFrame(tick);
        animate();
        loader.drawScene(drawSceneCallback);
    }
    tick();
}

resize();

