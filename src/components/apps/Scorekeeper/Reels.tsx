import React, { CSSProperties } from 'react';
import cnames from 'classnames';
import ScorekeeperController from 'controllers/ScorekeeperController';
import { Unsubscribe } from 'redux';
import { AddMediaPath } from 'controllers/functions';
import ClientController from 'controllers/ClientController';
import { SkaterRecord } from 'tools/vars';
import RosterController from 'controllers/RosterController';
import ScoreboardController from 'controllers/ScoreboardController';
import UIController from 'controllers/UIController';
import './css/Scorekeeper.scss';

/**
 * Component for configuring the scorekeeper elements.
 */
export default class ScorekeeperReels extends React.PureComponent<any, {
    Shown:boolean;
}> {

    readonly state = {
        Shown:UIController.GetState().ScorekeeperReel.Shown
    }

    protected remoteUI?:Unsubscribe;

    /**
     * Constructor
     * @param props PCaptureControlPanel
     */
    constructor(props) {
        super(props);
        this.updateUI = this.updateUI.bind(this);
    }

    protected updateUI() {
        this.setState({
            Shown:UIController.GetState().ScorekeeperReel.Shown
        });
    }

    /**
     * Start listeners
     */
    componentDidMount() {
        this.remoteUI = UIController.Subscribe(this.updateUI);
    }

    /**
     * Close listeners
     */
    componentWillUnmount() {
        if(this.remoteUI)
            this.remoteUI();
    }

    /**
     * Renders the component.
     */
    render() {
        let className:string = cnames('scorekeeper-reels', {
            shown:this.state.Shown
        });
        return (
            <div className={className}>
                <SkaterReel side='A'/>
                <SkaterReel side='B'/>
            </div>
        );
    }
}

class SkaterReel extends React.PureComponent<{
    side:string
},{
    Records:Array<SkaterRecord>;
    Index:number;
    Color:string;
    Logo:string;
}> {

    readonly state = {
        Records:RosterController.GetState().TeamA.Skaters.filter(skater => (typeof(skater.Number) === 'string' && skater.Number)),
        Index:ClientController.GetState().RosterTeamAIndex,
        Color:ScoreboardController.GetState().TeamA.Color,
        Logo:ScoreboardController.GetState().TeamA.Thumbnail
    }

    protected remoteClient?:Unsubscribe;
    protected remoteScorekeeper?:Unsubscribe;
    protected remoteScoreboard?:Unsubscribe;

    constructor(props) {
        super(props)
        this.updateClient = this.updateClient.bind(this);
        this.updateScorekeeper = this.updateScorekeeper.bind(this);
        this.updateScoreboard = this.updateScoreboard.bind(this);
        if(this.props.side === 'B') {
            this.state.Records = RosterController.GetState().TeamB.Skaters.filter(skater => (typeof(skater.Number) === 'string' && skater.Number));
            this.state.Index = ClientController.GetState().RosterTeamBIndex;
            this.state.Color = ScoreboardController.GetState().TeamB.Color;
            this.state.Logo = ScoreboardController.GetState().TeamB.Thumbnail;
        }
    }

    protected updateClient() {
        let index:number = ClientController.GetState().RosterTeamAIndex;
        if(this.props.side === 'B')
            index = ClientController.GetState().RosterTeamBIndex;
        this.setState({Index:index});
    }

    protected updateScorekeeper() {
        let skaters:Array<SkaterRecord> = RosterController.GetState().TeamA.Skaters;
        if(this.props.side === 'B')
            skaters = RosterController.GetState().TeamB.Skaters;
        this.setState({Records:skaters.filter(skater => (typeof(skater.Number) === 'string' && skater.Number))});
    }

    protected updateScoreboard() {
        if(this.props.side === 'A') {
            this.setState({
                Color:ScoreboardController.GetState().TeamA.Color,
                Logo:ScoreboardController.GetState().TeamA.Thumbnail
            });
        }
        else {
            this.setState({
                Color:ScoreboardController.GetState().TeamB.Color,
                Logo:ScoreboardController.GetState().TeamB.Thumbnail
            });
        }
    }

    componentDidMount() {
        this.remoteClient = ClientController.Subscribe(this.updateClient);
        this.remoteScoreboard = ScoreboardController.Subscribe(this.updateScoreboard);
        this.remoteScorekeeper = ScorekeeperController.Subscribe(this.updateScorekeeper);
    }

    componentWillUnmount() {
        if(this.remoteScorekeeper)
            this.remoteScorekeeper();
        if(this.remoteClient)
            this.remoteClient();
        if(this.remoteScoreboard)
            this.remoteScoreboard();
    }

    render() {
        let skaters:Array<React.ReactElement> = new Array<React.ReactElement>();
        let index:number = this.state.Index;
        let records:Array<SkaterRecord> = this.state.Records;
        let logo:string = '';
        let style:CSSProperties = {};
        if(this.state.Logo)
            logo = AddMediaPath(this.state.Logo);

        if(records && records.length) {
            style.width = (150*records.length + 150) + "px";
            if(index === -1) {
                skaters.push(<div className="skater noskater active" key="no-skater"><div className="number">NONE</div></div>);
            } else {
                skaters.push(<div className="skater noskater" key="no-skater"><div className="number">NONE</div></div>);
            }
            if(index >= 1) {
                style.transform = "translateX(-" + ((index)*150) + "px)";
            }
            records.forEach((skater:SkaterRecord, i:number) => {
                skaters.push(
                    <SkaterItem
                        skater={skater}
                        active={(i === index)}
                        color={this.state.Color}
                        key={`${skater.RecordType}-${skater.RecordID}`}
                    />
                )
            });
        }
        else {
            skaters.push(<div className="skater noskater" key="no-skater"><div className="number">NONE</div></div>);
        }

        return (
            <div className={'skater-reel team-' + this.props.side}>
                <div className="logo">
                    <img src={logo} alt=""/>
                </div>
                <div className="skaters" style={style}>
                    {skaters}
                </div>
            </div>
        )
    }
}

function SkaterItem(props:{skater:SkaterRecord,active:boolean,color:string}) {
    let src:string = '';
    let className = cnames('skater', {active:props.active});
    if(props.skater.Thumbnail)
        src = AddMediaPath(props.skater.Thumbnail);
    return (
        <div className={className}>
            <div className="thumbnail">
                <img src={src} alt=""/>
            </div>
            <div className="number">
                {props.skater.Number}
            </div>
        </div>
    )
}