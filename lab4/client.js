const net = require('net');
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    win.loadFile('index.html');
    
    const client = new net.Socket();
    
    client.connect(3000, 'localhost', () => {
        console.log('Подключено к промежуточному серверу');
    });

    client.on('data', (data) => {
        const messages = JSON.parse(data);
        win.webContents.send('update-messages', messages);
    });
}

app.whenReady().then(createWindow); 