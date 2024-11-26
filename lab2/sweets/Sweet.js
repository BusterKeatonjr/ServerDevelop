class Sweet {
    constructor(name, weight, sugarContent) {
        this.name = name;
        this.weight = weight;
        this.sugarContent = sugarContent;
    }

    getInfo() {
        return `${this.name}: вес ${this.weight} г, сахар ${this.sugarContent} г`;
    }
}

module.exports = Sweet;