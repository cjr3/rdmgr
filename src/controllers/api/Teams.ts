import {CreateController} from './functions';
import {IAPIController, TeamRecord} from './vars';
import vars from 'tools/vars';

const APITeamsController:IAPIController = CreateController('TEM', '/team');
APITeamsController.NewRecord = () : TeamRecord => {
    return {
        RecordID:0,
        RecordType:'TEM',
        Name:''
    };
};
export default APITeamsController;