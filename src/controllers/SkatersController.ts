/**
 * Controller for Skater records
 */
import vars, { SkaterRecord, SkaterTeamRecord, PenaltyRecord } from 'tools/vars';
import {CreateController, SaveRecord} from './functions.records';
import {Files, IRecordController} from './vars';
import { PrepareObjectForSending } from './functions';

const SkatersController:IRecordController = CreateController(vars.RecordType.Skater, Files.Skaters);
SkatersController.SaveRecord = async (record:SkaterRecord) : Promise<boolean> => {
    return SaveRecord(SkatersController, record, (skater:SkaterRecord) => {
        if(skater.Teams && skater.Teams.length) {
            skater.Teams.forEach((team:SkaterTeamRecord) => {
                team.SkaterID = skater.RecordID;
            });
        }
    });
};

SkatersController.NewRecord = () : SkaterRecord => {
    return {
        RecordID:0,
        RecordType:vars.RecordType.Skater,
        Name:'',
        ShortName:'',
        Number:'',
        Color:'',
        Thumbnail:'',
        Photo:'',
        Background:'',
        Slide:'',
        Acronym:'',
        Teams: new Array<SkaterTeamRecord>(),
        Penalties : new Array<PenaltyRecord>(),
        BirthDate : '',
        RetireDate : '',
        Position : ''
    };
};

SkatersController.BuildAPI = async () => {
    const server = window.LocalServer;
    const exp = server.ExpressApp;

    //list of records
    exp.get(/^\/api\/v1\/skater(\/?)$/i, (req, res) => {
        res.send(server.PrepareObjectForSending(PrepareObjectForSending(SkatersController.Get())));
        res.end();
    });

    //get individual record
    exp.get(/^\/api\/v1\/skater\/:id([0-9]{1,6})$/i, (req, res) => {
        let record:SkaterRecord = SkatersController.GetRecord(req.params.id);
        if(record) {
            res.send(server.PrepareObjectForSending(PrepareObjectForSending(record)));
        } else {
            res.send(null);
        }
        res.end();
    });
}

export default SkatersController;