import React from 'react'
import cnames from 'classnames'
import vars from 'tools/vars'
import './css/Clock.scss'

interface SClock {
    hour:number,
    minute:number,
    second:number,
    tenths:number
}

/**
 * Base clock component.
 */
export default class Clock extends React.Component<{
    /**
     * Starting hour
     */
    hour:number;
    /**
     * Starting minute
     */
    minute:number;
    /**
     * Starting second
     */
    second:number;

    /**
     * If provided, determines the format of stopwatch 
     */
    maxseconds?:number;
    /**
     * Current status
     */
    status:number;
    /**
     * Remote control flag
     */
    remote?:boolean;
    /**
     * Type of clock
     */
    type?:string;
    /**
     * Additional class names
     */
    className?:string;
    /**
     * true to show tenths, false to hide (default is false)
     */
    showTenths?:boolean;
    /**
     * Triggered when the user clicks the clock
     */
    onClick?:any;
    /**
     * Triggered when the user right-clicks the clock
     */
    onContextMenu?:any;
    /**
     * Triggered with each 1 second tick
     */
    onTick?:Function;
    /**
     * Triggered with each 1/100 second tick
     */
    onTenths?:Function;
    /**
     * Triggered when the clock reaches 00:00:00.0
     */
    onDone?:Function;
}, {
    /**
     * Hour of the clock
     */
    hour:number;
    /**
     * Minute of the clock
     */
    minute:number;
    /**
     * Second of the clock
     */
    second:number;
    /**
     * Tenths of the clock
     */
    tenths:number;
}> {
    readonly state:SClock = {
        hour:0,
        minute:0,
        second:0,
        tenths:0
    }

    /**
     * Reference for setTimeout
     */
    protected Timer:number = 0;

    /**
     * Reference for setInterval
     */
    protected Ticker:number = 0;

    /**
     * Constructor
     * @param props 
     */
    constructor(props) {
        super(props);

        if(this.props.hour)
            this.state.hour = this.props.hour;
        if(this.props.minute)
            this.state.minute = this.props.minute;
        if(this.props.second)
            this.state.second = this.props.second;

        //bindings
        this._tick = this._tick.bind(this);
        this._clear = this._clear.bind(this);
        this._done = this._done.bind(this);
    }

    onWorkerMessage(response:any) {
        switch(response.data.type) {
            case 'tick' :
                if(this.props.onTick) {
                    setTimeout(this.props.onTick, 10, response.data.hours, response.data.minutes, response.data.seconds, response.data.tenths);
                }
                this.setState({
                    hour:response.data.hours,
                    minute:response.data.minutes,
                    second:response.data.seconds,
                    tenths:response.data.tenths
                });
            break;

            case 'tenths' :
                this.setState({
                    hour:response.data.hours,
                    minute:response.data.minutes,
                    second:response.data.seconds,
                    tenths:response.data.tenths
                }, () => {
                    if(this.props.onTenths) {
                        //setTimeout(this.props.onTenths, 10, response.data.hours, response.data.minutes, response.data.seconds, response.data.tenths);
                    }
                });
            break;

            case 'done' :
                if(this.props.onDone)
                    this.props.onDone();
            break;
        }
    }

    /**
     * Interrupts the clock ticking.
     * The current tick will continue until it is done.
     */
    _clear() {
        try {clearTimeout(this.Timer);} catch(er) {}
    }

    /**
     * Resets the clock to the values provided in its properties, or zero if none provided.
     */
    _reset() {
        this.setState(() => {
            return {
                hour:(this.props.hour) ? this.props.hour : 0,
                minute:(this.props.minute) ? this.props.minute : 0,
                second:(this.props.second) ? this.props.second : 0,
                tenths:0
            };
        });
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
        if(this.props.status !== vars.Clock.Status.Running) {
            this.setState((state) => {
                var stenths = state.tenths;
                if(hour > state.hour)
                    stenths = tenths;
                else if(hour === state.hour && minute > state.minute)
                    stenths = tenths;
                return {
                    hour:hour,
                    minute:minute,
                    second:second,
                    tenths:stenths
                };
            });
        }
    }

    /**
     * Tick of the clock
     */
    protected async _tick() {
        if(window.remoteApps.SB)
            return;
        this._clear();
        var hours = this.state.hour;
        var minutes = this.state.minute;
        var seconds = this.state.second;
        var tenths = this.state.tenths;

        tenths--;
        if(tenths < 0) {
            tenths = 9;
            seconds--;
            if(seconds < 0) {
                minutes--;
                seconds = 59;
                if(minutes < 0) {
                    hours--;
                    minutes = 59;
                    if(hours < 0) {
                        hours = 0;
                        minutes = 0;
                        seconds = 0;
                        tenths = 0;
                    }
                }
            }

            this.setState(() => {
                return {
                    hour:hours,
                    minute:minutes,
                    second:seconds,
                    tenths:tenths
                };
            });

            if(this.props.onTick)
                setTimeout(this.props.onTick, 10, hours, minutes, seconds, tenths);

        } else {
            this.setState(() => {
                return {tenths:tenths};
            });
            
            //if(this.props.onTenths)
                //setTimeout(this.props.onTenths, 10, hours, minutes, seconds, tenths);
        }

        if(this.Ticker === 0) {
            this.Ticker = window.setInterval(this._tick, 100);
        }

        //continue ticking
        if(this._done(hours, minutes, seconds, tenths)) {
            this.stopDispatcher();
            if(this.props.onDone)
                this.props.onDone();
        }
    }

    protected startDispatcher() {
        this.stopDispatcher();
        this.Ticker = 0;
        this._tick();
    }

    protected stopDispatcher() {
        try {window.clearInterval(this.Ticker);} catch(er) {}
    }

    /**
     * Checks if the clock is done.
     * The clock is done, and should enter the stopped state,
     * when hour, minute, second, and tenths, are zero.
     * @param {Number} hour
     * @param {Number} minute
     * @param {Number} second
     * @param {Number} tenths
     */
    _done(hour, minute, second, tenths) {
        return (hour <= 0 && minute <= 0 && second <= 0 && tenths <= 0);
    }

    /**
     * Gets a string representation of this clock.
     */
    toString() {
        var str = "";
        if(this.props.type === vars.Clock.Types.Clock) {
            if(this.state.hour > 0)
                str = this.state.hour.toString().padStart(2,'0') + ":";
            str += this.state.minute.toString().padStart(2,'0') + ":";
            str += this.state.second.toString().padStart(2,'0');
        } else {
            if(this.state.second > 60 || (this.props.maxseconds !== undefined && !Number.isNaN(this.props.maxseconds)) && this.props.maxseconds > 60) {
                let minutes = 0;
                let seconds = this.state.second;
                while(seconds >= 60) {
                    minutes++;
                    seconds -= 60;
                }
                
                str += minutes.toString().padStart(2,'0') + ":";
                str += seconds.toString().padStart(2,'0');
            } else {
                str += this.state.second.toString().padStart(2,'0');
            }
        }
        if(this.props.showTenths)
            str += "." + this.state.tenths;
        return str;
    }

    /**
     * Triggered when the component has been updated
     * @param {Object} prevProps 
     */
    componentDidUpdate(prevProps) {
        if(window.remoteApps.SB) {
            this.stopDispatcher();
            if(this.props.hour !== this.state.hour
                || this.props.minute !== this.state.minute
                || this.props.second !== this.state.second) {
                this.setState({
                    hour:this.props.hour,
                    minute:this.props.minute,
                    second:this.props.second
                });
            }
        } else {
            if(prevProps.status !== this.props.status) {
                
                switch(this.props.status) {
                    case vars.Clock.Status.Ready :
                        this.stopDispatcher();
                        this._reset();
                    break;
    
                    case vars.Clock.Status.Running :
                        //this._tick();
                        this.startDispatcher();
                        break;
                        
                    case vars.Clock.Status.Stopped :
                        //this._clear();
                        this.stopDispatcher();
                    break;
    
                    default :
    
                    break;
                }
            }
        }
    }

    /**
     * Renders the component.
     */
    render() {
        var classNames = cnames({
            clock:true,
            running:(this.props.status === vars.Clock.Status.Running),
            stopped:(this.props.status === vars.Clock.Status.Stopped),
            ready:(this.props.status === vars.Clock.Status.Ready)
        }, this.props.className);

        return (
            <div 
                className={classNames}
                onClick={this.props.onClick}
                onContextMenu={this.props.onContextMenu}
                >
                {this.toString()}
            </div>
        )
    }
}