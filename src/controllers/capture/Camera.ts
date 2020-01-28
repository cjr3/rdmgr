import {CreateController} from './functions';
import { ICaptureController } from './vars';
const CameraCaptureController:ICaptureController = CreateController('CC-CAM');
const PeerCameraCaptureController:ICaptureController = CreateController('CC-PCAM');
export default CameraCaptureController;
export {
    PeerCameraCaptureController
};