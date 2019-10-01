import React from 'react'
import Clock from 'components/tools/Clock'
import {Icon} from 'components/Elements'
import ScoreboardController from 'controllers/ScoreboardController';
import vars from 'tools/vars';

interface SBreakClock {
    status:number,
    second:number
}

interface PBreakClock {
    remote?:string
}

/**
 * Scoreboard Break Clock control
 */
export default class BreakClock extends React.PureComponent<{
    /**
     * Remote Peer ID. If provided, the clock does not tick,
     * and the peer must update its value
     */
    remote?:string;
}, {
    /**
     * Status of the clock (playing, stopped, ready)
     */
    status:number;
    /**
     * Seconds on the clock
     */
    second:number;
}> {
    readonly state:SBreakClock = {
        status:vars.Clock.Status.Ready,
        second:30
    }

    /**
     * Clock reference item
     */
    protected ClockItem:React.RefObject<Clock> = React.createRef();

    /**
     * ScoreboardController listener
     */
    protected remoteScore:Function|null = null;

    /**
     * Constructor
     * @param props 
     */
    constructor(props) {
        super(props);
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
                status:ScoreboardController.getState().BreakState,
                second:ScoreboardController.getState().BreakSecond
            };
        }, () => {
            if(!this.props.remote && this.ClockItem !== null && this.ClockItem.current !== null) {
                this.ClockItem.current.set(
                    0,
                    0,
                    this.state.second,
                    0
                );
            }
        });
    }

    /**
     * Triggered when the user clicks the clock
     * @param {MouseEvent} ev 
     */
    onClick(ev) {
        ev.stopPropagation();
        ev.preventDefault();
        ScoreboardController.ToggleBreakClock();
    }

    /**
     * Triggered when the clock has reach 0.0
     */
    onDone() {
        ScoreboardController.StopBreakGameClock();
    }

    /**
     * Triggered on each tick of the break clock.
     * @param {Number} hour 
     * @param {Number} minute 
     * @param {Number} second 
     */
    async onTick(hour, minute, second) {
        if(!this.props.remote)
            ScoreboardController.SetBreakTime(second);
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
     * Renders the component.
     */
    render() {
        return (
            <tr>
                <td>Break</td>
                <td>
                    <Clock
                        hour={0}
                        minute={0}
                        second={this.state.second}
                        status={this.state.status}
                        remote={this.props.remote}
                        onClick={this.onClick}
                        onTick={this.onTick}
                        onDone={this.onDone}
                        ref={this.ClockItem}
                    />
                </td>
                <td colSpan={2}>
                    <Icon 
                        src={require('images/icons/stopwatch.png')}
                        onClick={this.onClick}
                        title="Stop/Start"
                    />
                </td>
            </tr>
        )
    }
}