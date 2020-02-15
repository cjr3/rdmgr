/**
 * Controller for manual slideshows, such as full-size team intros.
 * - See SponsorController for the sponsor slideshow.
 * - See StreamIntroController for the stream intro slideshows.
 */
import keycodes from 'tools/keycodes';
import {SlideshowRecord} from 'tools/vars';

import {IController, Files} from './vars';
import {CreateController, BaseReducer} from './functions.controllers';
import SlideshowCaptureController from './capture/Slideshow';
import SlideshowsController from './SlideshowsController';
import { PrepareObjectForSending, MoveElement } from './functions';

interface ISlideshowController extends IController {
    Next:Function;
    Prev:Function;
    Display:{(index:number)};
    Start:Function;
    Show:Function;
    Hide:Function;
    Toggle:Function;
    SetSlides:{(records:Array<any>,id:number,name:string)};
    RemoveSlide:{(index:number)};
    AddSlide:{(record:any)};
    SetLoop:{(value:boolean)},
    SwapSlides:{(a:number, b:number, right:boolean)};
    onKeyUp:Function;
}

enum Actions {
    NEXT_SLIDE = 'NEXT_SLIDE',
    PREV_SLIDE = 'PREV_SLIDE',
    SET_SLIDES = 'SET_SLIDES',
    SET_LOOP = 'SET_LOOP',
    SET_INDEX = 'SET_INDEX',
    SWAP_SLIDES = 'SWAP_SLIDES',
    ADD_SLIDE = 'ADD_SLIDE',
    REMOVE_SLIDE = 'REMOVE_SLIDE'
}

