import React from 'react';
import {Icon} from 'components/Elements'
import ScoreboardController from 'controllers/ScoreboardController'
import DataController from 'controllers/DataController'

class PhaseControl extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            PhaseIndex:(this.props.index) ? this.props.index : 0,
            PhaseMinute:(this.props.minute) ? this.props.minute : 15,
            PhaseSecond:(this.props.second) ? this.props.second : 0,
            Phases:DataController.getState().Phases
        }

        //bindings
        this.onChangeMinute = this.onChangeMinute.bind(this);
        this.onChangeSecond = this.onChangeSecond.bind(this);
        this.onSetGameTime = this.onSetGameTime.bind(this);
        this.onCopyGameTime = this.onCopyGameTime.bind(this);
        this.updateState = this.updateState.bind(this);
        this.remote = ScoreboardController.subscribe(this.updateState);
        this.dataRemote = DataController.subscribe(this.updateState);
    }

    updateState() {
        this.setState(() => {
            return {
                PhaseIndex:ScoreboardController.getState().PhaseIndex,
                PhaseMinute:ScoreboardController.getState().PhaseMinute,
                PhaseSecond:ScoreboardController.getState().PhaseSecond,
                Phases:DataController.getState().Phases
            };
        });
    }

    /**
     * Triggered when the user changes the phase minute.
     * @param {KeyEvent} ev 
     */
    onChangeMinute(ev) {
        var value = ev.target.value;
        this.setState(() => {
            return {PhaseMinute:value};
        }, () => {
            ScoreboardController.SetPhaseTime(0, this.state.PhaseMinute, this.state.PhaseSecond);
        });
    }

    /**
     * Triggered when the user changes the phase second.
     * @param {KeyEvent} ev 
     */
    onChangeSecond(ev) {
        var value = ev.target.value;
        this.setState(() => {
            return {PhaseSecond:value};
        }, () => {
            ScoreboardController.SetPhaseTime(0, this.state.PhaseMinute, this.state.PhaseSecond);
        });
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
                    src={require('images/icons/fastforward.png')}
                    title="Change Phase"
                    onClick={ScoreboardController.IncreasePhase}
                    onContextMenu={ScoreboardController.DecreasePhase}
                    />
                <input type="number" onChange={this.onChangeMinute} value={this.state.PhaseMinute} max={59} min={0}/>
                {":"},
                <input type="number" onChange={this.onChangeSecond} value={this.state.PhaseSecond} max={59} min={0}/>
                <Icon
                    src={require('images/icons/check.png')}
                    title="Set Game Time"
                    onClick={this.onSetGameTime}
                    onContextMenu={this.onCopyGameTime}
                />
            </div>
        )
    }
}

export default PhaseControl;