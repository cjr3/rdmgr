/**
 * Controller for Video records
 */

import vars, { VideoRecord } from 'tools/vars';
import {CreateController } from './functions.records';
import {Files, IRecordController} from './vars';
import { PrepareObjectForSending, AddMediaPath } from './functions';

const VideosController:IRecordController = CreateController(vars.RecordType.Video, Files.Videos);

VideosController.NewRecord = () : VideoRecord => {
    return {
        RecordID:0,
        RecordType:vars.RecordType.Video,
        Name:'',
        ShortName:'',
        Number:'',
        Color:'',
        Thumbnail:'',
        Photo:'',
        Background:'',
        Slide:'',
        Acronym:''
    }
};

/**
 * 
 */
VideosController.BuildAPI = async () => {
    const server = window.LocalServer;
    const exp = server.ExpressApp;

    //list of records
    exp.get(/^\/api\/v1\/video(\/?)$/i, (req, res) => {
        res.send(server.PrepareObjectForSending(PrepareObjectForSending(VideosController.Get())));
        res.end();
    });

    //get individual record
    exp.get(/^\/api\/v1\/video\/:id([0-9]{1,6})$/i, (req, res) => {
        let record:VideoRecord = VideosController.GetRecord(req.params.id);
        if(record) {
            res.send(server.PrepareObjectForSending(PrepareObjectForSending(record)));
        } else {
            res.send(null);
        }
        res.end();
    });

    //stream video
    exp.get(/^\/api\/v1\/video\/:id([0-9]{1,6})\/stream(\/?)$/i, (req, res) => {
        let record:VideoRecord = VideosController.GetRecord(req.params.id);
        if(record) {
            if(!record.FileName) {
                res.sendState(404);
                res.end();
            }

            var file = AddMediaPath("videos/" + record.FileName);
            let fs:any = require('fs');
            fs.stat(file, function(err, stats) {
            if (err) {
                if (err.code === 'ENOENT') {
                    // 404 Error if file not found
                    return res.sendStatus(404);
                }
                res.end(err);
            }

            var range = req.headers.range;
            if (!range) {
                // 416 Wrong range
                range = "bytes=0-10";
            }
            var positions = range.replace(/bytes=/, "").split("-");
            var start = parseInt(positions[0], 10);
            var total = stats.size;
            var end = positions[1] ? parseInt(positions[1], 10) : total - 1;
            var chunksize = (end - start) + 1;
        
            res.writeHead(206, {
                "Content-Range": "bytes " + start + "-" + end + "/" + total,
                "Accept-Ranges": "bytes",
                "Content-Length": chunksize,
                "Content-Type": "video/mp4"
            });
        
            var stream = fs.createReadStream(file, { start: start, end: end, autoClose:true })
                .on("open", function() {
                    stream.pipe(res);
                }).on("error", function(err) {
                    res.end(err);
                });
            });
        } else {
            res.send(null);
        }
        res.end();
    });
};

export default VideosController;