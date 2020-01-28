import React from 'react'
import Clock from 'components/tools/Clock'
import cnames from 'classnames';
import vars from 'tools/vars'
import ScoreboardController from 'controllers/ScoreboardController'

/**
 * Jam clock component for the scoreboard.
 */
export default class JamClock extends React.PureComponent<any, {
    /**
     * Show tenths on the clock or not
     */
    showTenths:boolean;
    /**
     * Default hour
     */
    hour:number;
    /**
     * Default minute
     */
    minute:number;
    /**
     * Default second
     */
    second:number;
    /**
     * Status (playing, stopped, ready)
     */
    status:number;

    maxseconds:number;
}> {
    readonly state = {
        status:vars.Clock.Status.Ready,
        showTenths:false,
        hour:0,
        minute:0,
        second:ScoreboardController.GetState().JamSecond,
        maxseconds:ScoreboardController.GetState().MaxJamSeconds
    }

    /**
     * Clock component reference
     */
    protected ClockItem:React.RefObject<Clock> = React.createRef();
    /**
     * ScoreboardController listener
     */
    protected remoteScore:Function|null = null;

    /**
     * 
     * @param props 
     */
    constructor(props) {
        super(props);
        this.onContextMenu = this.onContextMenu.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onDone = this.onDone.bind(this);
        this.onTick = this.onTick.bind(this);
        this.updateState = this.updateState.bind(this);
    }

    /**
     * Updates the state to match the controller.
     */
    protected async updateState() {
        this.setState(() => {
            let cstate = ScoreboardController.GetState();
            return {
                status:cstate.JamState,
                hour:cstate.JamHour,
                minute:cstate.JamMinute,
                second:cstate.JamSecond,
                maxseconds:cstate.MaxJamSeconds
            };
        }, () => {
            if(!window.remoteApps.SB && this.ClockItem !== null && this.ClockItem.current !== null) {
                this.ClockItem.current.set(
                    this.state.hour,
                    this.state.minute,
                    this.state.second,
                    0
                );
            }
        });
    }

    protected async onClick(ev) {
        ev.preventDefault();
        ev.stopPropagation();
        ScoreboardController.ToggleJamClock();
    }

    protected async onContextMenu(ev) {
        ev.preventDefault();
        ev.stopPropagation();
        this.setState((state) => {
            return {showTenths:!state.showTenths};
        });
    }

    protected async onDone() {
        ScoreboardController.ToggleJamClock();
    }

    /**
     * Triggered with each 1/sec tick on the clock.
     * @param {Number} hour 
     * @param {Number} minute 
     * @param {Number} second 
     */
    protected async onTick(hour, minute, second, tenths) {
        if(!window.remoteApps.SB) {
            ScoreboardController.SetJamTime(second, minute);
        }
    }

    /**
     * Start listeners
     */
    componentDidMount() {
        this.remoteScore = ScoreboardController.Subscribe(this.updateState);
        this.updateState();
    }

    /**
     * Close listeners
     */
    componentWillUnmount() {
        if(this.remoteScore !== null)
            this.remoteScore();
    }

    /**
     * Renders the component
     */
    render() {
        let status:number = this.state.status;
        if(status === vars.Clock.Status.Running && window.remoteApps.SB)
            status = vars.Clock.Status.Ready;

        let className = cnames('jam-clock', {
            longjam:(this.state.second > 60 || this.state.maxseconds > 60)
        });
        
        return (
            <Clock 
                className={className}
                remote={window.remoteApps.SB}
                hour={this.state.hour}
                minute={this.state.minute}
                second={this.state.second}
                maxseconds={this.state.maxseconds}
                type={vars.Clock.Types.Stopwatch}
                showTenths={this.state.showTenths}
                status={status}
                onContextMenu={this.onContextMenu}
                onTick={this.onTick}
                onDone={this.onDone}
                ref={this.ClockItem}
                {...this.props}
            />
        );
    }
}