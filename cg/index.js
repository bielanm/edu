function execute(callback) {
    callback();
}

function createShader(gl, id) {
    const shaderScript = document.getElementById(id);
    let shaderSrc = "",
        currentChild = shaderScript.firstChild;

    while(currentChild) {
        if (currentChild.nodeType == currentChild.TEXT_NODE)
            shaderSrc += currentChild.textContent;
        currentChild = currentChild.nextSibling;
    }

    const types = {
        'x-shader/x-fragment': gl.FRAGMENT_SHADER,
        'x-shader/x-vertex': gl.VERTEX_SHADER
    };

    const shaderType = types[shaderScript.type],
        shader = gl.createShader(shaderType);

    gl.shaderSource(shader, shaderSrc);
    gl.compileShader(shader);

    return gl.getShaderParameter(shader, gl.COMPILE_STATUS)
        ? shader
        : gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    return gl.getProgramParameter(program, gl.LINK_STATUS)
        ? program
        : gl.deleteProgram(program);
}