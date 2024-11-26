const Sweet = require('./Sweet');

class Candy extends Sweet {
    constructor(name, weight, sugarContent, flavor) {
        super(name, weight, sugarContent);
        this.flavor = flavor;
    }

    getInfo() {
        return `${this.name} (вкус: ${this.flavor}): вес ${this.weight} г, сахар ${this.sugarContent} г`;
    }
}

module.exports = Candy;