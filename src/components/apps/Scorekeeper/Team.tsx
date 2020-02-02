import React, { CSSProperties } from 'react';
import ScorekeeperController, {Sides, Decks, Positions, SScorekeeperTeamDeck, SScorekeeperState} from 'controllers/ScorekeeperController';
import { IconStar, Button, IconButton } from 'components/Elements';
import cnames from 'classnames';
import { Unsubscribe } from 'redux';
import ScoreboardController from 'controllers/ScoreboardController';
import { SkaterRecord } from 'tools/vars';
import RosterController from 'controllers/RosterController';
import { Compare } from 'controllers/functions';

export default class Team extends React.PureComponent<{
    side:Sides;
}> {
    render() {
        let className:string = cnames('team', 'team-' + this.props.side);
        return (
            <div className={className}>
                <TeamName side={this.props.side}/>
                <SkaterRecords side={this.props.side}/>
                <div className="skater-decks">
                    <SkaterDeck deck="Track" side={this.props.side}/>
                    <SkaterDeck deck="Deck" side={this.props.side}/>
                </div>
                <TeamControls side={this.props.side}/>
            </div>
        )
    }
}

function TeamControls(props:{side:Sides}) {
    return (
        <div className="skater-buttons">
            <IconButton 
                src={IconStar}
                onClick={() => {ScorekeeperController.StarPass(props.side)}}
                title="Star Pass"
                >Star Pass</IconButton>
        </div>
    );
}

class TeamName extends React.PureComponent<{
    side:Sides;
}, {
    Name:string;
    Color:string;
}> {
    readonly state = {
        Name:ScoreboardController.GetState().TeamA.Name,
        Color:ScoreboardController.GetState().TeamA.Color
    }

    protected remoteScoreboard:Unsubscribe|null = null;

    constructor(props) {
        super(props);
        this.updateSocreboard = this.updateSocreboard.bind(this);
        if(this.props.side == 'B') {
            this.state.Name = ScoreboardController.GetState().TeamB.Name;
            this.state.Color = ScoreboardController.GetState().TeamB.Color;
        }
    }

    protected async updateSocreboard() {
        let name:string = ScoreboardController.GetState().TeamA.Name;
        let color:string = ScoreboardController.GetState().TeamA.Color;
        if(this.props.side === 'B') {
            name = ScoreboardController.GetState().TeamB.Name;
            color = ScoreboardController.GetState().TeamB.Color;
        }

        this.setState({Name:name,Color:color});
    }

    componentDidMount() {
        this.remoteScoreboard = ScoreboardController.Subscribe(this.updateSocreboard);
    }
    
    componentWillUnmount() {
        if(this.remoteScoreboard !== null)
            this.remoteScoreboard();
    }

    render() {
        let style:CSSProperties = {backgroundColor:this.state.Color};
        return (
            <div className="name" style={style}>{this.state.Name}</div>
        )
    }
}

