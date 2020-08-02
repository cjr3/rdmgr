/**
 * Module used for game controllers
 */

import ScoreboardController from './ScoreboardController';
import RosterController from './RosterController';
import AnnouncerCaptureController from './capture/Announcer';
import AnthemCaptureController from './capture/Anthem';
import PenaltyCaptureController from './capture/Penalty';
import RaffleCaptureController from './capture/Raffle';
import RosterCaptureController from './capture/Roster';
import ScheduleCaptureController from './capture/Schedule';
import ScoresCaptureController from './capture/Scores';
import SlideshowCaptureController from './capture/Slideshow';
import StandingsCaptureController from './capture/Standings';
import ScorekeeperController from './ScorekeeperController';
import UIController from './UIController';
import { SkaterRecord } from 'tools/vars';
import ClientController from './ClientController';
import DataController from './DataController';

export interface GameButton {
    /**
     * Human-readable string of button
     */
    label:string;
    /**
     * Determines if the button is pressed
     * - If the button is a toggle button, the 'pressed'
     */
    pressed:boolean;
    /**
     * Determines if the button has been released
     */
    released:boolean;
    /**
     * Determines if this button item is to be recognized as a toggle button or not
     * - Usually this is start, select/back, and L3/R3 buttons
     */
    toggle:boolean;
    /**
     * The number of frames the button has been pressed down
     */
    frames:number;
    /**
     * index of gamepad button associated to the 'standard' mapping
     */
    index:number;
}

export interface GameAxis {
    /**
     * Common name
     */
    label:string;
    /**
     * The horizontal distance from the center
     * Positive is right, negative is left
     */
    x:number;
    /**
     * The vertical distance from the center
     * Positive is down, negative is up
     */
    y:number;
}

export interface IGamepadButtonMap {
    /**
     * Bottom button in right cluster (A)
     */
    A:GameButton;
    /**
     * Right button in right cluster (B)
     */
    B:GameButton;
    /**
     * Left button in right cluster (X)
     */
    X:GameButton;
    /**
     * Top button in right cluster (Y)
     */
    Y:GameButton;
    /**
     * Top left front button (L1)
     */
    L1:GameButton;
    /**
     * Top right front button (R1)
     */
    R1:GameButton;
    /**
     * Bottom left front button (L2)
     */
    L2:GameButton;
    /**
     * Bottom right front button (R2)
     */
    R2:GameButton;
    /**
     * Left button in center cluster (Select/Back)
     */
    SELECT:GameButton;
    /**
     * Right button in center cluster (Start)
     */
    START:GameButton;
    /**
     * Left stick pressed button (L3)
     */
    L3:GameButton;
    /**
     * Right stick pressed button (R3)
     */
    R3:GameButton;
    /**
     * Top button in left cluster (D-PAD UP)
     */
    UP:GameButton;
    /**
     * Bottom button in left cluster (D-PAD DOWN)
     */
    DOWN:GameButton;
    /**
     * Left button in left cluster (D-PAD LEFT)
     */
    LEFT:GameButton;
    /**
     * Right button in left cluster (D-PAD RIGHT)
     */
    RIGHT:GameButton;
}

export interface IGamepadAxes {

    /**
     * Left stick of the controller
     */
    LSTICK:GameAxis;
    /**
     * Right stick of the controller
     */
    RSTICK:GameAxis;
}

