class Customer {
    constructor(id, lastName, firstName, middleName, address, creditCardNumber, bankAccountNumber) {
        this.id = id;
        this.lastName = lastName;
        this.firstName = firstName;
        this.middleName = middleName;
        this.address = address;
        this.creditCardNumber = creditCardNumber;
        this.bankAccountNumber = bankAccountNumber;
    }

    // геттеры
    getId() {
        return this.id;
    }

    getLastName() {
        return this.lastName;
    }

    getFirstName() {
        return this.firstName;
    }

    getMiddleName() {
        return this.middleName;
    }

    getAddress() {
        return this.address;
    }

    getCreditCardNumber() {
        return this.creditCardNumber;
    }

    getBankAccountNumber() {
        return this.bankAccountNumber;
    }

    // сеттеры
    setId(id) {
        this.id = id;
    }

    setLastName(lastName) {
        this.lastName = lastName;
    }

    setFirstName(firstName) {
        this.firstName = firstName;
    }

    setMiddleName(middleName) {
        this.middleName = middleName;
    }

    setAddress(address) {
        this.address = address;
    }

    setCreditCardNumber(creditCardNumber) {
        this.creditCardNumber = creditCardNumber;
    }

    setBankAccountNumber(bankAccountNumber) {
        this.bankAccountNumber = bankAccountNumber;
    }

    toString() {
        return `Customer [id=${this.id}, ${this.lastName} ${this.firstName} ${this.middleName}, Адрес: ${this.address}, Номер кредитной карты: ${this.creditCardNumber}, Номер счёта: ${this.bankAccountNumber}]`;
    }

    hashCode() {
        return this.id;
    }
}

const customers = [
    new Customer(1, "Асанов", "Осман", "Эрпанович", "Евпатория", "1234567890123456", "111111"),
    new Customer(2, "Сейтумеров", "Эдем", "Рустемович", "Кировское", "9876543210987654", "222222"),
    new Customer(3, "Рудов", "Илья", "Сергеевич", "ГРЭС", "1111222233334444", "333333"),
    new Customer(4, "Минзатов", "Эмран", "Серверович", "Старый Крым", "5555666677778888", "444444"),
    new Customer(5, "Бекиров", "Дилявер", "Энверович", "Симферополь", "4444555566667777", "555555")
];

console.log("Список покупателей в алфавитном порядке:");
customers.sort((a, b) => a.getLastName().localeCompare(b.getLastName())).forEach(customer => {
    console.log(customer.toString());
});

function getCustomersByCardRange(min, max) {
    return customers.filter(customer => customer.getCreditCardNumber() >= min && customer.getCreditCardNumber() <= max);
}

const minCardNumber = "4000000000000000";
const maxCardNumber = "6000000000000000";

console.log(`\nСписок покупателей с номерами кредитных карт в интервале от ${minCardNumber} до ${maxCardNumber}:`);
getCustomersByCardRange(minCardNumber, maxCardNumber).forEach(customer => {
    console.log(customer.toString());
});