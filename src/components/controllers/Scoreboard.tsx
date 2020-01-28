import React from 'react';
import ScoreboardController from 'controllers/ScoreboardController';
import { Unsubscribe } from 'redux';
import Panel from 'components/Panel';
import ColorPicker from 'material-ui-color-picker';
import { IconButton, IconSave, IconNo } from 'components/Elements';

export default class Scoreboard extends React.PureComponent<{
    opened:boolean;
    onClose?:Function;
}, {
    JamCounter:number;
    TeamAID:number;
    TeamAName:string;
    TeamAScore:number;
    TeamATimeouts:number;
    TeamAChallenges:number;
    TeamAColor:string;
    TeamBID:number;
    TeamBName:string;
    TeamBScore:number;
    TeamBTimeouts:number;
    TeamBChallenges:number;
    TeamBColor:string;
    MaxChallenges:number;
    MaxTimeouts:number;
}> {
    readonly state = {
        JamCounter:ScoreboardController.GetState().JamCounter,
        TeamAID:ScoreboardController.GetState().TeamA.ID,
        TeamAName:ScoreboardController.GetState().TeamA.Name,
        TeamAScore:ScoreboardController.GetState().TeamA.Score,
        TeamATimeouts:ScoreboardController.GetState().TeamA.Timeouts,
        TeamAChallenges:ScoreboardController.GetState().TeamA.Challenges,
        TeamAColor:ScoreboardController.GetState().TeamA.Color,
        TeamBID:ScoreboardController.GetState().TeamB.ID,
        TeamBName:ScoreboardController.GetState().TeamB.Name,
        TeamBScore:ScoreboardController.GetState().TeamB.Score,
        TeamBTimeouts:ScoreboardController.GetState().TeamB.Timeouts,
        TeamBChallenges:ScoreboardController.GetState().TeamB.Challenges,
        TeamBColor:ScoreboardController.GetState().TeamB.Color,
        MaxTimeouts:ScoreboardController.GetState().MaxTimeouts,
        MaxChallenges:ScoreboardController.GetState().MaxChallenges
    }

    protected remoteScoreboard:Unsubscribe|null = null;

    protected JamCounterItem:React.RefObject<HTMLInputElement> = React.createRef();
    protected TeamAScoreItem:React.RefObject<HTMLInputElement> = React.createRef();
    protected TeamATimeoutItem:React.RefObject<HTMLInputElement> = React.createRef();
    protected TeamAChallengeItem:React.RefObject<HTMLInputElement> = React.createRef();
    protected TeamBScoreItem:React.RefObject<HTMLInputElement> = React.createRef();
    protected TeamBTimeoutItem:React.RefObject<HTMLInputElement> = React.createRef();
    protected TeamBChallengeItem:React.RefObject<HTMLInputElement> = React.createRef();

    constructor(props) {
        super(props);

        this.updateScoreboard = this.updateScoreboard.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onOpen = this.onOpen.bind(this);
        this.onChangeJamCounter = this.onChangeJamCounter.bind(this);

        this.onChangeTeamAName = this.onChangeTeamAName.bind(this);
        this.onChangeTeamAColor = this.onChangeTeamAColor.bind(this);
        this.onChangeTeamAScore = this.onChangeTeamAScore.bind(this);
        this.onChangeTeamATimeouts = this.onChangeTeamATimeouts.bind(this);
        this.onChangeTeamAChallenges = this.onChangeTeamAChallenges.bind(this);

        this.onChangeTeamBName = this.onChangeTeamBName.bind(this);
        this.onChangeTeamBColor = this.onChangeTeamBColor.bind(this);
        this.onChangeTeamBScore = this.onChangeTeamBScore.bind(this);
        this.onChangeTeamBTimeouts = this.onChangeTeamBTimeouts.bind(this);
        this.onChangeTeamBChallenges = this.onChangeTeamBChallenges.bind(this);
    }

    protected updateScoreboard() {
        let cstate = ScoreboardController.GetState();
        let changes:any = {
            MaxTimeouts:cstate.MaxTimeouts,
            MaxChallenges:cstate.MaxChallenges
        }

        if(this.state.TeamAID != cstate.TeamA.ID) {
            changes.TeamAName = cstate.TeamA.Name;
            changes.TeamAColor = cstate.TeamA.Color;
        }

        if(this.state.TeamBID != cstate.TeamB.ID) {
            changes.TeamBAName = cstate.TeamB.Name;
            changes.TeamBColor = cstate.TeamB.Color;
        }

        this.setState(changes);
    }

    protected onSubmit() {

        if(Number.isNaN(this.state.JamCounter)) {
            if(this.JamCounterItem && this.JamCounterItem.current) {
                this.setState({JamCounter:ScoreboardController.GetState().JamCounter});
                this.JamCounterItem.current.focus();
                return;
            }
        }

        //validate team A values
        if(Number.isNaN(this.state.TeamAScore)) {
            if(this.TeamAScoreItem && this.TeamAScoreItem.current) {
                this.setState({TeamAScore:ScoreboardController.GetState().TeamA.Score});
                this.TeamAScoreItem.current.focus();
                return;
            }
        }

        if(Number.isNaN(this.state.TeamATimeouts)) {
            if(this.TeamATimeoutItem && this.TeamATimeoutItem.current) {
                this.TeamATimeoutItem.current.focus();
                this.setState({TeamATimeouts:ScoreboardController.GetState().TeamA.Timeouts});
                return;
            }
        }

        if(Number.isNaN(this.state.TeamAChallenges)) {
            if(this.TeamAChallengeItem && this.TeamAChallengeItem.current) {
                this.TeamAChallengeItem.current.focus();
                this.setState({TeamAChallenges:ScoreboardController.GetState().TeamA.Challenges});
                return;
            }
        }

        //validate team B values
        if(Number.isNaN(this.state.TeamBScore)) {
            if(this.TeamBScoreItem && this.TeamBScoreItem.current) {
                this.setState({TeamBScore:ScoreboardController.GetState().TeamB.Score});
                this.TeamBScoreItem.current.focus();
                return;
            }
        }

        if(Number.isNaN(this.state.TeamBTimeouts)) {
            if(this.TeamBTimeoutItem && this.TeamBTimeoutItem.current) {
                this.TeamBTimeoutItem.current.focus();
                this.setState({TeamBTimeouts:ScoreboardController.GetState().TeamB.Timeouts});
                return;
            }
        }

        if(Number.isNaN(this.state.TeamBChallenges)) {
            if(this.TeamBChallengeItem && this.TeamBChallengeItem.current) {
                this.TeamBChallengeItem.current.focus();
                this.setState({TeamBChallenges:ScoreboardController.GetState().TeamB.Challenges});
                return;
            }
        }

        let colorA = this.state.TeamAColor;
        let colorB = this.state.TeamBColor;
        let nameA = this.state.TeamAName;
        let nameB = this.state.TeamBName;
        if(!nameA)
            nameA = ScoreboardController.GetState().TeamA.Name;
        if(!colorA)
            colorA = ScoreboardController.GetState().TeamA.Color;
        if(!nameB)
            nameB = ScoreboardController.GetState().TeamB.Name;
        if(!colorB)
            colorB = ScoreboardController.GetState().TeamB.Color;

        ScoreboardController.SetState({
            JamCounter:this.state.JamCounter,
            TeamA:{
                Name:nameA,
                Color:colorA,
                Score:this.state.TeamAScore,
                Timeouts:this.state.TeamATimeouts,
                Challenges:this.state.TeamAChallenges
            },
            TeamB:{
                Name:nameB,
                Color:colorB,
                Score:this.state.TeamBScore,
                Timeouts:this.state.TeamBTimeouts,
                Challenges:this.state.TeamBChallenges
            }
        });

        if(this.props.onClose)
            this.props.onClose();
    }

    protected onOpen() {
        let cstate = ScoreboardController.GetState();
        this.setState({
            JamCounter:cstate.JamCounter,

            TeamAID:cstate.TeamA.ID,
            TeamAName:cstate.TeamA.Name,
            TeamAColor:cstate.TeamA.Color,
            TeamAScore:cstate.TeamA.Score,
            TeamATimeouts:cstate.TeamA.Timeouts,
            TeamAChallenges:cstate.TeamA.Challenges,

            TeamBID:cstate.TeamB.ID,
            TeamBName:cstate.TeamB.Name,
            TeamBColor:cstate.TeamB.Color,
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

    protected onChangeTeamAName(ev: React.ChangeEvent<HTMLInputElement>) {
        let value = ev.currentTarget.value;
        this.setState({TeamAName:value});
    }

    protected onChangeTeamAColor(color:string) {
        this.setState({TeamAColor:color});
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

    protected onChangeTeamBName(ev: React.ChangeEvent<HTMLInputElement>) {
        let value = ev.currentTarget.value;
        this.setState({TeamBName:value});
    }

    protected onChangeTeamBColor(color:string) {
        this.setState({TeamBColor:color});
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
        this.remoteScoreboard = ScoreboardController.Subscribe(this.updateScoreboard);
    }

    componentWillUnmount() {
        if(this.remoteScoreboard !== null)
            this.remoteScoreboard();
    }

    render() {
        let cstate = ScoreboardController.GetState();
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
                            <td colSpan={2}>
                                <input type="number"
                                    value={this.state.JamCounter}
                                    onChange={this.onChangeJamCounter}
                                    min={0}
                                    max={999}
                                    ref={this.JamCounterItem}
                                    />
                            </td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>{ScoreboardController.GetState().TeamA.Name}</td>
                            <td>{ScoreboardController.GetState().TeamB.Name}</td>
                        </tr>
                        <tr>
                            <td>Name</td>
                            <td>
                                <input 
                                    type="text"
                                    size={20}
                                    value={this.state.TeamAName}
                                    maxLength={30}
                                    onChange={this.onChangeTeamAName}
                                    />
                            </td>
                            <td>
                                <input 
                                    type="text"
                                    size={20}
                                    value={this.state.TeamBName}
                                    maxLength={30}
                                    onChange={this.onChangeTeamBName}
                                    />
                            </td>
                        </tr>
                        <tr>
                            <td>Color</td>
                            <td>
                                <ColorPicker
                                    name='color'
                                    value={this.state.TeamAColor}
                                    size='10'
                                    onChange={this.onChangeTeamAColor}
                                    />
                            </td>
                            <td>
                                <ColorPicker
                                    name='color'
                                    value={this.state.TeamBColor}
                                    size='10'
                                    onChange={this.onChangeTeamBColor}
                                    />
                            </td>
                        </tr>
                        <tr>
                            <td>Score</td>
                            <td>
                                <input type="number"
                                    value={this.state.TeamAScore}
                                    onChange={this.onChangeTeamAScore}
                                    ref={this.TeamAScoreItem}
                                    />
                            </td>
                            <td>
                                <input type="number"
                                    value={this.state.TeamBScore}
                                    onChange={this.onChangeTeamBScore}
                                    ref={this.TeamBScoreItem}
                                    />
                            </td>
                        </tr>
                        <tr>
                            <td>Timeouts</td>
                            <td>
                                <input type="number"
                                    value={this.state.TeamATimeouts}
                                    onChange={this.onChangeTeamATimeouts}
                                    ref={this.TeamATimeoutItem}
                                    />
                            </td>
                            <td>
                                <input type="number"
                                    value={this.state.TeamBTimeouts}
                                    onChange={this.onChangeTeamBTimeouts}
                                    ref={this.TeamBTimeoutItem}
                                    />
                            </td>
                        </tr>
                        <tr>
                            <td>Challenges</td>
                            <td>
                                <input type="number"
                                    value={this.state.TeamAChallenges}
                                    onChange={this.onChangeTeamAChallenges}
                                    ref={this.TeamAChallengeItem}
                                    />
                            </td>
                            <td>
                                <input type="number"
                                    value={this.state.TeamBChallenges}
                                    onChange={this.onChangeTeamBChallenges}
                                    ref={this.TeamBChallengeItem}
                                    />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </Panel>
        );
    }
    
}