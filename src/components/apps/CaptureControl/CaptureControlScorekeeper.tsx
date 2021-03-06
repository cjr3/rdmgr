import React from 'react';
import cnames from 'classnames';
import ScorekeeperController, { SScorekeeperTeam } from 'controllers/ScorekeeperController';
import CaptureControlPanel, {PCaptureControlPanel} from './CaptureControlPanel';
import ScorekeeperCaptureController from 'controllers/capture/Scorekeeper';
import { Unsubscribe } from 'redux';
import { AddMediaPath } from 'controllers/functions';
import ClientController from 'controllers/ClientController';
import { SkaterRecord } from 'tools/vars';
import RosterController from 'controllers/RosterController';
import ScoreboardController from 'controllers/ScoreboardController';
import UIController from 'controllers/UIController';

/**
 * Component for configuring the scorekeeper elements.
 */
export default class CaptureControlScorekeeper extends React.PureComponent<any, {
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
    constructor(props:PCaptureControlPanel) {
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
        let className:string = cnames('scorekeeper-reel', {
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
        Records:RosterController.GetState().TeamA.Skaters,
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
        if(this.props.side == 'B') {
            this.state.Records = RosterController.GetState().TeamB.Skaters;
            this.state.Index = ClientController.GetState().RosterTeamBIndex;
            this.state.Color = ScoreboardController.GetState().TeamB.Color;
            this.state.Logo = ScoreboardController.GetState().TeamB.Thumbnail;
        }
    }

    protected updateClient() {
        let index:number = ClientController.GetState().RosterTeamAIndex;
        if(this.props.side == 'B')
            index = ClientController.GetState().RosterTeamBIndex;
        this.setState({Index:index});
    }

    protected updateScorekeeper() {
        let skaters:Array<SkaterRecord> = RosterController.GetState().TeamA.Skaters;
        if(this.props.side == 'B')
            skaters = RosterController.GetState().TeamB.Skaters;
        this.setState({Records:skaters});
    }

    protected updateScoreboard() {
        if(this.props.side == 'A') {
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
        if(records && records.length) {
            if(index == -1)
                skaters.push(<div className="skater noskater" key="no-skater"></div>);
            
            records.forEach((skater:SkaterRecord, i:number) => {
                if(i >= index && (i+1) <= index) {
                    skaters.push(
                        <div className="skater" key={`${skater.RecordType}-${skater.RecordID}`}>
                            {skater.Number}
                        </div>
                    );
                }
            });

            if((index+1) >= records.length) {
                skaters.push(<div className="skater noskater" key="no-skater"></div>);
            }
        }
        else {
            skaters.push(<div className="skater noskater" key="no-skater"></div>);
        }

        return (
            <div className={'skater-reel team-' + this.props.side}>
                {skaters}
            </div>
        )
    }
    
}