/**
 * Controller for Slideshow records
 */

import vars, { SlideshowRecord } from 'tools/vars';
import {CreateController } from './functions.records';
import {Files, IRecordController} from './vars';
import { PrepareObjectForSending } from './functions';

const SlideshowsController:IRecordController = CreateController(vars.RecordType.Slideshow, Files.Slideshows);

SlideshowsController.NewRecord = () : SlideshowRecord => {
    return {
        RecordID:0,
        RecordType:vars.RecordType.Slideshow,
        Name:'',
        ShortName:'',
        Number:'',
        Color:'',
        Thumbnail:'',
        Photo:'',
        Background:'',
        Slide:'',
        Acronym:'',
        Records:[],
        SlideshowType:'INTRO',
        SlideshowOverlay:''
    }
};

SlideshowsController.BuildAPI = async () => {
    const server = window.LocalServer;
    const exp = server.ExpressApp;

    exp.get(/^\/api\/v1\/slideshow(\/?)$/i, (req, res) => {
        res.send(server.PrepareObjectForSending(PrepareObjectForSending(SlideshowsController.Get())));
        res.end();
    });

    exp.get(/^\/api\/v1\/slideshow\/:id([0-9]{1,6})$/i, (req, res) => {
        let record:SlideshowRecord = SlideshowsController.GetRecord(req.params.id);
        if(record) {
            res.send(server.PrepareObjectForSending(PrepareObjectForSending(record)));
        } else {
            res.send(null);
        }
        res.end();
    });
}

export default SlideshowsController;