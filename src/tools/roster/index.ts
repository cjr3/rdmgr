import {
    SkaterRoster,
    SMainController,
    SRoster,
    TeamSide
} from '../vars';

namespace RosterState {
    /**
     * Add skaters to the roster
     * @param state 
     * @param side 
     * @param records 
     * @returns 
     */
    export const AddRecords = (state:SMainController, side:TeamSide, records:SkaterRoster[]) : SMainController => {
        const a = (state.Roster.SkatersA || []).slice();
        const b = (state.Roster.SkatersB || []).slice();
        records.forEach(s => {
            const ai = a.findIndex(r => r.RecordID === s.RecordID);
            const bi = b.findIndex(r => r.RecordID === s.RecordID);
            if(side === 'A') {
                //remove from side B
                if(bi >= 0) {
                    b.splice(bi, 1);
                }
        
                //add to Side A
                if(ai < 0) {
                    a.push(s);
                }
            } else if(side === 'B') {
                //remove from side A
                if(ai >= 0) {
                    a.splice(ai, 1);
                }

                //add to side B
                if(bi < 0) {
                    b.push(s);
                }
            }
        });
        return {
            ...state,
            Roster:{
                ...state.Roster,
                SkatersA:a,
                SkatersB:b
            },
            UpdateTimeRoster:Date.now()
        }
    };

    /**
     * Remove skaters from a team.
     * @param state 
     * @param side 
     * @param ids 
     * @returns 
     */
    export const RemoveRecords = (state:SMainController, side:TeamSide, ids:number[]) : SMainController => {
        if(side === 'A') {
            return {
                ...state,
                Roster:{
                    ...state.Roster,
                    SkatersA:(state.Roster.SkatersA || []).filter(r => typeof(r.RecordID) === 'number' && ids.indexOf(r.RecordID) < 0)
                },
                UpdateTimeRoster:Date.now()
            }
        } else if(side === 'B') {
            return {
                ...state,
                Roster:{
                    ...state.Roster,
                    SkatersB:(state.Roster.SkatersB || []).filter(r => typeof(r.RecordID) === 'number' && ids.indexOf(r.RecordID) < 0)
                },
                UpdateTimeRoster:Date.now()
            }
        } else {
            return state;
        }
    };

    /**
     * Set the skaters for a team.
     * @param state 
     * @param side 
     * @param records 
     * @returns 
     */
    export const SetRecords = (state:SMainController, side:TeamSide, records:SkaterRoster[]) : SMainController => {
        if(side === 'A') {
            return {
                ...state,
                Roster:{
                    ...state.Roster,
                    SkatersA:records
                },
                UpdateTimeRoster:Date.now()
            }
        } else if(side === 'B') {
            return {
                ...state,
                Roster:{
                    ...state.Roster,
                    SkatersB:records
                },
                UpdateTimeRoster:Date.now()
            }
        }

        return state;
    };

    /**
     * 
     * @param state 
     * @param side 
     * @param role 
     * @param recordId 
     * @returns 
     */
    export const SetRole = (state:SMainController, side:TeamSide, role:string, recordId:number) : SMainController => {
        // console.log(`${side}:${role}:${recordId}`)
        if(side === 'A') {
            const roles = {...state.Roster.TeamA};
            switch(role) {
                case 'bench' : roles.BenchCoach = recordId; break;
                case 'captain' : roles.Captain = recordId; break;
                case 'coach' : roles.Coach = recordId; break;
                case 'cocaptain' : roles.CoCaptain = recordId; break;
                case 'manager' : roles.Manager = recordId; break;
                case 'penalties' : roles.Penalties = recordId; break;
            }

            return {
                ...state,
                Roster:{
                    ...state.Roster,
                    TeamA:roles
                },
                UpdateTimeRoster:Date.now()
            }
        } else if(side === 'B') {
            const roles = {...state.Roster.TeamB};
            switch(role) {
                case 'bench' : roles.BenchCoach = recordId; break;
                case 'captain' : roles.Captain = recordId; break;
                case 'coach' : roles.Coach = recordId; break;
                case 'cocaptain' : roles.CoCaptain = recordId; break;
                case 'manager' : roles.Manager = recordId; break;
                case 'penalties' : roles.Penalties = recordId; break;
            }

            return {
                ...state,
                Roster:{
                    ...state.Roster,
                    TeamB:roles
                },
                UpdateTimeRoster:Date.now()
            }
        } else {
            return state;
        }
    }

    /**
     * Update a skater record.
     * @param state 
     * @param record 
     * @returns 
     */
    export const UpdateRecord = (state:SMainController, record:SkaterRoster) : SMainController => {
        let index = (state.Roster.SkatersA || []).findIndex(r => r.RecordID === record.RecordID);
        if(index >= 0) {
            const records = (state.Roster.SkatersA || []).slice();
            records[index] = {...records[index], ...record};
            return {
                ...state,
                Roster:{
                    ...state.Roster,
                    SkatersA:records
                },
                UpdateTimeRoster:Date.now()
            }
        }

        index = (state.Roster.SkatersB || []).findIndex(r => r.RecordID === record.RecordID);
        if(index >= 0) {
            const records = (state.Roster.SkatersB || []).slice();
            records[index] = {...records[index], ...record};
            return {
                ...state,
                Roster:{
                    ...state.Roster,
                    SkatersB:records
                },
                UpdateTimeRoster:Date.now()
            }
        }

        return state;
    };

    /**
     * 
     * @param state 
     * @param values 
     * @returns 
     */
    export const Update = (state:SMainController, values:SRoster) : SMainController => {
        return {
            ...state,
            Roster:{
                ...state.Roster,
                ...values
            },
            UpdateTimeRoster:Date.now()
        };
    };
}

export {RosterState};