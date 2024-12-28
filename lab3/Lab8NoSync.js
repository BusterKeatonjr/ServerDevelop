// Создаем класс для управления счетчиком
class Counter {
    constructor() {
        this.count = 0;
    }

    increment() {
        this.count++;
    }

    decrement() {
        this.count--;
    }

    getCount() {
        return this.count;
    }
}

// Функция для измерения времени выполнения
function measureExecutionTime(callback) {
    const start = performance.now();
    callback();
    const end = performance.now();
    return end - start;
}

// Основная функция
function runThreads(n, m) {
    const counter = new Counter();
    const iterations = 100000;
    
    // Создаем массивы промисов для обоих типов потоков
    const incrementThreads = Array(n).fill().map(() => {
        return new Promise(resolve => {
            let localSum = 0;
            for (let i = 0; i < iterations; i++) {
                localSum = counter.getCount();
                counter.increment();
            }
            resolve();
        });
    });

    const decrementThreads = Array(m).fill().map(() => {
        return new Promise(resolve => {
            let localSum = 0;
            for (let i = 0; i < iterations; i++) {
                localSum = counter.getCount();
                counter.decrement();
            }
            resolve();
        });
    });

    // Запускаем все потоки и измеряем время выполнения
    const executionTime = measureExecutionTime(async () => {
        await Promise.all([...incrementThreads, ...decrementThreads]);
    });

    console.log(`Финальное значение счетчика: ${counter.getCount()}`);
    console.log(`Время выполнения: ${executionTime.toFixed(2)} мс`);
}

// Запускаем программу с разными параметрами
console.log('Тест 1: n=2, m=2');
runThreads(2, 2);

console.log('\nТест 2: n=4, m=4');
runThreads(4, 4);

console.log('\nТест 3: n=8, m=8');
runThreads(8, 8); 