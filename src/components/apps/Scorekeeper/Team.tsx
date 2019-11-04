import React, { CSSProperties } from 'react';
import ScorekeeperController from 'controllers/ScorekeeperController';
import { Icon, IconStar, IconUp, Button, IconButton } from 'components/Elements';
import cnames from 'classnames';
import { Unsubscribe } from 'redux';
import ScoreboardController from 'controllers/ScoreboardController';
import { SkaterRecord } from 'tools/vars';
import RosterController from 'controllers/RosterController';
import DataController from 'controllers/DataController';

export default class Team extends React.PureComponent<{
    side:string;
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

function TeamControls(props:{side:string}) {
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
    side:string;
}, {
    Name:string;
    Color:string;
}> {
    readonly state = {
        Name:'Team',
        Color:'#000'
    }

    protected remoteScoreboard:Unsubscribe|null = null;

    constructor(props) {
        super(props);
        this.updateSocreboard = this.updateSocreboard.bind(this);
    }

    protected async updateSocreboard() {
        let name:string = ScoreboardController.getState().TeamA.Name;
        let color:string = ScoreboardController.getState().TeamA.Color;
        if(this.props.side === 'B') {
            name = ScoreboardController.getState().TeamB.Name;
            color = ScoreboardController.getState().TeamB.Color;
        }

        this.setState({Name:name,Color:color});
    }

    componentDidMount() {
        this.remoteScoreboard = ScoreboardController.subscribe(this.updateSocreboard);
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
    side:string;
}, {
    Records:Array<SkaterRecord>;
    Color:string;
}> {
    readonly state = {
        Records:new Array<SkaterRecord>(),
        Color:''
    }

    protected remoteRoster:Unsubscribe|null = null;
    protected remoteScoreboard:Unsubscribe|null = null;

    constructor(props) {
        super(props);
        this.updateRoster = this.updateRoster.bind(this);
        this.updateScoreboard = this.updateScoreboard.bind(this);
        this.onSelectSkater = this.onSelectSkater.bind(this);
    }

    protected async updateRoster() {
        let records = RosterController.getState().TeamA.Skaters;

        if(this.props.side === 'B')
            records = RosterController.getState().TeamB.Skaters;

        if(!DataController.compare(records, this.state.Records))
            this.setState({Records:records});
    }

    protected async updateScoreboard() {
        let color = ScoreboardController.getState().TeamA.Color;
        if(this.props.side === 'B')
            color = ScoreboardController.getState().TeamB.Color;
        this.setState({Color:color});
    }

    /**
     * Triggered when the user selects a skater
     * @param skater SkaterRecord
     */
    protected async onSelectSkater(skater) {
        ScorekeeperController.SetPosition(this.props.side, skater);
    }

    componentDidMount() {
        this.remoteRoster = RosterController.subscribe(this.updateRoster);
        this.remoteScoreboard = ScoreboardController.subscribe(this.updateScoreboard);
        this.updateRoster();
        this.updateScoreboard();
    }

    componentWillUnmount() {
        if(this.remoteRoster !== null)
            this.remoteRoster();
        if(this.remoteScoreboard !== null)
            this.remoteScoreboard();
    }
    
    /**
     * Renders the component
     */
    render() {
        let skaters:Array<React.ReactElement> = new Array<React.ReactElement>();
        this.state.Records.forEach((skater, index) => {
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
    side:string;
    deck:string;
}, {
    Jammer:SkaterRecord|null;
    Pivot:SkaterRecord|null;
    Blocker1:SkaterRecord|null;
    Blocker2:SkaterRecord|null;
    Blocker3:SkaterRecord|null;
}> {
    readonly state = {
        Jammer:null,
        Pivot:null,
        Blocker1:null,
        Blocker2:null,
        Blocker3:null
    }

    protected remoteScorekeeper:Unsubscribe|null = null;

    constructor(props) {
        super(props);
        this.updateScorekeeper = this.updateScorekeeper.bind(this);
    }

    protected async updateScorekeeper() {
        let cstate = ScorekeeperController.getState();
        let skaters = cstate.TeamA.Track;
        if(this.props.deck === 'Deck')
            skaters = cstate.TeamA.Deck;
        if(this.props.side === 'B') {
            skaters = cstate.TeamB.Track;
            if(this.props.deck === 'Deck')
                skaters = cstate.TeamB.Deck;
        }

        if(!DataController.compare(skaters.Jammer, this.state.Jammer))
            this.setState({Jammer:skaters.Jammer});

        if(!DataController.compare(skaters.Pivot, this.state.Pivot))
            this.setState({Pivot:skaters.Pivot});

        if(!DataController.compare(skaters.Blocker1, this.state.Blocker1))
            this.setState({Blocker1:skaters.Blocker1});

        if(!DataController.compare(skaters.Blocker2, this.state.Blocker2))
            this.setState({Blocker2:skaters.Blocker2});

        if(!DataController.compare(skaters.Blocker3, this.state.Blocker3))
            this.setState({Blocker3:skaters.Blocker3});
    }

    componentDidMount() {
        this.remoteScorekeeper = ScorekeeperController.subscribe(this.updateScorekeeper);
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
    side:string;
    deck:string;
    position:string;
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
        let deck = ScorekeeperController.getState().TeamA.Current.Deck;
        let position = ScorekeeperController.getState().TeamA.Current.Position;
        if(this.props.side === 'B') {
            deck = ScorekeeperController.getState().TeamB.Current.Deck;
            position = ScorekeeperController.getState().TeamB.Current.Position;
        }

        this.setState({
            CurrentDeck:deck,
            CurrentPosition:position
        });
    }

    componentDidMount() {
        this.remoteScorekeeper = ScorekeeperController.subscribe(this.updateScorekeeper);
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

        return (
            <Button 
                className={className}
                onClick={() => {
                    ScorekeeperController.SetPosition(this.props.side, null, this.props.position, this.props.deck);
                }}
                >{(this.props.skater !== null) ? this.props.skater.Number : ''}</Button>
        );
    }
}