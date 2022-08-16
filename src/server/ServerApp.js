const express = require('express');
const { ExpressPeerServer } = require('peer');
const app = express();
const clients = [];
app.get('/', (req, res, next) => res.send('Hello, world!'));
app.get('/peers', (req, res) => res.send(clients.map(c => c.getId()).join(',')));
let port = (window && window.portNumber && typeof(window.portNumber) === 'number') ? window.portNumber : 9000;


const server = app.listen(port);
const peerServer = ExpressPeerServer(server, {
    path:'/'
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

peerServer.on('error', (err) => {
    console.error(err);
});

app.use('/peerjs', peerServer);