import {IController} from '../vars';
export interface ICaptureController extends IController {
    Show:Function;
    Hide:Function;
    Toggle:Function;
    SetClass:{(className:string)};
    SetVisibility:{(value:boolean)};
    SetDelay:{(delay:number)};
    SetDuration:{(duration:number)};
    SetAutoHide:{(value:boolean)};
    ToggleAutoHide:Function;
}

export interface SCaptureControllerState {
    Shown:boolean;
    className:string;
    Delay:number;
    Duration:number;
    AutoHide:boolean;
}

export enum Actions {
    SET_STATE = "SET_STATE",
    TOGGLE = "TOGGLE",
    SHOW = "SHOW",
    HIDE = "HIDE",
    SET_CLASS = "SET_CLASS",
    SET_VISIBILITY = "SET_VISIBILITY",
    SET_DELAY = 'SET_DELAY',
    SET_DURATION = 'SET_DURATION',
    SET_AUTO_HIDE = 'SET_AUTO_HIDE',
    TOGGLE_AUTO_HIDE = 'TOGGLE_AUTO_HIDE'
}