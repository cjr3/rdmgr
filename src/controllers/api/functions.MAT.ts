import {SendPut} from './functions';

export const UpdateMatchScores = (id:number, scoreA:number, scoreB:number) : Promise<any> => {
    return SendPut('/match/' + id, {
        TeamA:{Score:scoreA},
        TeamB:{Score:scoreB}
    });
};