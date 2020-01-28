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
}> {
    readonly state = {
        Name:'Team',
        Color:'#000000',
        RecordID:0
    }

    protected remoteScoreboard?:Unsubscribe;

    constructor(props) {
        super(props);
        this.updateScoreboard = this.updateScoreboard.bind(this);
        if(this.props.side == 'A') {
            this.state.Name = ScoreboardController.GetState().TeamA.Name;
            this.state.Color = ScoreboardController.GetState().TeamA.Color;
            this.state.RecordID = ScoreboardController.GetState().TeamA.ID;
        } else {
            this.state.Name = ScoreboardController.GetState().TeamB.Name;
            this.state.Color = ScoreboardController.GetState().TeamB.Color;
            this.state.RecordID = ScoreboardController.GetState().TeamB.ID;
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

    componentDidMount() {
        this.remoteScoreboard = ScoreboardController.Subscribe(this.updateScoreboard);
    }

    componentWillUnmount() {
        if(this.remoteScoreboard)
            this.remoteScoreboard();
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
                    />
            </div>
        )
    }
}

class SkaterList extends React.PureComponent<{
    side:Sides;
    teamid:number;
}, {
    Skaters:Array<SkaterRecord>;
}> {
    readonly state = {
        Skaters:new Array<SkaterRecord>()
    };

    protected remoteRoster?:Unsubscribe;

    constructor(props) {
        super(props);
        this.updateRoster = this.updateRoster.bind(this);
        if(this.props.side === 'A') {
            this.state.Skaters = RosterController.GetState().TeamA.Skaters;
        }
        else {
            this.state.Skaters = RosterController.GetState().TeamB.Skaters;
        }
    }

    protected updateRoster() {
        if(this.props.side === 'A') {
            this.setState({
                Skaters:RosterController.GetState().TeamA.Skaters,
            });
        } else {
            this.setState({
                Skaters:RosterController.GetState().TeamB.Skaters
            });
        }
    }

    componentDidMount() {
        this.remoteRoster = RosterController.Subscribe(this.updateRoster);
    }

    componentWillUnmount() {
        if(this.remoteRoster)
            this.remoteRoster();
    }

    render() {
        let skaters:Array<any> = new Array<any>();
        
        if(this.state.Skaters) {
            this.state.Skaters.forEach((skater, index) => {
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
    render() {
        let position:string = '';
        if(this.props.teamid && this.props.skater && this.props.skater.Teams) {
            for(let key in this.props.skater.Teams) {
                let team:SkaterTeamRecord = this.props.skater.Teams[key];
                if(team.TeamID == this.props.teamid) {
                    if(team.Captain)
                        position = 'Captain';
                    else if(team.CoCaptain)
                        position = 'Co-Captain';
                    else if(team.Coach)
                        position = 'Coach / Penalty Manager'
                }
                break;
            }
        }
        
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