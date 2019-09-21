import React from 'react';
import ScoreboardController, {SScoreboardTeam} from 'controllers/ScoreboardController';
import CaptureController from 'controllers/CaptureController';
import CaptureControlPanel, {PCaptureControlPanel} from './CaptureControlPanel';
import DataController from 'controllers/DataController';

import {
    IconX,
    IconCheck,
    IconButton
} from 'components/Elements';
import { PhaseRecord } from 'tools/vars';
import Counter from 'components/tools/Counter';

interface SCaptureControlScorebanner {
    /**
     * Left side socreboard team
     */
    TeamA:SScoreboardTeam,
    /**
     * Right side scoreboard team
     */
    TeamB:SScoreboardTeam,
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
    Phases:Array<PhaseRecord>,
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

    /**
     * Reference to jam Counter element
     */
    protected JamCounterItem:React.RefObject<Counter> = React.createRef();

    /**
     * Listener for scoreboard controller
     */
    protected remoteState:Function

    /**
     * Listener for capture controller
     */
    protected remoteCapture:Function

    /**
     * Listener for data controller
     */
    protected remoteData:Function

    /**
     * 
     * @param props PCaptureControlPanel
     */
    constructor(props:PCaptureControlPanel) {
        super(props);

        this.updateState = this.updateState.bind(this);
        this.updateCapture = this.updateCapture.bind(this);
        this.updateData = this.updateData.bind(this);

        this.onAddJam = this.onAddJam.bind(this);
        this.onSubtractJam = this.onSubtractJam.bind(this);
        this.onChangePhase = this.onChangePhase.bind(this);
        this.onClickIncreaseTeamAScore = this.onClickIncreaseTeamAScore.bind(this);
        this.onClickDecreaseTeamAScore = this.onClickDecreaseTeamAScore.bind(this);
        this.onClickIncreaseTeamBScore = this.onClickIncreaseTeamBScore.bind(this);
        this.onClickDecreaseTeamBScore = this.onClickDecreaseTeamBScore.bind(this);

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
                TeamB:ScoreboardController.getState().TeamB,
                JamCounter:ScoreboardController.getState().JamCounter,
                PhaseIndex:ScoreboardController.getState().PhaseIndex
            }
        });
    }

    /**
     * Updates the state to match the capture controller.
     */
    updateCapture() {
        this.setState(() => {
            return {
                Shown:CaptureController.getState().Scorebanner.Shown,
                ClocksShown:CaptureController.getState().Scorebanner.ClocksShown
            }
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
     * Triggered when the user increase the jam counter
     * @param amount number
     */
    onAddJam(amount) {
        ScoreboardController.IncreaseJamCounter(amount);
    }

    /**
     * Triggered when the user decreases the jam counter
     * @param amount number
     */
    onSubtractJam(amount) {
        ScoreboardController.DecreaseJamCounter(amount);
    }

    /**
     * Triggered when the user changes the phase
     * @param ev React.ChangeEvent<HTMLSelectElement>
     */
    onChangePhase(ev:React.ChangeEvent<HTMLSelectElement>) {
        ScoreboardController.SetPhase(parseInt(ev.currentTarget.value));
    }

    /**
     * Triggered when the user clicks on the right side team's score
     */
    onClickIncreaseTeamAScore() {
        ScoreboardController.IncreaseTeamScore(this.state.TeamA, 1);
    }

    /**
     * Triggered when the user context-clicks on the left-side team's score
     */
    onClickDecreaseTeamAScore() {
        ScoreboardController.DecreaseTeamScore(this.state.TeamA, 1);
    }

    /**
     * Triggered when the user clicks on the left side team's score
     */
    onClickIncreaseTeamBScore() {
        ScoreboardController.IncreaseTeamScore(this.state.TeamB, 1);
    }

    /**
     * Triggered when the user context-clicks on the right-side team's score
     */
    onClickDecreaseTeamBScore() {
        ScoreboardController.DecreaseTeamScore(this.state.TeamB, 1);
    }

    /**
     * Triggered when the component updates
     * @param prevProps PCaptureControlPanel
     * @param prevState SCaptureControlScorebanner
     */
    componentDidUpdate(prevProps:PCaptureControlPanel, prevState:SCaptureControlScorebanner) {
        if(prevState.JamCounter != this.state.JamCounter) {
            if(this.JamCounterItem !== null && this.JamCounterItem.current !== null) {
                this.JamCounterItem.current.set(this.state.JamCounter, false);
            }
        }
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
                            onClick={this.onClickIncreaseTeamAScore}
                            onContextMenu={this.onClickDecreaseTeamAScore}
                            >
                            {this.state.TeamA.Score}
                        </div>
                        <div 
                            className="team-score"
                            style={{
                                backgroundColor:this.state.TeamB.Color
                            }}
                            onClick={this.onClickIncreaseTeamBScore}
                            onContextMenu={this.onClickDecreaseTeamBScore}
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
                    <div className="phase-selection">
                        <select size={1}
                            value={this.state.PhaseIndex}
                            onChange={this.onChangePhase}
                            >{phases}</select>
                    </div>
                    <div className="stack-panel s2">
                        <div className="jam-counter">JAM #</div>
                        <div className="jam-counter">
                            <Counter
                                min={0}
                                max={99}
                                padding={2}
                                onAdd={this.onAddJam}
                                onSubtract={this.onSubtractJam}
                                ref={this.JamCounterItem}
                            />
                        </div>
                    </div>
                </CaptureControlPanel>
        )
    }
}

export default CaptureControlScorebanner;