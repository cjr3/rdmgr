import React, { CSSProperties } from 'react';
import RosterController, {SRosterTeam, Sides} from 'controllers/RosterController';
import ScoreboardController from 'controllers/ScoreboardController';
import {IconButton, Icon, IconX, IconLoop, IconNo} from 'components/Elements';
import Panel from 'components/Panel';
import SortPanel from 'components/tools/SortPanel';
import RosterSkaterList from './RosterSkaterList';
import cnames from 'classnames';
import keycodes from 'tools/keycodes';
import { SkaterRecord, SkaterTeamRecord } from 'tools/vars';
import './css/Roster.scss';
import UIController from 'controllers/UIController';
import { Unsubscribe } from 'redux';
import SkatersController from 'controllers/SkatersController';
import { AddMediaPath } from 'controllers/functions';

/**
 * Component for building the roster of skaters and coaches on the track
 */
export default class Roster extends React.PureComponent<any, {
    TeamA:SRosterTeam;
    TeamB:SRosterTeam;
    Skaters:Array<SkaterRecord>;
    ScoreboardTeamA:{
        ID:number;
        Color:string;
        Name:string;
    },
    ScoreboardTeamB:{
        ID:number;
        Color:string;
        Name:string;
    },
    Keywords:string;
    VisibleSkaters:Array<SkaterRecord>;
    opened:boolean;
}> {
    readonly state = {
        TeamA:RosterController.GetState().TeamA,
        TeamB:RosterController.GetState().TeamB,
        Skaters:SkatersController.Get(),
        ScoreboardTeamA:{
            ID:ScoreboardController.GetState().TeamA.ID,
            Color:ScoreboardController.GetState().TeamA.Color,
            Name:ScoreboardController.GetState().TeamA.Name
        },
        ScoreboardTeamB:{
            ID:ScoreboardController.GetState().TeamB.ID,
            Color:ScoreboardController.GetState().TeamB.Color,
            Name:ScoreboardController.GetState().TeamB.Name
        },
        Keywords:'',
        VisibleSkaters:[],
        opened:UIController.GetState().Roster.Shown
    }

    /**
     * RosterController listener
     */
    protected remoteState:Function|null = null;
    /**
     * DataController listener
     */
    protected remoteData:Function|null = null;
    /**
     * ScoreboardController listener
     */
    protected remoteScore:Function|null = null;

    protected remoteUI:Unsubscribe|null = null;

    /**
     * Constructor
     * @param props 
     */
    constructor(props) {
        super(props);
        this.clearSkaters = this.clearSkaters.bind(this);
        this.loadSkaters = this.loadSkaters.bind(this);
        this.onChangeKeywords = this.onChangeKeywords.bind(this);
        this.onKeyUpKeywords = this.onKeyUpKeywords.bind(this);
        this.updateState = this.updateState.bind(this);
        this.updateData = this.updateData.bind(this);
        this.updateScore = this.updateScore.bind(this);
        this.updateUI = this.updateUI.bind(this);
    }

    protected async updateUI() {
        this.setState({
            opened:UIController.GetState().Roster.Shown
        });
    }

    /**
     * Updates the state to match the controller.
     */
    protected updateState() {
        this.setState({
            TeamA:RosterController.GetState().TeamA,
            TeamB:RosterController.GetState().TeamB
        });
    }

    /**
     * Updates the state to refresh the skaters.
     */
    protected updateData() {
        this.setState({Skaters:SkatersController.Get()});
    }

    /**
     * Updates the state to refresh the scoreboard info.
     */
    protected updateScore() {
        var sstate = ScoreboardController.GetState();
        this.setState(() => {
            return {
                ScoreboardTeamA:{
                    ID:sstate.TeamA.ID,
                    Color:sstate.TeamA.Color,
                    Name:sstate.TeamA.Name
                },
                ScoreboardTeamB:{
                    ID:sstate.TeamB.ID,
                    Color:sstate.TeamB.Color,
                    Name:sstate.TeamB.Name
                }
            }
        });
    }

    /**
     * Clears the skaters.
     */
    protected clearSkaters() {
        RosterController.SetSkaters('A', []);
        RosterController.SetSkaters('B', []);
    }

    /**
     * Loads skaters based on their assigned team, and ordered by name.
     */
    protected loadSkaters() {
        RosterController.LoadSkaters();
    }

    /**
     * Triggered when the value of the keywords text input changes.
     * @param {Event} ev 
     */
    protected onChangeKeywords(ev) {
        var value = ev.target.value;
        this.setState(() => {
            return {Keywords:value}
        });
    }

    /**
     * Triggered when the user presses a key in the keywords field.
     * @param {KeyEvent} ev 
     */
    protected onKeyUpKeywords(ev) {
        switch(ev.keyCode) {
            case keycodes.ESCAPE :
                this.setState({Keywords:''});
            break;
            case keycodes.ENTER :
                if(this.state.VisibleSkaters.length === 1) {
                    if(ev.ctrlKey) {
                        RosterController.AddSkater('A', this.state.VisibleSkaters[0])
                    } else if(ev.shiftKey) {
                        RosterController.AddSkater('B', this.state.VisibleSkaters[0])
                    }
                }
            break;

            default :

            break;
        }
    }

    /**
     * Start listeners
     */
    componentDidMount() {
        this.remoteState = RosterController.Subscribe(this.updateState);
        this.remoteData = SkatersController.Subscribe(this.updateData);
        this.remoteScore = ScoreboardController.Subscribe(this.updateScore);
        this.remoteUI = UIController.Subscribe(this.updateUI);
    }

    /**
     * Close listeners
     */
    componentWillUnmount() {
        if(this.remoteState !== null)
            this.remoteState();
        if(this.remoteData !== null)
            this.remoteData();
        if(this.remoteScore !== null)
            this.remoteScore();
        if(this.remoteUI !== null)
            this.remoteUI();
    }

    /**
     * Renders the component.
     * - Left: Left side team, with name, color, and list of skaters.
     * - Center: Right side team, with name, color, and list of skaters.
     * - Right: List of all available skaters.
     * 
     * Buttons:
     * - Clear: Remove all skaters from both teams.
     * - Load Skaters: Set skaters based on scoreboard teams.
     * - Close: To close the panel.
     */
    render() {
        let buttons:Array<React.ReactElement> = [
            <IconButton
                src={IconLoop}
                onClick={this.loadSkaters}
                key="btn-reset"
                title="Reset from skater records"
                >Reset</IconButton>,
            <IconButton
                src={IconNo}
                onClick={this.clearSkaters}
                key="btn-clear"
                >Clear</IconButton>
        ];

        return (
            <Panel
                opened={this.state.opened}
                contentName="ROS-app"
                buttons={buttons}
                >
                <RosterTeam side='A'/>
                <RosterTeam side='B'/>
                <RosterSkaterList/>
            </Panel>
        )
    }
}

