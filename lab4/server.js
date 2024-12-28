const dgram = require('dgram');
const fs = require('fs');
const server = dgram.createSocket('udp4');

const PORT = 1502;
const INTERMEDIATE_PORT = 2333;

// Чтение сообщения из файла
function getMessage() {
    try {
        return fs.readFileSync('message.txt', 'utf8');
    } catch (err) {
        return 'Текущая температура: 20°C';
    }
}

// Отправка сообщений каждые 10 секунд
setInterval(() => {
    const message = getMessage();
    server.send(message, INTERMEDIATE_PORT, 'localhost', (err) => {
        if (err) {
            console.error('Ошибка при отправке:', err);
        } else {
            console.log('Сообщение отправлено промежуточному клиенту');
        }
    });
}, 10000);

server.bind(PORT); 