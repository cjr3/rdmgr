import React from 'react'
import Clock from 'components/tools/Clock'
import {Icon} from 'components/Elements'
import vars from 'tools/vars'
import ScoreboardController from 'controllers/ScoreboardController'

/**
 * Scoreboard Break Clock control
 */
class BreakClock extends React.PureComponent {
    constructor(props) {
        super(props);

        var sstate = ScoreboardController.getState();
        this.state = {
            status:vars.Clock.Status.Ready,
            second:sstate.BreakSecond
        };

        this.Clock = React.createRef();

        //bindings
        this.onClick = this.onClick.bind(this);
        this.onDone = this.onDone.bind(this);
        this.onTick = this.onTick.bind(this);
        this.updateState = this.updateState.bind(this);
        this.remote = ScoreboardController.subscribe(this.updateState);
    }

    /**
     * Updates the state to match the controller.
     */
    updateState() {
        var sstate = ScoreboardController.getState();
        this.setState(() => {
            return {
                status:sstate.BreakState,
                second:sstate.BreakSecond
            };
        }, () => {
            if(!this.props.remote && this.Clock.current) {
                this.Clock.current.set(
                    0,
                    0,
                    this.state.second,
                    0,
                    false
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
    onTick(hour, minute, second) {
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
                        ref={this.Clock}
                    />
                </td>
                <td colSpan="2">
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