class SkaterRecords extends React.PureComponent<{
    side:Sides;
}, {
    Records:Array<SkaterRecord>;
    Color:string;
    Track:SScorekeeperTeamDeck;
    Deck:SScorekeeperTeamDeck;
}> {
    readonly state = {
        Records:RosterController.GetState().TeamA.Skaters,
        Track:ScorekeeperController.GetState().TeamA.Track,
        Deck:ScorekeeperController.GetState().TeamA.Deck,
        Color:ScoreboardController.GetState().TeamA.Color
    }

    protected remoteRoster:Unsubscribe|null = null;
    protected remoteScoreboard:Unsubscribe|null = null;
    protected remoteScorekeeper?:Unsubscribe;

    constructor(props) {
        super(props);
        this.updateRoster = this.updateRoster.bind(this);
        this.updateScoreboard = this.updateScoreboard.bind(this);
        this.updateScorekeeper = this.updateScorekeeper.bind(this);
        this.onSelectSkater = this.onSelectSkater.bind(this);
        if(this.props.side == 'A') {
            this.state.Records = RosterController.GetState().TeamA.Skaters;
            this.state.Track = ScorekeeperController.GetState().TeamA.Track;
            this.state.Deck = ScorekeeperController.GetState().TeamA.Deck;
        } else if(this.props.side === 'B') {
            this.state.Records = RosterController.GetState().TeamB.Skaters;
            this.state.Track = ScorekeeperController.GetState().TeamB.Track;
            this.state.Deck = ScorekeeperController.GetState().TeamB.Deck;
        }
    }

    protected async updateRoster() {
        let records = RosterController.GetState().TeamA.Skaters;

        if(this.props.side === 'B')
            records = RosterController.GetState().TeamB.Skaters;

        this.setState({Records:records});
    }

    protected async updateScoreboard() {
        let color = ScoreboardController.GetState().TeamA.Color;
        if(this.props.side === 'B')
            color = ScoreboardController.GetState().TeamB.Color;
        this.setState({Color:color});
    }

    protected async updateScorekeeper() {
        let track:SScorekeeperTeamDeck = ScorekeeperController.GetState().TeamA.Track;
        let deck:SScorekeeperTeamDeck = ScorekeeperController.GetState().TeamA.Deck;
        if(this.props.side == 'B') {
            track = ScorekeeperController.GetState().TeamB.Track;
            deck = ScorekeeperController.GetState().TeamB.Deck;
        }

        this.setState({
            Track:track,
            Deck:deck
        });
    }

    /**
     * Triggered when the user selects a skater
     * @param skater SkaterRecord
     */
    protected async onSelectSkater(skater) {
        ScorekeeperController.SetPosition(this.props.side, skater, null, null);
    }

    componentDidMount() {
        this.remoteRoster = RosterController.Subscribe(this.updateRoster);
        this.remoteScoreboard = ScoreboardController.Subscribe(this.updateScoreboard);
        this.remoteScorekeeper = ScorekeeperController.Subscribe(this.updateScorekeeper);
    }

    componentWillUnmount() {
        if(this.remoteRoster !== null)
            this.remoteRoster();
        if(this.remoteScoreboard !== null)
            this.remoteScoreboard();
        if(this.remoteScorekeeper)
            this.remoteScorekeeper();
    }
    
    /**
     * Renders the component
     */
    render() {
        let skaters:Array<React.ReactElement> = new Array<React.ReactElement>();
        this.state.Records.forEach((skater:SkaterRecord) => {
            if(skater.Number !== '' && skater.Number !== null) {
                let className = cnames({
                    active:(skater.Position && skater.Deck == 'Track'),
                    ondeck:(skater.Position && skater.Deck == 'Deck'),
                    jammer:(skater.Position && skater.Position === 'Jammer'),
                    pivot:(skater.Position && skater.Position === 'Pivot'),
                    penalized:(skater.Penalties && skater.Penalties.length >= 1)
                });
                skaters.push(
                    <Button
                        key={`${skater.RecordType}-${skater.RecordID}`}
                        className={className}
                        onClick={() => {
                            this.onSelectSkater(Object.assign({}, skater, {Color:this.state.Color}));
                        }}
                        title={skater.Name}
                    >{skater.Number}</Button>
                );
            }
        });

        return (
            <div className="skater-list">{skaters}</div>
        );
    }
}