export const GamepadButtonMap:IGamepadButtonMap = {
    A:{
        label:'A',
        pressed:false,
        released:false,
        toggle:false,
        frames:0,
        index:0
    },
    B:{
        label:'B',
        pressed:false,
        released:false,
        toggle:false,
        frames:0,
        index:1
    },
    X:{
        label:'X',
        pressed:false,
        released:false,
        toggle:false,
        frames:0,
        index:2
    },
    Y:{
        label:'Y',
        pressed:false,
        released:false,
        toggle:false,
        frames:0,
        index:3
    },
    L1:{
        label:'L1',
        pressed:false,
        released:false,
        toggle:false,
        frames:0,
        index:4
    },
    R1:{
        label:'R1',
        pressed:false,
        released:false,
        toggle:false,
        frames:0,
        index:5
    },
    L2:{
        label:'L2',
        pressed:false,
        released:false,
        toggle:false,
        frames:0,
        index:6
    },
    R2:{
        label:'R2',
        pressed:false,
        released:false,
        toggle:false,
        frames:0,
        index:7
    },
    SELECT:{
        label:'SELECT',
        pressed:false,
        released:false,
        toggle:false,
        frames:0,
        index:8
    },
    START:{
        label:'START',
        pressed:false,
        released:false,
        toggle:false,
        frames:0,
        index:9
    },
    L3:{
        label:'L3',
        pressed:false,
        released:false,
        toggle:false,
        frames:0,
        index:10
    },
    R3:{
        label:'R3',
        pressed:false,
        released:false,
        toggle:false,
        frames:0,
        index:11
    },
    UP:{
        label:'UP',
        pressed:false,
        released:false,
        toggle:false,
        frames:0,
        index:12
    },
    DOWN:{
        label:'DOWN',
        pressed:false,
        released:false,
        toggle:false,
        frames:0,
        index:13
    },
    LEFT:{
        label:'LEFT',
        pressed:false,
        released:false,
        toggle:false,
        frames:0,
        index:14
    },
    RIGHT:{
        label:'RIGHT',
        pressed:false,
        released:false,
        toggle:false,
        frames:0,
        index:15
    }
}

export const GamepadAxisMap:IGamepadAxes = {
    LSTICK:{
        label:"Left Stick",
        x:0,
        y:0
    },
    RSTICK:{
        label:"Right Stick",
        x:0,
        y:0
    }
}

let reelA:any = 0;
let reelB:any = 0;

const SpinScorekeeperReel = (side:string, direction:boolean) => {
    let skaters:Array<SkaterRecord> = RosterController.GetState().TeamA.Skaters;
    let index:number = ClientController.GetState().RosterTeamAIndex;
    if(side === 'B') {
        skaters = RosterController.GetState().TeamB.Skaters;
        index = ClientController.GetState().RosterTeamBIndex;
    }

    skaters = skaters.filter(skater => (typeof(skater.Number) === 'string' && skater.Number));
    if(direction) {
        index--;
    } else {
        index++;
    }

    if(index >= skaters.length) {
        index = -1;
    } else if(index < -1) {
        index = skaters.length - 1;
    }

    if(index < -1)
        index = -1;

    try {
        if(side === 'A')
            clearTimeout(reelA);
        else
            clearTimeout(reelB);
    }catch(er){}

    if(side === 'A') {
        reelA = setTimeout(() => {
            ClientController.SetRosterIndex(side, index);
        }, 100);
    } else {
        reelB = setTimeout(() => {
            ClientController.SetRosterIndex(side, index);
        }, 100);
    }
};

class GameControllerHandler {

    /**
     * 
     */
    protected Timer:number = 0;

    protected StickTimer:any = 0;

    /**
     * Gamepad object
     */
    protected Gamepad:Gamepad|null = null;

    /**
     * Array of connected gamepads
     */
    protected Gamepads:any = {};

    /**
     * Constructor
     */
    constructor() {
        this.queryGamepad = this.queryGamepad.bind(this);
        this.onGamePadConnected = this.onGamePadConnected.bind(this);
        this.onGamePadDisconnected = this.onGamePadDisconnected.bind(this);
    }

    /**
     * Initializes the game controller
     * This should be called when the window object is ready
     */
    Init() {
        if(window && window.addEventListener) {
            window.addEventListener('gamepadconnected', this.onGamePadConnected);
            window.addEventListener('gamepaddisconnected', this.onGamePadDisconnected);
            this.LoadControllers().then((controllers) => {
                this.Gamepads = controllers;
                this.Timer = window.requestAnimationFrame(this.queryGamepad);
            }).catch(() => {

            })
        }
    }

    /**
     * Loads the controllers and returns a promise with an array of those controllers
     * The returned value is an object, because the Gamepad API returns an object,
     * not an Array, even though the properties are numbers
     */
    async LoadControllers() :Promise<any> {
        return new Promise((res) => {
            if(navigator && navigator.getGamepads) {
                res(navigator.getGamepads());
            } else {
                res({});
            }
        });
    }

    /**
     * Triggered when a gamepad has been connected
     * @param e GamepadEvent
     */
    protected async onGamePadConnected(e:any|GamepadEvent) {
        this.Gamepads = await this.LoadControllers();
        if(e instanceof GamepadEvent && this.Gamepads[e.gamepad.index]) {
            this.Gamepad = this.Gamepads[e.gamepad.index];
        }
    }