export interface SSlideshowController {
    /**
     * Index # of the current slide
     */
    Index:number;
    /**
     * True to loop; false to not loop
     * - May be obsolete with introduction of MediaQueue
     */
    Loop:boolean;
    /**
     * True to auto-play; false ot not (default)
     * - May be obsolete with introduction of MediaQueue
     */
    Auto:boolean;
    /**
     * Collection of slide records
     */
    Slides:Array<any>;
    /**
     * The current slideshow record
     */
    Slideshow:SlideshowRecord|null;
    /**
     * The ID of the current slideshow
     */
    SlideshowID:number;
    /**
     * Name of the current slideshow
     */
    Name:string;
    /**
     * How long to display a slide
     */
    Delay:number;
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
const getCorrectIndex = (index:number, len:number, loop:boolean = false) => {
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
};

const NextSlide = (state:SSlideshowController) => {
    return {
        ...state,
        Index:getCorrectIndex(state.Index + 1, state.Slides.length, state.Loop)
    };
};

const PrevSlide = (state:SSlideshowController) => {
    return {
        ...state,
        Index:getCorrectIndex(state.Index - 1, state.Slides.length, state.Loop)
    };
};

const DisplaySlide = (state:SSlideshowController, index:number) => {
    return {
        ...state,
        Index:getCorrectIndex(index, state.Slides.length, state.Loop)
    };
};

const StartSlideshow = (state:SSlideshowController) => {
    return {
        ...state,
        Index:0
    };
};

const SetSlides = (state:SSlideshowController, records:Array<any>, id?:number, name?:string) => {
    return {
        ...state,
        Index:0,
        Slides:records,
        SlideshowID:(id) ? id : 0,
        Name:(name) ? name : ''
    };
};

const SetSlideshowLoop = (state:SSlideshowController, value:boolean) => {
    return {...state, Loop:value};
};

const SwapSlides = (state:SSlideshowController, a:number, b:number, right:boolean) => {
    let slides:Array<any> = state.Slides.slice();
    MoveElement(slides, a, b, right);
    return {...state, Slides:slides};
};

const RemoveSlide = (state:SSlideshowController, index:number) => {
    if(!state.Slides[index])
        return state;
    let slides:Array<any> = state.Slides.slice();
    let i:number = state.Index;
    slides.splice(index, 1);
    if(i > slides.length)
        i = 0;
    return {...state, Index:i, Slides:slides};
};

/**
 * Main reducer for the slideshow controller.
 * @param {Object} state 
 * @param {Object} action 
 */
const SlideshowReducer = (state = InitState, action) => {
    try {
        switch(action.type) {
            case Actions.NEXT_SLIDE :
                return NextSlide(state);

            //shows the previous slide
            case Actions.PREV_SLIDE :
                return PrevSlide(state);

            //set slides and reset
            case Actions.SET_SLIDES :
                return SetSlides(state, action.records, action.id, action.name);

            //update loop status
            case Actions.SET_LOOP :
                return SetSlideshowLoop(state, action.value);

            //sets the slide to show - within the bounds of # of slides
            case Actions.SET_INDEX :
                return DisplaySlide(state, action.index);

            //Swaps the slides
            case Actions.SWAP_SLIDES :
                return SwapSlides(state, action.indexA, action.indexB, action.right);

            case Actions.REMOVE_SLIDE :
                return RemoveSlide(state, action.index);

            default :
                return BaseReducer(state, action);
        }
    } catch(er) {
        return state;
    }
}

//const SlideshowStore = createStore(SlideshowReducer);

const SlideshowController:ISlideshowController = CreateController('SLS', SlideshowReducer);
SlideshowController.Next = async () => {
    SlideshowController.Dispatch({
        type:Actions.NEXT_SLIDE
    });
};

SlideshowController.Prev = async () => {
    SlideshowController.Dispatch({
        type:Actions.PREV_SLIDE
    });
};

SlideshowController.Display = async (index:number) => {
    SlideshowController.Dispatch({
        type:Actions.SET_INDEX,
        index:index
    });
};

SlideshowController.Start = async () => {
    SlideshowController.Dispatch({
        type:Actions.SET_INDEX,
        index:0
    });
};

SlideshowController.Show = async () => {
    SlideshowCaptureController.Show();
};

SlideshowController.Hide = async () => {
    SlideshowCaptureController.Hide();
};

SlideshowController.Toggle = async () => {
    SlideshowCaptureController.Toggle();
};

SlideshowController.SetSlides = async (records:Array<any>, id?:number, name?:string) => {
    SlideshowController.Dispatch({
        type:Actions.SET_SLIDES,
        records:records,
        id:id,
        name:name
    });
};

SlideshowController.SetLoop = async (value:boolean) => {
    SlideshowController.Dispatch({
        type:Actions.SET_LOOP,
        value:value
    });
};

SlideshowController.SwapSlides = async (a:number, b:number, right:boolean = false) => {
    SlideshowController.Dispatch({
        type:Actions.SWAP_SLIDES,
        indexA:a,
        indexB:b,
        right:right
    });
};

SlideshowController.RemoveSlide = async (index:number) => {
    SlideshowController.Dispatch({
        type:Actions.REMOVE_SLIDE,
        index:index
    });
};

SlideshowController.onKeyUp = (ev) => {
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
};

SlideshowController.BuildAPI = async () => {
    let server = window.LocalServer;
    let exp = server.ExpressApp;

    //get full slideshow state
    exp.get(/^\/api\/slideshow(\/?)$/i, (req, res) => {
        res.send(server.PrepareObjectForSending(PrepareObjectForSending(SlideshowController.GetState())));
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
                    res.send(server.PrepareObjectForSending(PrepareObjectForSending(SlideshowController.GetState())));
                break;
            }
        } else {
            res.send(server.PrepareObjectForSending(PrepareObjectForSending(SlideshowController.GetState())));
        }
        res.end();
    });

    //set slideshow based on index
    exp.post(/^\/api\/slideshow\/:id(\d{1,10})/i, (req, res) => {
        let record:SlideshowRecord = SlideshowsController.GetRecord(req.params.id);
        if(record && record.Records && (record.Records instanceof Array)) {
            let slides:Array<any> = [];
            for(var key in record.Records)
                slides.push(record.Records[key]);
            SlideshowController.SetSlides(slides, record.RecordID, record.Name);
            res.send("OK");
        } else {
            res.send("NONE");
        }
    });
};

export default SlideshowController;