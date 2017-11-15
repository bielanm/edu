class ButtonsListener {

    constructor() {
        this.elements = [];
        this.target = null;
    }

    load() {

        const form = document.getElementById('buttons');
        Object.keys(this.elements)
            .forEach((element) => {
                const input = document.createElement('input');
                input.type = 'radio';
                input.onclick = () => this.target = element;
                form.appendChild(input);
            });

        addWheelListener((event) => {
            const callback = this.target && this.target.wheel;

            if(callback)
                callback(event);
        });

        const buttons = [];
        this.elements.map(element => element.buttons).forEach((obj) => Array.prototype.push(buttons, Object.keys(obj)));
        buttons.forEach((button) => addKeydownListener(button, (event) => {
            const callback = this.target && this.target[button];

            if(callback)
                callback(event);
        }));

    }

    addListener(target) {
        this.elements.push(target);
    }


}