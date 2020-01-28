import vars, { AnthemRecord } from 'tools/vars';
import {CreateController} from './functions.records';
import {Files, IRecordController} from './vars';
import { PrepareObjectForSending } from './functions';

const AnthemsController:IRecordController = CreateController(vars.RecordType.Anthem, Files.AnthemSingers);
AnthemsController.NewRecord = () : AnthemRecord => {
    return {
        RecordID:0,
        RecordType:vars.RecordType.Anthem,
        Name:'',
        ShortName:'',
        Number:'',
        Color:'',
        Thumbnail:'',
        Photo:'',
        Background:'',
        Slide:'',
        Acronym:'',
        Biography : ''
    };
};

AnthemsController.BuildAPI = async() => {
    const server = window.LocalServer;
    const exp = server.ExpressApp;

    //list of records
    exp.get(/^\/api\/v1\/anthem(\/?)$/i, (req, res) => {
        res.send(server.PrepareObjectForSending(PrepareObjectForSending(AnthemsController.Get())));
        res.end();
    });

    //get individual record
    exp.get(/^\/api\/v1\/anthem\/:id([0-9]{1,6})$/i, (req, res) => {
        let record:AnthemRecord = AnthemsController.GetRecord(req.params.id);
        if(record) {
            res.send(server.PrepareObjectForSending(PrepareObjectForSending(record)));
        } else {
            res.send(null);
        }
        res.end();
    });
};

export default AnthemsController;