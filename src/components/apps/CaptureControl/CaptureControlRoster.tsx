import React from 'react';
import RosterController, {Sides} from 'controllers/RosterController';
import ScoreboardController from 'controllers/ScoreboardController';
import CaptureController from 'controllers/CaptureController';
import DataController from 'controllers/DataController';
import CaptureControlPanel, {PCaptureControlPanel} from './CaptureControlPanel';

import {
    Button,
    IconShown,
    IconHidden,
    IconButton,
    IconLoop,
    IconLeft,
    IconRight,
    IconTeam,
    IconMonitor
} from 'components/Elements';
import { Unsubscribe } from 'redux';
import vars, { SkaterRecord } from 'tools/vars';

/**
 * Component for configuring the roster.
 */
export default class CaptureControlRoster extends React.PureComponent<PCaptureControlPanel, {
    /**
     * Determines if the Roster is shown on the CaptureForm or not
     */
    Shown:boolean;
}> {
    readonly state = {
        Shown:CaptureController.getState().Roster.Shown
    }

    /**
     * CaptureController listener
     */
    protected remoteCapture?:Unsubscribe;

    /**
     * Constructor
     * @param props 
     */
    constructor(props) {
        super(props);
        this.updateCapture = this.updateCapture.bind(this);
    }

    /**
     * Updates the state to match the capture controller.
     */
    protected async updateCapture() {
        this.setState({
            Shown:CaptureController.getState().Roster.Shown
        });
    }

    /**
     * Subscribe to controllers
     */
    componentDidMount() {
        this.remoteCapture = RosterController.subscribe(this.updateCapture);
    }

    /**
     * Close listeners
     */
    componentWillUnmount() {
        if(this.remoteCapture)
            this.remoteCapture();
    }

    /**
     * Renders the component.
     */
    render() {
        return (
            <CaptureControlPanel
                active={this.props.active}
                name={'Intro'}
                icon={IconTeam}
                toggle={CaptureController.ToggleRoster}
                shown={this.state.Shown}
                buttons={[<Buttons key="buttons"/>]}
                onClick={this.props.onClick}>
                <Skaters/>
            </CaptureControlPanel>
        );
    }
}

/**
 * Buttons for CaptureControlRoster
 */
class Buttons extends React.PureComponent<any, {
    className:string;
    shown:boolean;
}> {
    readonly state = {
        className:CaptureController.getState().Roster.className,
        shown:CaptureController.getState().Roster.Shown
    }

    /**
     * CaptureController listener
     */
    protected remoteCapture?:Unsubscribe;

    /**
     * Constructor
     * @param props 
     */
    constructor(props) {
        super(props);
        this.updateCapture = this.updateCapture.bind(this);
    }

    /**
     * Updates the state to match the CaptureController
     */
    protected async updateCapture() {
        this.setState({
            className:CaptureController.getState().Roster.className,
            shown:CaptureController.getState().Roster.Shown
        });
    }

    /**
     * Subscribe to controllers
     */
    componentDidMount() {
        this.remoteCapture = CaptureController.subscribe(this.updateCapture);
    }

    /**
     * Close listeners
     */
    componentWillUnmount() {
        if(this.remoteCapture)
            this.remoteCapture();
    }

    /**
     * Renders the component
     * - Toggle class
     * - Reload roster from skater records
     * - Show/Hide
     * - Previous Skater
     * - Next Skater
     */
    render() {
        return (
            <React.Fragment>
                <IconButton
                    src={IconMonitor}
                    active={(this.state.className === 'fullscreen')}
                    onClick={() => {
                        if(this.state.className === 'fullscreen')
                            CaptureController.SetRosterClass('');
                        else
                            CaptureController.SetRosterClass('fullscreen');
                    }}
                    />
                <IconButton
                    src={IconLoop}
                    title="Load Roster"
                    onClick={RosterController.LoadSkaters}
                    />
                <IconButton
                    active={this.state.shown}
                    title="Show/Hide"
                    src={(this.state.shown) ? IconShown : IconHidden}
                    onClick={CaptureController.ToggleRoster}
                    />
                <IconButton
                    src={IconLeft}
                    title="Previous"
                    onClick={RosterController.Prev}
                    />
                <IconButton
                    src={IconRight}
                    title="Next"
                    onClick={RosterController.Next}
                    />
            </React.Fragment>
        )
    }
}

