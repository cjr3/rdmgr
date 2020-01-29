import {IController} from '../vars';
export interface ICaptureController extends IController {
    Show:Function;
    Hide:Function;
    Toggle:Function;
    SetClass:Function;
    SetVisibility:Function;
    SetDelay:Function;
    SetDuration:Function;
}

export interface SCaptureControllerState {
    Shown:boolean;
    className:string;
    Delay:number;
    Duration:number;
}

export enum Actions {
    SET_STATE = "SET_STATE",
    TOGGLE = "TOGGLE",
    SHOW = "SHOW",
    HIDE = "HIDE",
    SET_CLASS = "SET_CLASS",
    SET_VISIBILITY = "SET_VISIBILITY",
    SET_DELAY = 'SET_DELAY',
    SET_DURATION = 'SET_DURATION'
}