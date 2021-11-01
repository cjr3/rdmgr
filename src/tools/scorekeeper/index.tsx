import {
    SMainController,
    Skater,
    Deck,
    DeckChoice,
    TeamSide,
    SScorekeeper,
    ScorekeeperPosition
} from '../vars';

namespace ScorekeeperState {
    /**
     * Set the position of a skater on the track / on-deck.
     * @param state 
     * @param side 
     * @param record A skater record, or undefined to clear the position
     * @param deck The deck choice, or undefined to choose the next available deck
     * @param position The position choice, or undefined to choose the next available position
     * @returns 
     */
    export const SetPosition = (state:SMainController, side:TeamSide, record?:Skater, deck?:DeckChoice, position?:ScorekeeperPosition) : SMainController => {
        if(deck === 'Deck') {
            return SetDeckPosition(state, side, record, position);
        } else if(deck === 'Track') {
            return SetTrackPosition(state, side, record, position);
        } else {
            return SetTeamPosition(state, side, record);
        }
    };

    /**
     * 
     * @param state 
     * @param side 
     * @param record 
     * @param position 
     * @returns 
     */
    const SetDeckPosition = (state:SMainController, side:TeamSide, record?:Skater, position?:ScorekeeperPosition) : SMainController => {
        if(side === 'A') {
            if(!position) {
                const deck = {...state.Scorekeeper.DeckA};
                const other = {...state.Scorekeeper.TrackA};
                if(SetAvailableDeckPosition(deck, record, other)) {
                    return {
                        ...state,
                        Scorekeeper:{
                            ...state.Scorekeeper,
                            DeckA:deck,
                            TrackA:other
                        },
                        UpdateTimeScorekeeper:Date.now()
                    }
                }
            } else {
                return {
                    ...state,
                    Scorekeeper:{
                        ...state.Scorekeeper,
                        DeckA:{
                            ...state.Scorekeeper.DeckA,
                            [position]:(record) ? {...record, Teams:[]} : undefined
                        }
                    },
                    UpdateTimeScorekeeper:Date.now()
                }
            }
        } else if(side === 'B') {
            if(!position) {
                const deck = {...state.Scorekeeper.DeckB};
                const other = {...state.Scorekeeper.TrackB};
                if(SetAvailableDeckPosition(deck, record, other)) {
                    return {
                        ...state,
                        Scorekeeper:{
                            ...state.Scorekeeper,
                            DeckB:deck,
                            TrackB:other
                        },
                        UpdateTimeScorekeeper:Date.now()
                    }
                }
            } else {
                return {
                    ...state,
                    Scorekeeper:{
                        ...state.Scorekeeper,
                        DeckB:{
                            ...state.Scorekeeper.DeckB,
                            [position]:(record) ? {...record, Teams:[]} : undefined
                        }
                    },
                    UpdateTimeScorekeeper:Date.now()
                }
            }
        }

        return state;
    };

    /**
     * Set the skater's position based on the next available position
     * @param state 
     * @param side 
     * @param record 
     */
    const SetTeamPosition = (state:SMainController, side:TeamSide, record?:Skater) : SMainController => {
        if(side === 'A') {
            const track = {...state.Scorekeeper.TrackA};
            const other = {...state.Scorekeeper.DeckA};
            if(SetAvailableDeckPosition(track, record, other)) {
                return {
                    ...state,
                    Scorekeeper:{
                        ...state.Scorekeeper,
                        TrackA:track,
                        DeckA:other
                    },
                    UpdateTimeScorekeeper:Date.now()
                }
            } else {
                const deck = {...state.Scorekeeper.DeckA};
                const other = {...state.Scorekeeper.TrackA};
                if(SetAvailableDeckPosition(deck, record, other)) {
                    return {
                        ...state,
                        Scorekeeper:{
                            ...state.Scorekeeper,
                            DeckA:deck,
                            TrackA:other
                        },
                        UpdateTimeScorekeeper:Date.now()
                    }
                }
            }
        } else if(side === 'B') {
            const track = {...state.Scorekeeper.TrackB};
            const other = {...state.Scorekeeper.DeckB}
            if(SetAvailableDeckPosition(track, record, other)) {
                return {
                    ...state,
                    Scorekeeper:{
                        ...state.Scorekeeper,
                        TrackB:track,
                        DeckB:other
                    },
                    UpdateTimeScorekeeper:Date.now()
                }
            } else {
                const deck = {...state.Scorekeeper.DeckB};
                const other = {...state.Scorekeeper.TrackB};
                if(SetAvailableDeckPosition(deck, record, other)) {
                    return {
                        ...state,
                        Scorekeeper:{
                            ...state.Scorekeeper,
                            DeckB:deck,
                            TrackB:other
                        },
                        UpdateTimeScorekeeper:Date.now()
                    }
                }
            }
        }

        return state;
    };

