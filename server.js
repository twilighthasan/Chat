// Сохраните этот файл как server.js и запустите его с помощью Node.js

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="ru">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Чат в реальном времени</title>
            <style>
                #chat-container {
                    display: flex;
                    flex-direction: column;
                    height: 90vh;
                    max-width: 400px;
                    margin: auto;
                    border: 1px solid #ccc;
                    padding: 10px;
                }
                #chat-window {
                    flex-grow: 1;
                    overflow-y: auto;
                }
                #chat-input {
                    margin-top: 10px;
                }
            </style>
        </head>
        <body>
            <div id="chat-container">
                <div id="chat-window">
                    <ul id="chat-messages"></ul>
                </div>
                <input type="text" id="chat-input" placeholder="Напишите сообщение...">
                <button id="send-button">Отправить</button>
            </div>
            <script src="/socket.io/socket.io.js"></script>
            <script>
                const socket = io();

                document.getElementById('send-button').onclick = function() {
                    const input = document.getElementById('chat-input');
                    socket.emit('chat message', input.value);
                    input.value = '';
                };

                socket.on('chat message', function(msg) {
                    const item = document.createElement('li');
                    item.textContent = msg;
                    document.getElementById('chat-messages').appendChild(item);
                    window.scrollTo(0, document.body.scrollHeight);
                });
            </script>
        </body>
        </html>
    `);
});

io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
