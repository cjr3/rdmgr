import {CreateController, BaseReducer} from './functions.controllers';
import { IController, Files } from './vars';

interface ICameraController extends IController {
    
}

export interface SCameraController {
    /**
     * Currently selected local camera device ID to send to the capture window.
     */
    DeviceID:string;
    /**
     * Available, connected video input devices
     */
    Cameras:Array<MediaDeviceInfo>;
    /**
     * ID of the peer to load the stream of
     */
    PeerID:string;
}

export enum Actions {
    SET_DEVICE_ID = 'SET_DEVICE_ID',
    SET_CAMERAS = 'SET_CAMERAS'
}

export const InitState:SCameraController = {
    DeviceID:'',
    Cameras:new Array<MediaDeviceInfo>(),
    PeerID:''
};

const SetDeviceID = (state:SCameraController, deviceId:any) => {
    return {...state, DeviceID:deviceId};
};

const SetCameras = (state:SCameraController, records:Array<MediaDeviceInfo>) => {
    return {...state, Cameras:records}
};

const CameraReducer = (state:SCameraController = InitState, action) => {
    try {
        switch(action.type) {
            case Actions.SET_DEVICE_ID :
                return SetDeviceID(state, action.deviceId);
            case Actions.SET_CAMERAS :
                return SetCameras(state, action.records);
            default :
                return BaseReducer(state, action);
        }
    } catch(er) {
        return state;
    }
};

const CameraController:ICameraController = CreateController('CAM', CameraReducer);

/**
 * Get the selected device ID
 */
CameraController.Get = () => {
    return CameraController.GetState().DeviceID;
};

/**
 * Set the selected camera device ID
 */
CameraController.Set = async (deviceId:string) : Promise<boolean> => {
    return new Promise((res, rej) => {
        if(deviceId === '') {
            CameraController.GetStore().dispatch({
                type:Actions.SET_DEVICE_ID,
                deviceId:deviceId
            });
            res(true);
        } else {
            let devices:Array<MediaDeviceInfo> = CameraController.GetState().Cameras;
            let device:MediaDeviceInfo|undefined = devices.find(d => d.deviceId == deviceId);
            if(device) {
                CameraController.GetStore().dispatch({
                    type:Actions.SET_DEVICE_ID,
                    deviceId:deviceId
                });
                res(true);
            } else {
                rej(`Device ${deviceId} could not be found. Did you forget to connect something?`);
            }
        }
    });
};

//we don't save the state of the camera controller
//because users can add/remove devices
CameraController.Save = async () : Promise<boolean> => {
    return new Promise((res) => res(true));
};

/**
 * Load connected videoinput devices
 */
CameraController.Load = async () : Promise<Array<MediaDeviceInfo>> => {
    return new Promise((res, rej) => {
        try {
            navigator.mediaDevices.enumerateDevices().then((devices:Array<MediaDeviceInfo>) => {
                let cameras:Array<MediaDeviceInfo> = [];
                if(devices && devices.length) {
                    for(var key in devices) {
                        if(devices[key].kind !== "videoinput")
                            continue;

                        //ignore the elgato helper device
                        if(devices[key].label.search('Elgato Helper') >= 0)
                            continue;

                        cameras.push(devices[key]);
                    }
                }

                CameraController.GetStore().dispatch({
                    type:Actions.SET_CAMERAS,
                    records:cameras
                });
                res(cameras);
            }).catch((er) => {
                rej(er)
            });
        } catch(er) {
            rej(er)
        }
    });
};

export default CameraController;