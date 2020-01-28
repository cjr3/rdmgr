/**
 * Controller for Phase records
 */
import vars, { PhaseRecord } from 'tools/vars';
import {CreateController, LoadControllerRecords} from './functions.records';
import { Files, IRecordController } from './vars';

const PhasesController:IRecordController = CreateController(vars.RecordType.Phase, Files.Phases);
PhasesController.Load = async () : Promise<boolean> => {
    return LoadControllerRecords(PhasesController, (records:Array<any>) => {
        records.forEach((phase) => {
            if(phase.PhaseTime) {
                let parts:Array<string> = phase.PhaseTime.split(':');
                phase.Duration = [
                    parts[0] ? parseInt(parts[0]) : 0,
                    parts[1] ? parseInt(parts[1]) : 0,
                    parts[2] ? parseInt(parts[2]) : 0
                ]
            }
        });
    });
};

PhasesController.NewRecord = () : PhaseRecord => {
    return {
        RecordID:0,
        RecordType:vars.RecordType.Phase,
        Name:'',
        ShortName:'',
        Number:'',
        Color:'',
        Thumbnail:'',
        Photo:'',
        Background:'',
        Slide:'',
        Acronym:'',
        Code:'',
        PhaseQtr:0,
        PhaseTime:'00:00:00',
        Duration:[0,0,0]
    }
};

PhasesController.BuildAPI = async() => {
    /*
    const server = window.LocalServer;
    const exp = server.ExpressApp;

    //list of records
    exp.get(/^\/api\/v1\/phase(\/?)$/i, (req, res) => {
        res.send(server.PrepareObjectForSending(PrepareObjectForSending(PhasesController.Get())));
        res.end();
    });

    //get individual record
    exp.get(/^\/api\/v1\/phase\/:id([0-9]{1,6})$/i, (req, res) => {
        let record:PhaseRecord = PhasesController.GetRecord(req.param.id);
        if(record) {
            res.send(server.PrepareObjectForSending(PrepareObjectForSending(record)));
        } else {
            res.send(null);
        }
        res.end();
    });
    */
}

export default PhasesController;