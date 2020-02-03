import { FileExtension } from 'controllers/functions.io';

/**
 * Class used for queuing and saving state updates from the controllers
 * - Scoreboard
 * - Roster
 * - Chat
 * - Capture
 */
class IO {
    /**
     * Collection of IOQueue records, each to save a different state from a controller
     */
    protected StateRecords:Array<IOController> = [];

    /**
     * File system access object
     */
    protected FS:any  = null;

    /**
     * Constructor
     */
    constructor() {
        if(window && window.require)
            this.FS = window.require('fs');
        else
            this.FS = require('fs');
    }

    /**
     * Initializes the IO process to watch for changes in states:
     * - Scoreboard
     * - Chat
     * - Roster
     * - Capture
     */
    Init() {
        //this.StateRecords.push(new IOController(ScoreboardController, Files.Scoreboard));
        //this.StateRecords.push(new IOController(ChatController, Files.Chat));
        //this.StateRecords.push(new IOController(RosterController, Files.Roster));
        //this.StateRecords.push(new IOController(CaptureController, Files.Capture));
        //this.StateRecords.push(new IOController(UIController, Files.UI));
    }

    /**
     * Starts the IO listeners
     */
    async Start() : Promise<boolean> {
        return new Promise((res) => {
            this.StateRecords.forEach(async (record) => {
                await record.Start();
            });
            res(true);
        });
    }

    /**
     * Pauses the IO listeners
     */
    async Pause() : Promise<boolean> {
        return new Promise((res) => {
            this.StateRecords.forEach((record) => {
                record.Pause();
            });
            res(true);
        });
    }

    /**
     * Attempts to save a file
     * @param filename string
     * @param content string|binary
     */
    async SaveFile(filename:string, content:any) : Promise<boolean> {
        return new Promise(async (res, rej) => {
            let response = await this.FS.promises.writeFile(filename, content);
            if(response === undefined)
                res(true);
            else
                res(false);
        });
    }
}

/**
 * Class uses to queue file saving when a controller's state has been updated
 * - Each state update is queued into the States object
 */
class IOController {
    /**
     * Listener for controller state changes
     */
    protected Remote:Function
    /**
     * Absolute path to file to save
     */
    protected FileName:string
    /**
     * True when paused (saving cannot occur, and states are not stored)
     */
    protected Paused:boolean = true;
    /**
     * True when attempting to save the state
     */
    protected Saving:boolean = false;
    /**
     * Controller to listen to
     */
    protected Controller:any = null;
    /**
     * File system reference - use promises
     */
    protected FS:any = null;
    /**
     * Collection of state updates
     */
    protected States:Array<any> = [];
    /**
     * Interval reference
     */
    protected Timer:number = 0;

    /**
     * Constructor
     * @param controller any
     * @param filename string
     */
    constructor(controller:any, filename:string) {
        this.Controller = controller;
        this.FileName = filename;
        this.onUpdate = this.onUpdate.bind(this);
        this.Start = this.Start.bind(this);
        this.Pause = this.Pause.bind(this);
        this.SaveNext = this.SaveNext.bind(this);
        this.Remote = controller.Subscribe(this.onUpdate);
        if(window && window.require)
            this.FS = window.require('fs');
        else
            this.FS = require('fs');
    }

    /**
     * Starts the listener for storing and saving updates
     */
    async Start() : Promise<boolean> {
        this.Paused = false;
        try {clearInterval(this.Timer);} catch(er) {}
        this.Timer = window.setInterval(this.SaveNext, 100);
        return new Promise(async (res) => {res(true);});
    }

    /**
     * Checks if able to save the next state, and removes it, even if it succeeds or not
     * - The rapid saving, and removal, is to keep memory use down, as
     *   states for certain controllers can update quite frequently (3/s for the Scoreboard at least)
     */
    protected async SaveNext() {
        if(this.States[0] && !this.Paused && !this.Saving) {
            await this.Save(this.States[0]);
            this.States.shift();
        }
    }

