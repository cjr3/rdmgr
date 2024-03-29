import { Capture } from 'tools/capture/functions';
import Data from 'tools/data';
import { Skaters } from 'tools/skaters/functions';
import { Skater, SkaterRoster, SRoster, TeamSide } from 'tools/vars';
import {MainController} from '../MainController';

/**
 * Add a skater to the roster.
 * @param side 
 * @param id 
 */
const AddSkater = (side:TeamSide, id:number) => {
    const skater = Skaters.Get(id);
    if(skater) {
        MainController.AddRosterSkaters(side, [{...skater}]);
    }
};

/**
 * Get current state
 * @returns 
 */
const Get = () => MainController.GetState().Roster;

/**
 * Get the skater record for the given role
 * @param side 
 * @param role 
 * @returns 
 */
const GetRoleSkater = (side:TeamSide, role:string) : Skater|undefined => {
    const state = Get();
    let skaterId = 0;
    if(side === 'A') {
        switch(role) {
            case 'bench' : skaterId = state.TeamA?.BenchCoach || skaterId; break;
            case 'coach' : skaterId = state.TeamA?.Coach || skaterId; break;
            case 'captain' : skaterId = state.TeamA?.Captain || skaterId; break;
            case 'cocaptain' : skaterId = state.TeamA?.CoCaptain || skaterId; break;
            case 'manager' : skaterId = state.TeamA?.Manager || skaterId; break;
            case 'penalties' : skaterId = state.TeamA?.Penalties || skaterId; break;
        }
    } else {
        switch(role) {
            case 'bench' : skaterId = state.TeamB?.BenchCoach || skaterId; break;
            case 'coach' : skaterId = state.TeamB?.Coach || skaterId; break;
            case 'captain' : skaterId = state.TeamB?.Captain || skaterId; break;
            case 'cocaptain' : skaterId = state.TeamB?.CoCaptain || skaterId; break;
            case 'manager' : skaterId = state.TeamB?.Manager || skaterId; break;
            case 'penalties' : skaterId = state.TeamB?.Penalties || skaterId; break;
        }
    }

    return Skaters.Get(skaterId);
};

/**
 * 
 * @param side 
 * @returns 
 */
const GetSkaters = (side:TeamSide) : SkaterRoster[] => {
    if(side === 'A')
        return Get().SkatersA || [];
    else if(side === 'B')
        return Get().SkatersB || [];
    return [];
};

/**
 * Get timestamp when relevant roster records are updated
 * @returns number
 */
const GetUpdateTime = () : number => {
    const state = MainController.GetState();
    return Math.max(state.UpdateTimeRoster, state.UpdateTimeScoreboard, state.UpdateTimeSkaters, state.UpdateTimeTeams);
};

/**
 * Initialize roster
 * - Start state listener.
 */
const Init = () : Promise<boolean> => {
    return new Promise((res) => {
        Load().then().catch().finally(() => {
            let lastState = Get();
            let saving = false;
            setInterval(() => {
                const state = Get();
                if(!saving && state !== lastState) {
                    lastState = state;
                    saving = true;
                    Data.SaveRoster(state).then().catch().finally(() => {
                        saving = false;
                    });
                }
            }, 1000);
            return res(true);
        });
    });
};

/**
 * Load roster
 * @returns 
 */
const Load = () : Promise<SRoster> => {
    return new Promise((res, rej) => {
        Data.LoadRoster().then(state => {
            Update(state);
            return res(state);
        }).catch(er => rej(er));
    });
};

/**
 * Show the next record in the roster
 */
const Next = () => {
    const capture = Capture.GetRoster();
    const state = Get();
    let visible = capture.visible || false;
    let side = capture.side;
    let index = typeof(capture.index) === 'number' ? capture.index : -1;
    if(side === 'A') {
        if(visible) {
            index++;
            if(index >= (state.SkatersA || []).length) {
                visible = false;
                side = 'C';
                index = -1;
            }
        } else if(index === -1) {
            visible = true;
        }
    } else if(side === 'B') {
        if(visible) {
            index++;
            if(index >= (state.SkatersB || []).length) {
                side = '';
                index = -1;
                visible = false;
            }
        } else if(index === -1) {
            visible = true;
        }
    } else if(side === 'C') {
        side = 'B';
        visible = true;
        index = -1;
    } else {
        side = 'A';
        visible = true;
        index = -1;
    }

    // console.log(`${side}:${index}:${visible}`)

    Capture.UpdateRoster({
        side:side,
        index:index,
        visible:visible
    });
}

