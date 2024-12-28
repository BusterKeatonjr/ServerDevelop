function runSyncCounterTest(n, m) {
    const startTime = performance.now(); // Начало измерения
    let counter = 0;
    const ITERATIONS = 100000;
    const lock = new Mutex();
    
    const incrementThreads = Array(n).fill().map(() => {
        return new Promise(async (resolve) => {
            for (let i = 0; i < ITERATIONS; i++) {
                await lock.acquire();
                try {
                    let localSum = counter;
                    counter++;
                } finally {
                    lock.release();
                }
            }
            resolve();
        });
    });

    const decrementThreads = Array(m).fill().map(() => {
        return new Promise(async (resolve) => {
            for (let i = 0; i < ITERATIONS; i++) {
                await lock.acquire();
                try {
                    let localSum = counter;
                    counter--;
                } finally {
                    lock.release();
                }
            }
            resolve();
        });
    });

    Promise.all([...incrementThreads, ...decrementThreads])
        .then(() => {
            const endTime = performance.now(); // Конец измерения
            const executionTime = endTime - startTime;
            console.log(`Финальное значение счетчика: ${counter}`);
            console.log(`Время выполнения: ${executionTime.toFixed(2)} мс`);
        });
}

// Простая реализация мьютекса
class Mutex {
    constructor() {
        this.locked = false;
        this.waitingQueue = [];
    }

    async acquire() {
        while (this.locked) {
            await new Promise(resolve => this.waitingQueue.push(resolve));
        }
        this.locked = true;
    }

    release() {
        this.locked = false;
        const nextResolver = this.waitingQueue.shift();
        if (nextResolver) {
            nextResolver();
        }
    }
}

class Counter {
    constructor() {
        this.count = 0;
        this.mutex = new Mutex();
    }

    async increment() {
        await this.mutex.acquire();
        try {
            this.count++;
        } finally {
            this.mutex.release();
        }
    }

    async decrement() {
        await this.mutex.acquire();
        try {
            this.count--;
        } finally {
            this.mutex.release();
        }
    }

    async getCount() {
        await this.mutex.acquire();
        try {
            return this.count;
        } finally {
            this.mutex.release();
        }
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
async function runThreads(n, m) {
    const counter = new Counter();
    const iterations = 100000;
    
    // Создаем массивы промисов для обоих типов потоков
    const incrementThreads = Array(n).fill().map(() => {
        return new Promise(async resolve => {
            let localSum = 0;
            for (let i = 0; i < iterations; i++) {
                localSum = await counter.getCount();
                await counter.increment();
            }
            resolve();
        });
    });

    const decrementThreads = Array(m).fill().map(() => {
        return new Promise(async resolve => {
            let localSum = 0;
            for (let i = 0; i < iterations; i++) {
                localSum = await counter.getCount();
                await counter.decrement();
            }
            resolve();
        });
    });

    // Запускаем все потоки и измеряем время выполнения
    const executionTime = await measureExecutionTime(async () => {
        await Promise.all([...incrementThreads, ...decrementThreads]);
    });

    console.log(`Финальное значение счетчика: ${await counter.getCount()}`);
    console.log(`Время выполнения: ${executionTime.toFixed(2)} мс`);
}

// Запускаем программу с разными параметрами
(async () => {
    console.log('Тест 1: n=2, m=2');
    await runThreads(2, 2);

    console.log('\nТест 2: n=4, m=4');
    await runThreads(4, 4);

    console.log('\nТест 3: n=8, m=8');
    await runThreads(8, 8);
})(); 