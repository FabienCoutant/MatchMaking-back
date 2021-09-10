const WebSocket = require('ws');
const url = 'ws://127.0.0.1:8999'; // SERVER ADDRESS

let i = 1;

function enter_mm() {
    const connection = new WebSocket(url);
    const player = {
        id: Math.floor(Math.random() * 1000),
        rankedLevel: Math.floor(Math.random() * 100),
        name: `Alice ${i}`,
        spaceShip: ["Jumper", "Prospector", "Space Digger"]
    };
    i++;
    connection.onopen = () => {
        connection.send(JSON.stringify(player));
    };

    connection.onerror = error => {
        console.log(error);
    };

    connection.onmessage = e => {
        console.log(e.data);
    };

    connection.onclose = () => {
        console.log('connection closed by host.');
    };
}

setInterval(() => enter_mm(), 500);
