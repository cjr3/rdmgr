import {CreateController} from './functions';
import {IAPIController, SkaterRecord, SkaterTeamRecord} from './vars';

const APISkatersController:IAPIController = CreateController('SKR', '/skater');
APISkatersController.NewRecord = () : SkaterRecord => {
    return {
        RecordID:0,
        RecordType:'SKR',
        Name:'',
        Teams:new Array<SkaterTeamRecord>()
    };
};
export default APISkatersController;