import vars, { Record } from "tools/vars";
import {Folders, Files} from './vars';
//import path from 'path';
import { IOFileQueue } from "tools/IO";
import { RemoveMediaPath } from "./functions";
let fs = require('fs');
let path = require('path');
if(window && window.require) {
    fs = window.require('fs');
    path = window.require('path');
}

//state saver
//export const StateSaver = new IO();

//state savers
export const StateSavers = {
    //Capture States
    'CC-ANC':new IOFileQueue(Files.CaptureAnnouncer),
    'CC-ANT':new IOFileQueue(Files.CaptureAnthem),
    'CC-PEN':new IOFileQueue(Files.CapturePenalty),
    'CC-RAF':new IOFileQueue(Files.CaptureRaffle),
    'CC-ROS':new IOFileQueue(Files.CaptureRoster),
    'CC-SCHEDULE':new IOFileQueue(Files.CaptureSchedule),
    'CC-SB':new IOFileQueue(Files.CaptureScoreboard),
    'CC-SB-JCLOCK':new IOFileQueue(Files.CaptureJamClock),
    'CC-SB-JAM':new IOFileQueue(Files.CaptureJamCounter),
    'CC-SB-BANNER':new IOFileQueue(Files.CaptureScorebanner),
    'CC-SK':new IOFileQueue(Files.CaptureScorekeeper),
    'CC-SCORES':new IOFileQueue(Files.CaptureScores),
    'CC-SLS':new IOFileQueue(Files.CaptureSlideshow),
    'CC-SPN':new IOFileQueue(Files.CaptureSponsor),
    'CC-STANDINGS':new IOFileQueue(Files.CaptureStandings),
    'CC-VID':new IOFileQueue(Files.CaptureVideo),
    //App States
    'SB':new IOFileQueue(Files.Scoreboard),
    'CHT':new IOFileQueue(Files.Chat),
    'PT':new IOFileQueue(Files.Penalty),
    'RAF':new IOFileQueue(Files.Raffle),
    'ROS':new IOFileQueue(Files.Roster),
    'SK':new IOFileQueue(Files.Scorekeeper),
    'SLS':new IOFileQueue(Files.Slideshow),
    'SPN':new IOFileQueue(Files.Sponsor),
    //['VID']:new IOFileQueue(Files.Video),
    //Misc States
    'UI':new IOFileQueue(Files.UI)
};

//record savers
export const RecordSavers = {
    [vars.RecordType.Anthem]:new IOFileQueue(Files.AnthemSingers),
    [vars.RecordType.Peer]:new IOFileQueue(Files.Peers),
    [vars.RecordType.Penalty]:new IOFileQueue(Files.Penalties),
    [vars.RecordType.Phase]:new IOFileQueue(Files.Phases),
    [vars.RecordType.Skater]:new IOFileQueue(Files.Skaters),
    [vars.RecordType.Slideshow]:new IOFileQueue(Files.Slideshows),
    [vars.RecordType.Team]:new IOFileQueue(Files.Teams),
    [vars.RecordType.Video]:new IOFileQueue(Files.Videos),
    MISC:new IOFileQueue(Files.MiscRecords)
};

export function FileExtension(src:string) :string|undefined {
    try {
        return path.extname(src).toLowerCase().split('.').pop();
    } catch(er) {
        return '';
    }
};

export function Basename(filepath:string) : string {
    return path.basename(filepath);
};

export async function CanAccessFile(filename:string) {
    return fs.promises.access( filename );
};

export async function LoadFile(filename:string, sync:boolean = false) : Promise<any> {
    return new Promise((res, rej) => {
        if(typeof(filename) === 'string' && filename.length) {
            if(sync) {
                res(fs.readFileSync(filename));
            } else {
                try {
                    fs.promises.readFile(filename).then((data) => {
                        res(data);
                    }).catch((er) => {
                        rej(er);
                    });
                } catch(er) {
                    rej(er.message);
                }
            }
        } else {
            rej('Please provide a filename to read.');
        }
    });
};

export async function LoadJsonFile(filename:string, sync:boolean = false) : Promise<any> {
    return new Promise((res, rej) => {
        LoadFile(filename, sync).then((data) => {
            try {
                let jdata:any = JSON.parse(data);
                res(jdata);
            } catch(er) {
                console.log('Failed to convert json data');
                rej(er.message);
            }
        }).catch((er) => {
            rej(er);
        })
    });
};

export async function SaveFile(filename, content, sync:boolean = false) {
    try {
        var ext = FileExtension(filename);
        if(ext === 'json') {
            if(!content || content.length <= 0)
                return;
            try {
                JSON.parse(content);
            } catch(er) {
                return;
            }
        }
        if(sync) {
            fs.writeFileSync(filename, content);
        } else {
            fs.writeFile(filename, content, () => {});
        }
    } catch(er) {
        //+show error
        //console.log(er);
    }
};

export async function GetRecordsFromFile(filename:string) : Promise<Array<Record>> {
    return new Promise(async (res, rej) => {
        if(filename === '')
            rej(`Failed to get records: file not specified.`);
        else {
            let data:any = await LoadJsonFile(filename);
            try {
                if(data && data.Records)
                    res(data.Records);
                else
                    throw new Error("File found, but no Records defined.");
            } catch(er) {
                rej(`Failed to load records: ${er.message}`)
            }
        }
    });
};

