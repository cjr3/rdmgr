import OBSWS from 'obs-websocket-js';

/**
 * OBS Controller
 */
class Controller extends OBSWS {

    Connected:boolean = false;

    constructor() {
        super();
        this.on('error', this.onError);
        this.on('ConnectionOpened', this.onConnected);
        this.on('ConnectionClosed', this.onDisconnected);
    }

    protected onConnected = () => {
        this.Connected = true;
    }

    protected onDisconnected = () => {
        this.Connected = false;
    }

    protected onError = (err:any) => {
        console.log('socket error:', err);
    }

    /**
     * Initialize OBS Connection and Settings
     * @returns 
     */
    Init = () : Promise<boolean> => {
        return new Promise((res, rej) => {
            //GetAuthRequired does not work if actually required - the socket connection is refused!
            this.connect({
                address:'',
                password:''
            }).then(() => {
                return res(true);
            }).catch(er => rej(er));
        });
    }
}


const OBSController = new Controller();
export {OBSController};