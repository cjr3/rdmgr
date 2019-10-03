/**
 * This 'controller' is for sending messages back to the Client
 * form from the CaptureForm (captureWindow to the mainWindow)
 * 
 * This state should be a one-way state, just like the controllers
 * are a one-way state from Client ot CaptureForm.
 */

import {createStore} from 'redux';
import vars from './vars';

export enum Actions {
    SET_STATE,
    SET_VIDEO,
    SET_PEER
};

export interface SCaptureStatus {
    Video:{
        CurrentTime:number;
        Duration:number;
        Status:number;
    },
    PeerCamera:{
        PeerID:string;
        Connected:boolean;
    }
}

//Initial state
export const InitState:SCaptureStatus = {
    Video:{
        CurrentTime:0,
        Duration:0,
        Status:vars.Video.Status.Stopped
    },
    PeerCamera:{
        PeerID:'',
        Connected:false
    }
};

/**
 * Reducer for the CaptureStatus
 * @param {Object} state The current state
 * @param {Object} action The action to perform
 */
function CaptureStatusReducer(state:SCaptureStatus = InitState, action) {
    switch( action.type ) {
        //Set the state
        case Actions.SET_STATE :
            return Object.assign({}, state, action.values);

        //sets the video state
        case Actions.SET_VIDEO :
            return Object.assign({}, state, {
                Video:Object.assign({}, state.Video, action.values)
            });

        case Actions.SET_PEER :
            return Object.assign({}, state, {
                PeerCamera:Object.assign({}, state.PeerCamera, action.values)
            });

        default :
            return state;
    }
}

//redux store
const CaptureStatusStore = createStore( CaptureStatusReducer );

/**
 * Status for the capture form, to send updates back to the main window.
 */
const CaptureStatus = {

    /**
     * Sets the state of the status.
     * @param {Object} state 
     */
    SetState(state) {
        CaptureStatus.getStore().dispatch({
            type:Actions.SET_STATE,
            values:state
        });
    },

    /**
     * Updates the status of the current video.
     * @param {Number} currentTime Current time of the video
     * @param {Number} duration Duration of the video
     */
    UpdateVideo(currentTime, duration) {
        CaptureStatus.getStore().dispatch({
            type:Actions.SET_VIDEO,
            values:{
                CurrentTime:currentTime,
                Duration:duration
            }
        });
    },

    /**
     * Updates the video status.
     * @param {Number} status 
     */
    UpdateVideoStatus(status) {
        CaptureStatus.getStore().dispatch({
            type:Actions.SET_VIDEO,
            values:{
                Status:status
            }
        });
    },

    /**
     * Updates the remote streaming peer's status
     * @param id The peer's ID
     * @param status true if connected, false if not
     */
    UpdatePeer(id:string, status:boolean) {
        CaptureStatus.getStore().dispatch({
            type:Actions.SET_PEER,
            values:{
                PeerID:id,
                Connected:status
            }
        });
    },

    /**
     * Gets the Redux store for the capture status
     * @return {Object} Redux store
     */
    getStore() {
        return CaptureStatusStore;
    },

    /**
     * Gets the current state of the store.
     * @returns {Object} The current state
     */
    getState() : SCaptureStatus {
        return CaptureStatusStore.getState();
    },

    /**
     * Subscribes a function to changes to the state.
     * @param {Function} f The function to receive the notification
     */
    subscribe(f) {
        return CaptureStatusStore.subscribe( f );
    }
};

export default CaptureStatus;