class SkaterDeck extends React.PureComponent<{
    side:Sides;
    deck:Decks;
}, {
    Jammer:SkaterRecord;
    Pivot:SkaterRecord;
    Blocker1:SkaterRecord;
    Blocker2:SkaterRecord;
    Blocker3:SkaterRecord;
}> {
    readonly state = {
        Jammer:ScorekeeperController.GetState().TeamA.Track.Jammer,
        Pivot:ScorekeeperController.GetState().TeamA.Track.Pivot,
        Blocker1:ScorekeeperController.GetState().TeamA.Track.Blocker1,
        Blocker2:ScorekeeperController.GetState().TeamA.Track.Blocker2,
        Blocker3:ScorekeeperController.GetState().TeamA.Track.Blocker3
    }

    protected remoteScorekeeper:Unsubscribe|null = null;

    constructor(props) {
        super(props);
        this.updateScorekeeper = this.updateScorekeeper.bind(this);
    }

    protected async updateScorekeeper() {
        let cstate:SScorekeeperState = ScorekeeperController.GetState();
        if(this.props.side == 'A') {
            if(this.props.deck == 'Track') {
                this.setState({...cstate.TeamA.Track});
            } else {
                this.setState({...cstate.TeamA.Deck});
            }
        } else {
            if(this.props.deck == 'Track') {
                this.setState({...cstate.TeamB.Track});
            } else {
                this.setState({...cstate.TeamB.Deck});
            }
        }
    }

    componentDidMount() {
        this.remoteScorekeeper = ScorekeeperController.Subscribe(this.updateScorekeeper);
        this.updateScorekeeper();
    }

    componentWillUnmount() {
        if(this.remoteScorekeeper !== null)
            this.remoteScorekeeper();
    }

    render() {
        return (
            <div className="skater-deck">
                <SkaterPosition
                    side={this.props.side}
                    deck={this.props.deck}
                    skater={this.state.Jammer}
                    position="Jammer"
                />
                <SkaterPosition
                    side={this.props.side}
                    deck={this.props.deck}
                    skater={this.state.Pivot}
                    position="Pivot"
                />
                <SkaterPosition
                    side={this.props.side}
                    deck={this.props.deck}
                    skater={this.state.Blocker1}
                    position="Blocker1"
                />
                <SkaterPosition
                    side={this.props.side}
                    deck={this.props.deck}
                    skater={this.state.Blocker2}
                    position="Blocker2"
                />
                <SkaterPosition
                    side={this.props.side}
                    deck={this.props.deck}
                    skater={this.state.Blocker3}
                    position="Blocker3"
                />
            </div>
        );
    }
}

class SkaterPosition extends React.PureComponent<{
    skater:SkaterRecord|null;
    side:Sides;
    deck:Decks;
    position:Positions;
}, {
    CurrentDeck:string;
    CurrentPosition:string;
}> {

    readonly state = {
        CurrentDeck:'',
        CurrentPosition:''
    }

    protected remoteScorekeeper:Unsubscribe|null = null;

    constructor(props) {
        super(props);
        this.updateScorekeeper = this.updateScorekeeper.bind(this);
    }

    protected async updateScorekeeper() {
        let deck = ScorekeeperController.GetState().TeamA.Current.Deck;
        let position = ScorekeeperController.GetState().TeamA.Current.Position;
        if(this.props.side === 'B') {
            deck = ScorekeeperController.GetState().TeamB.Current.Deck;
            position = ScorekeeperController.GetState().TeamB.Current.Position;
        }

        this.setState({
            CurrentDeck:deck,
            CurrentPosition:position
        });
    }

    componentDidMount() {
        this.remoteScorekeeper = ScorekeeperController.Subscribe(this.updateScorekeeper);
    }

    componentWillUnmount() {
        if(this.remoteScorekeeper !== null)
            this.remoteScorekeeper();
    }

    render() {
        let className:string = cnames({
            active:(this.props.skater !== null),
            current:(this.state.CurrentDeck === this.props.deck && this.state.CurrentPosition === this.props.position)
        });
        let title:string = this.props.position;
        if(this.props.skater) {
            title = this.props.skater.Name;
        }

        return (
            <Button 
                className={className}
                onClick={() => {
                    ScorekeeperController.SetPosition(this.props.side, null, this.props.position, this.props.deck);
                }}
                title={title}
                >{(this.props.skater) ? this.props.skater.Number : ''}</Button>
        );
    }
}