let socket = null;

onmessage = function(req) {
    switch(req.data.type) {
        case 'init' :
            init(req.data.url);
        break;
        case 'send' :
            sendMessage(req);
        break;
    }
}

function init() {
    
}

function sendMessage(req) {
    if(!socket)
        return;
    var message = JSON.stringify(req.message);
    socket.send(message);
}

function receiveMessage(ev) {
    var data;
    try {
        data = JSON.parse(ev.data);
    } catch(er) {
        return;
    }
    postMessage({
        type:'message',
        data:ev.data
    });
}

function sendHeartbeat() {
    
}