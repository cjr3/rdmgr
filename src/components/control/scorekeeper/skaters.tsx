import React from 'react';
import { Unsubscribe } from 'redux';
import { Roster } from 'tools/roster/functions';
import { Scorekeeper } from 'tools/scorekeeper/functions';
import { Skaters } from 'tools/skaters/functions';
import { DeckChoice, ScorekeeperPosition, TeamSide } from 'tools/vars';
import { SkaterItem } from './skater';

interface Props {
    deck?:DeckChoice;
    jammerOnly:boolean;
    position?:ScorekeeperPosition;
    side:TeamSide;
    onSet:{():void};
}

interface State {
    deckBlocker1Id:number;
    deckBlocker2Id:number;
    deckBlocker3Id:number;
    deckPivotId:number;
    deckJammerId:number;
    trackBlocker1Id:number;
    trackBlocker2Id:number;
    trackBlocker3Id:number;
    trackPivotId:number;
    trackJammerId:number;
    updateTime:number;
}

/**
 * Display skaters available for placing on the track or deck.
 */
class Main extends React.PureComponent<Props, State> {
    readonly state:State = {
        deckBlocker1Id:0,
        deckBlocker2Id:0,
        deckBlocker3Id:0,
        deckJammerId:0,
        deckPivotId:0,
        trackBlocker1Id:0,
        trackBlocker2Id:0,
        trackBlocker3Id:0,
        trackJammerId:0,
        trackPivotId:0,
        updateTime:0
    }

    protected remote?:Unsubscribe;

    protected update = () => {
        const state = Scorekeeper.Get();
        const deck = (this.props.side === 'A') ? state.DeckA : state.DeckB;
        const track = (this.props.side === 'B') ? state.TrackA : state.TrackB;
        this.setState({
            deckBlocker1Id:deck?.Blocker1?.RecordID || 0,
            deckBlocker2Id:deck?.Blocker2?.RecordID || 0,
            deckBlocker3Id:deck?.Blocker3?.RecordID || 0,
            deckPivotId:deck?.Pivot?.RecordID || 0,
            deckJammerId:deck?.Jammer?.RecordID || 0,
            trackBlocker1Id:track?.Blocker1?.RecordID || 0,
            trackBlocker2Id:track?.Blocker2?.RecordID || 0,
            trackBlocker3Id:track?.Blocker3?.RecordID || 0,
            trackPivotId:track?.Pivot?.RecordID || 0,
            trackJammerId:track?.Jammer?.RecordID || 0,
            updateTime:Scorekeeper.GetUpdateTime()
        });
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
        const skaters = Roster.GetSkaters(this.props.side).filter(s => s.Number);

        return <div className='skaters'>
            {
                skaters.map(skater => {
                    const record = Skaters.Get(skater.RecordID);
                    let position:ScorekeeperPosition|undefined = undefined;
                    let deck:DeckChoice|undefined = undefined;
                    if(skater.RecordID) {
                        switch(skater.RecordID) {
                            case this.state.deckBlocker1Id : position = 'Blocker1'; deck = 'Deck'; break;
                            case this.state.deckBlocker2Id : position = 'Blocker2'; deck = 'Deck'; break;
                            case this.state.deckBlocker3Id : position = 'Blocker3'; deck = 'Deck'; break;
                            case this.state.deckPivotId : position = 'Pivot'; deck = 'Deck'; break;
                            case this.state.deckJammerId : position = 'Jammer'; deck = 'Deck'; break;
                            case this.state.trackBlocker1Id : position = 'Blocker1'; deck = 'Track'; break;
                            case this.state.trackBlocker2Id : position = 'Blocker2'; deck = 'Track'; break;
                            case this.state.trackBlocker3Id : position = 'Blocker3'; deck = 'Track'; break;
                            case this.state.trackPivotId : position = 'Pivot'; deck = 'Track'; break;
                            case this.state.trackJammerId : position = 'Jammer'; deck = 'Track'; break;
                        }
                    }
                    //console.log(`${deck}:${position}:${skater.RecordID}`);
                    
                    return <SkaterItem
                        name={record?.Name || skater?.Name || ''}
                        num={record?.Number || skater?.Number || ''}
                        recordId={record.RecordID || skater.RecordID || 0}
                        side={this.props.side}
                        thumbnail={record.Thumbnail || skater.Thumbnail || ''}
                        currentDeck={this.props.deck}
                        currentPosition={this.props.position}
                        position={position}
                        jammerOnly={this.props.jammerOnly}
                        deck={deck}
                        onSet={this.props.onSet}
                        key={`skater-${skater.RecordID}`}
                    />
                })
            }
        </div>
    }
}

export {Main as ScorekeeperSkaters};