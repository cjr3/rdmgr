/**
 * Controller for manual slideshows, such as full-size team intros.
 * - See SponsorController for the sponsor slideshow.
 * - See StreamIntroController for the stream intro slideshows.
 */
import {createStore} from 'redux'
import CaptureController from 'controllers/CaptureController';
import DataController from 'controllers/DataController';
import keycodes from 'tools/keycodes';
import {SlideshowRecord} from 'tools/vars';

const SET_STATE = 'SET_STATE';
const NEXT_SLIDE = 'NEXT_SLIDE';
const PREV_SLIDE = 'PREV_SLIDE';
const SET_SLIDES = 'SET_SLIDES';
const SET_LOOP = 'SET_LOOP';
const SET_INDEX = 'SET_INDEX';
const SWAP_SLIDES = 'SWAP_SLIDES';

export interface SSlideshowController {
    Index:number,
    Loop:boolean,
    Auto:boolean,
    Slides:Array<any>,
    Slideshow:SlideshowRecord|null,
    SlideshowID:number,
    Name:string,
    Delay:number
}

export const InitState:SSlideshowController = {
    Index:0,
    Loop:false,
    Auto:false,
    Slides:[],
    Slideshow:null,
    SlideshowID:0,
    Name:'',
    Delay:10000
};

/**
 * Calculates the index to keep it within the bounds of the slideshow.
 * @param {Number} index 
 * @param {Number} len 
 * @param {Boolean} loop 
 */
function getCorrectIndex(index, len, loop) {
    if(index < 0) {
        if(loop)
            return len - 1;
        return 0;
    } else if(index >= len) {
        if(loop)
        return 0;
        return len - 1;
    }
    return index;
}

/**
 * Main reducer for the slideshow controller.
 * @param {Object} state 
 * @param {Object} action 
 */
function SlideshowReducer(state = InitState, action)
{
    switch(action.type) {
        case SET_STATE :
            return Object.assign({}, state, action.state);

        case NEXT_SLIDE :
            return Object.assign({}, state, {
                Index:getCorrectIndex(state.Index + 1, state.Slides.length, state.Loop)
            });

        //shows the previous slide
        case PREV_SLIDE :
            return Object.assign({}, state, {
                Index:getCorrectIndex(state.Index - 1, state.Slides.length, state.Loop)
            });

        //set slides and reset
        case SET_SLIDES :
            return Object.assign({}, state, {
                Index:0,
                SlideshowID:action.id,
                Slides:action.records,
                Name:action.name
            });

        //update loop status
        case SET_LOOP :
            return Object.assign({}, state, {Loop:action.value});

        //sets the slide to show - within the bounds of # of slides
        case SET_INDEX :
            return Object.assign({}, state, {
                Index:getCorrectIndex(action.index, state.Slides.length, state.Loop)
            });

        //Swaps the slides
        case SWAP_SLIDES :
            var slides = state.Slides.slice();
            DataController.MoveElement(slides, action.indexA, action.indexB, action.right);
            return Object.assign({}, state, {Slides:slides});

        default :
            return state;
    }
}

const SlideshowStore = createStore(SlideshowReducer);

/**
 * Controller for manual slideshows.
 */
