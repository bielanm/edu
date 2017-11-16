class ButtonsListener {

    constructor() {
        this.elements = [];
        this.target = null;
    }

    load() {

        const form = document.getElementById('buttons');
        while (form.firstChild) form.removeChild(form.firstChild);

        this.elements.forEach((element) => {
            const input = document.createElement('input');
            input.id = element.id;
            input.type = 'radio';
            input.name = 'buttons-listener';
            input.onclick = () => this.target = element;
            form.appendChild(input);

            const label = document.createElement('label');
            label.setAttribute('for', element.id);
            label.innerHTML = element.id;
            form.appendChild(label);
        });

        addWheelListener((event) => {
            const callback = this.target && this.target.wheel;

            if(callback)
                callback(event);
        });

        const buttons = [];
        this.elements.map(element => element.buttons).forEach((obj) => Array.prototype.push.apply(buttons, Object.keys(obj)));
        buttons.forEach((button) => document.addEventListener('keydown', (event) => {
            event.preventDefault();
            if(event.key != button) return;

            const callback = this.target && this.target.buttons[button];
            if(!callback) return;
            callback(event);
        }));
    }

    addListener(target) {
        this.elements.push(target);
    }


}