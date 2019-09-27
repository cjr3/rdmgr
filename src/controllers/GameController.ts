
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
}

interface GamepadAxesItem {
    label:string;

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

export const GamepadButtonMap:IGamepadButtonMap = {
    A:{
        label:'A',
        pressed:false,
        released:false,
        toggle:false,
        frames:0
    },
    B:{
        label:'B',
        pressed:false,
        released:false,
        toggle:false,
        frames:0
    },
    X:{
        label:'X',
        pressed:false,
        released:false,
        toggle:false,
        frames:0
    },
    Y:{
        label:'Y',
        pressed:false,
        released:false,
        toggle:false,
        frames:0
    },
    L1:{
        label:'L1',
        pressed:false,
        released:false,
        toggle:false,
        frames:0
    },
    R1:{
        label:'R1',
        pressed:false,
        released:false,
        toggle:false,
        frames:0
    },
    L2:{
        label:'L2',
        pressed:false,
        released:false,
        toggle:false,
        frames:0
    },
    R2:{
        label:'R2',
        pressed:false,
        released:false,
        toggle:false,
        frames:0
    },
    SELECT:{
        label:'SELECT',
        pressed:false,
        released:false,
        toggle:false,
        frames:0
    },
    START:{
        label:'START',
        pressed:false,
        released:false,
        toggle:false,
        frames:0
    },
    L3:{
        label:'L3',
        pressed:false,
        released:false,
        toggle:false,
        frames:0
    },
    R3:{
        label:'R3',
        pressed:false,
        released:false,
        toggle:false,
        frames:0
    },
    UP:{
        label:'UP',
        pressed:false,
        released:false,
        toggle:false,
        frames:0
    },
    DOWN:{
        label:'DOWN',
        pressed:false,
        released:false,
        toggle:false,
        frames:0
    },
    LEFT:{
        label:'LEFT',
        pressed:false,
        released:false,
        toggle:false,
        frames:0
    },
    RIGHT:{
        label:'RIGHT',
        pressed:false,
        released:false,
        toggle:false,
        frames:0
    },
}

class GameControllerHandler {

    /**
     * The controller to receive command
     */
    Receiver:any = null;

    /**
     * 
     */
    protected Timer:number = 0;

    /**
     * Gamepad object
     */
    protected Gamepad:Gamepad|null = null;

    /**
     * Array of connected gamepads
     */
    protected Gamepads:any = {};

    constructor() {
        this.queryGamepad = this.queryGamepad.bind(this);
        this.onGamePadConnected = this.onGamePadConnected.bind(this);
        this.onGamePadDisconnected = this.onGamePadDisconnected.bind(this);
    }

    /**
     * Initializes the game controller
     * This should be called when the window object is ready
     */
    async Init() {
        if(window && window.addEventListener) {
            window.addEventListener('gamepadconnected', this.onGamePadConnected);
            window.addEventListener('gamepaddisconnected', this.onGamePadDisconnected);
            this.Gamepads = await this.LoadControllers();
            this.Timer = window.requestAnimationFrame(this.queryGamepad);
        }
    }

    async LoadControllers() :Promise<any> {
        return new Promise((res, rej) => {
            if(navigator && navigator.getGamepads) {
                res(navigator.getGamepads());
            } else {
                res([]);
            }
        })
    }

    protected async onGamePadConnected(e:any|GamepadEvent) {
        this.Gamepads = await this.LoadControllers();
        if(e instanceof GamepadEvent && this.Gamepads[e.gamepad.index]) {
            this.Gamepad = this.Gamepads[e.gamepad.index];
        }
    }

    protected async onGamePadDisconnected(e:any|GamepadEvent) {
        this.Gamepads = await this.LoadControllers();
        if(e instanceof GamepadEvent && this.Gamepad !== null && e.gamepad.id == this.Gamepad.id) {
            this.Gamepad = null;
        }
    }

