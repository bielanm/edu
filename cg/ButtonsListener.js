class ButtonsListener {

    constructor() {
        this.elements = [];
        this.target = null;
    }

    load() {

        const form = document.getElementById('buttons');
        while (form.firstChild) form.removeChild(form.firstChild);

        this.elements.forEach((element) => {
            const div = document.createElement('div');

            const input = document.createElement('input');
            input.id = element.id;
            input.type = 'radio';
            input.name = 'buttons-listener';
            input.onclick = () => this.target = element;
            div.appendChild(input);

            const inputLabel = document.createElement('label');
            inputLabel.setAttribute('for', element.id);
            inputLabel.innerHTML = element.id;
            div.appendChild(inputLabel);

            if(element.color) {
                const { toggled, label } = element.color;

                let toggleInput = null;
                if(toggled) {
                    toggleInput = document.createElement('input');
                    toggleInput.id = `${element.id}Toggler`;
                    toggleInput.type = 'checkbox';
                    toggleInput.onchange = (event) => {
                        if(this.target != element) return;

                        const { onToggle } = this.target.color;

                        if(onToggle)
                            onToggle(event);
                    };
                    div.appendChild(toggleInput);

                    const toggleLabel = document.createElement('label');
                    toggleLabel.setAttribute('for', `${element.id}Toggler`);
                    toggleLabel.innerHTML = label;
                    div.appendChild(toggleLabel);
                }


                const colorInput = document.createElement('input');
                colorInput.id = `${element.id}Color`;
                colorInput.type = 'color';
                colorInput.value= '#ff0000';
                colorInput.onchange = (event) => {
                    if(this.target != element) return;

                    if(toggled)
                        toggleInput.checked = false;

                    const { onChange } = this.target.color;

                    if(onChange)
                        onChange(event);
                };
                div.appendChild(colorInput);
            }

            form.appendChild(div);
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