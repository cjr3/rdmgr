const express = require('express');
const { ExpressPeerServer } = require('peer');
const app = express();
app.get('/', (req, res, next) => res.send('Hello, world!'));
let port = (window && window.portNumber && typeof(window.portNumber) === 'number') ? window.portNumber : 9000;

const clients = [];

const server = app.listen(port);
const peerServer = ExpressPeerServer(server, {
    path:'/rdmgr'
});

peerServer.on('connection', (client) => {
    console.log('Connection: ' + client.getId());
    const index = clients.findIndex(c => c.getId() === client.getId());
    if(index < 0) {
        clients.push(client);
    }
    console.log(clients.length + ' clients connected');
});

peerServer.on('disconnect', (client) => {
    console.log('Disconnect: ' + client.getId());
    const index = clients.findIndex(c => c.getId() === client.getId());
    if(index >= 0) {
        clients.pop(index, 1);
    }
    console.log(clients.length + ' clients connected');
});

app.use('/peerjs', peerServer);