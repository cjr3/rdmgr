import {CreateController} from './functions';
import {IAPIController} from './vars';
const APIScoresController:IAPIController = CreateController('SCORES', '/scores');
export default APIScoresController;