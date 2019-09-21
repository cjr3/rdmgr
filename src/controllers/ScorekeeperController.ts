import {createStore} from 'redux'
import {SkaterRecord} from 'tools/vars';

const SET_STATE = 'SET_STATE';
const SET_POSITION = 'SET_POSITION';
const STAR_PASS = 'STAR_PASS';
const SHIFT_DECKS = 'SHIFT_DECKS';
const SET_CURRENT_POSITION = 'SET_CURRENT_POSITION';

export interface SScorekeeperTeamDeckStatus {
    Deck:string,
    Position:string
}

export interface SScorekeeperTeamDeck {
    Jammer:SkaterRecord|null,
    Pivot:SkaterRecord|null,
    Blocker1:SkaterRecord|null,
    Blocker2:SkaterRecord|null,
    Blocker3:SkaterRecord|null,
}

export interface SScorekeeperTeam {
    Track:SScorekeeperTeamDeck,
    Deck:SScorekeeperTeamDeck,
    Current:SScorekeeperTeamDeckStatus
}

export interface SScorekeeperState {
    TeamA:SScorekeeperTeam,
    TeamB:SScorekeeperTeam
}

export const InitState:SScorekeeperState = {
    TeamA:{
        Track:{
            Jammer:null,
            Pivot:null,
            Blocker1:null,
            Blocker2:null,
            Blocker3:null
        },
        Deck:{
            Jammer:null,
            Pivot:null,
            Blocker1:null,
            Blocker2:null,
            Blocker3:null
        },
        Current:{
            Deck:'',
            Position:''
        }
    },
    TeamB:{
        Track:{
            Jammer:null,
            Pivot:null,
            Blocker1:null,
            Blocker2:null,
            Blocker3:null
        },
        Deck:{
            Jammer:null,
            Pivot:null,
            Blocker1:null,
            Blocker2:null,
            Blocker3:null
        },
        Current:{
            Deck:'',
            Position:''
        }
    }
};