    protected queryGamepad() {
        if(this.Gamepad === null || this.Receiver === null) {
            this.LoadControllers().then((controllers) => {
                this.Gamepads = controllers;
            });
            this.Timer = window.requestAnimationFrame(this.queryGamepad);
            return;
        }

        //Button 0 - A
        if(this.Gamepad.buttons[0].pressed) {
            GamepadButtonMap.A.pressed = true;
            GamepadButtonMap.A.released = false;
            GamepadButtonMap.A.frames++;
        } else {
            GamepadButtonMap.A.pressed = false;
            if(GamepadButtonMap.A.frames > 0)
                GamepadButtonMap.A.released = true;
            GamepadButtonMap.A.frames = 0;
        }

        //Button 1 - B
        if(this.Gamepad.buttons[1].pressed) {
            GamepadButtonMap.B.pressed = true;
            GamepadButtonMap.B.released = false;
            GamepadButtonMap.B.frames++;
        } else {
            GamepadButtonMap.B.pressed = false;
            if(GamepadButtonMap.B.frames > 0)
                GamepadButtonMap.B.released = true;
            GamepadButtonMap.B.frames = 0;
        }

        //Button 2 - X
        if(this.Gamepad.buttons[2].pressed) {
            GamepadButtonMap.X.pressed = true;
            GamepadButtonMap.X.released = false;
            GamepadButtonMap.X.frames++;
        } else {
            GamepadButtonMap.X.pressed = false;
            if(GamepadButtonMap.X.frames > 0)
                GamepadButtonMap.X.released = true;
            GamepadButtonMap.X.frames = 0;
        }

        //Button 3 - Y
        if(this.Gamepad.buttons[3].pressed) {
            GamepadButtonMap.Y.pressed = true;
            GamepadButtonMap.Y.released = false;
            GamepadButtonMap.Y.frames++;
        } else {
            GamepadButtonMap.Y.pressed = false;
            if(GamepadButtonMap.Y.frames > 0)
                GamepadButtonMap.Y.released = true;
            GamepadButtonMap.Y.frames = 0;
        }

        //Button 4 - L1
        if(this.Gamepad.buttons[4].pressed) {
            GamepadButtonMap.L1.pressed = true;
            GamepadButtonMap.L1.released = false;
            GamepadButtonMap.L1.frames++;
        } else {
            GamepadButtonMap.L1.pressed = false;
            if(GamepadButtonMap.L1.frames > 0)
                GamepadButtonMap.L1.released = true;
            GamepadButtonMap.L1.frames = 0;
        }

        //Button 5 - R1
        if(this.Gamepad.buttons[5].pressed) {
            GamepadButtonMap.R1.pressed = true;
            GamepadButtonMap.R1.released = false;
            GamepadButtonMap.R1.frames++;
        } else {
            GamepadButtonMap.R1.pressed = false;
            if(GamepadButtonMap.R1.frames > 0)
                GamepadButtonMap.R1.released = true;
            GamepadButtonMap.R1.frames = 0;
        }

        //Button 6 - L2
        if(this.Gamepad.buttons[6].pressed) {
            GamepadButtonMap.L2.pressed = true;
            GamepadButtonMap.L2.released = false;
            GamepadButtonMap.L2.frames++;
        } else {
            GamepadButtonMap.L2.pressed = false;
            if(GamepadButtonMap.L2.frames > 0)
                GamepadButtonMap.L2.released = true;
            GamepadButtonMap.L2.frames = 0;
        }

        //Button 7 - R2
        if(this.Gamepad.buttons[7].pressed) {
            GamepadButtonMap.R2.pressed = true;
            GamepadButtonMap.R2.released = false;
            GamepadButtonMap.R2.frames++;
        } else {
            GamepadButtonMap.R2.pressed = false;
            if(GamepadButtonMap.R2.frames > 0)
                GamepadButtonMap.R2.released = true;
            GamepadButtonMap.R2.frames = 0;
        }

        //Button 8 - SELECT/BACK
        if(this.Gamepad.buttons[8].pressed) {
            GamepadButtonMap.SELECT.pressed = true;
            GamepadButtonMap.SELECT.released = false;
            GamepadButtonMap.SELECT.frames++;
        } else {
            GamepadButtonMap.SELECT.pressed = false;
            if(GamepadButtonMap.SELECT.frames > 0)
                GamepadButtonMap.SELECT.released = true;
            GamepadButtonMap.SELECT.frames = 0;
        }

        //Button 9 - START/PAUSE
        if(this.Gamepad.buttons[9].pressed) {
            GamepadButtonMap.START.pressed = true;
            GamepadButtonMap.START.released = false;
            GamepadButtonMap.START.frames++;
        } else {
            GamepadButtonMap.START.pressed = false;
            if(GamepadButtonMap.START.frames > 0)
                GamepadButtonMap.START.released = true;
            GamepadButtonMap.START.frames = 0;
        }

        //Button 10 - L3
        if(this.Gamepad.buttons[10].pressed) {
            GamepadButtonMap.L3.pressed = true;
            GamepadButtonMap.L3.released = false;
            GamepadButtonMap.L3.frames++;
        } else {
            GamepadButtonMap.L3.pressed = false;
            if(GamepadButtonMap.L3.frames > 0)
                GamepadButtonMap.L3.released = true;
            GamepadButtonMap.L3.frames = 0;
        }

        //Button 11 - R3
        if(this.Gamepad.buttons[11].pressed) {
            GamepadButtonMap.R3.pressed = true;
            GamepadButtonMap.R3.released = false;
            GamepadButtonMap.R3.frames++;
        } else {
            GamepadButtonMap.R3.pressed = false;
            if(GamepadButtonMap.R3.frames > 0)
                GamepadButtonMap.R3.released = true;
            GamepadButtonMap.R3.frames = 0;
        }

        //Button 12 - UP
        if(this.Gamepad.buttons[12].pressed) {
            GamepadButtonMap.UP.pressed = true;
            GamepadButtonMap.UP.released = false;
            GamepadButtonMap.UP.frames++;
        } else {
            GamepadButtonMap.UP.pressed = false;
            if(GamepadButtonMap.UP.frames > 0)
                GamepadButtonMap.UP.released = true;
            GamepadButtonMap.UP.frames = 0;
        }

        //Button 13 - DOWN
        if(this.Gamepad.buttons[13].pressed) {
            GamepadButtonMap.DOWN.pressed = true;
            GamepadButtonMap.DOWN.released = false;
            GamepadButtonMap.DOWN.frames++;
        } else {
            GamepadButtonMap.DOWN.pressed = false;
            if(GamepadButtonMap.DOWN.frames > 0)
                GamepadButtonMap.DOWN.released = true;
            GamepadButtonMap.DOWN.frames = 0;
        }

        //Button 14 - LEFT
        if(this.Gamepad.buttons[14].pressed) {
            GamepadButtonMap.LEFT.pressed = true;
            GamepadButtonMap.LEFT.released = false;
            GamepadButtonMap.LEFT.frames++;
        } else {
            GamepadButtonMap.LEFT.pressed = false;
            if(GamepadButtonMap.LEFT.frames > 0)
                GamepadButtonMap.LEFT.released = true;
            GamepadButtonMap.LEFT.frames = 0;
        }

        //Button 15 - RIGHT
        if(this.Gamepad.buttons[15].pressed) {
            GamepadButtonMap.RIGHT.pressed = true;
            GamepadButtonMap.RIGHT.released = false;
            GamepadButtonMap.RIGHT.frames++;
        } else {
            GamepadButtonMap.RIGHT.pressed = false;
            if(GamepadButtonMap.RIGHT.frames > 0)
                GamepadButtonMap.RIGHT.released = true;
            GamepadButtonMap.RIGHT.frames = 0;
        }

        //Button Press
        if(this.Receiver.controller && this.Receiver.controller.onGamepadButtonPress) {
            if((GamepadButtonMap.A.pressed && GamepadButtonMap.A.frames === 1)
                ||(GamepadButtonMap.B.pressed && GamepadButtonMap.B.frames === 1)
                || (GamepadButtonMap.X.pressed && GamepadButtonMap.X.frames === 1)
                || (GamepadButtonMap.Y.pressed && GamepadButtonMap.Y.frames === 1)
                || (GamepadButtonMap.L1.pressed && GamepadButtonMap.L1.frames === 1)
                || (GamepadButtonMap.R1.pressed && GamepadButtonMap.R1.frames === 1)
                || (GamepadButtonMap.L2.pressed && GamepadButtonMap.L2.frames === 1)
                || (GamepadButtonMap.R2.pressed && GamepadButtonMap.R2.frames === 1)
                || (GamepadButtonMap.SELECT.pressed && GamepadButtonMap.SELECT.frames === 1)
                || (GamepadButtonMap.START.pressed && GamepadButtonMap.START.frames === 1)
                || (GamepadButtonMap.L3.pressed && GamepadButtonMap.L3.frames === 1)
                || (GamepadButtonMap.R3.pressed && GamepadButtonMap.R3.frames === 1)
                || (GamepadButtonMap.UP.pressed && GamepadButtonMap.UP.frames === 1)
                || (GamepadButtonMap.DOWN.pressed && GamepadButtonMap.DOWN.frames === 1)
                || (GamepadButtonMap.LEFT.pressed && GamepadButtonMap.LEFT.frames === 1)
                || (GamepadButtonMap.RIGHT.pressed && GamepadButtonMap.RIGHT.frames === 1)
                ) {
                this.Receiver.controller.onGamepadButtonPress(GamepadButtonMap);
            }
        }

        //Button Down (Held down for more than 1 frame)
        if(this.Receiver.controller && this.Receiver.controller.onGamepadButtonDown) {
            if((GamepadButtonMap.A.pressed && GamepadButtonMap.A.frames > 1)
                ||(GamepadButtonMap.B.pressed && GamepadButtonMap.B.frames > 1)
                || (GamepadButtonMap.X.pressed && GamepadButtonMap.X.frames > 1)
                || (GamepadButtonMap.Y.pressed && GamepadButtonMap.Y.frames > 1)
                || (GamepadButtonMap.L1.pressed && GamepadButtonMap.L1.frames > 1)
                || (GamepadButtonMap.R1.pressed && GamepadButtonMap.R1.frames > 1)
                || (GamepadButtonMap.L2.pressed && GamepadButtonMap.L2.frames > 1)
                || (GamepadButtonMap.R2.pressed && GamepadButtonMap.R2.frames > 1)
                || (GamepadButtonMap.SELECT.pressed && GamepadButtonMap.SELECT.frames > 1)
                || (GamepadButtonMap.START.pressed && GamepadButtonMap.START.frames > 1)
                || (GamepadButtonMap.L3.pressed && GamepadButtonMap.L3.frames > 1)
                || (GamepadButtonMap.R3.pressed && GamepadButtonMap.R3.frames > 1)
                || (GamepadButtonMap.UP.pressed && GamepadButtonMap.UP.frames > 1)
                || (GamepadButtonMap.DOWN.pressed && GamepadButtonMap.DOWN.frames > 1)
                || (GamepadButtonMap.LEFT.pressed && GamepadButtonMap.LEFT.frames > 1)
                || (GamepadButtonMap.RIGHT.pressed && GamepadButtonMap.RIGHT.frames > 1)
                ) {
                this.Receiver.controller.onGamepadButtonDown(GamepadButtonMap);
            }
        }

        //Button Up / Release
        if(this.Receiver.controller && this.Receiver.controller.onGamepadButtonUp) {
            if((GamepadButtonMap.A.released)
                ||(GamepadButtonMap.B.released)
                || (GamepadButtonMap.X.released)
                || (GamepadButtonMap.Y.released)
                || (GamepadButtonMap.L1.released)
                || (GamepadButtonMap.R1.released)
                || (GamepadButtonMap.L2.released)
                || (GamepadButtonMap.R2.released)
                || (GamepadButtonMap.SELECT.released)
                || (GamepadButtonMap.START.released)
                || (GamepadButtonMap.L3.released)
                || (GamepadButtonMap.R3.released)
                || (GamepadButtonMap.UP.released)
                || (GamepadButtonMap.DOWN.released)
                || (GamepadButtonMap.LEFT.released)
                || (GamepadButtonMap.RIGHT.released)
                ) {
                this.Receiver.controller.onGamepadButtonUp(GamepadButtonMap);
            }
        }

        for(let key in GamepadButtonMap) {
            GamepadButtonMap[key].released = false;
            if(GamepadButtonMap[key].frames > 60)
                GamepadButtonMap[key].frames = 1;
        }

        this.LoadControllers().then((controllers) => {
            this.Gamepads = controllers;
        });
        this.Gamepad = this.Gamepads[this.Gamepad.index];
        this.Timer = window.requestAnimationFrame(this.queryGamepad);
    }

    protected buttonPressed(b:GamepadButton) : boolean {
        return b.pressed;
    }
}

const GameController = new GameControllerHandler();

export default GameController;