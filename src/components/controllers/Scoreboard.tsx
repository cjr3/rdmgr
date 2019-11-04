import React from 'react';
import ScoreboardController from 'controllers/ScoreboardController';
import { Unsubscribe } from 'redux';
import Panel from 'components/Panel';
import { IconButton, IconSave, IconNo } from 'components/Elements';

export default class Scoreboard extends React.PureComponent<{
    opened:boolean;
    onClose?:Function;
}, {
    JamCounter:number;
    TeamAName:string;
    TeamAScore:number;
    TeamATimeouts:number;
    TeamAChallenges:number;
    TeamBName:string;
    TeamBScore:number;
    TeamBTimeouts:number;
    TeamBChallenges:number;
    MaxChallenges:number;
    MaxTimeouts:number;
}> {
    readonly state = {
        JamCounter:ScoreboardController.getState().JamCounter,
        TeamAName:ScoreboardController.getState().TeamA.Name,
        TeamAScore:ScoreboardController.getState().TeamA.Score,
        TeamATimeouts:ScoreboardController.getState().TeamA.Timeouts,
        TeamAChallenges:ScoreboardController.getState().TeamA.Challenges,
        TeamBName:ScoreboardController.getState().TeamB.Name,
        TeamBScore:ScoreboardController.getState().TeamB.Score,
        TeamBTimeouts:ScoreboardController.getState().TeamB.Timeouts,
        TeamBChallenges:ScoreboardController.getState().TeamB.Challenges,
        MaxTimeouts:ScoreboardController.getState().MaxTimeouts,
        MaxChallenges:ScoreboardController.getState().MaxChallenges
    }

    protected remoteScoreboard:Unsubscribe|null = null;

    constructor(props) {
        super(props);

        this.updateScoreboard = this.updateScoreboard.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onOpen = this.onOpen.bind(this);
        this.onChangeJamCounter = this.onChangeJamCounter.bind(this);
        this.onChangeTeamAScore = this.onChangeTeamAScore.bind(this);
        this.onChangeTeamATimeouts = this.onChangeTeamATimeouts.bind(this);
        this.onChangeTeamAChallenges = this.onChangeTeamAChallenges.bind(this);
        this.onChangeTeamBScore = this.onChangeTeamBScore.bind(this);
        this.onChangeTeamBTimeouts = this.onChangeTeamBTimeouts.bind(this);
        this.onChangeTeamBChallenges = this.onChangeTeamBChallenges.bind(this);
    }

    protected updateScoreboard() {
        let cstate = ScoreboardController.getState();
        this.setState({
            MaxTimeouts:cstate.MaxTimeouts,
            MaxChallenges:cstate.MaxChallenges,
            TeamAName:cstate.TeamA.Name,
            TeamBName:cstate.TeamB.Name
        });
    }

    protected onSubmit() {
        ScoreboardController.SetState({
            JamCounter:this.state.JamCounter,
            TeamA:{
                Score:this.state.TeamAScore,
                Timeouts:this.state.TeamATimeouts,
                Challenges:this.state.TeamAChallenges
            },
            TeamB:{
                Score:this.state.TeamBScore,
                Timeouts:this.state.TeamBTimeouts,
                Challenges:this.state.TeamBChallenges
            }
        });

        if(this.props.onClose)
            this.props.onClose();
    }

    protected onOpen() {
        let cstate = ScoreboardController.getState();
        this.setState({
            JamCounter:cstate.JamCounter,
            TeamAScore:cstate.TeamA.Score,
            TeamATimeouts:cstate.TeamA.Timeouts,
            TeamAChallenges:cstate.TeamA.Challenges,
            TeamBScore:cstate.TeamB.Score,
            TeamBTimeouts:cstate.TeamB.Timeouts,
            TeamBChallenges:cstate.TeamB.Challenges,
            MaxTimeouts:cstate.MaxTimeouts,
            MaxChallenges:cstate.MaxChallenges
        });
    }

    protected onChangeJamCounter(ev: React.ChangeEvent<HTMLInputElement>) {
        let value:number = Math.min(999, Math.max(0, parseInt(ev.currentTarget.value)));
        this.setState({JamCounter:value});
    }

    protected onChangeTeamAScore(ev: React.ChangeEvent<HTMLInputElement>) {
        let value:number = Math.min(999, Math.max(0, parseInt(ev.currentTarget.value)));
        this.setState({TeamAScore:value});
    }

    protected onChangeTeamBScore(ev: React.ChangeEvent<HTMLInputElement>) {
        let value:number = Math.min(999, Math.max(0, parseInt(ev.currentTarget.value)));
        this.setState({TeamBScore:value});
    }

    protected onChangeTeamATimeouts(ev: React.ChangeEvent<HTMLInputElement>) {
        let value:number = Math.min(this.state.MaxTimeouts, Math.max(0, parseInt(ev.currentTarget.value)));
        this.setState({TeamATimeouts:value});
    }

    protected onChangeTeamBTimeouts(ev: React.ChangeEvent<HTMLInputElement>) {
        let value:number = Math.min(this.state.MaxTimeouts, Math.max(0, parseInt(ev.currentTarget.value)));
        this.setState({TeamBTimeouts:value});
    }

    protected onChangeTeamAChallenges(ev: React.ChangeEvent<HTMLInputElement>) {
        let value:number = Math.min(this.state.MaxChallenges, Math.max(0, parseInt(ev.currentTarget.value)));
        this.setState({TeamAChallenges:value});
    }

    protected onChangeTeamBChallenges(ev: React.ChangeEvent<HTMLInputElement>) {
        let value:number = Math.min(this.state.MaxChallenges, Math.max(0, parseInt(ev.currentTarget.value)));
        this.setState({TeamBChallenges:value});
    }

    componentDidMount() {
        this.remoteScoreboard = ScoreboardController.subscribe(this.updateScoreboard);
    }

    componentWillUnmount() {
        if(this.remoteScoreboard !== null)
            this.remoteScoreboard();
    }

    render() {
        let cstate = ScoreboardController.getState();
        let changed:boolean = false;
        if(this.state.JamCounter != cstate.JamCounter
            || this.state.TeamAScore != cstate.TeamA.Score
            || this.state.TeamBScore != cstate.TeamB.Score
            || this.state.TeamATimeouts != cstate.TeamA.Timeouts
            || this.state.TeamBTimeouts != cstate.TeamB.Timeouts
            || this.state.TeamAChallenges != cstate.TeamA.Challenges
            || this.state.TeamBChallenges != cstate.TeamB.Challenges
            ) {
            changed = true;
        }

        let buttons:Array<React.ReactElement> = [
            <IconButton
                key="btn-save"
                src={IconSave}
                active={changed}
                onClick={this.onSubmit}
            >Save</IconButton>,
            <IconButton
                key="btn-cancel"
                src={IconNo}
                onClick={this.props.onClose}
            >Cancel</IconButton>
        ];

        return (
            <Panel
                opened={this.props.opened}
                onOpen={this.onOpen}
                onClose={this.props.onClose}
                buttons={buttons}
                //popup={true}
            >
                <table cellPadding={5}>
                    <tbody>
                        <tr>
                            <td>Jam #</td>
                            <td>
                                <input type="number"
                                    value={this.state.JamCounter}
                                    onChange={this.onChangeJamCounter}
                                    min={0}
                                    max={999}
                                    />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table cellPadding={5}>
                    <tbody>
                        <tr>
                            <td></td>
                            <td>{this.state.TeamAName}</td>
                            <td>{this.state.TeamBName}</td>
                        </tr>
                        <tr>
                            <td>Score</td>
                            <td>
                                <input type="number"
                                    value={this.state.TeamAScore}
                                    onChange={this.onChangeTeamAScore}
                                    />
                            </td>
                            <td>
                                <input type="number"
                                    value={this.state.TeamBScore}
                                    onChange={this.onChangeTeamBScore}
                                    />
                            </td>
                        </tr>
                        <tr>
                            <td>Timeouts</td>
                            <td>
                                <input type="number"
                                    value={this.state.TeamATimeouts}
                                    onChange={this.onChangeTeamATimeouts}
                                    />
                            </td>
                            <td>
                                <input type="number"
                                    value={this.state.TeamBTimeouts}
                                    onChange={this.onChangeTeamBTimeouts}
                                    />
                            </td>
                        </tr>
                        <tr>
                            <td>Challenges</td>
                            <td>
                                <input type="number"
                                    value={this.state.TeamAChallenges}
                                    onChange={this.onChangeTeamAChallenges}
                                    />
                            </td>
                            <td>
                                <input type="number"
                                    value={this.state.TeamBChallenges}
                                    onChange={this.onChangeTeamBChallenges}
                                    />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </Panel>
        );
    }
    
}