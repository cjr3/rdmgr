import React from 'react';
import ScoreboardController from 'controllers/ScoreboardController';
import CaptureController from 'controllers/CaptureController';
import CaptureControlPanel, {PCaptureControlPanel} from './CaptureControlPanel';
import DataController from 'controllers/DataController';

import {
    IconX,
    IconCheck,
    IconButton
} from 'components/Elements';

interface SCaptureControlScorebanner {
    /**
     * Left side socreboard team
     */
    TeamA:any,
    /**
     * Right side scoreboard team
     */
    TeamB:any,
    /**
     * Current phase index
     */
    PhaseIndex:number,
    /**
     * Jam #
     */
    JamCounter:number,
    /**
     * Phases / quarters to select from
     */
    Phases:Array<any>,
    /**
     * Determines if the scorebanner is shown or note
     */
    Shown:boolean,
    /**
     * Determines if the clocks (jam and game) are displayed on the screen
     */
    ClocksShown:boolean
}

/**
 * Component for configuring the score banner.
 */
class CaptureControlScorebanner extends React.PureComponent<PCaptureControlPanel, SCaptureControlScorebanner> {

    readonly state:SCaptureControlScorebanner = {
        TeamA:ScoreboardController.getState().TeamA,
        TeamB:ScoreboardController.getState().TeamB,
        JamCounter:ScoreboardController.getState().JamCounter,
        PhaseIndex:ScoreboardController.getState().PhaseIndex,
        Phases:DataController.getPhases(),
        Shown:CaptureController.getState().Scorebanner.Shown,
        ClocksShown:CaptureController.getState().Scorebanner.ClocksShown
    }

    remoteState:Function
    remoteCapture:Function
    remoteData:Function

    constructor(props) {
        super(props);

        this.updateState = this.updateState.bind(this);
        this.updateCapture = this.updateCapture.bind(this);
        this.updateData = this.updateData.bind(this);

        this.remoteState = ScoreboardController.subscribe(this.updateState);
        this.remoteCapture = CaptureController.subscribe(this.updateCapture);
        this.remoteData = DataController.subscribe(this.updateData);
    }

    /**
     * Updates the state to match the scoreboard controller.
     */
    updateState() {
        this.setState(() => {
            return {
                TeamA:ScoreboardController.getState().TeamA,
                TeamB:ScoreboardController.getState().TeamB
            }
        });
    }

    /**
     * Updates the state to match the capture controller.
     */
    updateCapture() {
        this.setState(() => {
            return {Shown:CaptureController.getState().Scorebanner.Shown}
        });
    }

    /**
     * Updates the state to match the data controller.
     * - Update Phases.
     */
    updateData() {
        this.setState(() => {
            return {Phases:DataController.getPhases()}
        });
    }

    /**
     * Renders the component.
     */
    render() {
        var phases:Array<React.ReactElement> = [];
        this.state.Phases.forEach((phase, index) => {
            phases.push(
                <option
                    key={`${phase.RecordType}-${phase.RecordID}`}
                    value={index}
                    >{phase.Name}</option>
            );
        });

        return (
            <CaptureControlPanel
                active={this.props.active}
                name={this.props.name}
                icon={this.props.icon}
                toggle={this.props.toggle}
                shown={this.state.Shown}
                onClick={this.props.onClick}>
                    <div className="stack-panel s2">
                        <div 
                            className="team-score"
                            style={{
                                backgroundColor:this.state.TeamA.Color
                            }}
                            onClick={() => {
                                ScoreboardController.IncreaseTeamScore(this.state.TeamA, 1);
                            }}
                            onContextMenu={() => {
                                ScoreboardController.DecreaseTeamScore(this.state.TeamA, 1);
                            }}
                            >
                            {this.state.TeamA.Score}
                        </div>
                        <div 
                            className="team-score"
                            style={{
                                backgroundColor:this.state.TeamB.Color
                            }}
                            onClick={() => {
                                ScoreboardController.IncreaseTeamScore(this.state.TeamB, 1);
                            }}
                            onContextMenu={() => {
                                ScoreboardController.DecreaseTeamScore(this.state.TeamB, 1);
                            }}
                            >
                            {this.state.TeamB.Score}
                        </div>
                    </div>
                    <div className="record-list">
                        <IconButton
                            src={(this.state.ClocksShown === false) ? IconCheck : IconX}
                            active={(this.state.ClocksShown === false)}
                            onClick={CaptureController.ToggleScorebannerClocks}
                        >Hide Clocks</IconButton>
                    </div>
                    <div className="stack-panel s2">
                        <div>Quarter:</div>
                        <div>
                            <select size={1}
                                value={this.state.PhaseIndex}
                                onChange={(ev) => {
                                    ScoreboardController.SetPhase(parseInt(ev.target.value))
                                }}
                                >{phases}</select>
                        </div>
                        <div>JAM #</div>
                        <div
                            className="team-score"
                            onClick={() => {
                                ScoreboardController.IncreaseJamCounter(1);
                            }}
                            onContextMenu={() => {
                                ScoreboardController.DecreaseJamCounter(1);
                            }}
                        >{this.state.JamCounter}</div>
                    </div>
                </CaptureControlPanel>
        )
    }
}

export default CaptureControlScorebanner;