    /**
     * Triggered when a gamepad has been disconnected
     * @param e GamepadEvent
     */
    protected async onGamePadDisconnected(e:any|GamepadEvent) {
        this.Gamepads = await this.LoadControllers();
        if(e instanceof GamepadEvent && this.Gamepad !== null && e.gamepad.id === this.Gamepad.id) {
            this.Gamepad = null;
        }
    }

    /**
     * Checks the state of the gamepad button, and sets necessary values:
     * @param gpb GamepadButton
     * @param button GameButton
     */
    protected checkGamepadButton(gpb:GamepadButton, button:GameButton) {
        if(gpb.pressed) {
            button.pressed = true;
            button.released = false;
            button.frames++;
        } else {
            button.pressed = false;

            //if the button was recently pressed/held, then we need to mark
            //that it has been released
            if(button.frames > 0)
                button.released = true;
            button.frames = 0;
        }
    }

    /**
     * Resets the state of the buttons after being queried and sent to controllers
     */
    protected resetButtons() {
        for(let key in GamepadButtonMap) {
            GamepadButtonMap[key].released = false;
            if(GamepadButtonMap[key].frames > 60)
                GamepadButtonMap[key].frames = 1;
        }
    }

    protected resetSticks() {
        try {
            clearTimeout(this.StickTimer);
        } catch(er) {

        }
        return;
        /*
        this.StickTimer = setTimeout(() => {
            GamepadAxisMap.LSTICK.x = 0;
            GamepadAxisMap.LSTICK.y = 0;
            GamepadAxisMap.RSTICK.x = 0;
            GamepadAxisMap.RSTICK.y = 0;
        }, 1500);
        */
    }