    /**
     * 
     * @param state 
     * @param side 
     * @param record 
     * @param position 
     * @returns 
     */
    const SetTrackPosition = (state:SMainController, side:TeamSide, record?:Skater, position?:ScorekeeperPosition) : SMainController => {
        if(side === 'A') {
            if(!position) {
                const deck = {...state.Scorekeeper.TrackA};
                const other = {...state.Scorekeeper.DeckA}
                if(SetAvailableDeckPosition(deck, record, other)) {
                    return {
                        ...state,
                        Scorekeeper:{
                            ...state.Scorekeeper,
                            TrackA:deck,
                            DeckA:other
                        },
                        UpdateTimeScorekeeper:Date.now()
                    }
                }
            } else {
                return {
                    ...state,
                    Scorekeeper:{
                        ...state.Scorekeeper,
                        TrackA:{
                            ...state.Scorekeeper.TrackA,
                            [position]:(record) ? {...record, Teams:[]} : undefined
                        }
                    },
                    UpdateTimeScorekeeper:Date.now()
                }
            }
        } else if(side === 'B') {
            if(!position) {
                const deck = {...state.Scorekeeper.TrackB};
                const other = {...state.Scorekeeper.DeckB};
                if(SetAvailableDeckPosition(deck, record, other)) {
                    return {
                        ...state,
                        Scorekeeper:{
                            ...state.Scorekeeper,
                            TrackB:deck,
                            DeckB:other
                        },
                        UpdateTimeScorekeeper:Date.now()
                    }
                }
            } else {
                return {
                    ...state,
                    Scorekeeper:{
                        ...state.Scorekeeper,
                        TrackB:{
                            ...state.Scorekeeper.TrackB,
                            [position]:(record) ? {...record, Teams:[]} : undefined
                        }
                    },
                    UpdateTimeScorekeeper:Date.now()
                }
            }
        }

        return state;
    };

    /**
     * 
     * @param deck 
     * @param record 
     * @returns 
     */
    const SetAvailableDeckPosition = (deck:Deck, record?:Skater, otherDeck?:Deck) : boolean => {
        let set = false;
        if(record && record.RecordID) {

            //remove if already assigned.
            if(deck.Jammer?.RecordID === record.RecordID) {
                deck.Jammer = undefined;
                return true;
            }
            if(deck.Blocker1?.RecordID === record.RecordID) {
                deck.Blocker1 = undefined;
                return true;
            }
            if(deck.Blocker2?.RecordID === record.RecordID) {
                deck.Blocker2 = undefined;
                return true;
            }
            if(deck.Blocker3?.RecordID === record.RecordID) {
                deck.Blocker3 = undefined;
                return true;
            }
            if(deck.Pivot?.RecordID === record.RecordID) {
                deck.Pivot = undefined;
                return true;
            }
            if(otherDeck?.Jammer?.RecordID === record.RecordID) {
                otherDeck.Jammer = undefined;
                return true;
            }
            if(otherDeck?.Blocker1?.RecordID === record.RecordID) {
                otherDeck.Blocker1 = undefined;
                return true;
            }
            if(otherDeck?.Blocker2?.RecordID === record.RecordID) {
                otherDeck.Blocker2 = undefined;
                return true;
            }
            if(otherDeck?.Blocker3?.RecordID === record.RecordID) {
                otherDeck.Blocker3 = undefined;
                return true;
            }
            if(otherDeck?.Pivot?.RecordID === record.RecordID) {
                otherDeck.Pivot = undefined;
                return true;
            }
        }

        if(!deck.Jammer) {
            deck.Jammer = (record) ? {...record, Teams:[]} : undefined;
            set = true;
        } else if(!deck.Pivot) {
            deck.Pivot = (record) ? {...record, Teams:[]} : undefined;
            set = true;
        } else if(!deck.Blocker1) {
            deck.Blocker1 = (record) ? {...record, Teams:[]} : undefined;
            set = true;
        } else if(!deck.Blocker2) {
            deck.Blocker2 = (record) ? {...record, Teams:[]} : undefined;
            set = true;
        } else if(!deck.Blocker3) {
            deck.Blocker3 = (record) ? {...record, Teams:[]} : undefined;
            set = true;
        }

        return set;
    };

    /**
     * Update the scorekeeper state.
     * @param state 
     * @param values 
     * @returns 
     */
    export const Update = (state:SMainController, values:SScorekeeper) : SMainController => {
        return {
            ...state,
            Scorekeeper:{
                ...state.Scorekeeper,
                ...values
            },
            UpdateTimeScorekeeper:Date.now()
        }
    }
}

export {ScorekeeperState};