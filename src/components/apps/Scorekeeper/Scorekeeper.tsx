import React, { CSSProperties } from 'react'
import Panel from 'components/Panel'
import cnames from 'classnames';
import ScoreboardController, {SScoreboardTeam} from 'controllers/ScoreboardController'
import ScorekeeperController, {SScorekeeperState, SScorekeeperTeam, SScorekeeperTeamDeckStatus, SScorekeeperTeamDeck} from 'controllers/ScorekeeperController'
import CaptureController from 'controllers/CaptureController'
import RosterController from 'controllers/RosterController';
import {Button, IconButton, Icon, IconShown, IconHidden, IconUp} from 'components/Elements';

import './css/Scorekeeper.scss';
import { SkaterRecord } from 'tools/vars';
import DataController from 'controllers/DataController';

interface SScoreKeeper {
    Shown:boolean,
    TeamA:SScoreboardTeam,
    TeamB:SScoreboardTeam,
    State:SScorekeeperState,
    TeamASkaters:Array<SkaterRecord>,
    TeamBSkaters:Array<SkaterRecord>
}

/**
 * Component for tracking skaters on the track / on-deck
 */
class Scorekeeper extends React.PureComponent<any, SScoreKeeper> {
    readonly state:SScoreKeeper = {
        Shown:CaptureController.getState().Scorekeeper.Shown,
        TeamA:ScoreboardController.getState().TeamA,
        TeamB:ScoreboardController.getState().TeamB,
        State:ScorekeeperController.getState(),
        TeamASkaters:RosterController.getState().TeamA.Skaters,
        TeamBSkaters:RosterController.getState().TeamB.Skaters
    };

    remoteState:Function
    remoteCapture:Function
    remoteScore:Function
    remoteRoster:Function

    constructor(props) {
        super(props);

        this.updateState = this.updateState.bind(this);
        this.updateCapture = this.updateCapture.bind(this);
        this.updateScoreboard = this.updateScoreboard.bind(this);
        this.updateRoster = this.updateRoster.bind(this);

        this.remoteState = ScorekeeperController.subscribe(this.updateState);
        this.remoteCapture = CaptureController.subscribe(this.updateCapture);
        this.remoteScore = ScoreboardController.subscribe(this.updateScoreboard);
        this.remoteRoster = RosterController.subscribe(this.updateRoster);
    }

    /**
     * Updates the state to match the controller.
     */
    updateState() {
        this.setState({State:ScorekeeperController.getState()});
    }

    /**
     * Updates the capture state to match the controller.
     */
    updateCapture() {
        this.setState({Shown:CaptureController.getState().Scorekeeper.Shown});
    }

    /**
     * Updates the teams state to match the scoreboard controller.
     */
    updateScoreboard() {
        this.setState({
            TeamA:ScoreboardController.getState().TeamA,
            TeamB:ScoreboardController.getState().TeamB
        });
    }
    
    /**
     * Updates the state to match the roster
     */
    updateRoster() {
        this.setState({
            TeamASkaters:RosterController.getState().TeamA.Skaters,
            TeamBSkaters:RosterController.getState().TeamB.Skaters
        });
    }

    /**
     * Renders the component
     */
    render() {
        var iconShown = IconHidden;
        if(this.state.Shown)
            iconShown = IconShown;

        let logoA = '';
        let logoB = '';
        if(this.state.TeamA.Thumbnail !== undefined) {
            logoA = DataController.mpath(this.state.TeamA.Thumbnail);
        }

        if(this.state.TeamB.Thumbnail !== undefined) {
            logoB = DataController.mpath(this.state.TeamB.Thumbnail);
        }

        let teamASkaters:Array<React.ReactElement> = [];
        let teamBSkaters:Array<React.ReactElement> = [];

        let i = 0;
        for(let key in this.state.State.TeamA.Track) {
            let skater:SkaterRecord|null = this.state.State.TeamA.Track[key];
            if(skater !== null) {
                let src = logoA;
                if(skater.Thumbnail !== undefined && skater.Thumbnail.length >= 1) {
                    src = DataController.mpath(skater.Thumbnail);
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
                )
            }
            i++;
        }

        for(let key in this.state.State.TeamB.Track) {
            let skater:SkaterRecord|null = this.state.State.TeamB.Track[key];
            if(skater !== null) {
                let src = logoB;
                if(skater.Thumbnail !== undefined && skater.Thumbnail.length >= 1) {
                    src = DataController.mpath(skater.Thumbnail);
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
                )
            }
            i++;
        }

        var buttons = [
            <IconButton
                key="btn-shown"
                src={iconShown}
                active={this.state.Shown}
                onClick={CaptureController.ToggleScorekeeper}
            >{(this.state.Shown) ? 'Hide' : 'Show'}</IconButton>,
            <IconButton
                key="btn-shift"
                src={IconUp}
                onClick={ScorekeeperController.ShiftDecks}
                >Shift Skaters</IconButton>
        ];

        return (
            <Panel 
                opened={this.props.opened}
                contentName="SK-app"
                buttons={buttons}
                {...this.props}>
                <ScorekeeperTeam 
                    side='A' 
                    name={this.state.TeamA.Name}
                    color={this.state.TeamA.Color}
                    team={this.state.State.TeamA}
                    skaters={this.state.TeamASkaters}
                    />
                <ScorekeeperTeam 
                    side='B' 
                    name={this.state.TeamB.Name}
                    color={this.state.TeamB.Color}
                    team={this.state.State.TeamB}
                    skaters={this.state.TeamBSkaters}
                    />
                <div className="positions">
                    <div className="team team-a">
                        {teamASkaters}
                    </div>
                    <div className="team team-b">
                        {teamBSkaters}
                    </div>
                </div>
            </Panel>
        )
    }
}

