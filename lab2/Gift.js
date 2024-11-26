class Gift {
    constructor() {
        this.sweets = [];
    }

    addSweet(sweet) {
        this.sweets.push(sweet);
    }

    getTotalWeight() {
        return this.sweets.reduce((total, sweet) => total + sweet.weight, 0);
    }

    sortBySugarContent() {
        this.sweets.sort((a, b) => a.sugarContent - b.sugarContent);
    }

    findSweetsBySugarRange(minSugar, maxSugar) {
        return this.sweets.filter(sweet => sweet.sugarContent >= minSugar && sweet.sugarContent <= maxSugar);
    }

    showGiftInfo() {
        console.log("Подарок содержит:");
        this.sweets.forEach(sweet => {
            console.log(sweet.getInfo());
        });
        console.log(`Общий вес подарка: ${this.getTotalWeight()} г`);
    }
}

module.exports = Gift;