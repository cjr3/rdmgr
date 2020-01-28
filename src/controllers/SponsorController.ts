import {IController, Files} from './vars';
import {CreateController, BaseReducer} from './functions.controllers';

interface ISponsorController extends IController {
    SetIndex:{(index:number)},
    SetSlides:{(slides:Array<any>, recordid:number)},
    Next:Function;
    Start:Function;
    Stop:Function;
    ForceNext:Function;
}

enum Actions {
    SET_INDEX = 'SET_INDEX',
    SET_SLIDES = 'SET_SLIDES',
    NEXT = 'NEXT'
}

let Timer:any = 0;

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
     * RecordID of current sponsor slideshow
     */
    RecordID:number;
}

export const InitState:SSponsorController = {
    Slides:[],
    Index:0,
    SlideDuration:1000 * 10, //10 seconds
    Transition:"fade",
    RecordID:0
}

const SetIndex = (state:SSponsorController, index:number) => {
    if(index < 0)
        index = state.Slides.length - 1;
    else if(index >= state.Slides.length)
        index = 0;
    return {...state, Index:index};
};

const SetSlides = (state:SSponsorController, slides:Array<any>) => {
    return {
        ...state,
        Index:0,
        Slides:slides.slice()
    };
};

const NextSlide = (state:SSponsorController) => {
    return SetIndex(state, state.Index+1);
};

const SponsorReducer = (state:SSponsorController = InitState, action) => {
    try {
        switch(action.type) {
            case Actions.SET_INDEX :
                return SetIndex(state, action.index);

            case Actions.SET_SLIDES :
                return SetSlides(state, action.records);
            
            case Actions.NEXT :
                return NextSlide(state);

            default :
                return BaseReducer(state, action);
        }
    } catch(er) {
        return state;
    }
};

const SponsorController:ISponsorController = CreateController('SPN', SponsorReducer);
SponsorController.SetIndex = async (index:number) => {
    SponsorController.Dispatch({
        type:Actions.SET_INDEX,
        index:index
    });
};

SponsorController.SetSlides = async (records:Array<any>) => {
    SponsorController.Dispatch({
        type:Actions.SET_SLIDES,
        records:records
    });
};

SponsorController.Next = async () => {
    SponsorController.Dispatch({
        type:Actions.NEXT
    });
};

SponsorController.Start = async () => {
    SponsorController.Stop();
    Timer = setInterval(() => {
        SponsorController.Next();
    }, 10000);
};

SponsorController.Stop = async () => {
    try {clearTimeout(Timer);} catch(er) {}
};

SponsorController.ForceNext = async () => {
    SponsorController.Stop();
    SponsorController.Next();
    Timer = setInterval(() => {
        SponsorController.Next();
    }, 10000);
};

export default SponsorController;