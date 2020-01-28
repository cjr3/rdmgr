import {CreateController} from './functions';
import {IAPIController} from './vars';
const APIStandingsController:IAPIController = CreateController('STANDINGS', '/standings');
export default APIStandingsController;