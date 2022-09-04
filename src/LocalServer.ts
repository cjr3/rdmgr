

// const RemoveMediaPath = (src?:string|null) => {
//     if(typeof(src) !== 'string' || src === '')
//         return '';
//     if(src.indexOf('http://') === 0 || src.indexOf('https://') === 0)
//         return src;
//     if(typeof(src) === "string" && src.indexOf(Folders.Media) >= 0)
//         return src.replace(Folders.Media, '');
//     return src;
// };

import { GetMediaPath } from "tools/data";

const setupServer = () => {
    try {
        const {remote} = window.require('electron');
        const min = 5000;
        let port:number = 0;
        let value = remote.getGlobal('portNumber')
        if(typeof(value) === 'number' && value > min)
            port = value;
            
        if(port > min) {
            const express = window.require('express');
            const { ExpressPeerServer } = window.require('peer');
            const app = express();
            const clients:any[] = [];
    
            //root
            app.get('/', (req:any, res:any, next:any) => {
                try {
                    return res.send('Hello, world!')
                } catch(er:any) {
                    if(er && er.message)
                        return res.send(er.message);
                }
            });

            //image
            app.get(/^\/api\/image\/(.*?)\.{1}(png|jpg|jpeg|gif){1}/i, (req:any, res:any) => {
                try {
                    return res.sendFile(GetMediaPath(req.params[0] + "." + req.params[1]));
                } catch(er:any) {

                }
            });
    
            //list of peers
            app.get('/peers', (req:any, res:any) => res.send(clients.map((c:any) => c.getId()).join(',')));
            
            //start server
            const server = app.listen(port);
            const peerServer = ExpressPeerServer(server, {
                path:'/'
            });
            
            peerServer.on('connection', (client:any) => {
                try {
                    const index = clients.findIndex(c => c.getId() === client.getId());
                    if(index < 0) {
                        clients.push(client);
                    }
                } catch(er:any) {

                }
            });
            
            peerServer.on('disconnect', (client:any) => {
                try {
                    const index = clients.findIndex(c => c.getId() === client.getId());
                    if(index >= 0) {
                        clients.splice(index, 1);
                    }
                } catch(er:any) {

                }
            });
            
            peerServer.on('error', (err:any) => {
                // console.error(err);
            });
            
            app.use('/peerjs', peerServer);
        }
    } catch(er) {
        // console.error(er);
    }
};

export {setupServer};