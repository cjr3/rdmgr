import React from 'react'
import Panel from 'components/Panel'
import cnames from 'classnames';
import ScoreboardController from 'controllers/ScoreboardController'
import ScorekeeperController from 'controllers/ScorekeeperController'
import CaptureController from 'controllers/CaptureController'
import DataController from 'controllers/DataController';
import RosterController from 'controllers/RosterController';
import {Button, IconButton, Icon} from 'components/Elements';

import './css/Scorekeeper.scss';

/**
 * Component for tracking skaters on the track / on-deck
 */
class Scorekeeper extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            Capture:Object.assign({}, CaptureController.getState().Scorekeeper),
            TeamA:Object.assign({}, ScoreboardController.getState().TeamA),
            TeamB:Object.assign({}, ScoreboardController.getState().TeamB),
            State:Object.assign({}, ScorekeeperController.getState()),
            TeamASkaters:RosterController.getState().TeamA.Skaters.slice(),
            TeamBSkaters:RosterController.getState().TeamB.Skaters.slice()
        };

        this.updateState = this.updateState.bind(this);
        this.updateCapture = this.updateCapture.bind(this);
        this.updateScoreboard = this.updateScoreboard.bind(this);
        this.updateRoster = this.updateRoster.bind(this);

        this.remote = ScorekeeperController.subscribe(this.updateState);
        this.remoteCapture = CaptureController.subscribe(this.updateCapture);
        this.remoteScore = ScoreboardController.subscribe(this.updateScoreboard);
        this.remoteRoster = RosterController.subscribe(this.updateRoster);
    }

    /**
     * Updates the state to match the controller.
     */
    updateState() {
        this.setState(() => {
            return {State:Object.assign({}, ScorekeeperController.getState())};
        });
    }

    /**
     * Updates the capture state to match the controller.
     */
    updateCapture() {
        this.setState(() => {
            return {Capture:Object.assign({}, CaptureController.getState().Scorekeeper)};
        });
    }

    /**
     * Updates the teams state to match the scoreboard controller.
     */
    updateScoreboard() {
        this.setState(() => {
            var cstate = ScoreboardController.getState();
            return {
                TeamA:Object.assign({}, this.state.TeamA, {
                    ID:cstate.TeamA.ID,
                    Name:cstate.TeamA.Name,
                    Color:cstate.TeamA.Color
                }),
                TeamB:Object.assign({}, this.state.TeamB, {
                    ID:cstate.TeamB.ID,
                    Name:cstate.TeamB.Name,
                    Color:cstate.TeamB.Color
                })
            };
        });
    }
    
    updateRoster() {
        if(!DataController.compare(RosterController.getState().TeamA.Skaters, this.state.TeamASkaters)) {
            this.setState(() => {
                return {TeamASkaters:RosterController.getState().TeamA.Skaters.slice()};
            });
        }
        
        if(!DataController.compare(RosterController.getState().TeamB.Skaters, this.state.TeamBSkaters)) {
            this.setState(() => {
                return {TeamBSkaters:RosterController.getState().TeamB.Skaters.slice()};
            });
        }
    }

    render() {
        var iconShown = 'eye-closed.png'
        if(this.state.Capture.Shown)
            iconShown = 'eye-open.png';
        iconShown = require('images/icons/' + iconShown);

        var buttons = [
            <IconButton
                key="btn-shown"
                src={iconShown}
                active={this.state.Capture.Shown}
                onClick={CaptureController.ToggleScorekeeper}
            >{(this.state.Capture.Shown) ? 'Hide' : 'Show'}</IconButton>,
            <IconButton
                key="btn-shift"
                src={require('images/icons/up.png')}
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
                    boardteam={this.state.TeamA}
                    team={this.state.State.TeamA}
                    skaters={this.state.TeamASkaters}
                    />
                <ScorekeeperTeam 
                    side='B' 
                    boardteam={this.state.TeamB}
                    team={this.state.State.TeamB}
                    skaters={this.state.TeamBSkaters}
                    />
            </Panel>
        )
    }
}

/**
 * Component represents a team.
 */
class ScorekeeperTeam extends React.PureComponent {
    constructor(props) {
        super(props);
        var skaters = DataController.prepareRecordsForSaving(DataController.getTeamSkaters(this.props.boardteam.ID));
        skaters.forEach((skater) => {
            skater.Color = this.props.boardteam.Color;
        });
        this.state = {
            Skaters:skaters,
            LockTeam:false
        };

        this.state.Skaters.forEach((skater) => {
            skater.Position = null;
        });

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
        var skaters = [];
        if(this.props.skaters) {
            this.props.skaters.forEach((skater) => {
                skater.Color = this.props.boardteam.Color;
                if(skater.Number !== '' && skater.Number !== null) {
                    skaters.push(
                        <Button
                            key={`${skater.RecordType}-${skater.RecordID}`}
                            skater={skater}
                            active={(skater.Position !== null)}
                            onClick={() => {
                                this.onSelectSkater(skater);
                            }}
                        >{skater.Number}</Button>
                    );
                }
            });
        }
        var className = cnames('team', 'team-' + this.props.side);
        var style = {backgroundColor:this.props.boardteam.Color};

        return (
            <div className={className}>
                <div className="name" style={style}>{this.props.boardteam.Name}</div>
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

/**
 * Collection of five positions.
 */
class ScorekeeperTeamPositionDeck extends React.PureComponent {
    render() {
        return (
            <div className="skater-deck">
                <ScorekeeperTeamPosition 
                    position={this.props.deck.Jammer}
                    current={this.props.current}
                    deck={this.props.title}
                    title="Jammer"
                    onSelectPosition={this.props.onSelectPosition}
                    />
                <ScorekeeperTeamPosition 
                    position={this.props.deck.Pivot} 
                    current={this.props.current}
                    deck={this.props.title}
                    title="Pivot"
                    onSelectPosition={this.props.onSelectPosition}
                    />
                <ScorekeeperTeamPosition 
                    position={this.props.deck.Blocker1}
                    current={this.props.current}
                    deck={this.props.title}
                    title="Blocker1"
                    onSelectPosition={this.props.onSelectPosition}
                    />
                <ScorekeeperTeamPosition 
                    position={this.props.deck.Blocker2}
                    current={this.props.current}
                    deck={this.props.title}
                    title="Blocker2"
                    onSelectPosition={this.props.onSelectPosition}
                    />
                <ScorekeeperTeamPosition
                    position={this.props.deck.Blocker3} 
                    current={this.props.current}
                    deck={this.props.title}
                    title="Blocker3"
                    onSelectPosition={this.props.onSelectPosition}
                    />
            </div>
        );
    }
}

/**
 * Component that represents a position on a deck.
 */
class ScorekeeperTeamPosition extends React.PureComponent {
    render() {
        var className = cnames({
            active:(this.props.position !== null),
            current:(this.props.current.Deck === this.props.deck && this.props.current.Position === this.props.title)
        });

        return (
            <Button 
                className={className}
                onClick={() => {
                    this.props.onSelectPosition(this.props.deck, this.props.title);
                }}
                >{(this.props.position !== null) ? this.props.position.Number : ''}</Button>
        )
    }
}

export default Scorekeeper;