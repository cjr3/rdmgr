import { ClockStatus } from "tools/vars";

class Clock
{
    /**
     * True = Count down, False = count up.
     */
    Direction:boolean = true;

    /**
     * Current hour
     */
    Hour:number = 0;

    /**
     * Max number of seconds.
     * If Direction is true, this will be the reset value when reset is called.
     * If Direction is false, this will be the max number of seconds and the clock will stop immediately.
     */
    MaxSeconds:number = 0;

    /**
     * Current minute
     */
    Minute:number = 0;

    /**
     * Reset to MaxSeconds when stopped
     */
    ResetOnStop:boolean = false;

    /**
     * Current second
     */
    Second:number = 0;

    /**
     * Current status
     */
    Status:ClockStatus = ClockStatus.STOPPED;

    /**
     * Current tenths
     */
    Tenths:number = 0;

    /**
     * Interval holder
     */
    protected Timer:any = 0;

    /**
     * Callbacks for when the clock stops
     */
    OnStop:{():void}[] = [];
    
    /**
     * Callbacks for each 1 second tick
     */
    OnTick:{(hour:number, minute:number, second:number, tenths:number, status:ClockStatus):void}[] = [];

    /**
     * Callback for each 1/10th of a second
     */
    OnTickTenths:{(hour:number, minute:number, second:number, tenths:number, status:ClockStatus):void}[] = [];

    /**
     * Stop the interval
     */
    protected clear = () => {
        try {
            clearInterval(this.Timer);
        } catch(er) {

        }
    }

    /**
     * Add the given time to the clock. Ignored if clock is running. Resets tenths to zero.
     * @param hour 
     * @param minute 
     * @param second 
     */
    public add = (hour:number, minute:number, second:number) => {
        if(this.Status !== ClockStatus.RUNNING) {
            this.Hour = Math.min(23, this.Hour + Math.abs(hour));
            this.Minute = Math.min(59, this.Minute + Math.abs(minute));
            this.Second = Math.min(59, this.Second + Math.abs(second));
            this.Tenths = 0;
            // this.__onTick();
        }
    }

    public reset = () => {
        if(this.Status !== ClockStatus.RUNNING) {
            this.Hour = 0;
            this.Minute = 0;
            this.Second = Math.max(0, this.MaxSeconds);
            this.Tenths = 0;
            // this.__onTick();
        }
    }

    /**
     * Subtracts the given time from the clock. Ignored if clock is running. Resets tenths to zero.
     * @param hour 
     * @param minute 
     * @param second 
     */
    public subtract = (hour:number, minute:number, second:number) => {
        if(this.Status !== ClockStatus.RUNNING) {
            this.Hour = Math.max(0, this.Hour - Math.abs(hour));
            this.Minute = Math.max(0, this.Minute - Math.abs(minute));
            this.Second = Math.max(0, this.Second - Math.abs(second));
            this.Tenths = 0;
            // this.__onTick();
        }
    }

    /**
     * Start the clock
     */
    public start = () => {
        if(this.Status !== ClockStatus.RUNNING) {
            this.clear();
            this.Status = ClockStatus.RUNNING;
            // this.__onTick();
            this.Timer = setInterval(this.tick, 100);
        }
    }

    private _set = async (hour:number, minute:number, second:number, tenths:number = 0) => {
        this.Hour = hour;
        this.Minute = minute;
        this.Second = second;
        this.Tenths = tenths;
        // console.clear();
        // console.log(`${hour}:${minute}:${second}:${tenths}`);
        this.__onTick();
    }

    public set = async (hour:number, minute:number, second:number, tenths:number = 0) => {
        if(this.Status !== ClockStatus.RUNNING) {
            this._set(hour, minute, second, tenths);
        }
    }

    public stop = async () => {
        this.clear();
        const current = this.Status;
        this.Status = ClockStatus.STOPPED;
        if(this.ResetOnStop)
            this.reset();
        if(current !== this.Status)
            this.OnStop.forEach(f => f());
    }

    protected tick = async () => {
        let hour = this.Hour;
        let minute = this.Minute;
        let second = this.Second;
        let tenth = this.Tenths;
        if(this.Direction) {
            tenth--;
            if(tenth < 0) {
                tenth = 9;
                second--;
                if(second < 0) {
                    second = 59;
                    minute--;
                    if(minute < 0) {
                        minute = 59;
                        hour--;
                        if(hour < 0) {
                            hour = 0;
                            second = 0;
                            minute = 0;
                            tenth = 0;
                            this.stop();

                            if(this.ResetOnStop) {
                                this.reset();
                                return;
                            }
                        }
                    }
                }

                this._set(hour, minute, second, tenth);
                // this.__onTick();

            } else {
                this._set(hour, minute, second, tenth);
                // this.__onTick();
            }
        } else {
            tenth++;
            if(tenth > 9) {
                second++;
                tenth = 0;
                if(this.MaxSeconds > 0 && second >= this.MaxSeconds) {
                    this.stop();

                    if(this.ResetOnStop) {
                        this.reset();
                        return;
                    }
                } else if(second > 59) {
                    second = 0;
                    minute++;
                    if(minute > 59) {
                        minute = 0;
                        hour++;
                        if(hour > 23) {
                            hour = 23;
                            this.stop();

                            if(this.ResetOnStop) {
                                this.reset();
                                return;
                            }
                        }
                    }
                }
                this._set(hour, minute, second, tenth);
                // this.__onTick();
            } else {
                this._set(hour, minute, second, tenth);
                // this.__onTick();
            }
        }
    }

    protected async __onTickTenths() {
        this.OnTickTenths.forEach(f => f(this.Hour, this.Minute, this.Second, this.Tenths, this.Status));
    }

    protected async __onTick() {
        this.OnTick.forEach(f => f(this.Hour, this.Minute, this.Second, this.Tenths, this.Status));
    }
}

export {Clock};