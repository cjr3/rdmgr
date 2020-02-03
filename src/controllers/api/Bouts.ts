import {CreateController} from './functions';
import {IAPIController, MatchRecord, BoutRecord} from './vars';

const APIBoutsController:IAPIController = CreateController('BUT', '/bout');
APIBoutsController.NewRecord = () : BoutRecord => {
    return {
        RecordID:0,
        RecordType:'BUT',
        BoutDate:'',
        DoorsOpen:'00:00:00',
        Name:'',
        Matches:new Array<MatchRecord>()
    };
};
export default APIBoutsController;