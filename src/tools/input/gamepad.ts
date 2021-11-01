import { Roster } from "tools/roster/functions";
import { Scoreboard } from "tools/scoreboard/functions";
import { Scorekeeper } from "tools/scorekeeper/functions";
import { UIController } from "tools/UIController";
import { ScoreboardStatus, ScoreboardTeamStatus } from "tools/vars";

interface GameButton {
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


interface GameAxis {
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

type IGameButtonMap = {[key:string]:GameButton};

interface IGamepadButtonMap extends IGameButtonMap {
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

interface IGamepadAxes {

    /**
     * Left stick of the controller
     */
    LSTICK:GameAxis;
    /**
     * Right stick of the controller
     */
    RSTICK:GameAxis;
}

const defaultButton:GameButton = {
    frames:0,
    index:0,
    label:'',
    pressed:false,
    released:false,
    toggle:false
}

/**
 * Compatible with: Logitech F310 Controller, PDP Xbox Controller
 */
const GamepadButtonMap:IGamepadButtonMap = {
    A:{...defaultButton, label:'A', index:0},
    B:{...defaultButton, label:'B', index:1},
    X:{...defaultButton, label:'X', index:2},
    Y:{...defaultButton, label:'Y', index:3},
    L1:{...defaultButton, label:'L1', index:4},
    R1:{...defaultButton, label:'R1', index:5},
    L2:{...defaultButton, label:'L2', index:6},
    R2:{...defaultButton, label:'R2', index:7},
    SELECT:{...defaultButton, label:'SELECT', index:8},
    START:{...defaultButton, label:'START', index:9},
    L3:{...defaultButton, label:'L3', index:10},
    R3:{...defaultButton, label:'R3', index:11},
    UP:{...defaultButton, label:'UP', index:12},
    DOWN:{...defaultButton, label:'DOWN', index:13},
    LEFT:{...defaultButton, label:'LEFT', index:14},
    RIGHT:{...defaultButton, label:'RIGHT', index:15}
}

const GamepadAxisMap:IGamepadAxes = {
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

const SwitchPowerAButtonMap:IGamepadButtonMap = {
    A:{...defaultButton, label:'A', index:1},
    B:{...defaultButton, label:'B', index:2},
    X:{...defaultButton, label:'X', index:0},
    Y:{...defaultButton, label:'Y', index:3},
    L1:{...defaultButton, label:'L1', index:4},
    R1:{...defaultButton, label:'R1', index:5},
    L2:{...defaultButton, label:'L2', index:6},
    R2:{...defaultButton, label:'R2', index:7},
    SELECT:{...defaultButton, label:'SELECT', index:8},
    START:{...defaultButton, label:'START', index:9},
    L3:{...defaultButton, label:'L3', index:10},
    R3:{...defaultButton, label:'R3', index:11},
    UP:{...defaultButton, label:'UP', index:-1},
    DOWN:{...defaultButton, label:'DOWN', index:-1},
    LEFT:{...defaultButton, label:'LEFT', index:-1},
    RIGHT:{...defaultButton, label:'RIGHT', index:-1}
}

class Controller
{

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
    protected Gamepads:{[key:number]:Gamepad|null} = {};

    /**
     * Determines if the scorekeeper reel is displayed or not.
     */
    protected ScorekeeperReel = UIController.GetState().ScorekeeperReel.visible || false;

    Init = () => {
        if(window && window.addEventListener) {
            window.addEventListener('gamepadconnected', this.onGamePadConnected);
            window.addEventListener('gamepaddisconnected', this.onGamePadDisconnected);
            this.Timer = window.requestAnimationFrame(this.queryGamepad);
        }
    }
    

    /**
     * Loads the controllers and returns a promise with an array of those controllers
     * The returned value is an object, because the Gamepad API returns an object,
     * not an Array, even though the properties are numbers
     */
    LoadControllers = async () : Promise<{[key:number]:Gamepad|null}> => {
        return new Promise((res) => {
            if(navigator && navigator.getGamepads) {
                return res(navigator.getGamepads());
            } else {
                return res({});
            }
        });
    }

    

    /**
     * Triggered when a gamepad has been connected
     * @param e GamepadEvent
     */
     protected onGamePadConnected = async (e:any|GamepadEvent) => {
        this.Gamepads = await this.LoadControllers();
        // console.log('connected')
        if(e instanceof GamepadEvent && this.Gamepads[e.gamepad.index]) {
            this.Gamepad = this.Gamepads[e.gamepad.index];
        }
    }

    /**
     * Triggered when a gamepad has been disconnected
     * @param e GamepadEvent
     */
    protected onGamePadDisconnected = async (e:any|GamepadEvent) => {
        this.Gamepads = await this.LoadControllers();
        // console.log('disconnected')
        if(e instanceof GamepadEvent && this.Gamepad !== null && e.gamepad.id === this.Gamepad.id) {
            this.Gamepad = null;
        }
    }

    /**
     * Checks the state of the gamepad button, and sets necessary values:
     * @param gpb GamepadButton
     * @param button GameButton
     */
    protected checkGamepadButton = async (gpb:GamepadButton, button:GameButton) => {
        if(gpb && gpb.pressed) {
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
    protected resetButtons = (buttons:IGamepadButtonMap) => {
        for(let key in buttons) {
            buttons[key].released = false;
            if(buttons[key].frames > 60)
            buttons[key].frames = 1;
        }
    }

    protected resetSticks = () => {
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
    protected queryGamepad = async () => {
        let gamepad:Gamepad|null = null;
        const pads = navigator.getGamepads();
        if(!pads) {
            // this.Timer = window.requestAnimationFrame(this.queryGamepad);
            setTimeout(this.queryGamepad, 10);
            return;
        }
        
        if(pads.length) {
            for(let i=0; i < pads.length; i++) {
                if(pads[i] !== null && pads[i] !== undefined && pads[i]?.connected) {
                    gamepad = pads[i];
                    break;
                }
            }
        }
        // gamepad = pads[0];

        if(!gamepad) {
            // this.Timer = window.requestAnimationFrame(this.queryGamepad);
            setTimeout(this.queryGamepad, 10);
            return;
        }

        //check state of buttons
        let buttonPressed:boolean = false;
        let buttonDown:boolean = false;
        let buttonReleased:boolean = false;
        let stickMoved:boolean = false;
        let buttons:IGamepadButtonMap|undefined;
        switch(gamepad.id) {
            //switch controller
            case 'Core (Plus) Wired Controller (Vendor: 20d6 Product: a711)' :
                buttons = SwitchPowerAButtonMap;
            break;

            default :
                buttons = GamepadButtonMap
            break;
        }

        if(!buttons) {
            return;
        }

        for(let key in buttons) {
            let button:GameButton = buttons[key];
            this.checkGamepadButton(gamepad.buttons[button.index], button);
            if(button.pressed && button.frames === 1) {
                // console.log(key);
                // console.log(gamepad);
                buttonPressed = true;
            }
            if(button.pressed && button.frames > 1)
                buttonDown = true;
            if(button.released)
                buttonReleased = true;
        }

        //check control sticks
        if(gamepad.axes && gamepad.axes.length >= 4) {
            let lx = GamepadAxisMap.LSTICK.x;
            let ly = GamepadAxisMap.LSTICK.y;
            let rx = GamepadAxisMap.RSTICK.x;
            let ry = GamepadAxisMap.RSTICK.y;
            GamepadAxisMap.LSTICK.x = parseFloat(gamepad.axes[0].toFixed(2));
            GamepadAxisMap.LSTICK.y = parseFloat(gamepad.axes[1].toFixed(2));
            GamepadAxisMap.RSTICK.x = parseFloat(gamepad.axes[2].toFixed(2));
            GamepadAxisMap.RSTICK.y = parseFloat(gamepad.axes[3].toFixed(2));
            if(GamepadAxisMap.LSTICK.x !== lx || GamepadAxisMap.LSTICK.y !== ly
                || GamepadAxisMap.RSTICK.x !== rx || GamepadAxisMap.RSTICK.y !== ry) {
                stickMoved = true;
            }
        }

        if(buttonPressed) {
            if(buttons.Y.pressed) {
                this.ScorekeeperReel = !this.ScorekeeperReel;
                // console.log(this.ScorekeeperReel);
                UIController.SetScorekeeperReel({visible:this.ScorekeeperReel});
            }

            if(this.ScorekeeperReel)
                this.onScorekeeperButtonPress(buttons);
            else
                this.onScoreboardButtonPress(buttons);
        }

        // let streamMode:boolean = DataController.GetMiscRecord('StreamMode');
        // //Button Pressed
        // if(buttonPressed) {
        //     //Roster Control
        //     if(streamMode && GamepadButtonMap.Y.pressed) {
        //         //RosterController.onGamepadButtonPress(GamepadButtonMap);
        //         sendToScoreboard = false;
        //     } else if(streamMode && GamepadButtonMap.R3.pressed) {
        //         ScorekeeperController.ShiftDecks();
        //         sendToScoreboard = false;
        //     } else if(streamMode && GamepadButtonMap.R2.pressed && GamepadButtonMap.B.pressed) {
        //         AnnouncerCaptureController.Hide();
        //         AnthemCaptureController.Hide();
        //         PenaltyCaptureController.Hide();
        //         RaffleCaptureController.Hide();
        //         RosterCaptureController.Hide();
        //         ScheduleCaptureController.Hide();
        //         ScoresCaptureController.Hide();
        //         SlideshowCaptureController.Hide();
        //         StandingsCaptureController.Hide();
        //         ClientController.SetRosterIndex('A', -1);
        //         ClientController.SetRosterIndex('B', -1);
        //         ScorekeeperController.SetPosition('A', null, 'Jammer', 'Track')
        //         ScorekeeperController.SetPosition('B', null, 'Jammer', 'Track')
        //         sendToScoreboard = false;
        //     } else if(streamMode && GamepadButtonMap.B.pressed) {
        //         if(UIController.GetState().ScorekeeperReel.Shown
        //             && (
        //                 ClientController.GetState().RosterTeamAIndex >= 0 
        //                 || ClientController.GetState().RosterTeamBIndex >= 0 
        //             )) {
        //             ScorekeeperController.ShiftDecks();
        //             ClientController.SetRosterIndex('A', -1);
        //             ClientController.SetRosterIndex('B', -1);
        //         } else {
        //             UIController.ToggleScorekeeperReel();
        //         }

        //         sendToScoreboard = false;
        //     } else if(streamMode && GamepadButtonMap.A.pressed) {
        //         if(UIController.GetState().ScorekeeperReel.Shown) {
        //             let skatersA:Array<SkaterRecord> = RosterController.GetState().TeamA.Skaters;
        //             let skatersB:Array<SkaterRecord> = RosterController.GetState().TeamB.Skaters;
        //             let aIndex:number = ClientController.GetState().RosterTeamAIndex;
        //             let bIndex:number = ClientController.GetState().RosterTeamBIndex;

        //             if(aIndex < 0 || aIndex >= skatersA.length || !skatersA[aIndex]) {
        //                 ScorekeeperController.SetPosition('A', null, 'Jammer', 'Track')
        //             } else {
        //                 ScorekeeperController.SetPosition('A', skatersA[aIndex], 'Jammer', 'Track')
        //             }
                    
        //             if(bIndex < 0 || bIndex >= skatersB.length || !skatersB[bIndex]) {
        //                 ScorekeeperController.SetPosition('B', null, 'Jammer', 'Track')
        //             } else {
        //                 ScorekeeperController.SetPosition('B', skatersB[bIndex], 'Jammer', 'Track')
        //             }
        //             sendToScoreboard = false;
        //         }
        //         UIController.SetDisplay('ScorekeeperReel', false);
        //     } 

        //     if(streamMode && UIController.GetState().ScorekeeperReel.Shown) {
        //         if(GamepadButtonMap.LEFT.pressed) {
        //             if(GamepadButtonMap.R2.pressed)
        //                 SpinScorekeeperReel('A', true);
        //             else
        //                 SpinScorekeeperReel('A', false);
        //             sendToScoreboard = false;
        //         }
                
        //         if(GamepadButtonMap.RIGHT.pressed) {
        //             // if(GamepadButtonMap.R2.pressed)
        //             //     SpinScorekeeperReel('B', true);
        //             // else
        //             //     SpinScorekeeperReel('B', false);
        //             sendToScoreboard = false;
        //         }
        //     }

        //     if(sendToScoreboard) {
        //         onGamepadButtonPress(GamepadButtonMap);
        //     }
        // }

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

        this.resetButtons(buttons);
        // this.LoadControllers().then(this._setControllers).catch(this.ignore);
        // this.Gamepad = this.Gamepads[gamepad.index];
        // this.Timer = window.requestAnimationFrame(this.queryGamepad);
        setTimeout(this.queryGamepad, 10);
    }

    protected ignore = () => {};

    protected _setControllers = (controllers:{[key:number]:Gamepad|null}) => {
        this.Gamepads = controllers;
    }

    /**
     * 
     * @param buttons 
     * @returns 
     */
    protected onScoreboardButtonPress = async (buttons:IGamepadButtonMap) => {
        //Y - Ignore
        if(buttons.Y.pressed) {
            return;
        }

        //B - Ignore
        if(buttons.B.pressed) {
            return;
        }

        //X - Toggle Jam Clock
        if(buttons.X.pressed) {
            Scoreboard.ToggleJamClock();
            return;
        }

        //RESET
        // if(buttons.SELECT.pressed 
        //     && buttons.START.pressed 
        //     && buttons.L2.pressed 
        //     && buttons.R2.pressed
        //     && buttons.L1.pressed
        //     && buttons.R1.pressed
        //     ) {
        //         Scoreboard.Reset();
        //     return;
        // }

        //A - Toggle Confirm
        if(buttons.A.pressed) {
            Scoreboard.ToggleConfirmStatus();
            return;
        }

        //UP - Game Clock / Official Timeout
        if(buttons.UP.pressed) {
            if(buttons.R2.pressed) {
                Scoreboard.Stop();
                Scoreboard.SetStatus(ScoreboardStatus.TIMEOUT);
            } else {
                Scoreboard.ToggleGameClock();
            }
            return;
        }

        //DOWN - Break Clock / Injury Timeout
        if(buttons.DOWN.pressed) {
            if(buttons.R2.pressed) {
                Scoreboard.Stop();
                Scoreboard.SetStatus(ScoreboardStatus.INJURY);
            } else {
                Scoreboard.ToggleBreakClock();
            }

            return;
        }

        //LEFT 
        if(buttons.LEFT.pressed) {
            if(buttons.L2.pressed) {
                Scoreboard.DecreaseJamCounter();
            } else if(buttons.R2.pressed) {
                if(!Scoreboard.DecreaseTeamJamPoints('A', 1))
                    Scoreboard.DecreaseTeamScore('A', 1);
            } else {
                if(!Scoreboard.IncreaseTeamJamPoints('A', 1))
                    Scoreboard.IncreaseTeamScore('A', 1);
            }

            return;
        }

        //RIGHT 
        if(buttons.RIGHT.pressed) {
            if(buttons.L2.pressed) {
                Scoreboard.IncreaseJamCounter();
            } else if(buttons.R2.pressed) {
                if(!Scoreboard.DecreaseTeamJamPoints('B', 1))
                    Scoreboard.DecreaseTeamScore('B', 1);
            } else {
                if(!Scoreboard.IncreaseTeamJamPoints('B', 1))
                    Scoreboard.IncreaseTeamScore('B', 1);
            }

            return;
        }

        //L1
        if(buttons.L1.pressed) {
            Scoreboard.SetTeamStatus('B', ScoreboardTeamStatus.NORMAL);
            if(buttons.R2.pressed)
                Scoreboard.SetTeamStatus('A', ScoreboardTeamStatus.POWERJAM);
            else
                Scoreboard.SetTeamStatus('A', ScoreboardTeamStatus.LEADJAM);
            return;
        }

        //R1
        if(buttons.R1.pressed) {
            Scoreboard.SetTeamStatus('A', ScoreboardTeamStatus.NORMAL);
            if(buttons.R2.pressed)
                Scoreboard.SetTeamStatus('B', ScoreboardTeamStatus.POWERJAM);
            else
                Scoreboard.SetTeamStatus('B', ScoreboardTeamStatus.LEADJAM);
            return;
        }

        //SELECT
        if(buttons.SELECT.pressed) {
            if(buttons.L2.pressed && buttons.R2.pressed) {
                const state = Scoreboard.GetState();
                Scoreboard.SetGameClockTime(
                    state.PhaseHour || state.GameClock?.Hours || 0,
                    state.PhaseMinute || state.GameClock?.Minutes || 0,
                    state.PhaseSecond || state.GameClock?.Seconds || 0,
                );
            } else if(buttons.R2.pressed) {
                Scoreboard.PreviousPhase();
            } else {
                Scoreboard.NextPhase();
            }
            return;
        }

        //START
        if(buttons.START.pressed) {
            if(buttons.L2.pressed && buttons.R2.pressed) {
                Scoreboard.ResetJam();
            } else {
                Scoreboard.ToggleGameClock();
            }
            return;
        }
    }

    /**
     * 
     * @param buttons 
     */
    protected onScorekeeperButtonPress = async (buttons:IGamepadButtonMap) => {
        if(buttons.Y.pressed) {
            
            return;
        }

        if(buttons.B.pressed) {
            UIController.SetScorekeeperReel({
                indexA:-1,
                indexB:-1,
                skaterA:-1,
                skaterB:-1
            });
            return;
        }

        if(buttons.X.pressed) {
            this.ScorekeeperReel = false;
            Scorekeeper.SetPosition('A', undefined, 'Track', 'Jammer');
            Scorekeeper.SetPosition('B', undefined, 'Track', 'Jammer');
            UIController.SetScorekeeperReel({visible:false});
            return;
        }

        if(buttons.A.pressed) {
            const state = UIController.GetState().ScorekeeperReel;
            Scorekeeper.SetPosition('A', Roster.GetSkaters('A').find(r => r.RecordID === state.skaterA), 'Track', 'Jammer');
            Scorekeeper.SetPosition('B', Roster.GetSkaters('B').find(r => r.RecordID === state.skaterB), 'Track', 'Jammer');
            this.ScorekeeperReel = false;
            UIController.SetScorekeeperReel({visible:false});
            return;
        }

        if(buttons.LEFT.pressed || buttons.UP.pressed) {
            const state = UIController.GetState().ScorekeeperReel;
            const skaters = Roster.GetSkaters('A').filter(r => r.Number);
            let index = typeof(state.indexA) === 'number' ? state.indexA : -1;
            let skaterId = -1;
            if(buttons.R2.pressed || buttons.UP.pressed) {
                index--;
            } else {
                index++;
            }

            if(index < -1) {
                index = skaters.length - 1;
            } else if(index >= skaters.length) {
                index = -1;
            }
            if(index >= 0 && skaters[index])
                skaterId = skaters[index].RecordID || -1;
            UIController.SetScorekeeperReel({indexA:index, skaterA:skaterId});
            return;
        }

        if(buttons.RIGHT.pressed || buttons.DOWN.pressed) {
            const state = UIController.GetState().ScorekeeperReel;
            const skaters = Roster.GetSkaters('B').filter(r => r.Number);
            let index = typeof(state.indexB) === 'number' ? state.indexB : -1;
            let skaterId = -1;
            if(buttons.R2.pressed || buttons.DOWN.pressed) {
                index--;
            } else {
                index++;
            }

            if(index < -1) {
                index = skaters.length - 1;
            } else if(index >= skaters.length) {
                index = -1;
            }
            if(index >= 0 && skaters[index])
                skaterId = skaters[index].RecordID || -1;
            UIController.SetScorekeeperReel({indexB:index, skaterB:skaterId});
            return;
        }
    };
}

const GameController = new Controller();
export {GameController};