/**
 * Show previous roster record.
 */
const Previous = () => {
    const capture = Capture.GetRoster();
    const state = Get();
    let visible = capture.visible || false;
    let side = capture.side;
    let index = typeof(capture.index) === 'number' ? capture.index : -1;
    if(side === 'A') {
        index--;
        if(index < -1) {
            visible = false;
            side = '';
            index = -1;
        }
    } else if(side === 'B') {
        if(visible) {
            index--;
            if(index < -1) {
                side = 'C';
                visible = false;
                index = -1;
            }
        } else {
            side = 'C';
            visible = false;
            index = -1;
        }
    } else if(side === 'C') {
        side = 'A';
        index = (state.SkatersA || []).length - 1;
        visible = true;
    } else {
        side = 'A';
        index = -1;
        visible = true;
    }

    // console.log(`${side}:${index}:${visible}`)

    Capture.UpdateRoster({
        side:side,
        index:index,
        visible:visible
    });
}

/**
 * Remove skater from the roster.
 * @param side 
 * @param id 
 */
const RemoveSkater = (side:TeamSide, id:number) => MainController.RemoveRosterSkaters(side, [id]);

/**
 * Set the roster to match that of the skaters who are assigned to the current scoreboard teams.
 */
const Reset = () => {
    const state = MainController.GetScoreboardState();
    const skaters = Skaters.GetRecords();
    SetSkaters('A', skaters.filter(s => s.Teams && s.Teams.findIndex(t => t.TeamID === state.TeamA?.ID) >= 0 ));
    SetSkaters('B', skaters.filter(s => s.Teams && s.Teams.findIndex(t => t.TeamID === state.TeamB?.ID) >= 0 ));
    Update({
        TeamA:{
            BenchCoach:0,
            Captain:0,
            CoCaptain:0,
            Coach:0,
            Manager:0,
            Penalties:0
        },
        TeamB:{
            BenchCoach:0,
            Captain:0,
            CoCaptain:0,
            Coach:0,
            Manager:0,
            Penalties:0
        }
    })
};

/**
 * 
 * @param side 
 * @param role 
 * @param recordId 
 * @returns 
 */
const SetRole = (side:TeamSide, role:string, recordId:number) => MainController.SetRosterRole(side, role, recordId);

/**
 * Set the skaters on the roster
 * @param side 
 * @param records 
 * @returns 
 */
const SetSkaters = (side:TeamSide, records:Skater[]) => MainController.SetRosterSkaters(side, records);

/**
 * 
 * @param f 
 * @returns 
 */
const Subscribe = (f:{():void}) => MainController.Subscribe(f);

/**
 * 
 * @param side 
 * @param a 
 * @param b 
 */
const SwapSkaters = (side:TeamSide, a:number, b:number) => {
    const skaters = GetSkaters(side);
    if(a !== b && skaters[a] && skaters[b]) {
        const skaterA = {...skaters[a]};
        skaters.splice(a, 1);
        skaters.splice(b, 0, skaterA);
        SetSkaters(side, skaters);
    }
};

/**
 * Update roster
 * @param state 
 * @returns 
 */
const Update = (state:SRoster) => MainController.UpdateRosterState(state);

/**
 * Update a skater's values.
 * @param side 
 * @param values 
 */
const UpdateSkater = (side:TeamSide, values:Skater) => {
    MainController.UpdateRosterSkater(side, values);
};

const Roster = {
    AddSkater:AddSkater,
    Get:Get,
    GetRoleSkater:GetRoleSkater,
    GetSkaters:GetSkaters,
    GetUpdateTime:GetUpdateTime,
    Init:Init,
    Load:Load,
    Next:Next,
    Previous:Previous,
    RemoveSkater:RemoveSkater,
    Reset:Reset,
    SetRole:SetRole,
    SetSkaters:SetSkaters,
    Subscribe:Subscribe,
    SwapSkaters:SwapSkaters,
    Update:Update,
    UpdateSkater:UpdateSkater
}

export {Roster};