const SlideshowController = {
    Key:'SS',
    /**
     * Sets the state of the cotnroller
     * @param {Object} state 
     */
    SetState(state) {
        SlideshowController.getStore().dispatch({
            type:SET_STATE,
            state:state
        });
    },

    /**
     * Shows the next slide.
     */
    Next() {
        SlideshowController.getStore().dispatch({
            type:NEXT_SLIDE
        });
    },

    /**
     * Shows the previous slide.
     */
    Prev() {
        SlideshowController.getStore().dispatch({
            type:PREV_SLIDE
        });
    },

    /**
     * Displays the given slide.
     * @param {Number} index The numeric index of the slide.
     */
    Display(index) {
        SlideshowController.getStore().dispatch({
            type:SET_INDEX,
            index:index
        })
    },

    /**
     * Starts the slideshow
     */
    Start() {
        SlideshowController.getStore().dispatch({
            type:SET_INDEX,
            index:0
        });
        SlideshowController.Show();
    },

    /**
     * Shows the slideshow
     */
    Show() {
        CaptureController.SetMainSlideshowVisibility(true);
    },

    /**
     * Hides the slideshow
     */
    Hide() {
        CaptureController.SetMainSlideshowVisibility(false);
    },

    Toggle() {
        CaptureController.ToggleSlideshow()
    },

    /**
     * Sets the slide records.
     * @param {Array} records Slideshow's Slides
     * @param {Number} id Slideshow's RecordID
     * @param {String} name Slideshow's name
     */
    SetSlides(records:Array<any>|undefined, id, name) {
        SlideshowController.getStore().dispatch({
            type:SET_SLIDES,
            records:records,
            id:id,
            name:name
        });
    },

    /**
     * Sets the loop value of the slideshow.
     * True = Will loop, showing the first slide after the last slide.
     * False = Will not loop.
     * @param {Boolean} value 
     */
    SetLoop(value) {
        SlideshowController.getStore().dispatch({
            type:SET_LOOP,
            value:value
        });
    },

    /**
     * Swaps the slides at the given indexes, where a and b will be swapped.
     * @param {Number} a Index of the slide to move
     * @param {Number} b Index of where the slide should move to
     * @param {Boolean} right
     */
    SwapSlides(a, b, right) {
        SlideshowController.getStore().dispatch({
            type:SWAP_SLIDES,
            indexA:a,
            indexB:b,
            right:right
        });
    },

    onKeyUp(ev) {
        switch(ev.keyCode) {
            //Next slide or hide
            case keycodes.PAGEDOWN :
            case keycodes.RIGHT :
            case keycodes.SPACEBAR :
            case keycodes.DOWN :
                if(ev.ctrlKey) {
                    SlideshowController.Hide();
                } else {
                    SlideshowController.Next();
                }
            break;

            //previous slide or start
            case keycodes.LEFT :
            case keycodes.PAGEUP :
            case keycodes.UP :
                if(ev.ctrlKey) {
                    SlideshowController.Start();
                } else {
                    SlideshowController.Prev();
                }
                break;

            //start slideshow
            case keycodes.ENTER :
                SlideshowController.Start();
            break;

            //end slideshow
            case keycodes.END :
                SlideshowController.Hide();
            break;

            //show slideshow
            case keycodes.HOME :
                SlideshowController.Show();
            break;

            default :
            break;
        }
    },

    /**
     * Get the store.
     */
    getStore() {
        return SlideshowStore;
    },

    /**
     * Get the current state
     */
    getState() {
        return SlideshowStore.getState();
    },

    /**
     * Subscribe to changes in the store.
     * @param {Function} f 
     */
    subscribe(f) {
        return SlideshowStore.subscribe(f);
    },

    buildAPI() {
        var server = window.LocalServer;
        var exp = server.ExpressApp;

        //get full slideshow state
        exp.get(/^\/api\/slideshow(\/?)$/i, (req, res) => {
            res.send(server.PrepareObjectForSending(DataController.PrepareObjectForSending(SlideshowController.getState())));
            res.end();
        });

        exp.get(/^\/api\/slideshow\/([A-Z]{1,30})/i, (req, res) => {
            //res.send(req.params[0]);
            //res.end();
            if(req.params[0]) {
                switch(req.params[0].toString().toLowerCase()) {
                    case 'next' :
                        SlideshowController.Next();
                    break;
                    case 'prev' :
                        SlideshowController.Prev();
                    break;
                    case 'start' :
                        SlideshowController.Start();
                    break;
                    case 'show' :
                        SlideshowController.Show();
                    break;
                    case 'hide' :
                        SlideshowController.Hide();
                    break;

                    default :
                        res.send(server.PrepareObjectForSending(DataController.PrepareObjectForSending(this.getState())));
                    break;
                }
            } else {
                res.send(server.PrepareObjectForSending(DataController.PrepareObjectForSending(this.getState())));
            }
            res.end();
        });

        //set slideshow based on index
        exp.post(/^\/api\/slideshow\/(\d{1,10})/i, (req, res) => {
            var show = DataController.getSlideshow(req.params[0]);
            if(show) {
                var slides:Array<any> = [];
                for(var key in show.Records)
                    slides.push(show.Records[key]);
                SlideshowController.SetSlides(slides, show.RecordID, show.Name);
                res.send("OK");
            } else {
                res.send("NONE");
            }
        });
    }
};

export default SlideshowController;