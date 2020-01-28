/*
 * Controller for Scorekeeper
 */
import {SkaterRecord} from 'tools/vars';
import {IController} from './vars';
import {CreateController, BaseReducer} from './functions.controllers';
import { Unsubscribe } from 'redux';
import SkatersController from './SkatersController';

export type Sides = 'A' | 'B';
export type Decks = 'Track' | 'Deck';
export type Positions = 'Jammer' | 'Pivot' | 'Blocker1' | 'Blocker2' | 'Blocker3';

interface IScorekeeperController extends IController {
    SetPosition:{(team:Sides, skater:SkaterRecord|null, position:Positions|null, deck:Decks|null)};
    StarPass:{(team:Sides)};
    ShiftDecks:Function;
    SetCurrentPosition:{(team:Sides,deck:Decks,position:Positions)};
    GetSkaterPosition:{(id:number)};
    updateSkaters:Unsubscribe;
}

enum Actions {
    SET_POSITION = 'SET_POSITION',
    STAR_PASS = 'STAR_PASS',
    SHIFT_DECKS = 'SHIFT_DECKS',
    SET_CURRENT_POSITION = 'SET_CURRENT_POSITION',
    UPDATE_SKATERS = 'UPDATE_SKATERS'
}

export interface SScorekeeperTeamDeckStatus {
    Deck:string;
    Position:string;
}

export interface SScorekeeperTeamDeck {
    Jammer:SkaterRecord|null;
    Pivot:SkaterRecord|null;
    Blocker1:SkaterRecord|null;
    Blocker2:SkaterRecord|null;
    Blocker3:SkaterRecord|null;
}

export interface SScorekeeperTeam {
    Track:SScorekeeperTeamDeck;
    Deck:SScorekeeperTeamDeck;
    Current:SScorekeeperTeamDeckStatus;
}

