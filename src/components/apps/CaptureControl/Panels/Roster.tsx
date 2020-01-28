import React from 'react';
import RosterController, {Sides} from 'controllers/RosterController';
import ScoreboardController from 'controllers/ScoreboardController';

import {
    Button,
    IconShown,
    IconHidden,
    IconButton,
    IconLoop,
    IconLeft,
    IconRight,
    IconSubtract
} from 'components/Elements';
import { Unsubscribe } from 'redux';
import vars, { SkaterRecord } from 'tools/vars';
import RosterCaptureController from 'controllers/capture/Roster';
import { Compare, AddMediaPath } from 'controllers/functions';
import Panel from 'components/Panel';

/**
 * Component for configuring the roster.
 */
export default class RosterPanel extends React.PureComponent<{
    opened:boolean;
}> {
    readonly state = {
        Shown:RosterCaptureController.GetState().Shown
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
            Shown:RosterCaptureController.GetState().Shown
        });
    }

    /**
     * Subscribe to controllers
     */
    componentDidMount() {
        this.remoteCapture = RosterCaptureController.Subscribe(this.updateCapture);
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
            <Panel 
                opened={this.props.opened}
                popup={true}
                contentName="roster"
                title="Intros"
                buttons={[<Buttons key='buttons'/>]}
                >
                <Skaters/>
            </Panel>
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
        className:RosterCaptureController.GetState().className,
        shown:RosterCaptureController.GetState().Shown
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
            className:RosterCaptureController.GetState().className,
            shown:RosterCaptureController.GetState().Shown
        });
    }

    /**
     * Subscribe to controllers
     */
    componentDidMount() {
        this.remoteCapture = RosterCaptureController.Subscribe(this.updateCapture);
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
                    src={IconSubtract}
                    onClick={() => {RosterCaptureController.SetClass('');}}
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
                    onClick={() => {
                        RosterCaptureController.SetClass('');
                        RosterCaptureController.Toggle();
                    }}
                    />
                <IconButton
                    src={IconLeft}
                    title="Previous"
                    onClick={() => {
                        RosterCaptureController.SetClass('');
                        RosterController.Prev();
                    }}
                    />
                <IconButton
                    src={IconRight}
                    title="Next"
                    onClick={() => {
                        RosterCaptureController.SetClass('');
                        RosterController.Next();
                    }}
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
        CurrentTeam:RosterController.GetState().CurrentTeam,
        Index:RosterController.GetState().SkaterIndex,
        SkatersA:RosterController.GetState().TeamA.Skaters,
        SkatersB:RosterController.GetState().TeamB.Skaters,
        TeamA:{
            ID:ScoreboardController.GetState().TeamA.ID,
            Name:ScoreboardController.GetState().TeamA.Name,
            Thumbnail:ScoreboardController.GetState().TeamA.Thumbnail
        },
        TeamB:{
            ID:ScoreboardController.GetState().TeamB.ID,
            Name:ScoreboardController.GetState().TeamB.Name,
            Thumbnail:ScoreboardController.GetState().TeamB.Thumbnail
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
        let cstate = RosterController.GetState();
        this.setState({
            CurrentTeam:cstate.CurrentTeam,
            Index:cstate.SkaterIndex,
            SkatersA:cstate.TeamA.Skaters,
            SkatersB:cstate.TeamB.Skaters
        });
    }

    /**
     * Update the state to match the ScoreboardController
     */
    protected async updateScoreboard() {
        let cstate = ScoreboardController.GetState();
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

        if(!Compare(teama, this.state.TeamA))
            this.setState({TeamA:teama});

        if(!Compare(teamb, this.state.TeamB))
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
        this.remoteRoster = RosterController.Subscribe(this.updateRoster);
        this.remoteScoreboard = ScoreboardController.Subscribe(this.updateScoreboard);
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
                        <img src={AddMediaPath(this.props.src)} alt=""/>
                    </div>
                    <div className="name">{this.props.name}</div>
                </div>
            </Button>
        );
    }
}