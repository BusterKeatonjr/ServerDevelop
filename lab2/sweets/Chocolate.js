const Sweet = require('./Sweet');

class Chocolate extends Sweet {
    constructor(name, weight, sugarContent, cocoaPercentage) {
        super(name, weight, sugarContent);
        this.cocoaPercentage = cocoaPercentage;
    }

    getInfo() {
        return `${this.name} (какао: ${this.cocoaPercentage}%): вес ${this.weight} г, сахар ${this.sugarContent} г`;
    }
}

module.exports = Chocolate;