/**
 * Component to list skaters and teams, in the roster order
 */
class Skaters extends React.PureComponent<any, {
    CurrentTeam:string;
    Index:number;
    SkatersA:Array<SkaterRecord>;
    SkatersB:Array<SkaterRecord>;
    TeamA:{
        ID:number;
        Name:string;
        Thumbnail:string;
    },
    TeamB:{
        ID:number;
        Name:string;
        Thumbnail:string;
    }
}> {
    readonly state = {
        CurrentTeam:RosterController.getState().CurrentTeam,
        Index:RosterController.getState().SkaterIndex,
        SkatersA:RosterController.getState().TeamA.Skaters,
        SkatersB:RosterController.getState().TeamB.Skaters,
        TeamA:{
            ID:ScoreboardController.getState().TeamA.ID,
            Name:ScoreboardController.getState().TeamA.Name,
            Thumbnail:ScoreboardController.getState().TeamA.Thumbnail
        },
        TeamB:{
            ID:ScoreboardController.getState().TeamB.ID,
            Name:ScoreboardController.getState().TeamB.Name,
            Thumbnail:ScoreboardController.getState().TeamB.Thumbnail
        }
    }

    /**
     * Reference items to scroll into view
     */
    protected RecordsItem:React.RefObject<HTMLDivElement> = React.createRef();
    protected TeamItem:React.RefObject<TeamItem> = React.createRef();
    protected SkaterItem:React.RefObject<SkaterItem> = React.createRef();

    /**
     * Listeners for controllers
     */
    protected remoteScoreboard?:Unsubscribe;
    protected remoteRoster?:Unsubscribe;

    /**
     * Timer for scrolling
     * - DOM element may not exist immediately after componentDidUpdate
     */
    protected scrollTimer:number = 0;
    protected scrollDelay:number = 10;

    /**
     * Constructor
     * @param props 
     */
    constructor(props) {
        super(props);
        this.updateRoster = this.updateRoster.bind(this);
        this.updateScoreboard = this.updateScoreboard.bind(this);
    }

    /**
     * Updates the state to match the RosterController
     */
    protected async updateRoster() {
        let cstate = RosterController.getState();
        let changes:any = {
            CurrentTeam:cstate.CurrentTeam,
            Index:cstate.SkaterIndex
        };

        let skatersA = cstate.TeamA.Skaters;
        let skatersB = cstate.TeamB.Skaters;
        if(!DataController.compare(skatersA, this.state.SkatersA))
            changes.SkatersA = skatersA;
        if(!DataController.compare(skatersB, this.state.SkatersB))
            changes.SkatersB = skatersB;
        this.setState(changes);
    }

    /**
     * Update the state to match the ScoreboardController
     */
    protected async updateScoreboard() {
        let cstate = ScoreboardController.getState();
        let teama:any = {
            ID:cstate.TeamA.ID,
            Name:cstate.TeamA.Name,
            Thumbnail:cstate.TeamA.Thumbnail
        };
        let teamb:any = {
            ID:cstate.TeamB.ID,
            Name:cstate.TeamB.Name,
            Thumbnail:cstate.TeamB.Thumbnail
        };

        if(!DataController.compare(teama, this.state.TeamA))
            this.setState({TeamA:teama});

        if(!DataController.compare(teamb, this.state.TeamB))
            this.setState({TeamB:teamb});
    }

    /**
     * Gets a TeamItem component
     * @param side string
     * @param id number
     * @param name string
     * @param src string
     */
    protected getTeamItem(side:Sides, id:number, name:string, src:string) : React.ReactElement {
        return (
            <TeamItem
                key={`${vars.RecordType.Team}-${id}`}
                active={(this.state.CurrentTeam === side && this.state.Index < 0)}
                name={name}
                src={src}
                index={-1}
                side={side}
                ref={(this.state.CurrentTeam === side && this.state.Index < 0) ? this.TeamItem : null}
            />
        );
    }

    /**
     * Gets a SkaterItem
     * @param side Team Side (A or B)
     * @param id Skater's ID
     * @param name Skater's Name
     * @param index Index, relative to team's Skaters collection
     * @param num Skater's jersey #
     */
    protected getSkaterItem(side:Sides, id:number, name:string, index:number, num?:string) : React.ReactElement {
        return (
            <SkaterItem
                key={`${vars.RecordType.Skater}-${id}`}
                active={(this.state.CurrentTeam === side && this.state.Index === index)}
                name={name}
                num={num}
                index={index}
                side={side}
                ref={(this.state.CurrentTeam === side && this.state.Index === index) ? this.SkaterItem : null}
            />
        );
    }

    /**
     * Subscribe to controllers
     */
    componentDidMount() {
        this.remoteRoster = RosterController.subscribe(this.updateRoster);
        this.remoteScoreboard = ScoreboardController.subscribe(this.updateScoreboard);
    }

    /**
     * Close listeners
     */
    componentWillUnmount() {
        if(this.remoteRoster)
            this.remoteRoster();
        if(this.remoteScoreboard)
            this.remoteScoreboard();
    }

    /**
     * Scrolls the current item into view
     */
    componentDidUpdate() {
        try {clearTimeout(this.scrollTimer)}catch(er){}
        this.scrollTimer = window.setTimeout(() => {
            if(this.TeamItem && this.TeamItem.current) {
                this.TeamItem.current.scrollIntoView({behavior:"smooth",block:"center"});
            } else if(this.SkaterItem && this.SkaterItem.current) {
                this.SkaterItem.current.scrollIntoView({behavior:"smooth",block:"center"});
            }
        }, this.scrollDelay);
    }

    /**
     * Renders the component
     * - List skaters and teams as buttons, in the order they appear on the Roster
     */
    render() {
        
        let skaters:Array<React.ReactElement> = [
            this.getTeamItem('A', this.state.TeamA.ID, this.state.TeamA.Name, this.state.TeamA.Thumbnail)
        ];

        this.state.SkatersA.forEach((skater, index) => {
            skaters.push(
                this.getSkaterItem('A', skater.RecordID, skater.Name, index, skater.Number)
            );
        });

        skaters.push(
            this.getTeamItem('B', this.state.TeamB.ID, this.state.TeamB.Name, this.state.TeamB.Thumbnail)
        );

        this.state.SkatersB.forEach((skater, index) => {
            skaters.push(
                this.getSkaterItem('B', skater.RecordID, skater.Name, index, skater.Number)
            );
        });

        return (
            <div className="record-list roster-skaters" ref={this.RecordsItem}>
                {skaters}
            </div>
        );
    }
}

