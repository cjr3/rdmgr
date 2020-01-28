import {IController} from '../vars';
export interface ICaptureController extends IController {
    Show:Function;
    Hide:Function;
    Toggle:Function;
    SetClass:Function;
    SetVisibility:Function;
}

export interface SCaptureControllerState {
    Shown:boolean;
    className:string;
}

export enum Actions {
    SET_STATE = "SET_STATE",
    TOGGLE = "TOGGLE",
    SHOW = "SHOW",
    HIDE = "HIDE",
    SET_CLASS = "SET_CLASS",
    SET_VISIBILITY = "SET_VISIBILITY"
}