
class TargetListener {

    constructor() {
        this.containeer = [];
    }

    add(element) {
        this.containeer.push(element);
    }

    remove(element) {
        const index = this.containeer.indexOf(element);
        if (index < 0) return;
        this.containeer.splice(index, 1);
    }

    apply(callback) {
        this.containeer.forEach(callback);
    }

}