    /**
     * The animation frame query.
     * The gamepads should be queried at the end of each frame to reset the gamepad buttons
     * (I think this is a 'bug' in Chrome, or by design to poll the gamepad)
     */
    protected queryGamepad() {
        if(this.Gamepad === null) {
            this.LoadControllers().then((controllers) => {
                this.Gamepads = controllers;
            });
            this.Timer = window.requestAnimationFrame(this.queryGamepad);
            return;
        }

        //check state of buttons
        let buttonPressed:boolean = false;
        let buttonDown:boolean = false;
        let buttonReleased:boolean = false;
        let stickMoved:boolean = false;
        for(let key in GamepadButtonMap) {
            let button:GameButton = GamepadButtonMap[key];
            this.checkGamepadButton(this.Gamepad.buttons[button.index], button);
            if(button.pressed && button.frames === 1)
                buttonPressed = true;
            if(button.pressed && button.frames > 1)
                buttonDown = true;
            if(button.released)
                buttonReleased = true;
        }

        //check control sticks
        if(this.Gamepad.axes && this.Gamepad.axes.length >= 4) {
            let lx = GamepadAxisMap.LSTICK.x;
            let ly = GamepadAxisMap.LSTICK.y;
            let rx = GamepadAxisMap.RSTICK.x;
            let ry = GamepadAxisMap.RSTICK.y;
            GamepadAxisMap.LSTICK.x = parseFloat(this.Gamepad.axes[0].toFixed(2));
            GamepadAxisMap.LSTICK.y = parseFloat(this.Gamepad.axes[1].toFixed(2));
            GamepadAxisMap.RSTICK.x = parseFloat(this.Gamepad.axes[2].toFixed(2));
            GamepadAxisMap.RSTICK.y = parseFloat(this.Gamepad.axes[3].toFixed(2));
            if(GamepadAxisMap.LSTICK.x !== lx || GamepadAxisMap.LSTICK.y !== ly
                || GamepadAxisMap.RSTICK.x !== rx || GamepadAxisMap.RSTICK.y !== ry) {
                stickMoved = true;
            }
        }

        let sendToScoreboard:boolean = true;
        let streamMode:boolean = DataController.GetMiscRecord('StreamMode');
        //Button Pressed
        if(buttonPressed) {
            //Roster Control
            if(streamMode && GamepadButtonMap.Y.pressed) {
                //RosterController.onGamepadButtonPress(GamepadButtonMap);
                sendToScoreboard = false;
            } else if(streamMode && GamepadButtonMap.R3.pressed) {
                ScorekeeperController.ShiftDecks();
                sendToScoreboard = false;
            } else if(streamMode && GamepadButtonMap.R2.pressed && GamepadButtonMap.B.pressed) {
                AnnouncerCaptureController.Hide();
                AnthemCaptureController.Hide();
                PenaltyCaptureController.Hide();
                RaffleCaptureController.Hide();
                RosterCaptureController.Hide();
                ScheduleCaptureController.Hide();
                ScoresCaptureController.Hide();
                SlideshowCaptureController.Hide();
                StandingsCaptureController.Hide();
                ClientController.SetRosterIndex('A', -1);
                ClientController.SetRosterIndex('B', -1);
                ScorekeeperController.SetPosition('A', null, 'Jammer', 'Track')
                ScorekeeperController.SetPosition('B', null, 'Jammer', 'Track')
                sendToScoreboard = false;
            } else if(streamMode && GamepadButtonMap.B.pressed) {
                if(UIController.GetState().ScorekeeperReel.Shown
                    && (
                        ClientController.GetState().RosterTeamAIndex >= 0 
                        || ClientController.GetState().RosterTeamBIndex >= 0 
                    )) {
                    ScorekeeperController.ShiftDecks();
                    ClientController.SetRosterIndex('A', -1);
                    ClientController.SetRosterIndex('B', -1);
                } else {
                    UIController.ToggleScorekeeperReel();
                }

                sendToScoreboard = false;
            } else if(streamMode && GamepadButtonMap.A.pressed) {
                if(UIController.GetState().ScorekeeperReel.Shown) {
                    let skatersA:Array<SkaterRecord> = RosterController.GetState().TeamA.Skaters;
                    let skatersB:Array<SkaterRecord> = RosterController.GetState().TeamB.Skaters;
                    let aIndex:number = ClientController.GetState().RosterTeamAIndex;
                    let bIndex:number = ClientController.GetState().RosterTeamBIndex;

                    if(aIndex < 0 || aIndex >= skatersA.length || !skatersA[aIndex]) {
                        ScorekeeperController.SetPosition('A', null, 'Jammer', 'Track')
                    } else {
                        ScorekeeperController.SetPosition('A', skatersA[aIndex], 'Jammer', 'Track')
                    }
                    
                    if(bIndex < 0 || bIndex >= skatersB.length || !skatersB[bIndex]) {
                        ScorekeeperController.SetPosition('B', null, 'Jammer', 'Track')
                    } else {
                        ScorekeeperController.SetPosition('B', skatersB[bIndex], 'Jammer', 'Track')
                    }
                    sendToScoreboard = false;
                }
                UIController.SetDisplay('ScorekeeperReel', false);
            } 

            if(streamMode && UIController.GetState().ScorekeeperReel.Shown) {
                if(GamepadButtonMap.LEFT.pressed) {
                    if(GamepadButtonMap.R2.pressed)
                        SpinScorekeeperReel('A', true);
                    else
                        SpinScorekeeperReel('A', false);
                    sendToScoreboard = false;
                }
                
                if(GamepadButtonMap.RIGHT.pressed) {
                    if(GamepadButtonMap.R2.pressed)
                        SpinScorekeeperReel('B', true);
                    else
                        SpinScorekeeperReel('B', false);
                    sendToScoreboard = false;
                }
            }

            if(sendToScoreboard) {
                ScoreboardController.onGamepadButtonPress(GamepadButtonMap);
            }
        }

        //Button Down
        if(buttonDown) {
            //if(sendToScoreboard)
                //ScoreboardController.onGamepadButtonDown(GamepadButtonMap);
        }

        //Button Released
        if(buttonReleased) {
            //if(sendToScoreboard)
                //ScoreboardController.onGamepadButtonUp(GamepadButtonMap);
        }

        //moved control sticks
        if(stickMoved) {
            
        }

        this.resetButtons();

        this.LoadControllers().then((controllers) => {
            this.Gamepads = controllers;
        });
        this.Gamepad = this.Gamepads[this.Gamepad.index];
        this.Timer = window.requestAnimationFrame(this.queryGamepad);
    }
}

//export a single instance
const GameController = new GameControllerHandler();
export default GameController;