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
class BreakClock extends React.PureComponent<PBreakClock, SBreakClock> {
    readonly state:SBreakClock = {
        status:vars.Clock.Status.Ready,
        second:30
    }

    ClockItem:React.RefObject<Clock> = React.createRef();
    remoteScore:Function

    constructor(props) {
        super(props);

        //bindings
        this.onClick = this.onClick.bind(this);
        this.onDone = this.onDone.bind(this);
        this.onTick = this.onTick.bind(this);
        this.updateState = this.updateState.bind(this);
        this.remoteScore = ScoreboardController.subscribe(this.updateState);
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

export default BreakClock;