import {CreateController} from './functions';
import { ICaptureController } from './vars';
interface ISponsorController extends ICaptureController {}
const SponsorCaptureController:ISponsorController = CreateController('CC-SPN');
export default SponsorCaptureController;