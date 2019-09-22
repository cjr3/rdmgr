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

interface PClock {
    hour:number,
    minute:number,
    second:number,
    status:number,
    remote?:string,
    type?:string,
    className?:string,
    showTenths?:boolean,
    onClick?:any,
    onContextMenu?:any,
    onTick?:Function,
    onTenths?:Function,
    onDone?:Function
}

/**
 * Base clock component.
 */
class Clock extends React.Component<PClock, SClock> {
    readonly state:SClock = {
        hour:0,
        minute:0,
        second:0,
        tenths:0
    }

    Timer:number = 0

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
        this.setState((state) => {
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
    set(hour, minute, second, tenths) {
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
    async _tick() {
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
            
            if(this.props.onTenths)
                setTimeout(this.props.onTenths, 10, hours, minutes, seconds, tenths);
        }

        //continue ticking
        if(!this._done(hours, minutes, seconds, tenths)) {
            if(this.props.status === vars.Clock.Status.Running)
                this.Timer = window.setTimeout(this._tick, 100);
        } else {
            if(this.props.onDone)
                this.props.onDone();
        }
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
        }

        str += this.state.second.toString().padStart(2,'0');
        if(this.props.showTenths)
            str += "." + this.state.tenths;
        return str;
    }

    /**
     * Triggered when the component has been updated
     * @param {Object} prevProps 
     */
    componentDidUpdate(prevProps, prevState) {
        if(typeof(this.props.remote) === "string" && this.props.remote !== '') {
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
                        this._clear();
                        this._reset();
                    break;
    
                    case vars.Clock.Status.Running :
                        this._tick();
                        break;
                        
                    case vars.Clock.Status.Stopped :
                        this._clear();
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

export default Clock;