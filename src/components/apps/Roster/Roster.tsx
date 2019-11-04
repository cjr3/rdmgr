import React, { CSSProperties } from 'react';
import RosterController, {SRosterController} from 'controllers/RosterController';
import DataController from 'controllers/DataController';
import ScoreboardController from 'controllers/ScoreboardController';
import {IconButton, Icon, IconX, IconRight, IconLeft, IconLoop, IconNo, IconFolder, IconSave} from 'components/Elements';
import Panel from 'components/Panel';
import SortPanel from 'components/tools/SortPanel';
import RosterSkaterList from './RosterSkaterList';
import cnames from 'classnames';
import keycodes from 'tools/keycodes';
import { SkaterRecord } from 'tools/vars';
import './css/Roster.scss';
import UIController from 'controllers/UIController';
import { Unsubscribe } from 'redux';

/**
 * Component for building the roster of skaters and coaches on the track
 */
export default class Roster extends React.PureComponent<any, {
    /**
     * RosterController state
     */
    State:SRosterController;
    /**
     * Skaters available to add to either team
     */
    Skaters:Array<SkaterRecord>;
    /**
     * Left side team
     */
    TeamA:{
        ID:number;
        Color:string;
        Name:string;
    },
    /**
     * Right side team
     */
    TeamB:{
        ID:number;
        Color:string;
        Name:string;
    },
    /**
     * Keywords to search skaters
     */
    Keywords:string;
    /**
     * Skaters visible on the form
     * So the user can press 'enter' to add the one skater available
     */
    VisibleSkaters:Array<SkaterRecord>;

    opened:boolean;
}> {
    readonly state = {
        State:Object.assign({}, RosterController.getState()),
        Skaters:DataController.getSkaters(true),
        TeamA:{
            ID:ScoreboardController.getState().TeamA.ID,
            Color:ScoreboardController.getState().TeamA.Color,
            Name:ScoreboardController.getState().TeamA.Name
        },
        TeamB:{
            ID:ScoreboardController.getState().TeamB.ID,
            Color:ScoreboardController.getState().TeamB.Color,
            Name:ScoreboardController.getState().TeamB.Name
        },
        Keywords:'',
        VisibleSkaters:[],
        opened:UIController.getState().Roster.Shown
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
            opened:UIController.getState().Roster.Shown
        });
    }

    /**
     * Updates the state to match the controller.
     */
    updateState() {
        this.setState(() => {
            return {State:Object.assign({}, RosterController.getState())}
        });
    }

    /**
     * Updates the state to refresh the skaters.
     */
    updateData() {
        if(!DataController.compare(DataController.getSkaters(), this.state.Skaters)) {
            this.setState(() => {
                return {Skaters:DataController.getSkaters(true)};
            });
        }
    }

    /**
     * Updates the state to refresh the scoreboard info.
     */
    updateScore() {
        var sstate = ScoreboardController.getState();
        this.setState(() => {
            return {
                TeamA:{
                    ID:sstate.TeamA.ID,
                    Color:sstate.TeamA.Color,
                    Name:sstate.TeamA.Name
                },
                TeamB:{
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
    clearSkaters() {
        RosterController.SetSkaters('A', []);
        RosterController.SetSkaters('B', []);
    }

    /**
     * Loads skaters based on their assigned team, and ordered by name.
     */
    loadSkaters() {
        RosterController.SetSkaters('A', DataController.getTeamSkaters(this.state.TeamA.ID));
        RosterController.SetSkaters('B', DataController.getTeamSkaters(this.state.TeamB.ID));
    }

    /**
     * Triggered when the value of the keywords text input changes.
     * @param {Event} ev 
     */
    onChangeKeywords(ev) {
        var value = ev.target.value;
        this.setState(() => {
            return {Keywords:value}
        });
    }

    /**
     * Triggered when the user presses a key in the keywords field.
     * @param {KeyEvent} ev 
     */
    onKeyUpKeywords(ev) {
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
        this.remoteState = RosterController.subscribe(this.updateState);
        this.remoteData = DataController.subscribe(this.updateData);
        this.remoteScore = ScoreboardController.subscribe(this.updateScore);
        this.remoteUI = UIController.subscribe(this.updateUI);
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
                <RosterTeam 
                    team={this.state.State.TeamA} 
                    color={this.state.TeamA.Color}
                    name={this.state.TeamA.Name}
                    />
                <RosterTeam 
                    team={this.state.State.TeamB} 
                    color={this.state.TeamB.Color}
                    name={this.state.TeamB.Name}
                    />
                <RosterSkaterList/>
            </Panel>
        )
    }
}

interface SRosterTeam {
    /**
     * Team
     */
    team:any;
    /**
     * Color of team
     */
    color:string;
    /**
     * Team name
     */
    name:string;
}

function RosterTeam(props:SRosterTeam) {
    let skaters:Array<any> = []
    let style:CSSProperties = {
        backgroundColor:props.color
    }

    if(props.team.Skaters) {
        props.team.Skaters.forEach((skater, index) => {
            let src:string|null|undefined = skater.Thumbnail;
            if(src === null || src === '')
                src = skater.Slide;
            if(src === null || src === '')
                src = skater.Photo;

            if(src !==  null && src !== '')
                src = DataController.mpath(src);
            skaters.push({
                label:<SkaterItem
                    key={`${skater.RecordType}-${index}`}
                    side={props.team.Side}
                    skater={skater}
                />
            });
            /*
            skaters.push({
                label:<React.Fragment key={`${skater.RecordType}-${index}`}>
                    <div className="number">{`${skater.Number}`}</div>
                    <div className="name">{`${skater.Name}`}</div>
                    <Icon
                        src={IconX}
                        onClick={() => {
                            RosterController.RemoveSkater(props.team.Side, skater);
                        }}
                    />
                </React.Fragment>
            });*/
        })
    }

    let className:string = cnames('team', 'team-' + props.team.Side);

    return (
        <div className={className}>
            <div className="name" style={style}>
                {props.name}
            </div>
            <SortPanel
                className="skaters"
                items={skaters}
                onDrop={(a, b, right) => {
                    RosterController.SwapSkaters(props.team.Side, a, b, right);
                }}
                />
        </div>
    );
}

class SkaterItem extends React.PureComponent<{
    skater:SkaterRecord;
    side:string;
}> {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="skater-item">
                <div className="number">{`${this.props.skater.Number}`}</div>
                <div className="name">{`${this.props.skater.Name}`}</div>
                <Icon
                    src={IconX}
                    onClick={() => {
                        RosterController.RemoveSkater(this.props.side, this.props.skater);
                    }}
                />
            </div>
        )
    }
}