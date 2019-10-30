import React from 'react'
import Clock from 'components/tools/Clock'
import {Icon, IconStopwatch, Icon2x} from 'components/Elements'
import ScoreboardController from 'controllers/ScoreboardController';
import vars from 'tools/vars';
import ClientController from 'controllers/ClientController';

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
export default class BreakClock extends React.PureComponent<any, {
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
        this.onClickSixty = this.onClickSixty.bind(this);
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
            if(!window.remoteApps.SB && this.ClockItem !== null && this.ClockItem.current !== null) {
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
     * Sets the break clock time to 60 seconds
     */
    onClickSixty() {
        if(ScoreboardController.getState().JamState !== vars.Clock.Status.Running) {
            if(this.state.status !== vars.Clock.Status.Running && this.state.second === 60) {
                ScoreboardController.SetState({
                    BreakState:vars.Clock.Status.Running
                });
            } else {
                ScoreboardController.SetState({
                    BreakSecond:60
                });
            }
        }
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
        if(!ClientController.ControllerRemote(ScoreboardController.Key))
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
        let status:number = this.state.status;
        if(status === vars.Clock.Status.Running && window.remoteApps.SB)
            status = vars.Clock.Status.Ready;
        return (
            <tr>
                <td>Break</td>
                <td>
                    <Clock
                        hour={0}
                        minute={0}
                        second={this.state.second}
                        status={status}
                        remote={window.remoteApps.SB}
                        onClick={this.onClick}
                        onTick={this.onTick}
                        onDone={this.onDone}
                        ref={this.ClockItem}
                    />
                </td>
                <td>
                    <Icon 
                        src={IconStopwatch}
                        onClick={this.onClick}
                        title="Toggle Break Clock ( DOWN )"
                    />
                </td>
                <td>
                    <Icon 
                        src={Icon2x}
                        onClick={this.onClickSixty}
                        title="Double-click for a 60-second break"
                    />
                </td>
            </tr>
        )
    }
}