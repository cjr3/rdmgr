import React from 'react'
import Clock from 'components/tools/Clock'
import vars from 'tools/vars'
import ScoreboardController from 'controllers/ScoreboardController'

/**
 * Game Clock component for the Scoreboard.
 */
export default class GameClock extends React.PureComponent<any, {
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
    tenths:number;
}> {
    readonly state = {
        status:vars.Clock.Status.Ready,
        showTenths:false,
        hour:0,
        minute:15,
        second:0,
        tenths:0
    }

    /**
     * Reference for clock component
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
        this.onTick = this.onTick.bind(this);
        this.onContextMenu = this.onContextMenu.bind(this);
        this.updateState = this.updateState.bind(this);
    }

    /**
     * Updates the state to match the controller.
     */
    protected updateState() {
        let setTenths:boolean = false;
        this.setState(() => {
            var cstate = ScoreboardController.GetState();
            if(cstate.GameState != vars.Clock.Status.Running
                && cstate.GameHour == cstate.PhaseHour
                && cstate.GameMinute == cstate.PhaseMinute
                && cstate.GameSecond == cstate.PhaseSecond
                ) {
                setTenths = true;
            }
            return {
                status:cstate.GameState,
                hour:cstate.GameHour,
                minute:cstate.GameMinute,
                second:cstate.GameSecond
            };
        }, () => {
            if(!window.remoteApps.SB && this.ClockItem !== null && this.ClockItem.current !== null) {
                this.ClockItem.current.set(
                    this.state.hour,
                    this.state.minute,
                    this.state.second,
                    0
                );

                if(setTenths) {
                    this.ClockItem.current.setTenths(0);
                }
            }
        });
    }

    /**
     * Triggered when the user clicks on the game clock.
     * @param {MouseEvent} ev 
     */
    protected onClick(ev) {
        ev.stopPropagation();
        ev.preventDefault();
        ScoreboardController.ToggleGameClock();
    }

    protected onContextMenu(ev) {
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
    protected async onTick(hour, minute, second) {
        if(!window.remoteApps.SB)
            ScoreboardController.SetGameTime(hour, minute, second);
    }

    protected async onTenths(hour, minute, second, tenths) {
        this.setState({tenths:tenths});
    }

    /**
     * Start listeners
     */
    componentDidMount() {
        this.remoteScore = ScoreboardController.Subscribe(this.updateState);
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
            
        return (
            <Clock
                className="game-clock"
                hour={this.state.hour}
                minute={this.state.minute}
                second={this.state.second}
                status={status}
                showTenths={this.state.showTenths}
                type={vars.Clock.Types.Clock}
                onClick={this.onClick}
                onContextMenu={this.onContextMenu}
                onTick={this.onTick}
                remote={window.remoteApps.SB}
                ref={this.ClockItem}
                {...this.props}
            />
        )
    }
}