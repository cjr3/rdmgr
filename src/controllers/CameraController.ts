import {createStore} from 'redux';

export interface ICameraControllerState {
    /**
     * Currently selected local camera device ID to send to the capture window.
     */
    DeviceID:string,
    /**
     * Available, connected video input devices
     */
    Cameras:Array<MediaDeviceInfo>
}

const SET_STATE = 'SET_STATE';
const SET_CAMERA_ID = 'SET_CAMERA_ID';
const SET_CAMERAS = 'SET_CAMERAS';
const InitState:ICameraControllerState = {
    DeviceID:'',
    Cameras:new Array<MediaDeviceInfo>()
};

function CameraReducer(state = InitState, action) {
    switch(action.type) {
        case SET_STATE :
            return Object.assign({}, state, action.values);
        case SET_CAMERA_ID :
            return Object.assign({}, state, {
                DeviceID:action.deviceId
            });
        case SET_CAMERAS :
            return Object.assign({}, state, {
                Cameras:action.records
            });
        default :
            return state;
    }
}


const CameraStore = createStore(CameraReducer);

interface CameraControllerDefinition {
    /**
     * Key / code used to identify this controller dynamically
     * (such as sending state between peers and the capture window)
     */
    Key:string,
    /**
     * Sets the state of the controller
     */
    SetState:Function,
    /**
     * Sets the Device ID of the camera to display
     */
    SetDeviceID:Function,
    /**
     * Loads the available cameras on the user's device
     */
    LoadCameras:Function,
    /**
     * Gets the current state
     */
    getState:Function,
    /**
     * Gets the redux store
     */
    getStore:Function,
    /**
     * Subscribes to changes to the state
     */
    subscribe:Function
}

/**
 * Main controller for the local camera.
 */
const CameraController:CameraControllerDefinition = {
    Key:'CAM',
    /**
     * Updates the state with the given values.
     * @param {Object} state 
     */
    SetState(state:object) {
        CameraController.getStore().dispatch({
            type:SET_STATE,
            values:state
        });
    },

    /**
     * Sets the device ID.
     * @param {String} deviceId 
     */
    SetDeviceID(deviceId:string) {
        CameraController.getStore().dispatch({
            type:SET_CAMERA_ID,
            deviceId:deviceId
        });
    },

    /**
     * Loads the cameras connected to the system.
     */
    LoadCameras() {
        try {
            navigator.mediaDevices.enumerateDevices().then((devices:Array<MediaDeviceInfo>) => {
                var cameras:Array<MediaDeviceInfo> = [];
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

                CameraController.getStore().dispatch({
                    type:SET_CAMERAS,
                    records:cameras
                });
            });
        } catch(er) {

        }
    },

    /**
     * Gets the current state.
     */
    getState() {
        return CameraStore.getState();
    },

    /**
     * Gets the store.
     */
    getStore() {
        return CameraStore;
    },

    /**
     * Adds a clojure to listen for state changes.
     * @param {Function} f 
     */
    subscribe(f:any) {
        return CameraStore.subscribe(f);
    }
};

export default CameraController;