export interface SScorekeeperState {
    TeamA:SScorekeeperTeam;
    TeamB:SScorekeeperTeam;
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

const GetSkaterTeam = (state:SScorekeeperState, id:number) : SScorekeeperTeam|null => {
    for(var key in state.TeamA.Track) {
        let skater:SkaterRecord|null = state.TeamA.Track[key];
        if(skater != null && skater.RecordID == id)
            return state.TeamA;
    }

    for(var key in state.TeamA.Deck) {
        let skater:SkaterRecord|null = state.TeamA.Deck[key];
        if(skater != null && skater.RecordID == id)
            return state.TeamA;
    }

    for(var key in state.TeamB.Track) {
        let skater:SkaterRecord|null = state.TeamB.Track[key];
        if(skater != null && skater.RecordID == id)
            return state.TeamB;
    }
    
    for(var key in state.TeamB.Deck) {
        let skater:SkaterRecord|null = state.TeamB.Deck[key];
        if(skater != null && skater.RecordID == id)
            return state.TeamB;
    }

    return null;
};

const GetSkaterDeck = (state:SScorekeeperState, id:number) : SScorekeeperTeamDeck|null => {
    let team:SScorekeeperTeam|null = GetSkaterTeam(state, id);
    if(team == null)
        return null;

    for(var key in team.Track) {
        let skater:SkaterRecord|null = team.Track[key];
        if(skater != null && skater.RecordID == id)
            return team.Track;
    }

    for(var key in team.Deck) {
        let skater:SkaterRecord|null = team.Deck[key];
        if(skater != null && skater.RecordID == id)
            return team.Deck;
    }

    return null;
};

const GetSkaterPosition = (state:SScorekeeperState, id:number) : string => {
    let deck:SScorekeeperTeamDeck|null = GetSkaterDeck(state, id);
    if(deck == null)
        return '';
    for(let key in deck) {
        let skater:SkaterRecord|null = deck[key];
        if(skater != null && skater.RecordID == id) {
            return key;
        }
    }
    return '';
};


/**
 * Sets the given skater's position
 * 
 * @param state 
 * @param id 
 * @param side 
 * @param deck 
 * @param position 
 */
const SetPosition = (state:SScorekeeperState, side:string, skater:SkaterRecord|null, deck:string|null, position:string|null) => {
    if(side !== 'A' && side !== 'B')
        return state;

    let teamKey = (side === 'A') ? 'TeamA' : 'TeamB';
    let currentDeck = '';
    let currentPosition = '';

    if(skater !== null) {
        for(let key in state[teamKey].Track) {
            let s:SkaterRecord|null = state[teamKey].Track[key];
            if(s && s.RecordID == skater.RecordID) {
                currentDeck = 'Track';
                currentPosition = key;
            }
        }
        
        if(!currentPosition && !currentDeck) {
            for(let key in state[teamKey].Deck) {
                let s:SkaterRecord|null = state[teamKey].Deck[key];
                if(s && s.RecordID == skater.RecordID) {
                    currentDeck = 'Deck';
                    currentPosition = key;
                }
            }
        }
        
        if(currentPosition && currentDeck && !deck && !position) {
            return state;
        }

        if(!deck || !position) {
            if(state[teamKey].Current.Deck && state[teamKey].Current.Position) {
                deck = state[teamKey].Current.Deck;
                position = state[teamKey].Current.Position;
            } else if(!state[teamKey].Track.Jammer) {
                deck = 'Track';
                position = 'Jammer';
            } else if(!state[teamKey].Track.Pivot) {
                deck = 'Track';
                position = 'Pivot';
            } else if(!state[teamKey].Track.Blocker1) {
                deck = 'Track';
                position = 'Blocker1';
            } else if(!state[teamKey].Track.Blocker2) {
                deck = 'Track';
                position = 'Blocker2';
            } else if(!state[teamKey].Track.Blocker3) {
                deck = 'Track';
                position = 'Blocker3';
            } else if(!state[teamKey].Track.Blocker3) {
                deck = 'Track';
                position = 'Blocker3';
            } else if(!state[teamKey].Deck.Jammer) {
                deck = 'Deck';
                position = 'Jammer';
            } else if(!state[teamKey].Deck.Pivot) {
                deck = 'Deck';
                position = 'Pivot';
            } else if(!state[teamKey].Deck.Blocker1) {
                deck = 'Deck';
                position = 'Blocker1';
            } else if(!state[teamKey].Deck.Blocker2) {
                deck = 'Deck';
                position = 'Blocker2';
            } else if(!state[teamKey].Deck.Blocker3) {
                deck = 'Deck';
                position = 'Blocker3';
            } else if(!state[teamKey].Deck.Blocker3) {
                deck = 'Deck';
                position = 'Blocker3';
            }
        }
    } else if(deck && position) {
        if(deck === state[teamKey].Current.Deck && position === state[teamKey].Current.Position) {
            return {
                ...state,
                [teamKey]:{
                    ...state[teamKey],
                    Current:{
                        Deck:'',
                        Position:''
                    }
                }
            };
        } else {
            //a skater is assigned to the target position
            if(state[teamKey][deck] && state[teamKey][deck][position]) {
                let cskater = state[teamKey][deck][position];
                if(state[teamKey].Current.Deck && state[teamKey].Current.Position) {
                    //move skater to current position
                    if(state[teamKey].Current.Deck == deck) {

                        return {
                            ...state,
                            [teamKey]:{
                                ...state[teamKey],
                                [state[teamKey].Current.Deck]:{
                                    ...state[teamKey][state[teamKey].Current.Deck],
                                    [state[teamKey].Current.Position]:{...cskater},
                                    [position]:null
                                },
                                Current:{
                                    Deck:'',
                                    Position:''
                                }
                            }
                        }
                    } else {
                        return {
                            ...state,
                            [teamKey]:{
                                ...state[teamKey],
                                [state[teamKey].Current.Deck]:{
                                    ...state[teamKey][state[teamKey].Current.Deck],
                                    [state[teamKey].Current.Position]:{...cskater}
                                },
                                [deck]:{
                                    ...state[teamKey][deck],
                                    [position]:null
                                },
                                Current:{
                                    Deck:'',
                                    Position:''
                                }
                            }
                        }
                    }
                }
                return {
                    ...state,
                    [teamKey]:{
                        ...state[teamKey],
                        [deck]:{
                            ...state[teamKey][deck],
                            [position]:null
                        }
                    }
                };
            }
            return {
                ...state,
                [teamKey]:{
                    ...state[teamKey],
                    Current:{
                        Deck:deck,
                        Position:position
                    }
                }
            };
        }
    }
    
    //invalid deck or position, or none available
    if((deck != 'Track' && deck != 'Deck') || 
        (position != 'Jammer' 
            && position != 'Pivot'
            && position != 'Blocker1'
            && position != 'Blocker2'
            && position != 'Blocker3'
            )
        ) {

        //console.log(`invalid: ${deck}:${position}`);
        return state;
    } else if(skater === null) {
        return {
            ...state,
            [teamKey]:{
                ...state[teamKey],
                [deck]:{
                    ...state[teamKey][deck],
                    [position]:null
                },
                Current:{
                    Deck:'',
                    Position:''
                }
            }
        }
    }

    //console.log(`${currentDeck}:${currentPosition}`);

    //record is assigned to a position
    if(currentDeck && currentPosition) {

        //record is assigned to the target position (ignore)
        if(deck == currentDeck && currentPosition == position) {
            return state;
        }

        //position is available - swap positions
        let current:SkaterRecord|null = state[teamKey][deck][position];
        return {
            ...state,
            [teamKey]:{
                ...state[teamKey],
                [currentDeck]:{
                    ...state[teamKey][currentDeck],
                    [currentPosition]:current
                },
                [deck]:{
                    ...state[teamKey][deck],
                    [position]:skater
                },
                Current:{
                    Deck:'',
                    Position:''
                }
            }
        }

    } else {
        //assign skater to position
        //console.log(`${teamKey}:${deck}:${position}:${skater.Name}`);
        return {
            ...state,
            [teamKey]:{
                ...state[teamKey],
                [deck]:{
                    ...state[teamKey][deck],
                    [position]:skater
                },
                Current:{
                    Deck:'',
                    Position:''
                }
            }
        }
    }
};

const StarPass = (state:SScorekeeperState, side:Sides) => {
    if(side == 'A') {
        return {...state,
            TeamA:{
                ...state.TeamA, 
                Track:{
                    ...state.TeamA.Track,
                    Jammer:(state.TeamA.Track.Pivot != null) ? {...state.TeamA.Track.Pivot} : null,
                    Pivot:(state.TeamA.Track.Jammer != null) ? {...state.TeamA.Track.Jammer} : null,
                }
            }
        }
    } else {
        return {...state,
            TeamB:{
                ...state.TeamB, 
                Track:{
                    ...state.TeamB.Track,
                    Jammer:(state.TeamB.Track.Pivot != null) ? {...state.TeamB.Track.Pivot} : null,
                    Pivot:(state.TeamB.Track.Jammer != null) ? {...state.TeamB.Track.Jammer} : null,
                }
            }
        }
    }
};

//shifts the decks of a given team or both teams
//moving the skaters from on-deck to on-track
const ShiftDecks = (state:SScorekeeperState) => {

    let trackA:SScorekeeperTeamDeck = {
        Jammer:(state.TeamA.Deck.Jammer !== null) ? {...state.TeamA.Deck.Jammer, Deck:'Track'} : null,
        Pivot:(state.TeamA.Deck.Pivot !== null) ? {...state.TeamA.Deck.Pivot, Deck:'Track'} : null,
        Blocker1:(state.TeamA.Deck.Blocker1 !== null) ? {...state.TeamA.Deck.Blocker1, Deck:'Track'} : null,
        Blocker2:(state.TeamA.Deck.Blocker2 !== null) ? {...state.TeamA.Deck.Blocker2, Deck:'Track'} : null,
        Blocker3:(state.TeamA.Deck.Blocker3 !== null) ? {...state.TeamA.Deck.Blocker3, Deck:'Track'} : null
    }

    let trackB:SScorekeeperTeamDeck = {
        Jammer:(state.TeamB.Deck.Jammer !== null) ? {...state.TeamB.Deck.Jammer, Deck:'Track'} : null,
        Pivot:(state.TeamB.Deck.Pivot !== null) ? {...state.TeamB.Deck.Pivot, Deck:'Track'} : null,
        Blocker1:(state.TeamB.Deck.Blocker1 !== null) ? {...state.TeamB.Deck.Blocker1, Deck:'Track'} : null,
        Blocker2:(state.TeamB.Deck.Blocker2 !== null) ? {...state.TeamB.Deck.Blocker2, Deck:'Track'} : null,
        Blocker3:(state.TeamB.Deck.Blocker3 !== null) ? {...state.TeamB.Deck.Blocker3, Deck:'Track'} : null
    }

    return {
        ...state,
        TeamA:{
            ...state.TeamA,
            Track:{
                ...state.TeamA.Track,
                ...trackA
            },
            Deck:{
                ...state.TeamA.Deck,
                Jammer:null,
                Pivot:null,
                Blocker1:null,
                Blocker2:null,
                Blocker3:null
            }
        },
        TeamB:{
            ...state.TeamB,
            Track:{
                ...state.TeamB.Track,
                ...trackB
            },
            Deck:{
                ...state.TeamB.Deck,
                Jammer:null,
                Pivot:null,
                Blocker1:null,
                Blocker2:null,
                Blocker3:null
            }
        }
    }
};

const SetCurrentPosition = (state:SScorekeeperState, side:Sides, deck:string, position:string) => {
    if(side == 'A') {
        if(state.TeamA.Current.Deck == deck && state.TeamA.Current.Position == position) {
            deck = '';
            position = '';
        }
        return {...state,
            TeamA:{
                ...state.TeamA,
                Current:{
                    Deck:deck,
                    Position:position
                }
            }
        }
    } else {
        if(state.TeamB.Current.Deck == deck && state.TeamB.Current.Position == position) {
            deck = '';
            position = '';
        }
        return {...state,
            TeamB:{
                ...state.TeamB,
                Current:{
                    Deck:deck,
                    Position:position
                }
            }
        }
    }
};

const UpdateSkaters = (state:SScorekeeperState, records:Array<SkaterRecord>) => {
    if(records.length <= 0)
        return state;

    let trackA:SScorekeeperTeamDeck = {...state.TeamA.Track};
    let deckA:SScorekeeperTeamDeck = {...state.TeamA.Deck};
    let trackB:SScorekeeperTeamDeck = {...state.TeamB.Track};
    let deckB:SScorekeeperTeamDeck = {...state.TeamB.Deck};

    //Team A Track
    for(let key in trackA) {
        let skater:SkaterRecord = trackA[key];
        if(skater) {
            let uskater:SkaterRecord|undefined = records.find((r) => r.RecordID == skater.RecordID);
            if(uskater) {
                trackA[key] = {
                    ...trackA[key],
                    ...uskater,
                    Penalties:trackA[key].Penalties,
                    Position:trackA[key].Position
                }
            }
        }
    }
    
    //Team A Deck
    for(let key in deckA) {
        let skater:SkaterRecord = deckA[key];
        if(skater) {
            let uskater:SkaterRecord|undefined = records.find((r) => r.RecordID == skater.RecordID);
            if(uskater) {
                deckA[key] = {
                    ...deckA[key],
                    ...uskater,
                    Penalties:deckA[key].Penalties,
                    Position:deckA[key].Position
                }
            }
        }
    }

    //Team B Track
    for(let key in trackB) {
        let skater:SkaterRecord = trackB[key];
        if(skater) {
            let uskater:SkaterRecord|undefined = records.find((r) => r.RecordID == skater.RecordID);
            if(uskater) {
                trackB[key] = {
                    ...trackB[key],
                    ...uskater,
                    Penalties:trackB[key].Penalties,
                    Position:trackB[key].Position
                }
            }
        }
    }
    
    //Team A Deck
    for(let key in deckB) {
        let skater:SkaterRecord = deckB[key];
        if(skater) {
            let uskater:SkaterRecord|undefined = records.find((r) => r.RecordID == skater.RecordID);
            if(uskater) {
                deckB[key] = {
                    ...deckB[key],
                    ...uskater,
                    Penalties:deckB[key].Penalties,
                    Position:deckB[key].Position
                }
            }
        }
    }

    return {
        ...state,
        TeamA:{
            ...state.TeamA,
            Track:trackA,
            Deck:deckA
        },
        TeamB:{
            ...state.TeamB,
            Track:trackB,
            Deck:deckB
        }
    }
};

const ScorekeeperReducer = (state = InitState, action) => {
    try {
        switch(action.type) {
    
            //sets the skater of the giving position
            case Actions.SET_POSITION :
                return SetPosition(state, action.side, action.skater, action.deck, action.position);
    
            //performs a star pass, which swaps the target team's
            //pivot and jammer
            case Actions.STAR_PASS :
                return StarPass(state, action.side);
            case Actions.SHIFT_DECKS :
                return ShiftDecks(state);
    
            case Actions.SET_CURRENT_POSITION :
                return SetCurrentPosition(state, action.side, action.deck, action.position);
            
            case Actions.UPDATE_SKATERS :
                return UpdateSkaters(state, action.records);
    
            default :
                return BaseReducer(state, action);
        }
    } catch(er) {
        return state;
    }
}

const ScorekeeperController:IScorekeeperController = CreateController('SK', ScorekeeperReducer);
ScorekeeperController.SetPosition = async (side:Sides, skater:SkaterRecord|null, position:Positions|null = null, deck:Decks|null = null) => {
    ScorekeeperController.Dispatch({
        type:Actions.SET_POSITION,
        side:side,
        position:position,
        skater:skater,
        deck:deck
    });
};

ScorekeeperController.StarPass = async (side:Sides) => {
    ScorekeeperController.Dispatch({
        type:Actions.STAR_PASS,
        side:side
    });
};

ScorekeeperController.ShiftDecks = async () => {
    ScorekeeperController.Dispatch({
        type:Actions.SHIFT_DECKS
    });
};

ScorekeeperController.SetCurrentPosition = async (side:Sides, deck:Decks, position:Positions) => {
    ScorekeeperController.Dispatch({
        type:Actions.SET_CURRENT_POSITION,
        side:side,
        deck:deck,
        position:position
    });
};

ScorekeeperController.GetSkaterPosition = (id:number) : string => {
    return GetSkaterPosition(ScorekeeperController.GetState(), id);
};

ScorekeeperController.updateSkaters = SkatersController.Subscribe(() => {
    ScorekeeperController.Dispatch({
        type:Actions.UPDATE_SKATERS,
        records:SkatersController.Get()
    });
});

export default ScorekeeperController;