function ScorekeeperReducer(state = InitState, action) {
    switch(action.type) {
        case SET_STATE :
            return Object.assign({}, state, action.values);

        //sets the skater of the giving position
        case SET_POSITION :
            var key = (action.team === 'A') ? 'TeamA' : 'TeamB';
            var team = state[key];
            if(action.Skater !== null) {
                var skaterDeck = '';
                var skaterPosition = '';
                for(let pkey in team.Track) {
                    if(team.Track[pkey] !== null && parseInt(team.Track[pkey].RecordID) === parseInt(action.Skater.RecordID)) {
                        skaterDeck = 'Track';
                        skaterPosition = pkey;
                    }
                }

                if(skaterDeck === '' && skaterPosition === '') {
                    for(let pkey in team.Deck) {
                        if(team.Deck[pkey] !== null && parseInt(team.Deck[pkey].RecordID) === parseInt(action.Skater.RecordID)) {
                            skaterDeck = 'Deck';
                            skaterPosition = pkey;
                        }
                    }
                }

                //remove skater
                if(skaterDeck === action.Deck && skaterPosition === action.Position) {
                    return Object.assign({}, state, {
                        [key]:Object.assign({}, state[key],{
                            [skaterDeck]:Object.assign({}, state[key][skaterDeck], {
                                [skaterPosition]:null
                            })
                        })
                    });
                }
                
                if(skaterDeck !== '' && action.Position === null) {
                    return state;
                }
            }

            if(team.Current.Deck !== '' && action.Deck === null)
                action.Deck = team.Current.Deck;

            if(team.Current.Position !== '' && action.Position === null)
                action.Position = team.Current.Position;

            if(action.Position === null || action.Deck === null) {

                //find next available position
                action.Deck = 'Track';
                if(team.Track.Jammer === null)
                    action.Position = 'Jammer';
                else if(team.Track.Pivot === null)
                    action.Position = 'Pivot';
                else if(team.Track.Blocker1 === null)
                    action.Position = 'Blocker1';
                else if(team.Track.Blocker2 === null)
                    action.Position = 'Blocker2';
                else if(team.Track.Blocker3 === null)
                    action.Position = 'Blocker3';

                if(action.Position === null) {
                    action.Deck = 'Deck';
                    if(team.Deck.Jammer === null)
                        action.Position = 'Jammer';
                    else if(team.Deck.Pivot === null)
                        action.Position = 'Pivot';
                    else if(team.Deck.Blocker1 === null)
                        action.Position = 'Blocker1';
                    else if(team.Deck.Blocker2 === null)
                        action.Position = 'Blocker2';
                    else if(team.Deck.Blocker3 === null)
                        action.Position = 'Blocker3';
                }
            }

            var deck = action.Deck;
            var position = action.Position;

            if(action.Skater === null) {
                if(state[key][deck][position] !== null) {
                    deck = '';
                    position = '';
                } else if(team.Current.Deck === deck && team.Current.Position === position) {
                    deck = '';
                    position = '';
                }
            } else if(action.Skater !== null) {
                deck = '';
                position = '';
            }
            
            return Object.assign({}, state, {
                [key]:Object.assign({}, state[key], {
                    [action.Deck]:Object.assign({}, state[key][action.Deck], {
                        [action.Position]:action.Skater
                    }),
                    Current:{
                        Deck:deck,
                        Position:position
                    }
                })
            });

        //performs a star pass, which swaps the target team's
        //pivot and jammer
        case STAR_PASS :
            var key = (action.team === 'A') ? 'TeamA' : 'TeamB';
            return Object.assign({}, state, {
                [key]:Object.assign({}, state[key], {
                    Track:Object.assign({}, state[key].Track,{
                        Jammer:(state[key].Track.Pivot !== null) ? Object.assign({}, state[key].Track.Pivot) : null,
                        Pivot:(state[key].Track.Jammer !== null) ? Object.assign({}, state[key].Track.Jammer) : null
                    })
                })
            });

        //shifts the decks of a given team or both teams
        //moving the skaters from on-deck to on-track
        case SHIFT_DECKS :
            if(typeof(action.team) === 'string') {
                var key = (action.team === 'A') ? 'TeamA' : 'TeamB';
                return Object.assign({}, state, {
                    [key]:Object.assign({}, state[key], {
                        Track:Object.assign({}, {
                            Jammer:(state[key].Deck.Jammer !== null) ? Object.assign({}, state[key].Deck.Jammer) : null,
                            Pivot:(state[key].Deck.Pivot !== null) ? Object.assign({}, state[key].Deck.Pivot) : null,
                            Blocker1:(state[key].Deck.Blocker1 !== null) ? Object.assign({}, state[key].Deck.Blocker1) : null,
                            Blocker2:(state[key].Deck.Blocker2 !== null) ? Object.assign({}, state[key].Deck.Blocker2) : null,
                            Blocker3:(state[key].Deck.Blocker3 !== null) ? Object.assign({}, state[key].Deck.Blocker3) : null
                        }),
                        Deck:Object.assign({}, {
                            Jammer:null,
                            Pivot:null,
                            Blocker1:null,
                            Blocker2:null,
                            Blocker3:null
                        })
                    })
                });
            } else {
                return Object.assign({}, state, {
                    TeamA:Object.assign({}, state.TeamA, {
                        Track:Object.assign({}, {
                            Jammer:(state.TeamA.Deck.Jammer !== null) ? Object.assign({}, state.TeamA.Deck.Jammer) : null,
                            Pivot:(state.TeamA.Deck.Pivot !== null) ? Object.assign({}, state.TeamA.Deck.Pivot) : null,
                            Blocker1:(state.TeamA.Deck.Blocker1 !== null) ? Object.assign({}, state.TeamA.Deck.Blocker1) : null,
                            Blocker2:(state.TeamA.Deck.Blocker2 !== null) ? Object.assign({}, state.TeamA.Deck.Blocker2) : null,
                            Blocker3:(state.TeamA.Deck.Blocker3 !== null) ? Object.assign({}, state.TeamA.Deck.Blocker3) : null
                        }),
                        Deck:{
                            Jammer:null,
                            Pivot:null,
                            Blocker1:null,
                            Blocker2:null,
                            Blocker3:null
                        }
                    }),
                    TeamB:Object.assign({}, state.TeamB, {
                        Track:Object.assign({}, {
                            Jammer:(state.TeamB.Deck.Jammer !== null) ? Object.assign({}, state.TeamB.Deck.Jammer) : null,
                            Pivot:(state.TeamB.Deck.Pivot !== null) ? Object.assign({}, state.TeamB.Deck.Pivot) : null,
                            Blocker1:(state.TeamB.Deck.Blocker1 !== null) ? Object.assign({}, state.TeamB.Deck.Blocker1) : null,
                            Blocker2:(state.TeamB.Deck.Blocker2 !== null) ? Object.assign({}, state.TeamB.Deck.Blocker2) : null,
                            Blocker3:(state.TeamB.Deck.Blocker3 !== null) ? Object.assign({}, state.TeamB.Deck.Blocker3) : null
                        }),
                        Deck:{
                            Jammer:null,
                            Pivot:null,
                            Blocker1:null,
                            Blocker2:null,
                            Blocker3:null
                        }
                    })
                })
            }

        case SET_CURRENT_POSITION :
            return Object.assign({}, state, {
                [action.team]:Object.assign({}, state[action.team], {
                    Current:{
                        Deck:action.deck,
                        Position:action.position
                    }
                })
            });

        default :
            return state;
    }
}

const ScorekeeperStore = createStore(ScorekeeperReducer);

const ScorekeeperController = {
    Key:'SK',
    SetState(state) {
        ScorekeeperController.getStore().dispatch({
            type:SET_STATE,
            values:state
        });
    },

    SetPosition(team, skater = null, position = null, deck = null) {
        ScorekeeperController.getStore().dispatch({
            type:SET_POSITION,
            team:team,
            Position:position,
            Skater:skater,
            Deck:deck
        });
    },

    StarPass(team) {
        ScorekeeperController.getStore().dispatch({
            type:STAR_PASS,
            team:team
        });
    },

    ShiftDecks(team) {
        ScorekeeperController.getStore().dispatch({
            type:SHIFT_DECKS,
            team:team
        });
    },

    SetCurrentPosition(team, deck, position) {
        ScorekeeperController.getStore().dispatch({
            type:SET_CURRENT_POSITION,
            team:team,
            deck:deck,
            position:position
        });
    },

    getState() {
        return ScorekeeperStore.getState();
    },

    getStore() {
        return ScorekeeperStore;
    },

    subscribe(f) {
        return ScorekeeperStore.subscribe(f);
    }
};

export default ScorekeeperController;