import React from 'react';
import TeamSelection from 'components/tools/TeamSelection';
import ScoreboardController from 'controllers/ScoreboardController';
import DataController from 'controllers/DataController';
import Panel from 'components/Panel';
import { Button, ToggleButton } from 'components/Elements';

/**
 * Component for the scoreboard to pick the teams.
 */
export default class TeamPicker extends React.PureComponent<{
    /**
     * true to show, false to hide
     */
    opened:boolean;
    /**
     * Triggered when the user clicks the submit button
     */
    onSubmit:Function;
    /**
     * 
     */
    onClose:Function;
}, {
    /**
     * true to reset the board
     */
    resetChecked:boolean;
    /**
     * true to reset the roster
     */
    resetRosterChecked:boolean;
    /**
     * Selected team ID for the left-side
     */
    TeamAID:number;
    /**
     * Selected team ID for the right-side
     */
    TeamBID:number;
}> {
    readonly state = {
        resetChecked:false,
        resetRosterChecked:false,
        TeamAID:ScoreboardController.getState().TeamA.ID,
        TeamBID:ScoreboardController.getState().TeamB.ID
    }

    constructor(props) {
        super(props);
        this.onChangeA = this.onChangeA.bind(this);
        this.onChangeB = this.onChangeB.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    /**
     * Triggered when the user changes the left-side team.
     * @param {Number} team 
     */
    onChangeA(team) {
        this.setState(() => {
            return {TeamAID:team.RecordID};
        });
    }

    /**
     * Triggered when the user changes the right-side team.
     * @param {Number} team 
     */
    onChangeB(team) {
        this.setState(() => {
            return {TeamBID:team.RecordID};
        });
    }

    /**
     * Triggered when the user clicks the submit button.
     */
    onSubmit() {
        ScoreboardController.SetTeams(
            DataController.getTeam(this.state.TeamAID),
            DataController.getTeam(this.state.TeamBID),
            this.state.resetChecked, 
            this.state.resetRosterChecked
        );
        this.setState(() => {
            return {resetChecked:false, resetRosterChecked:false};
        });
        if(this.props.onSubmit)
            this.props.onSubmit();
    }

    /**
     * Renders the component.
     */
    render() {
        let buttons:Array<React.ReactElement> = [
            <ToggleButton 
                key="btn-roster" 
                label="Reset Roster"
                checked={this.state.resetRosterChecked}
                onClick={() => {
                    this.setState({resetRosterChecked:!this.state.resetRosterChecked});
                }}
                />,
            <ToggleButton 
                key="btn-reset" 
                label="Reset Board"
                checked={this.state.resetChecked}
                onClick={() => {
                    this.setState({resetChecked:!this.state.resetChecked});
                }}
                />,
            <Button key="btn-submit" onClick={this.onSubmit}>Submit</Button>,
            <Button key="btn-cancel" onClick={this.props.onClose}>Cancel</Button>
        ];

        return (
            <Panel 
                opened={this.props.opened}
                title="Team Selection" 
                contentName="team-selector"
                className="team-panel"
                popup={true}
                buttons={buttons}
                {...this.props}
                >
                <TeamSelection 
                    onChange={this.onChangeA} 
                    teamid={this.state.TeamAID}/>
                <TeamSelection 
                    onChange={this.onChangeB} 
                    teamid={this.state.TeamBID}/>
            </Panel>
        )
    }
}