/**
 * Component to repreent a skater on the roster, with their jersey # and name
 * Double-click sets the roster to that skater
 */
class SkaterItem extends React.PureComponent<{
    /**
     * Team's side
     */
    side:Sides;
    name:string;
    num?:string;
    active:boolean;
    index:number;
}> {

    protected Item:React.RefObject<any> = React.createRef();

    /**
     * Scrolls the element into view
     * @param options 
     */
    scrollIntoView(options:any) {
        if(this.Item && this.Item.current) {
            this.Item.current.scrollIntoView(options);
        }
    }

    /**
     * Renders the component
     */
    render() {
        return (
            <Button
                active={this.props.active}
                className="skater"
                onDoubleClick={() => {
                    RosterController.SetSkater(this.props.side, this.props.index);
                }}
                >
                <div ref={this.Item}>
                    <div className="num">{this.props.num}</div>
                    <div className="name">{this.props.name}</div>
                </div>
            </Button>
        );
    }
}

/**
 * Component to display a team item
 * When double-clicked, sets the skater index to -1 and changes the current team
 * on the roster.
 */
class TeamItem extends React.PureComponent<{
    side:Sides;
    name:string;
    src?:string;
    active:boolean;
    index:number;
}> {

    protected Item:React.RefObject<any> = React.createRef();

    /**
     * Scrolls the element into view
     * @param options 
     */
    scrollIntoView(options:any) {
        if(this.Item && this.Item.current)
            this.Item.current.scrollIntoView(options);
    }

    /**
     * Renders the component, a button with a logo and team name
     */
    render() {
        return (
            <Button
                active={this.props.active}
                className="skater"
                onDoubleClick={() => {
                    RosterController.SetSkater(this.props.side, this.props.index);
                }}
                >
                <div ref={this.Item}>
                    <div className="num">
                        <img src={DataController.mpath(this.props.src)} alt=""/>
                    </div>
                    <div className="name">{this.props.name}</div>
                </div>
            </Button>
        );
    }
}