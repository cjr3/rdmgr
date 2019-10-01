import React, { CSSProperties } from 'react'
import Panel from 'components/Panel'
import cnames from 'classnames';
import ScoreboardController, {SScoreboardTeam} from 'controllers/ScoreboardController'
import ScorekeeperController, {SScorekeeperState, SScorekeeperTeam, SScorekeeperTeamDeckStatus, SScorekeeperTeamDeck} from 'controllers/ScorekeeperController'
import CaptureController from 'controllers/CaptureController'
import RosterController from 'controllers/RosterController';
import {Button, IconButton, Icon, IconShown, IconHidden, IconUp} from 'components/Elements';
import { SkaterRecord } from 'tools/vars';
import DataController from 'controllers/DataController';
import './css/Scorekeeper.scss';

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
}> {
    readonly state = {
        Shown:CaptureController.getState().Scorekeeper.Shown,
        TeamA:ScoreboardController.getState().TeamA,
        TeamB:ScoreboardController.getState().TeamB,
        State:ScorekeeperController.getState(),
        TeamASkaters:RosterController.getState().TeamA.Skaters,
        TeamBSkaters:RosterController.getState().TeamB.Skaters
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
     * Starts listeners
     */
    componentDidMount() {
        this.remoteState = ScorekeeperController.subscribe(this.updateState);
        this.remoteCapture = CaptureController.subscribe(this.updateCapture);
        this.remoteScore = ScoreboardController.subscribe(this.updateScoreboard);
        this.remoteRoster = RosterController.subscribe(this.updateRoster);
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
                let src:string = logoA;
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
                );
            }
            i++;
        }

        for(let key in this.state.State.TeamB.Track) {
            let skater:SkaterRecord|null = this.state.State.TeamB.Track[key];
            if(skater !== null) {
                let src:string = logoB;
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
                );
            }
            i++;
        }

        let buttons:Array<React.ReactElement> = [
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

    /**
     * Triggered when the user selects a skater
     * @param skater SkaterRecord
     */
    onSelectSkater(skater) {
        ScorekeeperController.SetPosition(this.props.side, skater);
    }

    /**
     * Triggered when the user selects a position
     * @param deck 
     * @param position string
     */
    onSelectPosition(deck, position) {
        ScorekeeperController.SetPosition(this.props.side, null, position, deck);
    }

    /**
     * Triggered when the user shifts the decks
     */
    onShift() {
        ScorekeeperController.ShiftDecks(this.props.side);
    }

    /**
     * Triggered when the user presses the star pass button
     */
    onStarPass() {
        ScorekeeperController.StarPass(this.props.side);
    }
    
    /**
     * Renders the component.
     */
    render() {
        let skaters:Array<React.ReactElement> = [];
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
                                this.onSelectSkater(Object.assign({}, skater, {Color:this.props.color}));
                            }}
                        >{skater.Number}</Button>
                    );
                }
            });
        }
        let className:string = cnames('team', 'team-' + this.props.side);
        let style:CSSProperties = {backgroundColor:this.props.color};

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
    let className:string = cnames({
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