function run() {
    const canvas = document.getElementById('canvas'),
        loader = new GLoader(canvas),
        camera = new Camera().translate(5, 0, 0),
        perspectiveMatrix = mat4.create(),
        figures = [];

    //---------------
    const SCALE = 10;
    //---------------

    // const identity = mat4.create();
    // mat4.identity(identity);


    figures.push(new Tor('tor1', 6, 3, 10).translate(0, 0, 0).withTexture('img/thor1.png'));
    figures.push(new Tor('tor2', 7, 1, 20).translate(0, 0, 0).withTexture('img/thor2.png'));
    figures.push(new Tor('tor3', 7, 1, 50).translate(0, 0, 0).withTexture('img/thor2.png'));
    figures.push(new Cone('ne-tor', 5, 2, 25).translate(0, 3, 0).withTexture('img/captain.png'));
    figures.push(new Surface('sin(x)*cos(y)', (x, y) => Math.sin(x)*Math.cos(y), new Point(-5, 0, 0), new Point(5, 5, -10), 20).withTexture('img/grass.png').scale(1/SCALE, 1/SCALE, 1/SCALE).translate(0, -2.5, 0).rotate(Math.PI/2, 0, 0));
    figures.forEach((figure) => figure.scale(1/SCALE, 1/SCALE, 1/SCALE));

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

    mat4.perspective(perspectiveMatrix, 45*Math.PI/180, loader.gl.viewportWidth / loader.gl.viewportHeight, 0.1, 100.0);
    function drawSceneCallback(ctx) {
        const { gl, program } = ctx;

        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        gl.clearColor(.2, .2, .2, 1.0);
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

            const color = figure.color,
                modelMatrix = figure.getModel(),
                cameraMatrix = camera.getModel();
            ctx.setUniform1i('textureUniform', 0);
            ctx.setUniformMatrix('cameraUniform', cameraMatrix);
            ctx.setUniformMatrix('perspectiveUniform', perspectiveMatrix);
            ctx.setVec4Uniform('colorUniform', [color.r, color.g, color.b, color.t]);
            ctx.setUniformMatrix('modelUniform', modelMatrix);
            ctx.setFloatUniform('ifTextureUniform', figure.isTexture ? 1.0 : 0.0);

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

    }

    // const moveableListener = new TargetListener(canvas)
    //     .add(new Toggle('Camera', 'cameraImg'));
    // figures.forEach((figure) => moveableListener.add(figure.name, `${figure.name}Toogle`));
    // addKeydownListener(BUTTONS.W, () => moveableListener.apply((element) => element.increaseTranslationSpeedY()));
    // addKeydownListener(BUTTONS.S, () => moveableListener.apply((element) => element.decreaseTranslationSpeedY()));
    // addKeydownListener(BUTTONS.D, () => moveableListener.apply((element) => element.increaseTranslationSpeedX()));
    // addKeydownListener(BUTTONS.A, () => moveableListener.apply((element) => element.decreaseTranslationSpeedX()));
    // addWheelListener((event) => {
    //     const away = (event.deltaY > 0) ? true  : false;
    //     away
    //         ? moveableListener.apply((element) => element.increaseTranslationSpeedZ)
    //         : moveableListener.apply((element) => element.decreaseTranslationSpeedZ);
    // });    // const moveableListener = new TargetListener(canvas)
    //     .add(new Toggle('Camera', 'cameraImg'));
    // figures.forEach((figure) => moveableListener.add(figure.name, `${figure.name}Toogle`));
    // addKeydownListener(BUTTONS.W, () => moveableListener.apply((element) => element.increaseTranslationSpeedY()));
    // addKeydownListener(BUTTONS.S, () => moveableListener.apply((element) => element.decreaseTranslationSpeedY()));
    // addKeydownListener(BUTTONS.D, () => moveableListener.apply((element) => element.increaseTranslationSpeedX()));
    // addKeydownListener(BUTTONS.A, () => moveableListener.apply((element) => element.decreaseTranslationSpeedX()));
    // addWheelListener((event) => {
    //     const away = (event.deltaY > 0) ? true  : false;
    //     away
    //         ? moveableListener.apply((element) => element.increaseTranslationSpeedZ)
    //         : moveableListener.apply((element) => element.decreaseTranslationSpeedZ);
    // });

    function tick() {
        requestAnimationFrame(tick);
        animate();
        loader.drawScene(drawSceneCallback);
    }
    tick();
}

resize();