interface PScorekeeperTeam {
    side:string,
    name:string,
    color:string,
    skaters:Array<SkaterRecord>,
    team:SScorekeeperTeam
}
/**
 * Component represents a team.
 */
class ScorekeeperTeam extends React.PureComponent<PScorekeeperTeam> {
    constructor(props:PScorekeeperTeam) {
        super(props);
        this.onSelectSkater = this.onSelectSkater.bind(this);
        this.onSelectPosition = this.onSelectPosition.bind(this);
        this.onStarPass = this.onStarPass.bind(this);
        this.onShift = this.onShift.bind(this);
    }

    onSelectSkater(skater) {
        ScorekeeperController.SetPosition(this.props.side, skater);
    }

    onSelectPosition(deck, position) {
        ScorekeeperController.SetPosition(this.props.side, null, position, deck);
    }

    onShift() {
        ScorekeeperController.ShiftDecks(this.props.side);
    }

    onStarPass() {
        ScorekeeperController.StarPass(this.props.side);
    }
    
    /**
     * Renders the component.
     */
    render() {
        var skaters:Array<React.ReactElement> = [];
        if(this.props.skaters) {
            this.props.skaters.forEach((skater) => {
                let active = false;
                if(skater.Position !== null && skater.Position !== undefined && skater.Position !== '')
                    active = true;
                if(skater.Number !== '' && skater.Number !== null) {
                    skaters.push(
                        <Button
                            key={`${skater.RecordType}-${skater.RecordID}`}
                            skater={skater}
                            active={active}
                            onClick={() => {
                                this.onSelectSkater(skater);
                            }}
                        >{skater.Number}</Button>
                    );
                }
            });
        }
        var className = cnames('team', 'team-' + this.props.side);
        var style:CSSProperties = {backgroundColor:this.props.color};

        return (
            <div className={className}>
                <div className="name" style={style}>{this.props.name}</div>
                <div className="skater-list">{skaters}</div>
                <div className="skater-decks">
                    <ScorekeeperTeamPositionDeck 
                        deck={this.props.team.Track}
                        current={this.props.team.Current}
                        title="Track"
                        onSelectPosition={this.onSelectPosition}/>
                    <ScorekeeperTeamPositionDeck 
                        deck={this.props.team.Deck}
                        current={this.props.team.Current}
                        title="Deck" 
                        onSelectPosition={this.onSelectPosition}/>
                </div>
                <div className="skater-buttons">
                    <Icon 
                        src={require('images/icons/star.png')}
                        onClick={this.onStarPass}
                        title="Star Pass"
                        />
                    <Icon 
                        src={require('images/icons/up.png')}
                        onClick={this.onShift}
                        title="Shift Decks"
                        />
                </div>
            </div>
        );
    }
}

interface PScorekeeperTeamDeck {
    deck:SScorekeeperTeamDeck,
    current:SScorekeeperTeamDeckStatus,
    title:string,
    onSelectPosition:Function
}

function ScorekeeperTeamPositionDeck(props:PScorekeeperTeamDeck) {
    return (
        <div className="skater-deck">
            <ScorekeeperTeamPosition 
                position={props.deck.Jammer}
                current={props.current}
                deck={props.title}
                title="Jammer"
                onSelectPosition={props.onSelectPosition}
                />
            <ScorekeeperTeamPosition 
                position={props.deck.Pivot} 
                current={props.current}
                deck={props.title}
                title="Pivot"
                onSelectPosition={props.onSelectPosition}
                />
            <ScorekeeperTeamPosition 
                position={props.deck.Blocker1}
                current={props.current}
                deck={props.title}
                title="Blocker1"
                onSelectPosition={props.onSelectPosition}
                />
            <ScorekeeperTeamPosition 
                position={props.deck.Blocker2}
                current={props.current}
                deck={props.title}
                title="Blocker2"
                onSelectPosition={props.onSelectPosition}
                />
            <ScorekeeperTeamPosition
                position={props.deck.Blocker3} 
                current={props.current}
                deck={props.title}
                title="Blocker3"
                onSelectPosition={props.onSelectPosition}
                />
        </div>
    );
}

interface PScorekeeperPosition {
    position:SkaterRecord|null,
    current:SScorekeeperTeamDeckStatus,
    deck:string,
    title:string,
    onSelectPosition:Function
}

function ScorekeeperTeamPosition(props:PScorekeeperPosition) {
    var className = cnames({
        active:(props.position !== null),
        current:(props.current.Deck === props.deck && props.current.Position === props.title)
    });

    return (
        <Button 
            className={className}
            onClick={() => {
                props.onSelectPosition(props.deck, props.title);
            }}
            >{(props.position !== null) ? props.position.Number : ''}</Button>
    );
}

export default Scorekeeper;