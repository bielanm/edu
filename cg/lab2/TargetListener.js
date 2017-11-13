
class TargetListener {

    constructor(DOMelement) {
        this.containeer = [];
        this.DOMelement = DOMelement;

        this.init();
    }

    init() {
        const toggleds = this.containeer.reduce((acc, togled) => {
            acc += `<div>${toggled.name}<div>`;
            return acc;
        }, '');
        const toggleContaineer = document.createElement('div');
        this.DOMelement.parentNode.insertBefore(toggleContaineer, this.DOMelement.nextSibling);
    }

    add(toogled) {
        this.containeer.push(toogled);
        return this;
    }

    remove(toogled) {
        const index = this.containeer.indexOf(toogled);
        if (index < 0) return;
        this.containeer.splice(index, 1);
        return this;
    }

    apply(callback) {
        this.containeer.forEach(callback);
    }

}

class Toggle {

    constructor(name, img) {
        this.name = name;
    }

}