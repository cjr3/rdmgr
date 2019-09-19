import React from 'react'
import Clock from 'components/tools/Clock'
import vars from 'tools/vars'
import ScoreboardController from 'controllers/ScoreboardController'

interface SGameClock {
    showTenths:boolean,
    hour:number,
    minute:number,
    second:number,
    status:number
}

interface PGameClock {
    remote?:string
}

/**
 * Game Clock component for the Scoreboard.
 */
class GameClock extends React.PureComponent<PGameClock, SGameClock> {
    readonly state:SGameClock = {
        status:vars.Clock.Status.Ready,
        showTenths:false,
        hour:0,
        minute:15,
        second:0
    }

    ClockItem:React.RefObject<Clock> = React.createRef();

    remoteScore:Function

    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
        this.onTick = this.onTick.bind(this);
        this.onContextMenu = this.onContextMenu.bind(this);
        this.updateState = this.updateState.bind(this);
        this.remoteScore = ScoreboardController.subscribe(this.updateState);
    }

    /**
     * Updates the state to match the controller.
     */
    updateState() {
        this.setState(() => {
            var cstate = ScoreboardController.getState();
            return {
                status:cstate.GameState,
                hour:cstate.GameHour,
                minute:cstate.GameMinute,
                second:cstate.GameSecond
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

    /**
     * Triggered when the user clicks on the game clock.
     * @param {MouseEvent} ev 
     */
    onClick(ev) {
        ev.stopPropagation();
        ev.preventDefault();
        ScoreboardController.ToggleGameClock();
    }

    onContextMenu(ev) {
        ev.stopPropagation();
        ev.preventDefault();
        this.setState((state) => {
            return {showTenths:!state.showTenths};
        });
    }

    /**
     * Triggered with each 1-second tick of the game clock.
     * @param {Number} hour 
     * @param {Number} minute 
     * @param {Number} second 
     */
    async onTick(hour, minute, second) {
        if(!this.props.remote)
            ScoreboardController.SetGameTime(hour, minute, second);
    }

    /**
     * Renders the component
     */
    render() {
        return (
            <Clock
                className="game-clock"
                hour={this.state.hour}
                minute={this.state.minute}
                second={this.state.second}
                status={this.state.status}
                showTenths={this.state.showTenths}
                type={vars.Clock.Types.Clock}
                onClick={this.onClick}
                onContextMenu={this.onContextMenu}
                onTick={this.onTick}
                remote={this.props.remote}
                ref={this.ClockItem}
                {...this.props}
            />
        )
    }
}

export default GameClock;