class RosterTeam extends React.PureComponent<{
    side:Sides;
}, {
    Name:string;
    Color:string;
    RecordID:number;
    Skaters:Array<SkaterRecord>;
}> {
    readonly state = {
        Name:'Team',
        Color:'#000000',
        RecordID:0,
        Skaters:[],
    }

    protected remoteScoreboard?:Unsubscribe;
    protected remoteRoster?:Unsubscribe;

    constructor(props) {
        super(props);
        this.updateScoreboard = this.updateScoreboard.bind(this);
        this.updateRoster = this.updateRoster.bind(this);

        if(this.props.side == 'A') {
            this.state.Name = ScoreboardController.GetState().TeamA.Name;
            this.state.Color = ScoreboardController.GetState().TeamA.Color;
            this.state.RecordID = ScoreboardController.GetState().TeamA.ID;
            this.state.Skaters = RosterController.GetState().TeamA.Skaters;
        } else {
            this.state.Name = ScoreboardController.GetState().TeamB.Name;
            this.state.Color = ScoreboardController.GetState().TeamB.Color;
            this.state.RecordID = ScoreboardController.GetState().TeamB.ID;
            this.state.Skaters = RosterController.GetState().TeamB.Skaters;
        }
    }

    protected updateScoreboard() {
        if(this.props.side === 'A') {
            this.setState({
                Name:ScoreboardController.GetState().TeamA.Name,
                Color:ScoreboardController.GetState().TeamA.Color,
                RecordID:ScoreboardController.GetState().TeamA.ID
            });
        } else {
            this.setState({
                Name:ScoreboardController.GetState().TeamB.Name,
                Color:ScoreboardController.GetState().TeamB.Color,
                RecordID:ScoreboardController.GetState().TeamB.ID
            });
        }
    }

    protected updateRoster() {
        if(this.props.side == 'A') {
            this.setState({
                Skaters:RosterController.GetState().TeamA.Skaters
            });
        } else {
            this.setState({
                Skaters:RosterController.GetState().TeamB.Skaters
            });
        }
    }

    componentDidMount() {
        this.remoteScoreboard = ScoreboardController.Subscribe(this.updateScoreboard);
        this.remoteRoster = RosterController.Subscribe(this.updateRoster);
    }

    componentWillUnmount() {
        if(this.remoteScoreboard)
            this.remoteScoreboard();
        if(this.remoteRoster)
            this.remoteRoster();
    }

    render() {
        let className:string = cnames('team', 'team-' + this.props.side);
        let style:CSSProperties = {
            backgroundColor:this.state.Color
        };
        return (
            <div className={className}>
                <div className="name" style={style}>
                    {this.state.Name}
                </div>
                <SkaterList 
                    side={this.props.side}
                    teamid={this.state.RecordID}
                    skaters={this.state.Skaters}
                    />
                <TeamRole
                    side={this.props.side}
                    skaters={this.state.Skaters}
                />
            </div>
        )
    }
}

