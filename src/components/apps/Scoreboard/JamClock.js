import React from 'react'
import Clock from 'components/tools/Clock'
import vars from 'tools/vars'
import ScoreboardController from 'controllers/ScoreboardController'

/**
 * Jam clock component for the scoreboard.
 */
class JamClock extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            showTenths:false,
            status:vars.Clock.Status.Ready,
            hour:ScoreboardController.getState().JamHour,
            minute:ScoreboardController.getState().JamMinute,
            second:ScoreboardController.getState().JamSecond,
        }

        this.Clock = React.createRef();

        //bindings
        this.onContextMenu = this.onContextMenu.bind(this);
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
        this.setState(() => {
            return {
                status:ScoreboardController.getState().JamState,
                hour:ScoreboardController.getState().JamHour,
                minute:ScoreboardController.getState().JamMinute,
                second:ScoreboardController.getState().JamSecond
            };
        }, () => {
            if(!this.props.remote && this.Clock.current) {
                this.Clock.current.set(
                    this.state.hour,
                    this.state.minute,
                    this.state.second,
                    0,
                    false
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

    render() {
        return (
            <Clock 
                className="jam-clock"
                remote={this.props.remote}
                hour={this.state.hour}
                minute={this.state.minute}
                second={this.state.second}
                initSeconds={60}
                type={vars.Clock.Types.Stopwatch}
                showTenths={this.state.showTenths}
                status={this.state.status}
                onContextMenu={this.onContextMenu}
                onTick={this.onTick}
                onDone={this.onDone}
                ref={this.Clock}
                {...this.props}
            />
        )
    }
}

export default JamClock;