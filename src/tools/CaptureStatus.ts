/**
 * This 'controller' is for sending messages back to the Client
 * form from the CaptureForm (captureWindow to the mainWindow)
 * 
 * This state should be a one-way state, just like the controllers
 * are a one-way state from Client ot CaptureForm.
 */

import {createStore, Store, Unsubscribe} from 'redux';
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
function CaptureStatusReducer(state:SCaptureStatus = InitState, action) : SCaptureStatus{
    try {
        switch( action.type ) {
            //Set the state
            case Actions.SET_STATE : {
                return Object.assign({}, state, action.values);
            }
    
            //sets the video state
            case Actions.SET_VIDEO : {
                return Object.assign({}, state, {
                    Video:Object.assign({}, state.Video, action.values)
                });
            }
    
            //Set ID of remote peer
            case Actions.SET_PEER : {
                return Object.assign({}, state, {
                    PeerCamera:Object.assign({}, state.PeerCamera, action.values)
                });
            }
    
            default :
                return state;
        }
    } catch(er) {
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
     * @param state any
     */
    SetState(state:any) {
        CaptureStatus.getStore().dispatch({
            type:Actions.SET_STATE,
            values:state
        });
    },

    /**
     * Updates the status of the current video.
     * @param currentTime Current time of the video
     * @param duration Duration of the video
     */
    UpdateVideo(currentTime:number, duration:number) {
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
     * @param status 
     */
    UpdateVideoStatus(status:number) {
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
    getStore() : Store<SCaptureStatus, any> {
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
     * @param f The function to receive the notification
     */
    subscribe(f:any) : Unsubscribe|null {
        if(typeof(f) === "function")
            return CaptureStatusStore.subscribe( f );
        return null;
    }
};

export default CaptureStatus;