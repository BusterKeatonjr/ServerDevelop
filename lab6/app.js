require('dotenv').config();
const express = require('express');
const path = require('path');
const { requestLogger, LOG_LEVELS } = require('./middleware/requestLogger');

const app = express();

// Добавляем поддержку статических файлов
app.use(express.static(path.join(__dirname, 'public')));

// Обработка ошибок
process.on('uncaughtException', (err) => {
    console.error('Необработанная ошибка:', err);
});

app.use(express.json());

// Создаем экземпляр логгера
const logger = requestLogger();

// Подключаем логгер
app.use(logger.middleware);

// Маршрут для управления уровнем логирования
app.post('/logs/level', (req, res) => {
    const { level } = req.body;
    
    if (!level || !Object.values(LOG_LEVELS).includes(level.toLowerCase())) {
        return res.status(400).json({
            error: 'Неверный уровень логирования',
            availableLevels: Object.values(LOG_LEVELS)
        });
    }

    logger.setLogLevel(level.toLowerCase());
    res.json({ 
        message: `Уровень логирования изменен на ${level}`,
        currentLevel: level.toLowerCase()
    });
});

// Маршрут для получения текущего уровня логирования
app.get('/logs/level', (req, res) => {
    res.json({ 
        currentLevel: logger.getLogLevel(),
        availableLevels: Object.values(LOG_LEVELS)
    });
});

// Тестовый маршрут
app.get('/test', (req, res) => {
    try {
        res.json({ message: 'Тестовое сообщение' });
    } catch (err) {
        console.error('Ошибка в маршруте:', err);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
});

// Тестовые маршруты для разных уровней логирования
app.get('/test/debug', (req, res) => {
    logger.debug('Это debug сообщение');
    res.json({ level: 'debug' });
});

app.get('/test/info', (req, res) => {
    logger.info('Это info сообщение');
    res.json({ level: 'info' });
});

app.get('/test/warn', (req, res) => {
    logger.warn('Это warning сообщение');
    res.status(400).json({ warning: 'Тестовое предупреждение' });
});

app.get('/test/error', (req, res) => {
    logger.error('Это error сообщение');
    res.status(500).json({ error: 'Тестовая ошибка' });
});

// Запускаем сервер
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});

