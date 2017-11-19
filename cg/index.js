Array.prototype.pushReduce = function (callback) {
    return this.reduce((acc, element) => {
        Array.prototype.push.apply(acc, callback(element));
        return acc;
    }, [])
};
const BUTTONS = {
    rightPlus: 43,
    rightMinus: 45,
    D: 'd',
    A: 'a',
    W: 'w',
    S: 's',
    E: 'e',
    Q: 'q',
    R: 'r',
    T: 't',
    Y: 'y',
    F: 'f',
    G: 'g',
    H: 'h',
    left: 'ArrowLeft',
    up: 'ArrowUp',
    right: 'ArrowRight',
    down: 'ArrowDown',
    shift: 'Shift'
};

function addKeydownListener(button, listener) {
    document.addEventListener('keydown', (event) => {
        event.preventDefault();
        if(event.key == button) listener(event);
    });
}

function addWheelListener(listener) {
    document.addEventListener('wheel', (event) => {
        event.preventDefault();
        listener(event);
    });
}

function resize() {
    const canvas = document.getElementById('canvas');
    canvas.style.width = canvas.width = window.innerWidth;
    canvas.style.height = canvas.height = window.innerHeight*0.9;
    run();
}

function rgbToHex (r, g, b) {
    r = (+r).toString(16);
    g = (+g).toString(16);
    b = (+b).toString(16);
    if (r.length == 1) r = '0' + r;
    if (g.length == 1) g = '0' + g;
    if (b.length == 1) b = '0' + b;
    return "#" + r + g + b;
}

function hexToRGB (hex) {
    const r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
}


window.addEventListener('resize', resize, false);