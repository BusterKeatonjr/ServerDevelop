const path = require('path');
const fs = require('fs');

const LOG_LEVELS = {
    ERROR: 'error',
    WARN: 'warn',
    INFO: 'info',
    DEBUG: 'debug',
    TRACE: 'trace'
};

const getLogConfig = () => ({
    level: process.env.LOG_LEVEL || 'info',
    console: process.env.LOG_MODE === 'all' || process.env.LOG_MODE === 'console',
    file: process.env.LOG_MODE === 'all' || process.env.LOG_MODE === 'file',
    logDir: '../logs'
});

const shouldLog = (messageLevel, configLevel) => {
    const levels = Object.values(LOG_LEVELS);
    return levels.indexOf(messageLevel) <= levels.indexOf(configLevel);
};

const formatLog = (level, message) => {
    return `[${new Date().toISOString()}] ${level.toUpperCase()}: ${message}`;
};

const requestLogger = () => {
    let logConfig = getLogConfig();
    
    const log = (level, message) => {
        if (!shouldLog(level, logConfig.level)) return;
        const formattedMessage = formatLog(level, message);

        if (logConfig.console) {
            console.log(formattedMessage);
        }
        if (logConfig.file) {
            const logsDir = path.join(__dirname, logConfig.logDir);
            if (!fs.existsSync(logsDir)) {
                fs.mkdirSync(logsDir, { recursive: true });
            }
            const logFile = path.join(logsDir, `${new Date().toISOString().split('T')[0]}.log`);
            fs.appendFileSync(logFile, formattedMessage + '\n');
        }
    };

    // Добавляем методы для разных уровней логирования
    const logger = {
        error: (message) => log(LOG_LEVELS.ERROR, message),
        warn: (message) => log(LOG_LEVELS.WARN, message),
        info: (message) => log(LOG_LEVELS.INFO, message),
        debug: (message) => log(LOG_LEVELS.DEBUG, message),
        trace: (message) => log(LOG_LEVELS.TRACE, message),
        
        setLogLevel: (level) => {
            logConfig.level = level;
        },
        
        getLogLevel: () => logConfig.level,
        
        middleware: (req, res, next) => {
            const startTime = new Date();
            
            log(LOG_LEVELS.INFO, [
                '-------------------',
                'Входящий запрос:',
                `Метод: ${req.method}`,
                `URL: ${req.url}`,
                'Параметры запроса: ' + JSON.stringify(req.query),
                'Тело запроса: ' + JSON.stringify(req.body),
                '-------------------'
            ].join('\n'));
            
            const originalJson = res.json;
            res.json = function(body) {
                const endTime = new Date();
                const level = res.statusCode >= 500 ? LOG_LEVELS.ERROR :
                             res.statusCode >= 400 ? LOG_LEVELS.WARN :
                             LOG_LEVELS.INFO;

                log(level, [
                    '-------------------',
                    'Ответ:',
                    'Статус: ' + res.statusCode,
                    'Тело ответа: ' + JSON.stringify(body),
                    `Время выполнения: ${endTime - startTime}ms`,
                    '-------------------'
                ].join('\n'));
                
                return originalJson.call(this, body);
            };
            
            next();
        }
    };

    return logger;
};

module.exports = { requestLogger, LOG_LEVELS }; 