import {CreateController} from './functions';
import {IAPIController, SponsorRecord} from './vars';

const APISponsorsController:IAPIController = CreateController('SKR', '/skater');
APISponsorsController.NewRecord = () : SponsorRecord => {
    return {
        RecordID:0,
        RecordType:'SPN',
        Name:'',
        Website:''
    };
};
export default APISponsorsController;