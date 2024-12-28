const dgram = require('dgram');
const intermediate = dgram.createSocket('udp4');
const TCP_PORT = 3000;
const UDP_PORT = 2333;

const net = require('net');
const messages = [];

// UDP сервер для получения сообщений от основного сервера
intermediate.on('message', (msg, rinfo) => {
    messages.push(msg.toString());
    if (messages.length > 5) {
        messages.shift();
    }
    console.log('Получено сообщение:', msg.toString());
});

// TCP сервер для конечных клиентов
const tcpServer = net.createServer((socket) => {
    console.log('Клиент подключился');
    
    socket.write(JSON.stringify(messages));
    
    socket.on('error', (err) => {
        console.error('Ошибка соединения:', err);
    });
});

intermediate.bind(UDP_PORT);
tcpServer.listen(TCP_PORT, () => {
    console.log('TCP сервер запущен на порту', TCP_PORT);
}); 