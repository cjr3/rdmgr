/**
 * This 'controller' is for sending messages back to the Client
 * form from the CaptureForm (captureWindow to the mainWindow)
 * 
 * This state should be a one-way state, just like the controllers
 * are a one-way state from Client ot CaptureForm.
 */

import {createStore} from 'redux';
import vars from './vars';

const SET_STATE = 'SET_STATE';
const SET_VIDEO = 'SET_VIDEO';

export interface SCaptureStatus {
    Video:{
        CurrentTime:number,
        Duration:number,
        Status:number
    }
}

//Initial state
const InitState:SCaptureStatus = {
    Video:{
        CurrentTime:0,
        Duration:0,
        Status:vars.Video.Status.Stopped
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
        case SET_STATE :
            return Object.assign({}, state, action.values);

        //sets the video state
        case SET_VIDEO :
            return Object.assign({}, state, {
                Video:Object.assign({}, state.Video, action.values)
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
            type:SET_STATE,
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
            type:SET_VIDEO,
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
            type:SET_VIDEO,
            values:{
                Status:status
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