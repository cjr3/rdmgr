import {createStore} from 'redux';

const SET_STATE = 'SET_STATE';
const SET_INDEX = 'SET_INDEX';
const SET_TEMPORARY = 'SET_TEMPORARY';
const SET_SLIDES = 'SET_SLIDES';
const NEXT_SLIDE = 'NEXT_SLIDE';

const InitState = {
    Slides:[],
    Index:0,
    SlideDuration:1000 * 10, //10 seconds
    Transition:"fade",
    TemporarySlide:''
}

function SponsorReducer(state = InitState, action) {
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
                Index:0
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
    SetState(values) {
        SponsorController.getStore().dispatch({
            type:SET_STATE,
            values:values
        });
    },

    SetIndex(index) {
        SponsorController.getStore().dispatch({
            type:SET_INDEX,
            value:index
        });
    },

    SetTemporarySlide(value) {
        SponsorController.getStore().dispatch({
            type:SET_TEMPORARY,
            value:value
        });
    },

    SetSlides(slides) {
        SponsorController.getStore().dispatch({
            type:SET_SLIDES,
            values:slides
        });
    },

    Next() {
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

    subscribe(f) {
        return SponsorStore.subscribe(f);
    }
};

export default SponsorController;