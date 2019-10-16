import React from 'react';
import {Icon, IconCheck, IconFastForward, IconStopwatch} from 'components/Elements'
import ScoreboardController from 'controllers/ScoreboardController'

/**
 * Component for setting phase / game clock time
 */
export default class PhaseControl extends React.PureComponent<any, {
    PhaseMinute:number;
    PhaseSecond:number;
    PhaseHour:number;
}> {
    readonly state = {
        PhaseHour:ScoreboardController.getState().PhaseHour,
        PhaseMinute:ScoreboardController.getState().PhaseMinute,
        PhaseSecond:ScoreboardController.getState().PhaseSecond
    }

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
        this.onChangeMinute = this.onChangeMinute.bind(this);
        this.onChangeSecond = this.onChangeSecond.bind(this);
        this.onChangeHour = this.onChangeHour.bind(this);
        this.onSetGameTime = this.onSetGameTime.bind(this);
        this.onCopyGameTime = this.onCopyGameTime.bind(this);
        this.updateState = this.updateState.bind(this);
    }

    /**
     * Updates the state to match the scoreboard controller
     */
    updateState() {
        this.setState(() => {
            return {
                PhaseHour:ScoreboardController.getState().PhaseHour,
                PhaseMinute:ScoreboardController.getState().PhaseMinute,
                PhaseSecond:ScoreboardController.getState().PhaseSecond
            };
        });
    }

    /**
     * Triggered when the user changes the phase minute.
     * @param {KeyEvent} ev 
     */
    onChangeMinute(ev) {
        var value = ev.target.value;
        ScoreboardController.SetPhaseTime(this.state.PhaseHour, value, this.state.PhaseSecond);
    }

    /**
     * Triggered when the user changes the phase second.
     * @param {KeyEvent} ev 
     */
    onChangeSecond(ev) {
        var value = ev.target.value;
        ScoreboardController.SetPhaseTime(this.state.PhaseHour, this.state.PhaseMinute, value);
    }

    /**
     * Triggered when the user changes the phase hour.
     * @param {KeyEvent} ev 
     */
    onChangeHour(ev) {
        var value = ev.target.value;
        ScoreboardController.SetPhaseTime(value, this.state.PhaseMinute, this.state.PhaseSecond);
    }

    /**
     * Triggered when the user sets the game clock time.
     */
    onSetGameTime() {
        ScoreboardController.SetGameTime(this.state.PhaseHour, this.state.PhaseMinute, this.state.PhaseSecond);
    }

    /**
     * Triggered when the user copies the game clock time.
     * @param {MouseEvent} ev 
     */
    onCopyGameTime(ev) {
        this.setState(() => {
            return {
                PhaseHour:ScoreboardController.getState().GameHour,
                PhaseMinute:ScoreboardController.getState().GameMinute,
                PhaseSecond:ScoreboardController.getState().GameSecond
            }
        }, () => {
            ScoreboardController.SetPhaseTime(this.state.PhaseHour, this.state.PhaseMinute, this.state.PhaseSecond);
        });
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
            <div className="phase-control">
                <Icon
                    src={IconFastForward}
                    title="Change Phase ( P )"
                    onClick={ScoreboardController.IncreasePhase}
                    onContextMenu={ScoreboardController.DecreasePhase}
                    />
                <input type="number" onChange={this.onChangeHour} value={this.state.PhaseHour} max={23} min={0}/>
                {":"}
                <input type="number" onChange={this.onChangeMinute} value={this.state.PhaseMinute} max={59} min={0}/>
                {":"}
                <input type="number" onChange={this.onChangeSecond} value={this.state.PhaseSecond} max={59} min={0}/>
                <Icon
                    src={IconStopwatch}
                    title="Set Game Time"
                    onClick={this.onSetGameTime}
                    onContextMenu={this.onCopyGameTime}
                />
            </div>
        )
    }
}