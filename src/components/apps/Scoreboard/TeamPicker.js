import React from 'react';
import TeamSelection from 'components/tools/TeamSelection';
import ScoreboardController from 'controllers/ScoreboardController';
import DataController from 'controllers/DataController';
import Panel from 'components/Panel';
import { Button, ToggleButton } from 'components/Elements';

/**
 * Component for the scoreboard to pick the teams.
 */
class TeamPicker extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            resetChecked:false,
            TeamAID:ScoreboardController.getState().TeamA.ID,
            TeamBID:ScoreboardController.getState().TeamB.ID,
            Teams:[]
        };

        this.updateData = this.updateData.bind(this);
        this.remoteData = DataController.subscribe(this.updateData);

        //bindings
        this.onChangeA = this.onChangeA.bind(this);
        this.onChangeB = this.onChangeB.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    /**
     * Updates the state to match the data controller.
     * - Update teams
     */
    updateData() {
        let teams = DataController.getTeams(true);
        if(!DataController.compare(teams, this.state.Teams)) {
            this.setState(() => {
                return {Teams:teams.slice()}
            });
        }
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
            this.state.resetChecked
        );
        this.setState(() => {
            return {resetChecked:false};
        });
        if(this.props.onSubmit)
            this.props.onSubmit();
    }

    /**
     * Renders the component.
     */
    render() {
        var buttons = [
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
                popup={true}
                buttons={buttons}
                {...this.props}
                contentName="team-selector"
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

export default TeamPicker;