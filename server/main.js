const io = require('socket.io') (1919);

const fs = require('fs');
const axios = require('axios');
let rageData = [];
let altData = [];

setInterval(() => {
    var rage = JSON.parse(require('fs').readFileSync('./included/servRage.json', 'utf8'));
    var alt = JSON.parse(require('fs').readFileSync('./included/servAlt.json', 'utf8'));

    rageData = [];
    altData = [];

    console.clear();
    axios.get(`https://cdn.rage.mp/master/`).then(function (res) {
        let data = res.data;
        for (var i = 0; i < rage.length; i++){
            let info = data[rage[i].ip + ":" + rage[i].port];
            if (info != undefined) {
                let servData = {
                    "name": info.name,
                    "gamemode": info.gamemode,
                    "url": info.url,
                    "lang": info.lang,
                    "players": info.players,
                    "peak": info.peak,
                    "maxplayers": info.maxplayers,
                    "ip": rage[i].ip,
                    "port": rage[i].port
                };
                rageData.push(servData);
            } else {
                console.log(`[RAGE] ` + rage[i].host + ':' + rage[i].port + ` выключен или недоступен.`);
            }
        }
        console.log(`RAGE:MP JSON оновлён. Результат: ` + rageData.length);
    });

    axios.get(`https://api.altv.mp/servers/list`).then(function (res) {
        let data = res.data;
        for (var i = 0; i < alt.length; i++) {
            let info = data.find(server => server.host == alt[i].host && server.port == alt[i].port);
            if (info != undefined) {
                let servData = {
                    "name": info.name,
                    "gamemode": info.gameMode,
                    "url": info.website,
                    "lang": info.language,
                    "players": info.players,
                    "peak": null,
                    "maxplayers": info.maxPlayers,
                    "ip": info.host,
                    "port": info.port
                };
                altData.push(servData);
            } else {
                console.log(`[ALT] ` + alt[i].host + ':' + alt[i].port + ' выключен или недоступен.');
            }
        }
        console.log(`ALT:V JSON оновлён. Результат: ` + altData.length);;
    });

    let date = new Date();
    let h = date.getHours();
    let m = date.getMinutes();

    console.log(`[TIME] ${h}:${m}`);
}, 30000);

io.on('connection', socket => {
    console.log('Новое подключение установлено с ' + socket.id);
    socket.on('requestServerData', (ip, port, platform) => {
        if (platform == 'rage') {
            let serverData = rageData.find(server => server.ip == ip && server.port == port);
            socket.emit('receiveServerData', serverData);
        } else {
            let serverData = altData.find(server => server.ip == ip && server.port == port);
            socket.emit('receiveServerData', serverData);
        }
    })
});
