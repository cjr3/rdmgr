import React from 'react';
import {Icon, IconCheck, IconFastForward} from 'components/Elements'
import ScoreboardController from 'controllers/ScoreboardController'

interface SPhaseControl {
    PhaseMinute:number,
    PhaseSecond:number
}

class PhaseControl extends React.PureComponent<any, SPhaseControl> {
    readonly state:SPhaseControl = {
        PhaseMinute:ScoreboardController.getState().PhaseMinute,
        PhaseSecond:ScoreboardController.getState().PhaseSecond
    }

    remoteScore:Function

    constructor(props) {
        super(props);

        //bindings
        this.onChangeMinute = this.onChangeMinute.bind(this);
        this.onChangeSecond = this.onChangeSecond.bind(this);
        this.onSetGameTime = this.onSetGameTime.bind(this);
        this.onCopyGameTime = this.onCopyGameTime.bind(this);
        this.updateState = this.updateState.bind(this);
        this.remoteScore = ScoreboardController.subscribe(this.updateState);
    }

    /**
     * Updates the state to match the scoreboard controller
     */
    updateState() {
        this.setState(() => {
            return {
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
        ScoreboardController.SetPhaseTime(0, value, this.state.PhaseSecond);
    }

    /**
     * Triggered when the user changes the phase second.
     * @param {KeyEvent} ev 
     */
    onChangeSecond(ev) {
        var value = ev.target.value;
        ScoreboardController.SetPhaseTime(0, this.state.PhaseMinute, value);
    }

    /**
     * Triggered when the user sets the game clock time.
     */
    onSetGameTime() {
        ScoreboardController.SetGameTime(0, this.state.PhaseMinute, this.state.PhaseSecond);
    }

    /**
     * Triggered when the user copies the game clock time.
     * @param {MouseEvent} ev 
     */
    onCopyGameTime(ev) {
        this.setState(() => {
            return {
                PhaseMinute:ScoreboardController.getState().GameMinute,
                PhaseSecond:ScoreboardController.getState().GameSecond
            }
        });
    }

    /**
     * Renders the component
     */
    render() {
        return (
            <div className="phase-control">
                <Icon
                    src={IconFastForward}
                    title="Change Phase"
                    onClick={ScoreboardController.IncreasePhase}
                    onContextMenu={ScoreboardController.DecreasePhase}
                    />
                <input type="number" onChange={this.onChangeMinute} value={this.state.PhaseMinute} max={59} min={0}/>
                {":"},
                <input type="number" onChange={this.onChangeSecond} value={this.state.PhaseSecond} max={59} min={0}/>
                <Icon
                    src={IconCheck}
                    title="Set Game Time"
                    onClick={this.onSetGameTime}
                    onContextMenu={this.onCopyGameTime}
                />
            </div>
        )
    }
}

export default PhaseControl;