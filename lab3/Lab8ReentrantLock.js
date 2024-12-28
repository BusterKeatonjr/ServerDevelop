class ReentrantLock {
    constructor() {
        this.locked = false;
        this.waitingQueue = [];
        this.owner = null;
        this.holdCount = 0;
    }

    async lock() {
        const currentThread = this;
        
        if (this.owner === currentThread) {
            this.holdCount++;
            return;
        }

        while (this.locked) {
            await new Promise(resolve => this.waitingQueue.push(resolve));
        }
        
        this.locked = true;
        this.owner = currentThread;
        this.holdCount = 1;
    }

    unlock() {
        if (this.owner !== this) {
            return;
        }

        this.holdCount--;
        
        if (this.holdCount === 0) {
            this.locked = false;
            this.owner = null;
            const nextResolver = this.waitingQueue.shift();
            if (nextResolver) {
                nextResolver();
            }
        }
    }
}

class Counter {
    constructor() {
        this.count = 0;
        this.lock = new ReentrantLock();
    }

    async increment() {
        await this.lock.lock();
        try {
            this.count++;
        } finally {
            this.lock.unlock();
        }
    }

    async decrement() {
        await this.lock.lock();
        try {
            this.count--;
        } finally {
            this.lock.unlock();
        }
    }

    async getCount() {
        await this.lock.lock();
        try {
            return this.count;
        } finally {
            this.lock.unlock();
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
