import {CreateController} from './functions';
import {IAPIController, MatchRecord} from './vars';

const APIMatchesController:IAPIController = CreateController('MAT', '/match');
APIMatchesController.NewRecord = () : MatchRecord => {
    return {
        RecordID:0,
        RecordType:'MAT',
        MatchDate:'',
        SeasonID:0,
        BoutID:0,
        StartTime:'18:00:00',
        EndTime:'20:00:00',
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