import React, { CSSProperties } from 'react'
import Panel from 'components/Panel'
import cnames from 'classnames';
import ScoreboardController, {SScoreboardTeam} from 'controllers/ScoreboardController'
import ScorekeeperController, {SScorekeeperState, SScorekeeperTeam, SScorekeeperTeamDeckStatus, SScorekeeperTeamDeck} from 'controllers/ScorekeeperController'
import RosterController from 'controllers/RosterController';
import {Button, IconButton, Icon, IconShown, IconHidden, IconUp} from 'components/Elements';
import { SkaterRecord } from 'tools/vars';
import './css/Scorekeeper.scss';
import UIController from 'controllers/UIController';
import { Unsubscribe } from 'redux';
import Team from './Team';
import Positions from './Positions';
import ScorekeeperCaptureController from 'controllers/capture/Scorekeeper';
import { AddMediaPath } from 'controllers/functions';
import Penalties from './Penalties';

/**
 * Component for tracking skaters on the track / on-deck
 */
export default class Scorekeeper extends React.PureComponent<any, {
    /**
     * True if scorekeeper is visible or not
     */
    Shown:boolean;
    /**
     * Left side scoreboard team
     */
    TeamA:SScoreboardTeam;
    /**
     * Right side scoreboard team
     */
    TeamB:SScoreboardTeam;
    /**
     * ScorekeeperController state
     */
    State:SScorekeeperState;
    /**
     * Skaters on the left team
     */
    TeamASkaters:Array<SkaterRecord>;
    /**
     * Skaters on the right team
     */
    TeamBSkaters:Array<SkaterRecord>;
    opened:boolean;
}> {
    readonly state = {
        Shown:ScorekeeperCaptureController.GetState().Shown,
        TeamA:ScoreboardController.GetState().TeamA,
        TeamB:ScoreboardController.GetState().TeamB,
        State:ScorekeeperController.GetState(),
        TeamASkaters:RosterController.GetState().TeamA.Skaters,
        TeamBSkaters:RosterController.GetState().TeamB.Skaters,
        opened:UIController.GetState().Scorekeeper.Shown
    };

    /**
     * ScorekeeperController listener
     */
    protected remoteState:Function|null = null;
    /**
     * CaptureController listener
     */
    protected remoteCapture:Function|null = null;
    /**
     * ScoreboardController listener
     */
    protected remoteScore:Function|null = null;
    /**
     * RosterController listener
     */
    protected remoteRoster:Function|null = null;

    protected remoteUI:Unsubscribe|null = null;

    /**
     * Constructor
     * @param props 
     */
    constructor(props) {
        super(props);
        this.updateState = this.updateState.bind(this);
        this.updateCapture = this.updateCapture.bind(this);
        this.updateScoreboard = this.updateScoreboard.bind(this);
        this.updateRoster = this.updateRoster.bind(this);
        this.updateUI = this.updateUI.bind(this);
    }

    protected async updateUI() {
        this.setState({
            opened:UIController.GetState().Scorekeeper.Shown
        })
    }

    /**
     * Updates the state to match the controller.
     */
    updateState() {
        this.setState({State:ScorekeeperController.GetState()});
    }

    /**
     * Updates the capture state to match the controller.
     */
    updateCapture() {
        this.setState({Shown:ScorekeeperCaptureController.GetState().Shown});
    }

    /**
     * Updates the teams state to match the scoreboard controller.
     */
    updateScoreboard() {
        this.setState({
            TeamA:ScoreboardController.GetState().TeamA,
            TeamB:ScoreboardController.GetState().TeamB
        });
    }
    
    /**
     * Updates the state to match the roster
     */
    updateRoster() {
        this.setState({
            TeamASkaters:RosterController.GetState().TeamA.Skaters,
            TeamBSkaters:RosterController.GetState().TeamB.Skaters
        });
    }

    /**
     * Starts listeners
     */
    componentDidMount() {
        this.remoteState = ScorekeeperController.Subscribe(this.updateState);
        this.remoteCapture = ScorekeeperCaptureController.Subscribe(this.updateCapture);
        this.remoteScore = ScoreboardController.Subscribe(this.updateScoreboard);
        this.remoteRoster = RosterController.Subscribe(this.updateRoster);
        this.remoteUI = UIController.Subscribe(this.updateUI);
    }

    /**
     * Close listeners
     */
    componentWillUnmount() {
        if(this.remoteState !== null)
            this.remoteState();
        if(this.remoteCapture !== null)
            this.remoteCapture();
        if(this.remoteScore !== null)
            this.remoteScore();
        if(this.remoteRoster !== null)
            this.remoteRoster();
        if(this.remoteUI !== null)
            this.remoteUI();
    }

    /**
     * Renders the component
     */
    render() {
        let iconShown:string = IconHidden;
        if(this.state.Shown)
            iconShown = IconShown;

        let logoA:string = '';
        let logoB:string = '';
        if(this.state.TeamA.Thumbnail !== undefined) {
            logoA = AddMediaPath(this.state.TeamA.Thumbnail);
        }

        if(this.state.TeamB.Thumbnail !== undefined) {
            logoB = AddMediaPath(this.state.TeamB.Thumbnail);
        }

        let teamASkaters:Array<React.ReactElement> = [];
        let teamBSkaters:Array<React.ReactElement> = [];

        let i = 0;
        for(let key in this.state.State.TeamA.Track) {
            let skater:SkaterRecord|null = this.state.State.TeamA.Track[key];
            if(skater !== null) {
                let src:string = logoA;
                if(skater.Thumbnail !== undefined && skater.Thumbnail.length >= 1) {
                    src = AddMediaPath(skater.Thumbnail);
                }
                teamASkaters.push(
                    <div 
                        key={`skater-${i}`}
                        className="skater">
                        <div className="thumbnail">
                            <img src={src} alt=""/>
                        </div>
                        <div className="num">{skater.Number}</div>
                    </div>
                );
            }
            i++;
        }

        for(let key in this.state.State.TeamB.Track) {
            let skater:SkaterRecord|null = this.state.State.TeamB.Track[key];
            if(skater !== null) {
                let src:string = logoB;
                if(skater.Thumbnail !== undefined && skater.Thumbnail.length >= 1) {
                    src = AddMediaPath(skater.Thumbnail);
                }
                teamBSkaters.push(
                    <div 
                        key={`skater-${i}`}
                        className="skater">
                        <div className="thumbnail">
                            <img src={src} alt=""/>
                        </div>
                        <div className="num">{skater.Number}</div>
                    </div>
                );
            }
            i++;
        }

        let buttons:Array<React.ReactElement> = [
            <IconButton
                key="btn-shown"
                src={iconShown}
                active={this.state.Shown}
                onClick={ScorekeeperCaptureController.Toggle}
            >{(this.state.Shown) ? 'Hide' : 'Show'}</IconButton>,
            <IconButton
                key="btn-shift"
                src={IconUp}
                onClick={ScorekeeperController.ShiftDecks}
                >Shift Skaters</IconButton>
        ];

        return (
            <Panel 
                opened={this.state.opened}
                contentName="SK-app"
                buttons={buttons}
                {...this.props}>
                <Team side='A'/>
                <Team side='B'/>
                <Positions/>
                <div className="penalties">
                    <Penalties side='A'/>
                    <Penalties side='B'/>
                </div>
            </Panel>
        )
    }
}