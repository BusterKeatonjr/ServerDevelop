const Sweet = require('./Sweet');

class JellyBean extends Sweet {
    constructor(name, weight, sugarContent, color) {
        super(name, weight, sugarContent);
        this.color = color;
    }

    getInfo() {
        return `${this.name} (цвет: ${this.color}): вес ${this.weight} г, сахар ${this.sugarContent} г`;
    }
}

module.exports = JellyBean;