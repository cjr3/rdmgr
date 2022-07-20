import Data from "tools/data";
import { MainController } from "tools/MainController";
import { DeckChoice, ScorekeeperPosition, Skater, SScorekeeper, TeamSide } from "tools/vars";

/**
 * Clear all skaters off the scorekeeper.
 */
const Clear = () => {
    Update({
        DeckA:{},
        DeckB:{},
        TrackA:{},
        TrackB:{}
    });
};

/**
 * Get scorekeeper state
 * @returns 
 */
const Get = () => MainController.GetState().Scorekeeper;

/**
 * 
 * @param side 
 * @param deck 
 * @param position 
 * @returns 
 */
const GetSkater = (side:TeamSide, deck:DeckChoice, position:ScorekeeperPosition) : Skater|undefined|null => {
    const state = Get();
    if(deck === 'Deck') {
        switch(position) {
            case 'Blocker1' : return (side === 'A') ? state.DeckA?.Blocker1 : state.DeckB?.Blocker1;
            case 'Blocker2' : return (side === 'A') ? state.DeckA?.Blocker2 : state.DeckB?.Blocker2;
            case 'Blocker3' : return (side === 'A') ? state.DeckA?.Blocker3 : state.DeckB?.Blocker3;
            case 'Pivot' : return (side === 'A') ? state.DeckA?.Pivot : state.DeckB?.Pivot;
            case 'Jammer' : return (side === 'A') ? state.DeckA?.Jammer : state.DeckB?.Jammer;
        }
    } else if(deck === 'Track') {
        switch(position) {
            case 'Blocker1' : return (side === 'A') ? state.TrackA?.Blocker1 : state.TrackB?.Blocker1;
            case 'Blocker2' : return (side === 'A') ? state.TrackA?.Blocker2 : state.TrackB?.Blocker2;
            case 'Blocker3' : return (side === 'A') ? state.TrackA?.Blocker3 : state.TrackB?.Blocker3;
            case 'Pivot' : return (side === 'A') ? state.TrackA?.Pivot : state.TrackB?.Pivot;
            case 'Jammer' : return (side === 'A') ? state.TrackA?.Jammer : state.TrackB?.Jammer;
        }
    }

    return undefined;
}

/**
 * Get last timestamp when relevant records were updated.
 * @returns 
 */
const GetUpdateTime = () : number => {
    const state = MainController.GetState();
    return Math.max(
        state.UpdateTimePenalties,
        state.UpdateTimePenaltyTracker,
        state.UpdateTimeRoster,
        state.UpdateTimeScoreboard,
        state.UpdateTimeScorekeeper,
        state.UpdateTimeSkaters
    );
}

/**
 * Initialize Scorekeeper
 * - Start state save listener
 */
const Init = () : Promise<boolean> => {
    return new Promise(res => {
        Load().then().catch().finally(() => {
            let lastState = Get();
            let saving = false;
            setInterval(() => {
                const state = Get();
                if(!saving && lastState !== state) {
                    saving = true;
                    lastState = state;
                    Data.SaveScorekeeper(state).then().catch().finally(() => {
                        saving = false;
                    });
                }
            }, 1000);
            return res(true);
        });
    })
};

/**
 * 
 * @returns 
 */
const Load = () : Promise<SScorekeeper> => {
    return new Promise((res, rej) => {
        Data.LoadScorekeeper().then(state => {
            Update(state);
            return res(state);
        }).catch(er => rej(er));
    });
};

/**
 * 
 * @param side 
 * @param record 
 * @param deck 
 * @param position 
 */
const SetPosition = (side:TeamSide, record?:Skater, deck?:DeckChoice, position?:ScorekeeperPosition) => {
    // console.log(`${side}:${record?.RecordID}:${deck}:${position}`);
    MainController.SetScorekeeperPosition(side, record, deck, position);
};

const ShiftDecks = () => {
    const decka = {...Get().DeckA};
    const deckb = {...Get().DeckB};
    Update({
        TrackA:{
            Blocker1:decka?.Blocker1 || null,
            Blocker2:decka?.Blocker2 || null,
            Blocker3:decka?.Blocker3 || null,
            Pivot:decka?.Pivot || null,
            Jammer:decka?.Jammer || null,
        },
        DeckA:{},
        TrackB:{
            Blocker1:deckb?.Blocker1 || null,
            Blocker2:deckb?.Blocker2 || null,
            Blocker3:deckb?.Blocker3 || null,
            Pivot:deckb?.Pivot || null,
            Jammer:deckb?.Jammer || null,
        },
        DeckB:{}
    });
};

/**
 * 
 * @param side 
 */
const ShiftDeck = (side:TeamSide) => {
    if(side === 'A') {
        const deck = {...Get().DeckA};
        Update({
            TrackA:{
                Blocker1:deck?.Blocker1 || null,
                Blocker2:deck?.Blocker2 || null,
                Blocker3:deck?.Blocker3 || null,
                Pivot:deck?.Pivot || null,
                Jammer:deck?.Jammer || null,
            },
            DeckA:{}
        });
    } else if(side === 'B') {
        const deck = {...Get().DeckB};
        Update({
            TrackB:{
                Blocker1:deck?.Blocker1 || null,
                Blocker2:deck?.Blocker2 || null,
                Blocker3:deck?.Blocker3 || null,
                Pivot:deck?.Pivot || null,
                Jammer:deck?.Jammer || null,
            },
            DeckB:{}
        });
    }
}

/**
 * Subscribe to changes to the scorekeeper state
 * @param f 
 * @returns 
 */
const Subscribe = (f:{():void}) => MainController.Subscribe(f);

/**
 * 
 * @param side 
 * @param sourceDeck 
 * @param sourcePosition 
 * @param targetDeck 
 * @param targetPosition 
 */
const SwapPositions = (side:TeamSide, sourceDeck:DeckChoice, sourcePosition:ScorekeeperPosition, targetDeck:DeckChoice, targetPosition:ScorekeeperPosition) => {
    const source = GetSkater(side, sourceDeck, sourcePosition);
    const target = GetSkater(side, targetDeck, targetPosition);
    SetPosition(side, target || undefined, sourceDeck, sourcePosition);
    SetPosition(side, source || undefined, targetDeck, targetPosition);
}

/**
 * 
 * @param state 
 * @returns 
 */
const Update = (state:SScorekeeper) => MainController.UpdateScorekeeperState(state);

const Scorekeeper = {
    Clear:Clear,
    Get:Get,
    GetSkater:GetSkater,
    GetUpdateTime:GetUpdateTime,
    Init:Init,
    Load:Load,
    SetPosition:SetPosition,
    ShiftDeck:ShiftDeck,
    ShiftDecks:ShiftDecks,
    Subscribe:Subscribe,
    SwapPositions:SwapPositions,
    Update:Update
}

export {Scorekeeper};