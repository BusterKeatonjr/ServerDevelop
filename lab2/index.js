const Candy = require('./sweets/Candy');
const Chocolate = require('./sweets/Chocolate');
const JellyBean = require('./sweets/JellyBean');
const Gift = require('./Gift');

const gift = new Gift();

const candy1 = new Candy('Карамель', 50, 30, 'апельсин');
const candy2 = new Candy('Шоколадная конфета', 70, 50, 'шоколад');
const chocolate = new Chocolate('Темный шоколад', 100, 40, 75);
const jellyBean = new JellyBean('Мармелад', 30, 20, 'красный');

gift.addSweet(candy1);
gift.addSweet(candy2);
gift.addSweet(chocolate);
gift.addSweet(jellyBean);

gift.showGiftInfo();

console.log("\nСортировка по содержанию сахара:");
gift.sortBySugarContent();
gift.showGiftInfo();

const minSugar = 20;
const maxSugar = 40;
console.log(`\nКонфеты с содержанием сахара от ${minSugar} до ${maxSugar} г:`);
const sweetsInRange = gift.findSweetsBySugarRange(minSugar, maxSugar);
sweetsInRange.forEach(sweet => console.log(sweet.getInfo()));