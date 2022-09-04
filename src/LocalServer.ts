
const setupServer = () => {
    const {remote} = window.require('electron');
    // console.log(exp);
    const express = window.require('express');
    // console.log(express)
    const { ExpressPeerServer } = window.require('peer');
    const app = express();
    const clients:any[] = [];
    app.get('/', (req:any, res:any, next:any) => res.send('Hello, world!'));
    app.get('/peers', (req:any, res:any) => res.send(clients.map((c:any) => c.getId()).join(',')));
    let port:number = 9000;
    console.log(remote.getGlobal('portNumber'));
    try {
        // window.portNumber = remote.getGlobal('portNumber');
        let value = remote.getGlobal('portNumber')
        if(typeof(value) === 'number' && value > 5000)
            port = value;
    } catch(er) {
        console.error(er);
    }
    // let port = (window && window.portNumber && typeof(window.portNumber) === 'number') ? window.portNumber : 9000;
    
    const server = app.listen(port);
    const peerServer = ExpressPeerServer(server, {
        path:'/'
    });
    
    peerServer.on('connection', (client:any) => {
        // console.log('Connection: ' + client.getId());
        // console.log(client);
        const index = clients.findIndex(c => c.getId() === client.getId());
        if(index < 0) {
            clients.push(client);
        }
        // console.log(clients.length + ' clients connected');
    });
    
    peerServer.on('disconnect', (client:any) => {
        // console.log('Disconnect: ' + client.getId());
        const index = clients.findIndex(c => c.getId() === client.getId());
        if(index >= 0) {
            clients.splice(index, 1);
        }
        // console.log(clients.length + ' clients connected');
    });
    
    peerServer.on('error', (err:any) => {
        // console.error(err);
    });
    
    setInterval(() => {
        console.log(clients.map(c => c.id).join(','));
    }, 5000);
    
    app.use('/peerjs', peerServer);
};

export {setupServer};