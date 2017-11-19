function run() {
    const SCALE = 10,
        canvas = document.getElementById('canvas'),
        loader = new GLoader(canvas),
        perspectiveMatrix = mat4.create(),
        normalMatrix = mat3.create(),
        camera = new Camera()
            .withRotationRadius(5)
            .withAlpha(0)
            .translate(new Point(5, 0, 0))
            .withNormal(new Vector(0, 1, 0))
            .withRotationPoint(new Point(0, 0, 0)),
        lighting = new SphereLighting(1)
            .withRotationRadius(13)
            .withBetta(Math.PI/4)
            .withAlpha(Math.PI/4 - Math.PI/10)
            .translate(new Point(12, 5, 0))
            .withRotationPoint(new Point(0, 0, 0))
            .withAmbientColor(new Color(255, 255, 255))
            .withDirectionColor(new Color(255, 255, 255))
            .withColor(new Color(255/10, 255/10, 255/10));


    const figures = [
        new Tor('tor1', 3, 1, 5)
            .withColor(new Color(123, 109, 111))
            .translate(7, 0, 0)
            .withTexture('img/space.jpg'),
        new Tor('tor2', 3, 1, 20)
            .translate(0, 0, -7)
            .withTexture('img/space.jpg'),
        new Tor('tor3', 3, 1, 100)
            .translate(-7, 0, 0)
            .withColor(new Color(0, 50, 20)),
        new Cone('cone1', 3, 4, 10)
            .translate(5, 2, 2)
            .withColor(new Color(200, 120, 50)),
        new Cone('cone2', 5, 2, 25)
            .translate(-5, 1, 2)
            .withColor(new Color(200, 120, 50)),
        lighting,
        new Surface('Math.sin(x)*Math.cos(x)', (x, y) => 10+10*Math.sin(x)*Math.cos(x), new Point(-SCALE, -SCALE, -SCALE), new Point(SCALE, SCALE, SCALE), 100)
            .withColor(new Color(64, 64, 64))
    ];
    figures.forEach((figure) => figure.scale(1/SCALE, 1/SCALE, 1/SCALE));

    loader.initVertexShader('vertex.lab#2');
    loader.initFragmentShader('fragment.lab#2');
    loader.initProgram();

    loader.initAttribute('vertexPosition');
    loader.initAttribute('vertexTexturePosition');
    loader.initAttribute('vertexNormal');


    function initTextureBuffer(figure) {
        const textureId = `${figure.id}Texture`;
        loader.initTexture(textureId, figure.getTextureURL());
    }

    figures.forEach((figure) => {
        loader.initBuffer(figure.id, figure.points);

        const normalId = `${figure.id}Normal`;
        loader.initBuffer(normalId, figure.getLightingNormal());

        const textureId = `${figure.id}Texture`;
        loader.initBuffer(textureId, figure.getTexturePoints());
        initTextureBuffer(figure);
    });

    loader.initUniform('modelUniform');
    loader.initUniform('perspectiveUniform');
    loader.initUniform('cameraUniform');
    loader.initUniform('textureUniform');

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

            const textureId = `${figure.id}Texture`;
            gl.bindBuffer(gl.ARRAY_BUFFER, gl.buffers[textureId]);
            gl.vertexAttribPointer(gl.attributes['vertexTexturePosition'], 2, gl.FLOAT, false, 0, 0);
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, gl.textures[textureId]);

            const normalId = `${figure.id}Normal`;
            gl.bindBuffer(gl.ARRAY_BUFFER, gl.buffers[normalId]);
            gl.vertexAttribPointer(gl.attributes['vertexNormal'], 3, gl.FLOAT, false, 0, 0);

            const modelMatrix = figure.getModel(),
                cameraMatrix = camera.getModel();

            mat3.fromMat4(normalMatrix, modelMatrix);
            mat3.invert(normalMatrix, normalMatrix);
            mat3.transpose(normalMatrix, normalMatrix);

            ctx.setUniform1i('textureUniform', 0);
            ctx.setUniformMatrix('cameraUniform', cameraMatrix);
            ctx.setUniformMatrix('perspectiveUniform', perspectiveMatrix);
            ctx.setUniformMatrix3('normalUniform', normalMatrix);
            ctx.setUniformMatrix('modelUniform', modelMatrix);

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
        //lighting.move(T);

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
            [BUTTONS.A]: () => lighting.decreaseRotationSpeedAlpha(),
            [BUTTONS.shift]: () => lighting.toogle()
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
        },
        color: {
            label: 'Disable texture',
            toggled: true,
            onToggle: () => {
                figure.toggleTexture();
                initTextureBuffer(figure);
            },
            onChange: ({ r, g, b }) => {
                figure.withColor(new Color(r, g, b));
                initTextureBuffer(figure);
            },
            initToggle: !figure.isTexture,
            initColor: figure.getColor().getOrigin()
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

