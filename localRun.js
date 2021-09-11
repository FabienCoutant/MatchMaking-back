const WebSocket = require('ws');
const faker = require("faker");
const { v4: uuidv4 } = require('uuid');
const url = 'ws://127.0.0.1:8999'; // SERVER ADDRESS

function runTest() {
    const connection = new WebSocket(url);
    const player = {
        id: uuidv4(),
        rankedLevel: Math.floor(Math.random() * 100),
        name: faker.name.firstName()
    };

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

setInterval(() => runTest(), 500);
