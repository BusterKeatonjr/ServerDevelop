class Pot {
    constructor(capacity) {
        this.capacity = capacity;
        this.portions = 0;
        this.mutex = new Mutex();
        this.savagesQueue = []; // Очередь дикарей
    }

    async getPortion(savageId) {
        await this.mutex.acquire();
        try {
            if (this.portions > 0) {
                this.portions--;
                console.log(`Дикарь ${savageId} взял порцию. Осталось порций: ${this.portions}`);
                return true;
            }
            
            // Добавляем дикаря в очередь
            if (!this.savagesQueue.includes(savageId)) {
                this.savagesQueue.push(savageId);
                console.log(`Дикарь ${savageId} встал в очередь`);
            }
            return false;
        } finally {
            this.mutex.release();
        }
    }

    async fill() {
        await this.mutex.acquire();
        try {
            this.portions = this.capacity;
            console.log(`Повар наполнил котел. Порций: ${this.portions}`);
            
            // Обслуживаем дикарей в порядке очереди
            while (this.portions > 0 && this.savagesQueue.length > 0) {
                const nextSavage = this.savagesQueue.shift();
                this.portions--;
                console.log(`Дикарь ${nextSavage} получил порцию из очереди. Осталось порций: ${this.portions}`);
            }
        } finally {
            this.mutex.release();
        }
    }
}

class Mutex {
    constructor() {
        this.locked = false;
        this.waitingResolvers = [];
    }

    async acquire() {
        if (!this.locked) {
            this.locked = true;
            return;
        }
        await new Promise(resolve => this.waitingResolvers.push(resolve));
    }

    release() {
        if (this.waitingResolvers.length > 0) {
            const resolve = this.waitingResolvers.shift();
            resolve();
        } else {
            this.locked = false;
        }
    }
}

async function savage(id, pot) {
    while (true) {
        if (!await pot.getPortion(id)) {
            console.log(`Дикарь ${id} ждет, пока повар наполнит котел`);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Ждем повара
            continue;
        }
        console.log(`Дикарь ${id} ест`);
        await new Promise(resolve => setTimeout(resolve, Math.random() * 1000)); // Время на еду
    }
}

async function cook(pot) {
    while (true) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Время на готовку
        await pot.fill();
    }
}

// Запуск симуляции
async function runSimulation() {
    const POT_CAPACITY = 5; // Вместимость котла
    const SAVAGES_COUNT = 10; // Количество дикарей

    const pot = new Pot(POT_CAPACITY);
    
    // Запускаем повара
    cook(pot);
    
    // Запускаем дикарей
    for (let i = 0; i < SAVAGES_COUNT; i++) {
        savage(i, pot);
    }
}

runSimulation(); 