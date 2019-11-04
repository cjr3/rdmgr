import {createStore, Unsubscribe} from 'redux';

const SET_STATE = 'SET_STATE';
const SET_INDEX = 'SET_INDEX';
const SET_TEMPORARY = 'SET_TEMPORARY';
const SET_SLIDES = 'SET_SLIDES';
const NEXT_SLIDE = 'NEXT_SLIDE';

export interface SSponsorController {
    /**
     * Collection of slides
     */
    Slides:Array<any>;
    /**
     * Current slide to show
     */
    Index:number;
    /**
     * How long to show the current slide
     */
    SlideDuration:number;
    /**
     * Type of transition
     */
    Transition:string;
    /**
     * Filename of temporary slide.
     */
    TemporarySlide:string;

    /**
     * RecordID of current sponsor slideshow
     */
    RecordID:number;
}

export const InitState:SSponsorController = {
    Slides:[],
    Index:0,
    SlideDuration:1000 * 10, //10 seconds
    Transition:"fade",
    TemporarySlide:'',
    RecordID:0
}

function SponsorReducer(state:SSponsorController = InitState, action) {
    switch(action.type) {
        case SET_STATE :
            return Object.assign({}, state, action.values);

        case SET_INDEX :
            return Object.assign({}, state, {Index:action.value});

        case SET_TEMPORARY :
            return Object.assign({}, state, {TemporarySlide:action.value});

        case SET_SLIDES :
            return Object.assign({}, state, {
                Slides:action.values,
                Index:0,
                RecordID:action.RecordID
            });

        case NEXT_SLIDE :
            var index = state.Index + 1;
            if(index >= state.Slides.length)
                index = 0;
            return Object.assign({}, state, {Index:index});

        default :
            return state;
    }
}

const SponsorStore = createStore( SponsorReducer );

const SponsorController = {
    Key:'SPN',
    async SetState(values) {
        SponsorController.getStore().dispatch({
            type:SET_STATE,
            values:values
        });
    },

    async SetIndex(index) {
        SponsorController.getStore().dispatch({
            type:SET_INDEX,
            value:index
        });
    },

    async SetTemporarySlide(value) {
        SponsorController.getStore().dispatch({
            type:SET_TEMPORARY,
            value:value
        });
    },

    async SetSlides(slides:Array<any>|undefined, recordid:number = 0) {
        SponsorController.getStore().dispatch({
            type:SET_SLIDES,
            values:slides,
            RecordID:recordid
        });
    },

    async Next() {
        SponsorController.getStore().dispatch({
            type:NEXT_SLIDE
        })
    },

    getState() {
        return SponsorStore.getState();
    },

    getStore() {
        return SponsorStore;
    },

    subscribe(f) : Unsubscribe {
        return SponsorStore.subscribe(f);
    }
};

export default SponsorController;