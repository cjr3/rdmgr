import {CreateController} from './functions';
import {IAPIController, SeasonRecord, BoutRecord} from './vars';

const APISeasonsController:IAPIController = CreateController('SEA', '/season');
APISeasonsController.NewRecord = () : SeasonRecord => {
    return {
        RecordID:0,
        RecordType:'SEA',
        DateStart:'',
        DateEnd:'',
        Name:'',
        Bouts:new Array<BoutRecord>(),
        Standings:new Array<any>()
    };
};
export default APISeasonsController;