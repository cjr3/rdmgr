import vars from 'tools/vars';

class ClockController {

    protected onTick:Function|undefined;
    protected onDone:Function|undefined;
    protected onTenths:Function|undefined;
    protected Timer:NodeJS.Timeout|null = null;
    protected Hours:number = 0;
    protected Minutes:number = 0;
    protected Seconds:number = 0;
    protected Tenths:number = 0;
    protected Max:number = 60;
    Status:number = vars.Clock.Status.Ready;

    constructor(props:{
        hour:number;
        minute:number;
        second:number;
        max:number;
        onTick:Function;
        onDone:Function;
        onTenths?:Function;
    }) {
        this.Hours = props.hour;
        this.Minutes = props.minute;
        this.Seconds = props.second;
        this.Max = props.max;
        this.onTick = props.onTick;
        this.onDone = props.onDone;
        this.onTenths = props.onTenths;

        this.clear = this.clear.bind(this);
        this.set = this.set.bind(this);
        this.stop = this.stop.bind(this);
        this.run = this.run.bind(this);
        this.ready = this.ready.bind(this);
        this.tick = this.tick.bind(this);
    }

    /**
     * Sets the clock time.
     * The time cannot be set when the clock is running.
     * @param {Number} hour 
     * @param {Number} minute 
     * @param {Number} second 
     * @param {Number} tenths 
     */
    set(hour:number, minute:number, second:number, tenths:number) {
        if(this.Status !== vars.Clock.Status.Running) {
            
            let stenths = this.Tenths;
            if(hour > this.Hours)
                this.Tenths = tenths;
            else if(hour === this.Hours && minute > this.Minutes)
                this.Tenths = tenths;
            this.Hours = hour;
            this.Minutes = minute;
            this.Seconds = second;
        }
    }

    stop() {
        this.clear();
        this.Status = vars.Clock.Status.Stopped;
    }

    run() {
        this.clear();
        this.Status = vars.Clock.Status.Running;
        this.Timer = setInterval(this.tick, 100);
    }

    ready() {
        this.clear();
        this.Status = vars.Clock.Status.Ready;

    }

    protected clear() {
        try {
            if(this.Timer !== null)
                clearInterval(this.Timer);
        } catch(er) {

        }
    }

    protected async tick() {
        this.Tenths--;
        if(this.Tenths < 0) {
            this.Tenths = 9;
            this.Seconds--;
            if(this.Seconds < 0) {
                this.Minutes--;
                this.Seconds = 59;
                if(this.Minutes < 0) {
                    this.Hours--;
                    this.Minutes = 59;
                    if(this.Hours < 0) {
                        this.Hours = 0;
                        this.Minutes = 0;
                        this.Seconds = 0;
                        this.Tenths = 0;
                    }
                }
            }

            if(this.onTick) {
                //this.onTick(this.Hours, this.Minutes, this.Seconds, this.Tenths);
                setTimeout(this.onTick, 10, this.Hours, this.Minutes, this.Seconds, this.Tenths);
            }
        } else if(this.onTenths) {
            //this.onTenths(this.Hours, this.Minutes, this.Seconds, this.Tenths);
            setTimeout(this.onTenths, 10, this.Hours, this.Minutes, this.Seconds, this.Tenths);
        }

        //continue ticking ???
        if(this.done()) {
            this.clear();
            if(this.onDone)
                this.onDone();
        }
    }

    protected done() : boolean {
        return (this.Hours <= 0 && this.Minutes <= 0 && this.Seconds <= 0 && this.Tenths <= 0);
    }
}

export default ClockController;