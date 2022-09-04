const {remote} = require('electron');
console.log(remote.getGlobal('portNumber'));
// window.portNumber = remote.getGlobal('portNumber');
// ipcRenderer.on('port-number', (ev) => {
//     // window.portNumber = ev.portNumber;
// });