class TeamRole extends React.PureComponent<{
    skaters:Array<SkaterRecord>;
    side:Sides;
}, {
    Coach:number;
    Penalty:number;
    Captain:number;
    CoCaptain:number;
    CurrentRole:string;
}> {
    readonly state = {
        Coach:0,
        Penalty:0,
        Captain:0,
        CoCaptain:0,
        CurrentRole:'Coach'
    }

    protected remoteRoster?:Unsubscribe;

    constructor(props) {
        super(props);
        this.updateRoster = this.updateRoster.bind(this);
        this.onChangeRole = this.onChangeRole.bind(this);
        this.onChangeRoleSkater = this.onChangeRoleSkater.bind(this);

        if(this.props.side == 'A') {
            this.state.Coach = RosterController.GetState().TeamA.Roles.Coach;
            this.state.Penalty = RosterController.GetState().TeamA.Roles.Penalty;
            this.state.Captain = RosterController.GetState().TeamA.Roles.Captain;
            this.state.CoCaptain = RosterController.GetState().TeamA.Roles.CoCaptain;
        } else {
            this.state.Coach = RosterController.GetState().TeamB.Roles.Coach;
            this.state.Penalty = RosterController.GetState().TeamB.Roles.Penalty;
            this.state.Captain = RosterController.GetState().TeamB.Roles.Captain;
            this.state.CoCaptain = RosterController.GetState().TeamB.Roles.CoCaptain;
        }
    }

    protected updateRoster() {
        if(this.props.side == 'A') {
            this.setState({
                Coach:RosterController.GetState().TeamA.Roles.Coach,
                Penalty:RosterController.GetState().TeamA.Roles.Penalty,
                Captain:RosterController.GetState().TeamA.Roles.Captain,
                CoCaptain:RosterController.GetState().TeamA.Roles.CoCaptain,
            });
        } else {
            this.setState({
                Coach:RosterController.GetState().TeamB.Roles.Coach,
                Penalty:RosterController.GetState().TeamB.Roles.Penalty,
                Captain:RosterController.GetState().TeamB.Roles.Captain,
                CoCaptain:RosterController.GetState().TeamB.Roles.CoCaptain,
            });
        }
    }
    
    protected onChangeRole(ev: React.ChangeEvent<HTMLSelectElement>) {
        let value:string = ev.currentTarget.value;
        this.setState({CurrentRole:value}, () => {
            this.updateRoster();
        });
    }

    protected onChangeRoleSkater(ev: React.ChangeEvent<HTMLSelectElement>) {
        let id:number = Number.parseInt(ev.currentTarget.value);
        RosterController.SetRole(this.props.side, id, this.state.CurrentRole);
    }

    componentDidMount() {
        this.remoteRoster = RosterController.Subscribe(this.updateRoster);
    }

    componentWillUnmount() {
        if(this.remoteRoster)
            this.remoteRoster();
    }
    
    render() {
        let roleid:number = 0;
        let roles:Array<React.ReactElement> = new Array<React.ReactElement>(
            <option value='Coach' key='opt-coach'>Coach</option>,
            <option value='Penalty' key='opt-penalty'>Penalties</option>,
            <option value='Captain' key='opt-captain'>Captain</option>,
            <option value='CoCaptain' key='opt-cocaptain'>CoCaptain</option>
        );
        let skaters:Array<React.ReactElement> = new Array<React.ReactElement>(
            <option value={0} key='opt-noskater'></option>
        );

        switch(this.state.CurrentRole.toLowerCase()) {
            case 'coach' : roleid = this.state.Coach; break;
            case 'penalty' : roleid = this.state.Penalty; break;
            case 'captain' : roleid = this.state.Captain; break;
            case 'cocaptain' : roleid = this.state.CoCaptain; break;
        }

        if(this.props.skaters) {
            this.props.skaters.forEach((skater:SkaterRecord) => {
                skaters.push(
                    <option value={skater.RecordID} key={`${skater.RecordType}-${skater.RecordID}`}>{skater.Name}</option>
                );
            });
        }

        return (
            <div className="team-roles">
                <select size={1} value={this.state.CurrentRole} onChange={this.onChangeRole}>{roles}</select>
                <select size={1} value={roleid} onChange={this.onChangeRoleSkater}>{skaters}</select>
            </div>
        );
    }
}

