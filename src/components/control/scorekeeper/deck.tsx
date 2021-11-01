import React from 'react';
import { Unsubscribe } from 'redux';
import { Scorekeeper } from 'tools/scorekeeper/functions';
import { Deck, DeckChoice, ScorekeeperPosition, TeamSide } from 'tools/vars';
import { PositionItem } from './position';

interface Props {
    currentDeck?:DeckChoice;
    currentPosition?:ScorekeeperPosition;
    deck:DeckChoice;
    side:TeamSide;
    onSelect:{(side:TeamSide, deck:DeckChoice, position:ScorekeeperPosition):void};
}

interface State {
    blocker1:number;
    blocker2:number;
    blocker3:number;
    jammer:number;
    pivot:number;
}

/**
 * 
 */
class Main extends React.PureComponent<Props, State> {
    readonly state:State = {
        blocker1:0,
        blocker2:0,
        blocker3:0,
        jammer:0,
        pivot:0,
    }

    protected remote?:Unsubscribe;

    protected update = () => {
        const state = Scorekeeper.Get();
        let deck:Deck|undefined = undefined;
        if(this.props.side === 'A') {
            deck = (this.props.deck === 'Deck') ? state.DeckA : state.TrackA;
        } else if(this.props.side === 'B') {
            deck = (this.props.deck === 'Deck') ? state.DeckB : state.TrackB;
        }

        if(deck) {
            // console.log(deck);
            this.setState({
                blocker1:deck.Blocker1?.RecordID || 0,
                blocker2:deck.Blocker2?.RecordID || 0,
                blocker3:deck.Blocker3?.RecordID || 0,
                pivot:deck.Pivot?.RecordID || 0,
                jammer:deck.Jammer?.RecordID || 0,
            });
        }
    }

    componentDidMount() {
        this.remote = Scorekeeper.Subscribe(this.update);
        this.update();
    }

    componentWillUnmount() {
        if(this.remote)
            this.remote();
    }

    render() {
        const title = (this.props.deck === 'Deck') ? 'Deck' : 'Track';
        const positions:{position:ScorekeeperPosition, id:number}[] = [
            {position:'Jammer', id:this.state.jammer},
            {position:'Pivot', id:this.state.pivot},
            {position:'Blocker1', id:this.state.blocker1},
            {position:'Blocker2', id:this.state.blocker2},
            {position:'Blocker3', id:this.state.blocker3},
        ];
        return <div className='deck'>
            <div className='title'>{title}</div>
            {
                positions.map(pos => {
                    return <PositionItem
                        active={this.props.currentDeck === this.props.deck && this.props.currentPosition === pos.position}
                        currentDeck={this.props.currentDeck}
                        currentPosition={this.props.currentPosition}
                        deck={this.props.deck}
                        position={pos.position}
                        recordId={pos.id}
                        side={this.props.side}
                        onSelect={this.props.onSelect}
                        key={`pos-${this.props.deck}-${pos.position}`}
                    />
                })
            }
        </div>
    }
};

export {Main as ScorekeeperDeck};