    /**
     * Pauses saving on this quuee
     */
    Pause() {
        this.Paused = true;
    }

    /**
     * Triggered when the controller is updated
     */
    async onUpdate() {
        if(!this.Paused) {
            if(this.States[0])
                this.States.push(this.Controller.GetState());
            else
                this.States[0] = this.Controller.GetState();
        }
    }

    /**
     * Attempts to save the file
     * - Convert the state to a string usign JSON.stringify
     * - Convert the state back to an object
     * - 
     * @param state any
     */
    protected async Save(state:any) : Promise<boolean> {
        return new Promise(async (res, rej) => {
            this.Saving = true;
            try {
                let data:string = JSON.stringify(state, null, 4);
                // eslint-disable-next-line
                let js = JSON.parse(data);
                let response = await this.FS.promises.writeFile(this.FileName, data);
                if(response === undefined) {
                    this.Saving = false;
                    res(true);
                }
            } catch(er) {
                res(false);
            }
        });
    }
}

class IOFileQueue
{
    /**
     * Absolute path to file to save
     */
    FileName:string
    /**
     * Extension of file
     */
    protected Extension:string|unknown
    /**
     * True when paused (saving cannot occur, and states are not stored)
     */
    protected Paused:boolean = true;
    /**
     * True when attempting to save the state
     */
    protected Saving:boolean = false;
    /**
     * File system reference - use promises
     */
    protected FS:any = null;
    /**
     * Collection of state updates
     */
    protected Records:Array<any> = [];
    /**
     * Interval reference
     */
    protected Timer:number = 0;

    /**
     * Constructor
     * @param filename string
     */
    constructor(filename:string) {
        this.FileName = filename;
        this.Extension = FileExtension(this.FileName);
        this.Start = this.Start.bind(this);
        this.Pause = this.Pause.bind(this);
        this.SaveNext = this.SaveNext.bind(this);
        if(window && window.require)
            this.FS = window.require('fs');
        else
            this.FS = require('fs');
    }

    /**
     * Starts the listener for storing and saving updates
     */
    async Start() : Promise<boolean> {
        this.Paused = false;
        try {clearInterval(this.Timer);} catch(er) {}
        this.Timer = window.setInterval(this.SaveNext, 1000);
        return new Promise(async (res) => {res(true);});
    }

    /**
     * Pauses saving on this quuee
     */
    Pause() {
        this.Paused = true;
        try {clearInterval(this.Timer);} catch(er) {}
    }

    /**
     * Checks if able to save the next state, and removes it, even if it succeeds or not
     * - The rapid saving, and removal, is to keep memory use down, as
     *   states for certain controllers can update quite frequently (3/s for the Scoreboard at least)
     */
    protected async SaveNext() {
        if(this.Records[0] && !this.Paused && !this.Saving) {
            await this.SaveFile(this.Records[0]);
            this.Records.shift();
        }
    }

    /**
     * Adds the given content to the queue to be saved
     * @param content any
     */
    async Save(content:any) {
        if(!this.Paused) {
            if(this.Records.length === 0)
                this.Records.push(content);
            else
                this.Records[1] = content;
        }
    }

    /**
     * Attempts to save the file
     * - Convert the state to a string usign JSON.stringify
     * - Convert the state back to an object
     * - 
     * @param content any
     */
    protected async SaveFile(content:any) : Promise<boolean> {
        return new Promise(async (res, rej) => {
            this.Saving = true;
            try {
                let data = content;
                if(this.Extension === 'json') {
                    // eslint-disable-next-line
                    let js = JSON.parse(data);
                }
                let response = await this.FS.promises.writeFile(this.FileName, data);
                if(response === undefined) {
                    this.Saving = false;
                    res(true);
                }
            } catch(er) {
                this.Saving = false;
                res(false);
            }
        });
    }
}

export default IO;
export {IOFileQueue};