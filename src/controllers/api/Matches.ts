import {CreateController} from './functions';
import {IAPIController, MatchRecord} from './vars';

const APIMatchesController:IAPIController = CreateController('MAT', '/match');
APIMatchesController.NewRecord = () : MatchRecord => {
    return {
        RecordID:0,
        RecordType:'MAT',
        StartTime:'00:00:00',
        EndTime:'00:00:00',
        TeamA:{
            ID:0,
            Score:0
        },
        TeamB:{
            ID:0,
            Score:0
        }
    };
};
export default APIMatchesController;