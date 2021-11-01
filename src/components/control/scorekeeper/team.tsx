import React from 'react';
import { Unsubscribe } from 'redux';
import { Scoreboard } from 'tools/scoreboard/functions';
import { Scorekeeper } from 'tools/scorekeeper/functions';
import { DeckChoice, ScorekeeperPosition, TeamSide } from 'tools/vars';
import { ScorekeeperDeck } from './deck';
import { ScorekeeperSkaters } from './skaters';

interface Props {
    jammerOnly:boolean;
    side:TeamSide;
}

interface State {
    deck?:DeckChoice;
    color:string;
    name:string;
    position?:ScorekeeperPosition;
}

class Main extends React.PureComponent<Props, State> {
    readonly state:State = {
        color:'transparent',
        name:''
    }

    protected remote?:Unsubscribe;

    protected update = () => {
        const state = Scoreboard.GetState();
        this.setState({
            color:(this.props.side === 'A' ? state.TeamA?.Color : state.TeamB?.Color) || 'transparent',
            name:(this.props.side === 'A' ? state.TeamA?.Name : state.TeamB?.Name) || '',
        })
    }

    /**
     * 
     * @param side 
     * @param deck 
     * @param position 
     */
    protected onSelectPosition = (side:TeamSide, deck:DeckChoice, position:ScorekeeperPosition) => {
        if(side === this.props.side) {
            if(this.state.position && this.state.deck && (this.state.deck !== deck || this.state.position !== position)) {
                //swap positions
                Scorekeeper.SwapPositions(this.props.side, this.state.deck, this.state.position, deck, position);
                this.setState({deck:undefined, position:undefined});
            } else {
                this.setState({
                    position:(this.state.position === position && this.state.deck === deck) ? undefined : position,
                    deck:(this.state.position === position && this.state.deck === deck) ? undefined : deck
                });
            }
        }
    }

    componentDidMount() {
        this.remote = Scoreboard.Subscribe(this.update);
        this.update();
    }

    componentWillUnmount() {
        if(this.remote)
            this.remote();
    }

    render() {
        let position = (this.props.jammerOnly) ? 'Jammer' : this.state.position;
        return <div className={'team team-' + this.props.side}>
            <div className='name' style={{backgroundColor:this.state.color}}>{this.state.name}</div>
            <div className='decks'>
                <ScorekeeperDeck 
                    side={this.props.side} 
                    deck='Track' 
                    currentDeck={this.state.deck} 
                    currentPosition={position}
                    onSelect={this.onSelectPosition}
                    />
                <ScorekeeperDeck 
                    side={this.props.side} 
                    deck='Deck' 
                    currentDeck={this.state.deck} 
                    currentPosition={position}
                    onSelect={this.onSelectPosition}
                />
            </div>
            <ScorekeeperSkaters 
                deck={this.state.deck}
                position={this.state.position}
                jammerOnly={this.props.jammerOnly}
                side={this.props.side}
                onSet={() => {
                    this.setState({deck:undefined, position:undefined})
                }}
                />
        </div>
    }
}

export {Main as ScorekeeperTeam};