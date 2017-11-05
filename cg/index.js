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
    down: 'ArrowDown'
};

function addKeydownListener(button, listener) {
    document.addEventListener('keydown', (event) => {
        event.preventDefault();
        if(event.key == button) listener();
    })
}

function addWheelListener(listener) {
    document.addEventListener('wheel', (event) => {
        event.preventDefault();
        listener(event);
    })
}

function resize() {
    const canvas = document.getElementById('canvas');
    canvas.style.width = canvas.width = window.innerWidth;
    canvas.style.height = canvas.height = window.innerHeight;
    run();
}
window.addEventListener('resize', resize, false);