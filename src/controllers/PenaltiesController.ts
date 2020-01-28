/**
 * Controller for Penalty records
 */

import vars, { PenaltyRecord } from 'tools/vars';
import {CreateController} from './functions.records';
import {Files, IRecordController} from './vars';
import { PrepareObjectForSending } from './functions';

const PenaltiesController:IRecordController = CreateController(vars.RecordType.Penalty, Files.Penalties);
PenaltiesController.NewRecord = () : PenaltyRecord => {
    return {
        RecordID:0,
        RecordType:vars.RecordType.Penalty,
        Name:'',
        ShortName:'',
        Number:'',
        Color:'',
        Thumbnail:'',
        Photo:'',
        Background:'',
        Slide:'',
        Acronym:'',
        PenaltyType:'P',
        Code:'',
        Description:''
    };
};

PenaltiesController.BuildAPI = async () => {
    const server = window.LocalServer;
    const exp = server.ExpressApp;

    //list of records
    exp.get(/^\/api\/v1\/penalty(\/?)$/i, (req, res) => {
        res.send(server.PrepareObjectForSending(PrepareObjectForSending(PenaltiesController.Get())));
        res.end();
    });

    //get individual record
    exp.get(/^\/api\/v1\/penalty\/:id([0-9]{1,6})$/i, (req, res) => {
        let record:PenaltyRecord = PenaltiesController.GetRecord(req.params.id);
        if(record) {
            res.send(server.PrepareObjectForSending(PrepareObjectForSending(record)));
        } else {
            res.send(null);
        }
        res.end();
    });
}

export default PenaltiesController;