import React from 'react'
import Clock from 'components/tools/Clock'
import vars from 'tools/vars'
import ScoreboardController from 'controllers/ScoreboardController'

/**
 * Jam clock component for the scoreboard.
 */
export default class JamClock extends React.PureComponent<{
    /**
     * Remote Peer ID. If provided, the peer (connected or not) must provide
     * values to change the clock
     */
    remote?:string;
}, {
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
}> {
    readonly state = {
        status:vars.Clock.Status.Ready,
        showTenths:false,
        hour:0,
        minute:0,
        second:60
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
    updateState() {
        this.setState(() => {
            return {
                status:ScoreboardController.getState().JamState,
                hour:ScoreboardController.getState().JamHour,
                minute:ScoreboardController.getState().JamMinute,
                second:ScoreboardController.getState().JamSecond
            };
        }, () => {
            if(!this.props.remote && this.ClockItem !== null && this.ClockItem.current !== null) {
                this.ClockItem.current.set(
                    this.state.hour,
                    this.state.minute,
                    this.state.second,
                    0
                );
            }
        });
    }

    onClick(ev) {
        ev.preventDefault();
        ev.stopPropagation();
        ScoreboardController.ToggleJamClock();
    }

    onContextMenu(ev) {
        ev.preventDefault();
        ev.stopPropagation();
        this.setState((state) => {
            return {showTenths:!state.showTenths};
        });
    }

    onDone() {
        ScoreboardController.ToggleJamClock();
    }

    /**
     * Triggered with each 1/sec tick on the clock.
     * @param {Number} hour 
     * @param {Number} minute 
     * @param {Number} second 
     */
    async onTick(hour, minute, second) {
        if(!this.props.remote)
            ScoreboardController.SetJamTime(second);
    }

    /**
     * Start listeners
     */
    componentDidMount() {
        this.remoteScore = ScoreboardController.subscribe(this.updateState);
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
        return (
            <Clock 
                className="jam-clock"
                remote={this.props.remote}
                hour={this.state.hour}
                minute={this.state.minute}
                second={this.state.second}
                type={vars.Clock.Types.Stopwatch}
                showTenths={this.state.showTenths}
                status={this.state.status}
                onContextMenu={this.onContextMenu}
                onTick={this.onTick}
                onDone={this.onDone}
                ref={this.ClockItem}
                {...this.props}
            />
        )
    }
}