export async function SaveRecordsFile(type:string, records:Array<any>) : Promise<boolean> {
    return new Promise((res, rej) => {
        if(RecordSavers[type]) {
            RecordSavers[type].Save(JSON.stringify({
                Records:PrepareRecordsForSaving(records)
            }));
            res(true);
        } else {
            rej(`Failed to save: Unknown record type ${type}`);
        }
    });
};

/**
 * Loads folders for the given path. If no path is provided, the media path is used.
 * @param {String} path The path to load
 * @param {Object} parent A parent folder object, with a 'path' and 'children' (array)
 * @param {Array} folders An array of folders already read (foor recursion)
 */
export async function LoadFolder(folder:string = Folders.Media + "/", parent:any = null, folders:Array<any> = []) : Promise<any> {
    return new Promise((res, rej) => {
        return fs.readdir(folder, {encoding:'utf8'}, async (err, files) => {
            if(err) {
                rej(err);
            } else if(files !== null && typeof(files) === 'object') {
                for(let file of files) {
                    let pe = new Promise((fres, frej) => {
                        return fs.stat(folder + file, (er, stat) => {
                            if(er)
                                frej(er);
                            else if(stat && stat.isDirectory && stat.isDirectory()) {
                                fres({
                                    path:folder + file,
                                    children:[]
                                });
                            } else {
                                fres(null);
                            }
                        });
                    });

                    await pe.then((pfolder) => {
                        if(pfolder === null)
                            return;
                        if(parent !== null && typeof(parent) === 'object')
                            parent.children.push( pfolder );
                        else
                            folders.push( pfolder );
                        return LoadFolder(folder + file + "/", pfolder, folders);
                    }).catch(() => {
                        
                    });
                }
                res(folders);
            }
        });
    });
};

/**
 * Lists the files for the given path.
 */
export async function LoadFolderFiles(filename) : Promise<Array<string>> {
    return new Promise((res, rej) => {
        if(typeof(filename) === 'string' && filename === '')
            filename = Folders.Media;
        if(typeof(filename) !== 'string' || filename.indexOf(Folders.Media) !== 0)
            rej(`Listing files is restricted to the RDMGR media folder: ${filename}`);
        else {
            fs.readdir(filename, "utf8", (err, files) => {
                if(err)
                    rej(err);
                else {
                    let records:Array<string> = [];
                    for(var key in files) {
                        let ext = FileExtension(files[key]);
                        if(ext && ext !== '') {
                            records.push(filename + "/" + files[key]);
                        }
                    }
                    res(records);
                }
            });
        }
    });
};


/**
 * 
 * @param {String} path 
 * @param {String} dest
 */
export async function UploadFile(filename:string, dest:string = '') : Promise<any|undefined> {
    let local = dest;
    if(typeof(dest) !== 'string' || dest.indexOf(Folders.Media) !== 0) {
        let tdate = new Date();
        let yfolder = Folders.Media + "/" + tdate.getFullYear();
        let mfolder = yfolder + "/" + ((tdate.getMonth() + 1).toString().padStart(2,'0'));
        await CreateFolder(yfolder);
        await CreateFolder(mfolder);
        local = mfolder + '/' + Basename(filename);
    }

    return new Promise(async (res) => {
        let response = fs.promises.copyFile(filename, local);
        if(response === undefined)
            res(false);
        else
            res(local);
    });
};


/**
 * Attempts to create a folder in the media folder.
 * @param {String} path 
 */
export async function CreateFolder(folder:string) {
    return new Promise((res, rej) => {
        if(typeof(folder) !== 'string')
            rej('Path must be a string.');
        else if(folder.indexOf(Folders.Media) !== 0)
            rej('Path must reside in the RDMGR media folder.');
        else if(fs.existsSync(folder)) {
            res(folder);
        } else {
            let pe = fs.promises.mkdir(folder);
            pe.then(res).catch(rej);
        }
    });
};

export function PrepareRecordsForSaving(values:Array<any>) : Array<any> {
    var records:Array<any> = [];
    for(let key in values) {
        records.push(PrepareRecordForSaving( Object.assign({}, values[key]) ));
    }
    return records;
};

export function PrepareRecordForSaving(record:any) : any {
    for(let key in record) {
        switch(key) {
            case 'Thumbnail' :
            case 'Photo' :
            case 'ScoreboardThumbnail' :
            case 'Background' :
            case "Filename" :
            case "FileName" :
                if(window && window.LocalServer) {
                    record[key] = window.LocalServer.getVideoURL(record[key], true);
                    record[key] = window.LocalServer.getImageURL(record[key], true);
                }
                record[key] = RemoveMediaPath(record[key]);
            break;

            default :
                if(typeof(record[key]) === 'object' && record[key] !== null) {
                    if(record[key] instanceof Array) {
                        for(let akey in record[key]) {
                            if(typeof(record[key][akey]) === 'object' && record[key][akey] !== null) {
                                record[key][akey] = PrepareRecordForSaving(record[key][akey]);
                            }
                        }
                    } else {
                        record[key] = Object.assign({}, PrepareRecordForSaving(record[key]));
                    }
                }
            break;
        }
    }
    return record;
};