class SkaterList extends React.PureComponent<{
    side:Sides;
    teamid:number;
    skaters:Array<SkaterRecord>;
}> {
    render() {
        let skaters:Array<any> = new Array<any>();
        
        if(this.props.skaters) {
            this.props.skaters.forEach((skater, index) => {
                skaters.push({
                    label:<SkaterItem
                        key={`${skater.RecordType}-${index}`}
                        side={this.props.side}
                        skater={skater}
                        teamid={this.props.teamid}
                    />
                });
            });
        }
        return (
            <SortPanel
                className="skaters"
                items={skaters}
                onDrop={(a, b, right) => {
                    RosterController.SwapSkaters(this.props.side, a, b, right);
                }}
                />
        )
    }
}

class SkaterItem extends React.PureComponent<{
    skater:SkaterRecord;
    side:Sides;
    teamid:number;
}> {

    protected remoteRoster?:Unsubscribe;

    componentDidMount() {
        this.remoteRoster = RosterController.Subscribe(() => {
            this.forceUpdate();
        });
    }

    componentWillUnmount() {
        if(this.remoteRoster)
            this.remoteRoster();
    }
    
    render() {
        let position:string = '';
        let state:SRosterTeam = RosterController.GetState().TeamA;
        if(this.props.side == 'B') {
            state = RosterController.GetState().TeamB;
        }

        if(state.Roles.Coach == this.props.skater.RecordID)
            position = 'Coach';
            
        if(state.Roles.Penalty == this.props.skater.RecordID)
            position = 'Penalties';
        
        if(state.Roles.Captain == this.props.skater.RecordID)
            position = 'Captain';
            
        if(state.Roles.CoCaptain == this.props.skater.RecordID)
            position = 'Co-Captain';
        
        return (
            <div className="skater-item">
                <div className="number">{`${this.props.skater.Number}`}</div>
                <div className="name">{`${this.props.skater.Name}`}</div>
                <div className="pos">
                    {position}
                </div>
                <Icon
                    src={IconX}
                    onClick={() => {
                        RosterController.RemoveSkater(this.props.side, this.props.skater.RecordID);
                    }}
                />
            </div>
        )
    }
}