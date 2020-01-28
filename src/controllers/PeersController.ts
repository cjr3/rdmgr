/**
 * Controller for Peer records
 */

import vars, { PeerRecord } from 'tools/vars';
import {CreateController} from './functions.records';
import { Files, IRecordController } from './vars';

const PeersController:IRecordController = CreateController(vars.RecordType.Peer, Files.Peers);
PeersController.NewRecord = () : PeerRecord => {
    return {
        RecordID:0,
        RecordType:vars.RecordType.Peer,
        Name:'',
        ShortName:'',
        Number:'',
        Color:'',
        Thumbnail:'',
        Photo:'',
        Background:'',
        Slide:'',
        Acronym:'',
        Host:'127.0.0.1',
        CapturePort:0,
        Port:0,
        PeerID:''
    };
};

export default PeersController;