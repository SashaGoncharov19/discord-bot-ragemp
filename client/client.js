const fs = require('fs');
const path = './config.json';
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

try {if (fs.existsSync(path)) {}} catch (err) {console.error(err);}

const io = require('socket.io-client');
const socket = io.connect('http://localhost:1919', { reconnect: true});

const {ip, port, platform, time, token} = require('./config.json');

socket.on('connect', () => {
   console.log(`[LOG] Спасибо за покупку месячной подписки! Устанавливаю соединение с сервером..`);
   socket.emit('requestServerData', ip, port, platform);
    console.log('[LOG] Соединение установлено.')
   setInterval(() => {
       socket.emit('requestServerData', ip, port, platform);
       console.log('[LOG] Запрашиваю информацию для ' + ip + ':' + port + ' ...');
   }, time * 1000 * 60);
});

let serverData;

let ServerClose = 'Сервер выключен.';
let noPlayer = `На сервере пусто(`;
let fullPlayer = `На сервере нету мест(`
let online;

socket.on('receiveServerData', (serverDataS) => {
    let data = new Date();
    let h = data.getHours();
    let m = data.getMinutes();
    let s = data.getSeconds();

    serverData = null;
    serverData = serverDataS;
    console.log(serverData);
    console.log(`[LOG] [${h}:${m}:${s}] Информация получена, значения оновлены.`);
})

function start() {
    console.log('[LOG] Информация изменена.');
    if (serverData == undefined) {
        console.log('[LOG] Сервер выключен.');
        client.user.setActivity(ServerClose, {
            type: 'PLAYING'
        });
        client.user.setStatus('dnd');
    } else {
        online = `${serverData.players} из ${serverData.maxplayers} игроков!`;

        if (serverData.players == 0) {
            client.user.setActivity(noPlayer, {
                type: 'PLAYING'
            });
            client.user.setStatus('idle');
        } else if (serverData.players <= serverData.maxplayers - 1) {
            client.user.setActivity(online, {
                type: 'PLAYING'
            });
            client.user.setStatus('online');
        } else if ( serverData.players == serverData.maxplayers) {
            client.user.setActivity(fullPlayer, {
                type: 'PLAYING'
            });
            client.user.setStatus('dnd');
        }
    }
}

client.on('ready',  () => {
   console.log('[LOG] Discord бот запущен.');
   start();
   setInterval(start, time * 1000 * 60)
});

client.login(token);