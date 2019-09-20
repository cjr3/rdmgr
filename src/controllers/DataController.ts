/**
 * Controller and access for global data,
 * such as Skater records.
 */
import {createStore} from 'redux';
import vars, {
    SkaterRecord,
    TeamRecord,
    PenaltyRecord,
    PhaseRecord,
    SlideshowRecord,
    VideoRecord,
    AnthemRecord,
    PeerRecord,
    SkaterTeamRecord
} from 'tools/vars';

import ScoreboardController from './ScoreboardController';
import ScorekeeperController from './ScorekeeperController';
import SlideshowController from './SlideshowController';
import VideoController from './VideoController';
import RosterController from './RosterController';
import ChatController from './ChatController';
import CaptureController from './CaptureController';
import CameraController from './CameraController';
import PenaltyController from './PenaltyController';
import RaffleController from './RaffleController';
import SponsorController from './SponsorController';

import Installation from 'tools/Installation';

const os = require('os');

const USER_PATH = os.homedir();
const TEMP_PATH = os.tmpdir();
//console.log(TEMP_PATH);

export interface IConfigUser {
    
}

export interface IDataControllerState {
    /**
     * User configuration
     */
    Config:any,
    Skaters:any,
    Teams:any,
    Penalties:any,
    Videos:any,
    Phases:Array<PhaseRecord>,
    Slideshows:any,
    ScoreboardConfig:any,
    ScorekeeperConfig:any,
    BroadcasterConfig:any,
    PenaltyTrackerConfig:any,
    Peers:any,
    Anthems:any,
    ServerConfig:any,
    Jams:Array<any>,
    MiscRecords:{
        NationalAnthemSinger:{
            Name:string,
            Biography:string,
            Background:string
        },
        Raffle:{
            Background:string
        },
        Announcers:{
            Announcer1:string,
            Announcer2:string
        },
        NextBoutFlier:string
    }
}

const InitState:IDataControllerState = {
    Config:{},
    Skaters:{},
    Teams:{},
    Penalties:{},
    Videos:{},
    Phases:[],
    Slideshows:{},
    ScoreboardConfig:{},
    ScorekeeperConfig:{},
    BroadcasterConfig:{},
    PenaltyTrackerConfig:{},
    Peers:{},
    Anthems:{},
    ServerConfig:{},
    Jams:[],
    MiscRecords:{
        NationalAnthemSinger:{
            Name:"",
            Biography:"",
            Background:""
        },
        Raffle:{
            Background:"2019/01/RaffleTicketEmpty.jpg"
        },
        Announcers:{
            Announcer1:"Old Greg",
            Announcer2:"ChingadDora"
        },
        NextBoutFlier:""
    }
};

/**
 * Actions for the data controller
 */
export enum Actions {
    /**
     * Sets the skater records
     */
    SET_SKATERS,
    /**
     * Sets the team records
     */
    SET_TEAMS,
    /**
     * Sets the penalty records
     */
    SET_PENALTIES,
    /**
     * Sets the video records
     */
    SET_VIDEOS,
    /**
     * Sets the phase records
     */
    SET_PHASES,
    /**
     * Sets the slideshow records
     */
    SET_SLIDESHOWS,
    /**
     * Sets the jam records
     */
    SET_JAMS,
    /**
     * Sets the anthem records
     */
    SET_ANTHEMS,
    /**
     * Sets the misc records object
     */
    SET_MISC_RECORDS,
    /**
     * Sets the peer records
     */
    SET_PEERS,
    /**
     * Sets the user configuration
     */
    SET_CONFIG_USER,
    /**
     * Sets the capture window configuration
     */
    SET_CONFIG_CAPTURE,
    /**
     * Sets the scoreboard configuration
     */
    SET_CONFIG_SCOREBOARD,
    /**
     * Sets the configuration of the scorekeeper
     */
    SET_CONFIG_SCOREKEEPER,
    /**
     * Sets the configuration for the broadcaster
     */
    SET_CONFIG_BROADCASTER,
    /**
     * Sets the configuration for the penalty tracker
     */
    SET_CONFIG_PENALTYTRACKER
}

//file constants
//const FOLDER_MAIN = 'c:/rdmgrdata';
const FOLDER_MAIN = 'c:/ProgramData/RDMGR';
const FOLDER_DATA = FOLDER_MAIN + "/files";
const FOLDER_MEDIA_ROOT = FOLDER_MAIN + "/images";
const FOLDER_MEDIA = FOLDER_MAIN + "/images/uploads";
const FOLDER_RECORDS = FOLDER_DATA + "/records";
const FOLDER_STATES = FOLDER_DATA + "/states";
const FOLDER_MEDIA_DEFAULT = FOLDER_MEDIA + "/default";
const FOLDER_MEDIA_VIDEOS = FOLDER_MEDIA + "/videos";
const FOLDER_MEDIA_SLIDESHOWS = FOLDER_MEDIA + "/slideshows";

//record files
const FILE_CONFIG = FOLDER_DATA + "/rdmgr.config.json";
const FILE_RECORDS = FOLDER_RECORDS + "/records.misc.json";
const FILE_SKATERS = FOLDER_RECORDS + "/records.skaters.json";
const FILE_TEAMS = FOLDER_RECORDS + "/records.teams.json";
const FILE_PHASES = FOLDER_RECORDS + "/records.phases.json";
const FILE_VIDEOS = FOLDER_RECORDS + "/records.videos.json";
const FILE_SLIDESHOWS = FOLDER_RECORDS + "/records.slideshows.json";
const FILE_SPONSORS = FOLDER_RECORDS + "/records.sponsors.json";
const FILE_PENALTIES = FOLDER_RECORDS + "/records.penalties.json";
const FILE_JAMS = FOLDER_RECORDS + "/records.jams.json";
const FILE_ANTHEM = FOLDER_RECORDS + "/records.anthem.json";
const FILE_PEERS = FOLDER_RECORDS + "/records.peers.json";

const FILE_TEST = FOLDER_DATA + "/test.txt";

//state files
const FILE_STATE_SCOREBOARD = FOLDER_STATES + "/scoreboard.state.json";
const FILE_STATE_SCOREKEEPER = FOLDER_STATES + "/scorekeeper.state.json";
const FILE_STATE_CAMERA = FOLDER_STATES + "/camera.state.json";
const FILE_STATE_CAPTURE = FOLDER_STATES + "/capture.state.json";
const FILE_STATE_CHAT = FOLDER_STATES + "/chat.state.json";
const FILE_STATE_PENALTY = FOLDER_STATES + "/penalty.state.json";
const FILE_STATE_RAFFLE = FOLDER_STATES + "/raffle.state.json";
const FILE_STATE_ROSTER = FOLDER_STATES + "/roster.state.json";
const FILE_STATE_SLIDESHOW = FOLDER_STATES + "/slideshow.state.json";
const FILE_STATE_SPONSOR = FOLDER_STATES + "/sponsor.state.json";
const FILE_STATE_VIDEO = FOLDER_STATES + "/video.state.json";
const FILE_STATE_MEDIA_QUEUE = FOLDER_STATES + "/media.state.json";

/**
 * Reducer for the DataController
 * @param {Object} state 
 * @param {Object} action 
 */
function DataReducer(state = InitState, action) {
    switch(action.type) {
        //Sets the user configuration
        case Actions.SET_CONFIG_USER :
            return Object.assign({}, state, {
                Config:Object.assign({}, state.Config, action.config)
            });

        //set skaters
        case Actions.SET_SKATERS :
            if(DataController.compare(state.Skaters, action.records))
                return state;
            return Object.assign({}, state, {Skaters:action.records});

        //set teams
        case Actions.SET_TEAMS :
            if(DataController.compare(state.Teams, action.records))
                return state;
            return Object.assign({}, state, {
                Teams:action.records
            });

        //set phases
        case Actions.SET_PHASES :
            return Object.assign({}, state, {
                Phases:action.records
            });

        //set videos
        case Actions.SET_VIDEOS :
            return Object.assign({}, state, {
                Videos:action.records
            });

        //set penalties
        case Actions.SET_PENALTIES :
            return Object.assign({}, state, {
                Penalties:action.records
            });

        //set slideshows
        case Actions.SET_SLIDESHOWS :
            return Object.assign({}, state, {
                Slideshows:action.records
            });

        case Actions.SET_JAMS :
            return Object.assign({}, state, {
                Jams:action.records
            });

        case Actions.SET_CONFIG_SCOREBOARD :
            return Object.assign({}, state, {
                ScoreboardConfig:Object.assign({}, state.ScoreboardConfig, action.config)
            });

        //National Anthem Singer Records
        case Actions.SET_ANTHEMS :
            return Object.assign({}, state, {Anthems:action.records});

        //Peers
        case Actions.SET_PEERS :
            return Object.assign({}, state, {Peers:action.records});

        //Sets the misc records object
        case Actions.SET_MISC_RECORDS :
            return Object.assign({}, state, {
                MiscRecords:Object.assign({}, state.MiscRecords, action.values)
            });

        default :
            return state;
    }
}

const DataStore = createStore(DataReducer);

var SaveTimer:number = 0;
var States = {
    Scoreboard:null,
    Scorekeeper:null,
    Camera:null,
    Capture:null,
    Chat:null,
    Penalty:null,
    Raffle:null,
    Roster:null,
    Slideshow:null,
    Sponsor:null,
    Video:null
};

/**
 * Class for the DataController
 */
const DataController = {

    FS:{},
    WFA:{},
    PATH:{},
    DIALOG:{},
    MediaFolder:FOLDER_MEDIA,

    /**
     * Initializes the data controller by including node modules for
     * I/O access.
     */
    Init() : Promise<any> {
        DataController.PATH = window.require('path');
        DataController.FS = window.require('fs');
        DataController.WFA = window.require('write-file-atomic');
        DataController.DIALOG = window.require('electron').remote.dialog;
        if(window && window.location && window.location.search.substr(1) === 'control') {
            let installer = new Installation();
            return new Promise(async (res, rej) => {
                let folderResponse = await installer.CheckFolders();
                if(typeof(folderResponse) === 'string')
                    rej(folderResponse);
                let fileResponse = await installer.CheckFiles();
                if(typeof(fileResponse) === 'string')
                    rej(fileResponse);
                res(true);
            });
        } else {
            return new Promise((res) => {
                let timer = setInterval(() => {
                    if(window && window.RDMGR && window.RDMGR.mainWindow) {
                        clearInterval(timer);
                        res(true);
                    }
                }, 500);
            });
        }
    },

    /**
     * Registers saving the state of controllers.
     * - A state is saved if it changes.
     * - The check is performed every 1 second, which is good enough for our purposes.
     */
    RegisterSaveStates() {

        SaveTimer = window.setInterval(() => {
            DataController.saveFile(FILE_STATE_CAMERA, JSON.stringify(CameraController.getState(), null, 4));
            DataController.saveFile(FILE_STATE_CAPTURE, JSON.stringify(CaptureController.getState(), null, 4));
            DataController.saveFile(FILE_STATE_PENALTY, JSON.stringify(PenaltyController.getState(), null, 4));
            DataController.saveFile(FILE_STATE_RAFFLE, JSON.stringify(RaffleController.getState(), null, 4));
            DataController.saveFile(FILE_STATE_ROSTER, JSON.stringify(RosterController.getState(), null, 4));
            DataController.saveFile(FILE_STATE_SCOREBOARD, JSON.stringify(ScoreboardController.getState(), null, 4));
            DataController.saveFile(FILE_STATE_SCOREKEEPER, JSON.stringify(ScorekeeperController.getState(), null, 4));
            DataController.saveFile(FILE_STATE_SLIDESHOW, JSON.stringify(SlideshowController.getState(), null, 4));
            DataController.saveFile(FILE_STATE_SPONSOR, JSON.stringify(SponsorController.getState(), null, 4));
            DataController.saveFile(FILE_STATE_VIDEO, JSON.stringify(VideoController.getState(), null, 4));
        }, 1000);
    },

    /**
     * Clears the timer used to save states.
     */
    UnregisterSaveStates() {

    },

    /**
     * Reads a local file, and returns a promise. Use then() to access the data of the file.
     * @param {String} filename 
     * @param {Boolean} sync true to return data synchronously
     */
    loadFile(filename:string, sync:boolean = false) : Promise<any> {
        let fs:any = DataController.FS;
        return new Promise((res, rej) => {
            if(sync) {
                res(fs.readFileSync(filename));
            } else {
                fs.readFile(filename, (err, data) => {
                    err ? rej(err) : res(data);
                });
            }
        });
    },

    //empty callback for node js fs.writeFile
    _emptySaveFileCallback() {},

    /**
     * Saves a file.
     * @param {String} filename Full path to the file to save
     * @param {String} content Content to save
     * @param {Boolean} sync true to save synchronously (default is false)
     */
    saveFile(filename, content, sync:boolean = false) {
        try {
            var ext = DataController.ext(filename);
            if(ext === 'json') {
                if(!content || content.length <= 0)
                    return;
                try {
                    JSON.parse(content);
                } catch(er) {
                    return;
                }
            }
            let fs:any = DataController.FS;
            if(sync) {
                fs.writeFileSync(filename, content);
            } else {
                fs.writeFile(filename, content, DataController._emptySaveFileCallback);
            }
        } catch(er) {
            //+show error
            //console.log(er);
        }
    },

    /**
     * Saves a records file.
     * @param {String} filename 
     * @param {Obejct} values
     */
    saveRecordsFile(filename, values) {
        DataController.saveFile(filename, JSON.stringify({
            Records:DataController.prepareRecordsForSaving(values)
        }));
    },

    /**
     * Saves the given record. The record will be saved to the
     * file based on its RecordType property.
     * @param {Object} record The record to save.
     */
    SaveRecord(record) {
        if(typeof(record) !== "object" || record === null)
            return;
        
        var srecord = Object.assign({}, record);
        var records:any = {};
        var filename:string = '';
        var type:number = -1;
        switch(record.RecordType) {
            //Skater
            case vars.RecordType.Skater :
                records = Object.assign({}, DataController.getSkaters());
                filename = FILE_SKATERS;
                type = Actions.SET_SKATERS;
            break;

            //Team
            case vars.RecordType.Team :
                records = Object.assign({}, DataController.getTeams());
                filename = FILE_TEAMS;
                type = Actions.SET_TEAMS;
            break;

            //Slideshow
            case vars.RecordType.Slideshow :
                records = Object.assign({}, DataController.getSlideshows());
                filename = FILE_SLIDESHOWS;
                type = Actions.SET_SLIDESHOWS;
            break;

            //Video
            case vars.RecordType.Video :
                records = Object.assign({}, DataController.getVideos());
                filename = FILE_VIDEOS;
                type = Actions.SET_VIDEOS;
            break;

            //Penalty
            case vars.RecordType.Penalty :
                records = Object.assign({}, DataController.getPenalties());
                filename = FILE_PENALTIES;
                type = Actions.SET_PENALTIES;
            break;

            //Anthem
            case vars.RecordType.Anthem :
                records = Object.assign({}, DataController.getAnthemSingers());
                filename = FILE_ANTHEM;
                type = Actions.SET_ANTHEMS;
            break;

            //Peers
            case vars.RecordType.Peer :
                records = Object.assign({}, DataController.getPeers());
                filename = FILE_PEERS;
                type = Actions.SET_PEERS;
            break;

            case vars.RecordType.Phase :
                filename = FILE_PHASES;
                records = DataController.getPhases();
                type = Actions.SET_PHASES;
            break;

            default :
                return;
        }

        //generate a new record ID
        if(srecord.RecordID <= 0) {
            let id = 0;
            if(records instanceof Array) {
                records.forEach((record) => {
                    if(record.RecordID > id)
                        id = record.RecordID;
                });
            } else {
                let keys = Object.entries(records);
                keys.forEach((entry:any) => {
                    if(entry[1].RecordID > id)
                        id = entry[1].RecordID;
                });
            }
            srecord.RecordID = id + 1;
        }

        //update records after generating an ID
        switch(srecord.RecordType) {
            case vars.RecordType.Skater :
                if(srecord.Teams && srecord.Teams.length) {
                    srecord.Teams.forEach((team) => {
                        team.SkaterID = srecord.RecordID;
                    });
                }
            break;
            default :
            break;
        }

        if(srecord.RecordType === vars.RecordType.Phase) {
            let index = records.findIndex((record) => {
                return (record.RecordID == srecord.RecordID);
            });
            if(index >= 0) {
                records[index] = srecord;
            } else {
                records.push(srecord);
            }

        } else {
            records[srecord.RecordType + "-" + srecord.RecordID] = srecord;
        }
        
        DataController.saveRecordsFile(filename, records);
        DataController.getStore().dispatch({
            type:type,
            records:records
        });
    },

    /**
     * Attempts to update an array of records.
     * @param {String} type 
     * @param {Array} records 
     */
    async UpdateRecords(type, records) {
        let filename:string = '';
        let operation:number = -1;
        switch(type) {
            //Skaters
            case vars.RecordType.Skater :
                operation = Actions.SET_SKATERS;
                filename = FILE_SKATERS;
            break;
            
            //Teams
            case vars.RecordType.Team :
                operation = Actions.SET_TEAMS;
                filename = FILE_TEAMS;
            break;

            //Penalties
            case vars.RecordType.Penalty :
                operation = Actions.SET_PENALTIES;
                filename = FILE_PENALTIES;
            break;

            //Phases / Quarters
            case vars.RecordType.Phase :
                operation = Actions.SET_PHASES;
                filename = FILE_PHASES;
            break;

            //Anthem Singers
            case vars.RecordType.Anthem :
                operation = Actions.SET_ANTHEMS;
                filename = FILE_ANTHEM;
            break;

            default :
            break;
        }

        if(filename.length > 0 && operation >= 0) {
            if(records instanceof Array) {
                let items:any = records;

                //phases are always an array, not an object
                if(type !== vars.RecordType.Phase)
                    items = DataController.prepareRecords(records);

                //set records
                DataController.getStore().dispatch({
                    type:operation,
                    records:items
                });

                //save records as they're received (an array)
                DataController.saveFile(filename, JSON.stringify({
                    Records:records
                }));
            } else {
                //set records - they're already an object
                DataController.getStore().dispatch({
                    type:operation,
                    records:records
                });

                DataController.saveFile(filename, JSON.stringify({
                    Records:DataController.prepareRecordsForSaving(records)
                }));
            }
        }
    },

    /**
     * Saves a record to the misc records.
     * @param {String} key A unique key for the record
     * @param {Mixed} record Serializable value.
     */
    SaveMiscRecord(key, record) {
        var records = Object.assign({}, DataController.getState().MiscRecords);
        if(typeof(record) === "object")
            records[key] = Object.assign({}, record);
        else
            records[key] = record;
        DataController.saveFile(FILE_RECORDS, JSON.stringify({Records:records}, null, 4));
    },

    /**
     * Gets a record from the misc records.
     * @param {String} key 
     */
    GetMiscRecord(key) {
        var records = DataController.getState().MiscRecords;
        if((key in records)) {
            return records[key];
        }
        return null;
    },

    /**
     * Loads all files.
     */
    loadFiles() {
        return Promise.all([
            DataController.loadSkaters(),
            DataController.loadTeams(),
            DataController.loadPhases(),
            DataController.loadSlideshows(),
            DataController.loadVideos(),
            DataController.loadPenalties(),
            DataController.loadAnthemSingers(),
            DataController.loadMiscRecords()
        ]).then(() => {
            return Promise.all([
                DataController.loadScoreboardState(),
                DataController.loadCaptureState(),
                DataController.loadRosterState()
            ]);
        })
    },

    /**
     * Loads the user configuration settings.
     */
    loadConfig() {
        return DataController.loadFile(FILE_CONFIG)
            .then((data) => {
                try {
                    var content = JSON.parse(data);
                    DataController.getStore().dispatch({
                        type:Actions.SET_CONFIG_USER,
                        config:content
                    });
                } catch(er) {

                }
            });
    },

    /**
     * Loads the capture state to the capture controller.
     */
    loadCaptureState() {
        return DataController.loadFile(FILE_STATE_CAPTURE)
            .then((data:any) => {
                try {
                    var content = JSON.parse(data);
                    CaptureController.SetState(content);
                } catch(er) {

                }
            });
    },

    loadRosterState() {
        return DataController.loadFile(FILE_STATE_ROSTER)
            .then((data:any) => {
                try {
                    var content = JSON.parse(data);
                    RosterController.SetState(content);
                } catch(er) {

                }
            });
    },

    /**
     * Gets the current user configuration.
     */
    getConfig() {
        return DataController.getState().Config;
    },

    /**
     * Load skater records
     */
    loadSkaters() {
        return DataController.loadFile(FILE_SKATERS)
            .then((data:any) => {
                try {
                    DataController.getStore().dispatch({
                        type:Actions.SET_SKATERS,
                        records:DataController.prepareRecords(JSON.parse(data).Records)
                    });
                } catch(er) {

                }
            });
    },

    /**
     * Saves the skater records.
     */
    SaveSkaters() {
        DataController.saveRecordsFile(FILE_SKATERS, DataController.getState().Skaters);
    },

    /**
     * Loads the team records to the state.
     */
    loadTeams() {
        return DataController.loadFile(FILE_TEAMS)
            .then((data:any) => {
                try {
                    DataController.getStore().dispatch({
                        type:Actions.SET_TEAMS,
                        records:DataController.prepareRecords(JSON.parse(data).Records)
                    });
                } catch(er) {

                }
            });
    },

    /**
     * Saves the team records.
     */
    SaveTeams() {
        DataController.saveRecordsFile(FILE_TEAMS, DataController.getState().Teams);
    },

    /**
     * Gets the team records.
     * @param {Boolean} zero 
     */
    getTeams(zero:boolean = false) {
        var records = DataController.getRecords(vars.RecordType.Team, zero);
        if(records instanceof Array) {
            return records.sort((a, b) => {
                if(a.Name !== undefined && b.Name !== undefined)
                    return a.Name.localeCompare(b.Name);
                return 0;
            });
        }
        return records;
    },

    /**
     * Loads the scoreboard phases.
     */
    loadPhases() {
        return DataController.loadFile(FILE_PHASES)
        .then((data:any) => {
            try {
                let phases = JSON.parse(data).Records;
                phases.forEach((phase) => {
                    phase.Duration = phase.PhaseTime.split(":");
                });
                DataController.getStore().dispatch({
                    type:Actions.SET_PHASES,
                    records:phases
                });
            } catch(er) {

            }
        })
    },

    /**
     * Saves the scoreboard phase records.
     */
    SavePhases() {
        DataController.saveRecordsFile(FILE_PHASES, DataController.getState().Phases);
    },

    /**
     * 
     */
    getPhases() : Array<PhaseRecord> {
        return DataController.getState().Phases;
    },

    /**
     * 
     * @param {Number} id 
     */
    getPhase(id:number) {
        var phases = DataController.getPhases();
        if(phases && phases.length) {
            for(var key in phases) {
                if(phases[key].RecordID === id)
                    return phases[key];
            }
        }
        return null;
    },

    /**
     * Loads the video files.
     */
    loadVideos() {
        return DataController.loadFile(FILE_VIDEOS)
        .then((data:any) => {
            try {
                DataController.getStore().dispatch({
                    type:Actions.SET_VIDEOS,
                    records:DataController.prepareRecords(JSON.parse(data).Records)
                });
            } catch(er) {

            }
        });
    },

    /**
     * Saves the video records.
     */
    SaveVideos() {
        DataController.saveRecordsFile(FILE_VIDEOS, DataController.getState().Videos);
    },

    /**
     * Loads the slideshows to the state.
     */
    loadSlideshows() {
        return DataController.loadFile(FILE_SLIDESHOWS)
        .then((data:any) => {
            try {
                DataController.getStore().dispatch({
                    type:Actions.SET_SLIDESHOWS,
                    records:DataController.prepareRecords(JSON.parse(data).Records)
                });
            } catch(er) {

            }
        })
    },

    /**
     * Saves the slideshow records.
     */
    SaveSlideshows() {
        DataController.saveRecordsFile(FILE_SLIDESHOWS, DataController.getState().Slideshows);
    },

    /**
     * Loads the penalties to the state.
     */
    loadPenalties() {
        return DataController.loadFile(FILE_PENALTIES)
        .then((data:any) => {
            try {
                DataController.getStore().dispatch({
                    type:Actions.SET_PENALTIES,
                    records:DataController.prepareRecords(JSON.parse(data).Records)
                });
            } catch(er) {

            }
        });
    },

    /**
     * Saves the penalty records.
     */
    SavePenalties() {
        DataController.saveRecordsFile(FILE_PENALTIES, DataController.getState().Penalties);
    },

    /**
     * Gets a key/value pair object of penalty records.
     * @param {Boolean} zero true to return a zero-indexed array instead of an object.
     * @returns {Object}
     */
    getPenalties(zero:boolean = false) {
        return DataController.getRecords(vars.RecordType.Penalty, zero);
    },

    /**
     * Loads the national anthem singers.
     * @returns Promise
     */
    loadAnthemSingers() {
        return DataController.loadFile(FILE_ANTHEM)
        .then((data:any) => {
            try {
                DataController.getStore().dispatch({
                    type:Actions.SET_ANTHEMS,
                    records:DataController.prepareRecords(JSON.parse(data).Records)
                });
            } catch(er) {

            }
        });
    },

    /**
     * Gets a key/value pair object of national anthem singer records.
     * @param {Boolean} zero true to return a zero-indexed array instead of an object.
     */
    getAnthemSingers(zero:boolean = false) : any|Array<AnthemRecord> {
        return DataController.getRecords(vars.RecordType.Anthem, zero);
    },

    /**
     * Gets the national anthem singer record for the given ID
     * @param {Object} id 
     */
    getAnthemSinger(id) {
        var records:any = DataController.getAnthemSingers();
        if(records !== null && typeof(records) === 'object' && records[vars.RecordType.Anthem + "-" + id])
            return records[vars.RecordType.Anthem + "-" + id];
        return null;
    },

    /**
     * Loads the last state of the scoreboard
     */
    loadScoreboardState() {
        return DataController.loadFile(FILE_STATE_SCOREBOARD)
        .then((data:any) => {
            try {
                var config = JSON.parse( data );
                DataController.getStore().dispatch({
                    type:Actions.SET_CONFIG_SCOREBOARD,
                    config:config
                });
                ScoreboardController.ApplyConfig(config);
            } catch(er) {
                console.log(er)
            }
        });
    },

    /**
     * Loads the misc records.
     */
    loadMiscRecords() {
        return DataController.loadFile(FILE_RECORDS)
        .then((data:any) => {
            try {
                DataController.getStore().dispatch({
                    type:Actions.SET_MISC_RECORDS,
                    values:JSON.parse(data).Records
                });
            } catch(er) {

            }
        });
    },

    /**
     * Loads the peer records.
     */
    loadPeers() {
        return DataController.loadFile(FILE_PEERS)
        .then((data:any) => {
            try {
                DataController.getStore().dispatch({
                    type:Actions.SET_PEERS,
                    records:DataController.prepareRecords(JSON.parse(data).Records)
                });
            } catch(er) {

            }
        })
    },

    /**
     * Gets the peer records.
     * @param {Number} zero 
     */
    getPeers(zero:boolean = false) {
        if(zero) {
            return DataController.zeroArray(DataController.getState().Peers);
        }
        return DataController.getState().Peers;
    },

    /**
     * Gets the peer record with the given ID
     * @param {Number} id 
     */
    getPeer(id) {
        var peers:any = DataController.getPeers();
        if(typeof(peers) !== 'object' || peers === null)
            return null;
        if(typeof(id) === 'string' && Number.isNaN(parseInt(id))) {
            for(var key in peers) {
                if(peers[key].PeerID === id)
                    return peers[key];
            }
        } else {
            if(peers[vars.RecordType.Peer + "-" + id])
                return peers[vars.RecordType.Peer + "-" + id];
        }
        return null;
    },

    /**
     * Prepares records for use, by converting them from
     * a zero-based index array, to a key/value pair.
     * Each index is the RecordType + '-' + RecordID of each record
     * @param {Object} records 
     */
    prepareRecords(records) {
        var values = {};
        for(var key in records)
            values[records[key].RecordType + "-" + records[key].RecordID] = records[key];
        return values;
    },

    /**
     * Prepares records for saving by converting them to a zero-based index array
     * @param {Object} values
     */
    prepareRecordsForSaving(values) {
        var records:Array<any> = [];
        for(let key in values) {
            records.push(DataController.prepareObjectForSaving( Object.assign({}, values[key]) ));
        }
        return records;
    },

    /**
     * Prepares the object for saving to the local files.
     * - Removes full paths and URLs to image files.
     * @param {Object} record 
     */
    prepareObjectForSaving(record:any) {
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
                    record[key] = DataController.mpath(record[key], true);
                break;

                default :
                    if(typeof(record[key]) === 'object' && record[key] !== null) {
                        if(record[key] instanceof Array) {
                            for(let akey in record[key]) {
                                if(typeof(record[key][akey]) === 'object' && record[key][akey] !== null) {
                                    record[key][akey] = DataController.prepareObjectForSaving(record[key][akey]);
                                }
                            }
                        } else {
                            record[key] = Object.assign({}, DataController.prepareObjectForSaving(record[key]));
                        }
                    }
                break;
            }
        }
        return record;
    },

    /**
     * Converts a key-based object into a zero-indexed array
     * @param {Object} values
     */
    zeroArray(values) {
        var records:Array<any> = [];
        for(var key in values)
            records.push(values[key]);
        return records;
    },

    /**
     * Prepends the media folder to the given src.
     * @param {String} src
     * @param {Boolean} removal true to remove the path instead of prepending it.
     */
    mpath(src:string|null|undefined = '', removal:boolean = false) {
        if(typeof(src) !== "string" || src === '')
            return '';
        if(src.indexOf('http://') === 0 || src.indexOf('https://') === 0)
            return src;
        if(removal) {
            if(typeof(src) === "string" && src.indexOf(FOLDER_MEDIA) >= 0)
                return src.replace(FOLDER_MEDIA, '');
            return src;
        }
        if(typeof(src) === "string" && src.indexOf(FOLDER_MEDIA) !== 0)
            return FOLDER_MEDIA + "/" + src;
        return src;
    },

    getMediaFolder() {
        return FOLDER_MEDIA + "/";
    },

    /**
     * Prepends the user path to the given src.
     * @param {String} src 
     */
    upath(src) {
        if(typeof(src) === "string" && src.indexOf(USER_PATH) !== 0)
            return USER_PATH + "/" + src;
        return src;
    },

    /**
     * Gets the extension for the given file.
     * @param {String} src 
     */
    ext(src) {
        let path:any = DataController.PATH;
        return path.extname(src).toLowerCase().split('.').pop();
    },

    /**
     * Gets the basename of th given path.
     * @param path The full path
     */
    basename(path:string) {
        let pather:any = DataController.PATH;
        return pather.basename(path);
    },

    /**
     * Checks if the user has access to the given path
     * @param path string
     * @param cb Function
     */
    access(path:string) : Promise<any> {
        let fs:any = DataController.FS;
        return fs.promises.access( path );
    },

    /**
     * Gets height, width, x, and y, values, to keep a rectangles aspect ratio.
     * @param {Number} mw 
     * @param {Number} mh 
     * @param {Number} w 
     * @param {Number} h 
     */
    aspectSize(mw, mh, w, h) {
        var r = 0;
        if(w > mw) {
            r = mw / w;
            h = h * r;
            w = w * r;
        }

        if(h > mh) {
            r = mh / h;
            w = w * r;
            h = h * r;
        }

        var x = (mw/2) - (w/2);
        var y = (mh/2) - (h/2);

        return {width:w, height:h, x:x, y:y};
    },

    /**
     * Gets a string in the format of HH:MM:SS for the given seconds.
     * @param {Number} amount 
     */
    secondsToTime(amount) {
        var h = Math.floor(amount / 3600);
        var m = Math.floor((amount % 3600)/60);
        var s = Math.floor(amount % 60);
        var str = m.toString().padStart(2,'0') + ":" + s.toString().padStart(2,'0');
        if(h > 0)
            str = h.toString().padStart(2,'0') + ":" + str;
        return str;
    },

    /**
     * Gets the records of the specified type.
     * @param {String} type
     * @param {Boolean} zero
     */
    getRecords(type:string, zero:boolean = false) : 
        Array<SkaterRecord>|
        Array<TeamRecord>|
        Array<SlideshowRecord>|
        Array<VideoRecord>|
        Array<PenaltyRecord>|
        Array<PhaseRecord>|
        Array<AnthemRecord>|
        Array<PeerRecord>
        {
        var records:any = null;
        var state = DataController.getState();
        switch(type) {
            case vars.RecordType.Skater :
                records = state.Skaters;
                break;
            case vars.RecordType.Team :
                records = state.Teams;
                break;
            case vars.RecordType.Slideshow :
                records = state.Slideshows;
                break;
            case vars.RecordType.Video :
                records = state.Videos;
                break;
            case vars.RecordType.Penalty :
                records = state.Penalties;
                break;
            case vars.RecordType.Phase :
                records = state.Phases;
                break;
            case vars.RecordType.Anthem :
                records = state.Anthems;
                break;
            case vars.RecordType.Peer :
                records = state.Peers;
                break;
            default :
            break;
        }

        if(zero)
            return DataController.zeroArray( records );
        return records;
    },

    /**
     * Gets an arbitrary record with a known ID and type.
     * @param {String} type RecordType code
     * @param {Number} id RecordID
     */
    getRecord(type, id) {
        switch(type) {
            case vars.RecordType.Team :
                return DataController.getTeam(id);
            case vars.RecordType.Skater :
                return DataController.getSkater(id);
            case vars.RecordType.Slideshow :
                return DataController.getSlideshow(id);
            case vars.RecordType.Video :
                return DataController.getVideo(id);
            case vars.RecordType.Phase :
                return DataController.getPhase(id);
            case vars.RecordType.Anthem :
                return DataController.getAnthemSinger(id);
            default :
                return null;
        }
    },

    /**
     * Gets a new record of the given type.
     * @param {String} type 
     */
    getNewRecord(type) {
        var record:any = {
            RecordID:0,
            RecordType:type,
            Name:'',
            ShortName:'',
            Number:'',
            Color:'',
            Thumbnail:'',
            Photo:'',
            Background:'',
            Slide:'',
            Acronym:''
        };

        switch(type) {
            //Skater
            case vars.RecordType.Skater :
                record.Teams = [];
                record.BirthDate = '';
                record.RetireDate = '';
            break;

            //Team
            case vars.RecordType.Team :
                record.Skaters = [];
                record.Tagline = '';
                record.TeamType = 'H';
                record.LeagueID = 0;
                record.YouthTeam = 'N';
                record.ScoreboardThumbnail = '';
            break;

            //Slideshow
            case vars.RecordType.Slideshow :
                record.Records = [];
                record.SlideshowType = "INTRO";
                record.SlideshowOverlay = '';
            break;

            //Phase
            case vars.RecordType.Phase :
                record.Duration = [0,0,0];
                record.PhaseQtr = 0;
                record.PhaseTime = "00:00:00";
            break;

            //Penalty
            case vars.RecordType.Penalty :
                record.PenaltyType = 'P';
                record.Code = '';
                record.Description = '';
            break;

            //National Anthem Singer
            case vars.RecordType.Anthem :
                record.Biography = '';
            break;

            case vars.RecordType.Video :
                record.Filename = '';
            break;

            case vars.RecordType.Peer :
                record.PeerID = '';
                record.Port = 0;
                record.CapturePort = 0;
                record.Host = '127.0.0.1';
            break;

            default :
            break;
        }

        return record;
    },

    /**
     * Gets the team that matches the given RecordID. Null if no team found.
     * @param {Number} id 
     */
    getTeam(id) {
        if(DataStore.getState().Teams[vars.RecordType.Team + "-" + id])
            return DataStore.getState().Teams[vars.RecordType.Team + "-" + id];
        return null;
    },

    /**
     * Gets the skaters assigned to the given team.
     * @param {Number} id Team's record ID
     */
    getTeamSkaters(id) : Array<SkaterRecord> {
        var team = DataController.getTeam(id);
        var skaters:Array<SkaterRecord> = [];
        if(team === null)
            return skaters;
        var records:Array<SkaterRecord> = DataController.getSkaters(true);
        records.forEach((skater:SkaterRecord) => {
            if(skater.Teams && skater.Teams.length >= 1) {
                skater.Teams.forEach((steam:SkaterTeamRecord) => {
                    if(steam.TeamID === parseInt(id)) {
                        skaters.push(skater);
                    }
                });
            }
        });

        return skaters.sort((a:SkaterRecord, b) => {
            if(a !== undefined && b !== undefined && a.Name !== undefined && b.Name !== undefined)
                return a.Name.localeCompare(b.Name);
            return 0;
        });
    },

    /**
     * Gets the skater that matches the given RecordID. Null if no skater found.
     * @param {Number} id 
     */
    getSkater(id) {
        if(DataStore.getState().Skaters[vars.RecordType.Skater + "-" + id])
            return DataStore.getState().Skaters[vars.RecordType.Skater + "-" + id];
        return null;
    },

    /**
     * Gets the skater records.
     * @param {Boolean} zero Gets the skaters as a zero-based indexed array
     * @return {Object}
     */
    getSkaters(zero:boolean = false) : Array<SkaterRecord>|any {
        var records = this.getRecords(vars.RecordType.Skater, zero);
        if(records instanceof Array) {
            return records.sort((a, b) => {
                if(a.Name !== undefined && b.Name !== undefined)
                    return a.Name.localeCompare(b.Name);
                return 0;
            });
        }
        return records;
    },

    /**
     * Gets the slideshows that matches the given RecordID. Null if no slideshow found.
     * @param {Number} id 
     */
    getSlideshow(id) {
        if(DataStore.getState().Slideshows[vars.RecordType.Slideshow + "-" + id])
            return DataStore.getState().Slideshows[vars.RecordType.Slideshow + "-" + id];
        return null;
    },

    /**
     * Gets the slideshows.
     * @param {Boolean} zero true to get a zero-indexed, alpha-sorted array
     */
    getSlideshows(zero:boolean = false) {
        var records = DataController.getRecords(vars.RecordType.Slideshow, zero);
        if(records instanceof Array) {
            return records.sort((a, b) => {
                if(a.Name !== undefined && b.Name !== undefined)
                    return a.Name.localeCompare(b.Name);
                return 0;
            });
        }
        return records;
    },

    /**
     * Gets the video that matches the given RecordID. Null if no video found.
     * @param {Number} id 
     */
    getVideo(id) {
        if(DataStore.getState().Videos[vars.RecordType.Video + "-" + id])
            return DataStore.getState().Videos[vars.RecordType.Video + "-" + id];
        return null;
    },

    /**
     * Gets a key/value pair of video records.
     * @param {Boolean} zero
     * @return {Object}
     */
    getVideos(zero:boolean = false) {
        var records = DataController.getRecords(vars.RecordType.Video, zero);
        if(records instanceof Array) {
            return records.sort((a, b) => {
                if(a.Name !== undefined && b.Name !== undefined)
                    return a.Name.localeCompare(b.Name);
                return 0;
            });
        }
        return records;
    },

    /**
     * Compares two objects
     * @author nicbell (https://gist.github.com/nicbell/6081098)
     * @param {Object} obj1
     * @param {Object} obj1
     * @param {Boolean} log
     */
    compare(obj1:any, obj2:any) {
        if(obj1 === null || obj2 === null || obj1 === undefined || obj2 === undefined) {
            if(obj1 === null && obj2 === null)
                return true;
            if(obj1 === undefined && obj2 === undefined)
                return true;
            return false;
        }

        //Loop through properties in object 1
        for (var p in obj1) {
            //Check property exists on both objects
            if (obj1.hasOwnProperty(p) !== obj2.hasOwnProperty(p)) {
                return false;
            }
     
            switch (typeof (obj1[p])) {
                //Deep compare objects
                case 'object':
                    if (!DataController.compare(obj1[p], obj2[p])) return false;
                break;
                //Compare function code
                case 'function':
                    if (typeof (obj2[p]) == 'undefined' || (p !== 'compare' && obj1[p].toString() !== obj2[p].toString())) return false;
                break;
                //Compare values
                default:
                    if (obj1[p] !== obj2[p]) {
                        return false;
                    }
            }
        }
     
        //Check object 2 for any extra properties
        for (var p2 in obj2) {
            if (typeof (obj1[p2]) == 'undefined') return false;
        }

        return true;
    },

    /**
     * Moves an element within an array
     * @param {Array} arr The array to change
     * @param {Number} a The index of the element to move adjacent to
     * @param {Number} b The index of the element to move
     * @param {Boolean} right True of moving to the left of the target; default is false
     */
    MoveElement(arr, a, b, right = false) {
        if(a >= arr.length) {
            var k = a - arr.length + 1;
            while(k--) {
                arr.push(undefined);
            }
        }
        if(right) {
            if(b > a) {
                arr.splice(a+1, 0, arr.splice(b, 1)[0]);
            } else {
                arr.splice(a, 0, arr.splice(b, 1)[0]);
            }
        }
        else {
            if(a > b) {
                arr.splice(a, 0, arr.splice(b, 1)[0]);
            } else {
                arr.splice(a, 0, arr.splice(b, 1)[0]);
            }
        }
    },

    /**
     * Prepares an object for sending
     * - Strips local path names from media values
     * @param {Object} record 
     */
    PrepareObjectForSending(record) {
        if(typeof(record) !== 'object' || record == null)
            return record;
        
        for(let key in record) {
            switch(key) {
                case 'Thumbnail' :
                case 'Photo' :
                case 'ScoreboardThumbnail' :
                case 'Background' :
                case "Filename" :
                case "FileName" :
                    record[key] = DataController.mpath(record[key], true);
                break;

                default :
                    if(typeof(record[key]) === 'object' && record[key] !== null) {
                        if(record[key] instanceof Array) {
                            record[key] = record[key].slice();
                            for(var akey in record[key]) {
                                if(typeof(record[key][akey]) === 'object' && record[key][akey] !== null) {
                                    record[key][akey] = this.PrepareObjectForSending(Object.assign({}, record[key][akey]));
                                }
                            }
                        } else {
                            record[key] = this.PrepareObjectForSending(Object.assign({}, record[key]));
                        }
                    }
                break;
            }
        }

        return record;
    },

    /**
     * Prepares the given state for sending.
     * - Video Controller
     * @param {String} app 
     * @param {Object} state 
     */
    PrepareStateForSending(app, state) {
        switch(app) {
            case VideoController.Key :
                state = VideoController.prepareStateForSending(state);
            break;
            default :
            break;
        }
        return state;
    },

    /**
     * Gets the store
     */
    getStore() {
        return DataStore;
    },

    /**
     * Gets the current state of the store.
     */
    getState() {
        return DataStore.getState();
    },

    /**
     * Loads folders for the given path. If no path is provided, the media path is used.
     * @param {String} path The path to load
     * @param {Object} parent A parent folder object, with a 'path' and 'children' (array)
     * @param {Array} folders An array of folders already read (foor recursion)
     */
    async loadFolder(path:string = FOLDER_MEDIA + "/", parent:any = null, folders:Array<any> = []) : Promise<any> {
        let fs:any = DataController.FS;
        return new Promise((res, rej) => {
            return fs.readdir(path, {encoding:'utf8'}, async (err, files) => {
                if(err) {
                    rej(err);
                } else if(files !== null && typeof(files) === 'object') {
                    for(let file of files) {
                        let pe = new Promise((fres, frej) => {
                            return fs.stat(path + file, (er, stat) => {
                                if(er)
                                    frej(er);
                                else if(stat && stat.isDirectory && stat.isDirectory()) {
                                    fres({
                                        path:path + file,
                                        children:[]
                                    });
                                } else {
                                    fres(null);
                                }
                            });
                        });

                        await pe.then((folder) => {
                            if(folder === null)
                                return;
                            if(parent !== null && typeof(parent) === 'object')
                                parent.children.push( folder );
                            else
                                folders.push( folder );
                            return DataController.loadFolder(path + file + "/", folder, folders);
                        }).catch(() => {
                            
                        });
                    }
                    res(folders);
                }
            });
        });
    },

    /**
     * Lists the files for the given path.
     * @param {String} path Path to the folder to read
     */
    async loadFolderFiles(path) : Promise<Array<string>> {
        let fs:any = DataController.FS;
        return new Promise((res, rej) => {
            if(typeof(path) === 'string' && path === '')
                path = FOLDER_MEDIA;
            if(typeof(path) !== 'string' || path.indexOf(FOLDER_MEDIA) !== 0)
                rej(`Listing files is restricted to the RDMGR media folder: ${path}`);
            else {
                fs.readdir(path, "utf8", (err, files) => {
                    if(err)
                        rej(err);
                    else {
                        let records:Array<string> = [];
                        for(var key in files) {
                            let ext = DataController.ext(files[key]);
                            if(ext && ext !== '') {
                                records.push(path + "/" + files[key]);
                            }
                        }
                        res(records);
                    }
                });
            }
        });
    },

    /**
     * Shows a dialog for selecting files or folders.
     * @param {Object} options 
     */
    async showOpenDialog(options) : Promise<Array<string>> {
        let diag:any = DataController.DIALOG;
        let settings = Object.assign({
            title:"Select File(s)",
            defaultPath:FOLDER_MEDIA,
            buttonLabel:"SELECT",
            filers:[
                {name:'Images', extensions:['jpg', 'png', 'gif', 'jpeg']},
                {name:'Movies', extensions:['mp4', 'wmv', 'mov', 'webm']}
            ],
            properties:['openFile']
        }, options);

        return new Promise((res, rej) => {
            return diag.showOpenDialog(window.RDMGR.mainWindow, settings, names => {res(names ? names : undefined)});
        });
    },

    /**
     * 
     * @param {String} path 
     * @param {String} dest
     */
    async uploadFile(path, dest:string = '') {
        let fs:any = DataController.FS;
        let pather:any = DataController.PATH;
        if(typeof(dest) !== 'string' || dest.indexOf(FOLDER_MEDIA) !== 0) {
            let tdate = new Date();
            let yfolder = FOLDER_MEDIA + "/" + tdate.getFullYear();
            let mfolder = yfolder + "/" + ((tdate.getMonth() + 1).toString().padStart(2,'0'));
            await DataController.createFolder(yfolder);
            await DataController.createFolder(mfolder);
            dest = mfolder;
        }

        return fs.promises.copyFile(path, dest + '/' + pather.basename(path));
    },

    /**
     * Attempts to create a folder in the media folder.
     * @param {String} path 
     */
    async createFolder(path) {
        let fs:any = DataController.FS;
        return new Promise((res, rej) => {
            if(typeof(path) !== 'string')
                return rej('Path must be a string.');
            if(path.indexOf(FOLDER_MEDIA) !== 0)
                return rej('Path must reside in the RDMGR media folder.');

            if(fs.existsSync(path)) {
                return res(path);
            }

            let pe = fs.promises.mkdir(path);
            pe.then(res).catch(rej);
        });
    },

    /**
     * Subscribes to the store, and returns a function that can cancel that subscription
     * @param {Function} f 
     */
    subscribe(f) {
        return DataStore.subscribe(f);
    },

    buildAPI() {
        const server = window.LocalServer;
        const exp = server.ExpressApp;
        
        //get individual record
        exp.get(/^\/api\/record\/([A-Z]{3})\/(\d{1,10})/i, (req, res) => {
            res.send(DataController.getRecord(req.params[0], req.params[1]));
        });

        //get all records of the specified type
        exp.get(/^\/api\/record\/([A-Z]{3})$/i, (req, res) => {
            var records:Array<any> = [];
            if(req.params[0]) {
                let results:any = DataController.getRecords(req.params[0], true);
                if(results !== null && results instanceof Array && req.params[0] !== vars.RecordType.Phase) {
                    results = results.sort((a, b) => {
                        return a.Name.localeCompare(b.Name)
                    });
                }
            } else {
                res.send("Please provide a record type code.");
                res.end();
                return;
            }

            if(records.length >= 1) {
                records = server.PrepareObjectForSending(DataController.PrepareObjectForSending(records));
            }

            res.send(records);
        });

        //get image
        exp.get(/^\/api\/image\/(.*?)\.{1}(png|jpg|jpeg|gif){1}/i, (req, res) => {
            res.sendFile(DataController.mpath(req.params[0] + "." + req.params[1]));
        });

        //get thumbnail
        exp.get(/^\/api\/thumbnail\/(.*?)\.{1}(png|jpg|jpeg|gif){1}/i, (req, res) => {
            res.sendFile(DataController.mpath(req.params[0] + "." + req.params[1]));
        });
    }
};

export default DataController;

//file constants
export const Folders = {
    /**
     * Main folder
     */
    Main:FOLDER_MAIN,
    /**
     * Base folder for data files (records, states, config)
     */
    Data:FOLDER_DATA,
    /**
     * Root media folder
     */
    MediaRoot:FOLDER_MEDIA_ROOT,
    /**
     * Base media folder, for images, videos, slides, etc.
     */
    Media:FOLDER_MEDIA,
    /**
     * Folder for individual records
     */
    Records:FOLDER_RECORDS,
    /**
     * Folder for state records
     */
    States:FOLDER_STATES,
    /**
     * Folder for default media records
     */
    MediaDefault:FOLDER_MEDIA_DEFAULT,
    /**
     * Folder for video records
     */
    Videos:FOLDER_MEDIA_VIDEOS,
    /**
     * Folder for slideshow folders
     */
    Slideshows:FOLDER_MEDIA_SLIDESHOWS
}

export const Files = {
    /**
     * User configuration file
     */
    Config:FILE_CONFIG,
    /**
     * Misc records file
     */
    MiscRecords:FILE_RECORDS,
    /**
     * Skater records file
     */
    Skaters:FILE_SKATERS,
    /**
     * Team records file
     */
    Teams:FILE_TEAMS,
    /**
     * Phase records file
     */
    Phases:FILE_PHASES,
    /**
     * Video records file
     */
    Videos:FILE_VIDEOS,
    /**
     * Slideshow records file
     */
    Slideshows:FILE_SLIDESHOWS,
    /**
     * Sponsor records file
     */
    Sponsors:FILE_SPONSORS,
    /**
     * Penalty records file
     */
    Penalties:FILE_PENALTIES,
    /**
     * Jam records file
     */
    Jams:FILE_JAMS,
    /**
     * Anthem singer records file
     */
    AnthemSingers:FILE_ANTHEM,
    /**
     * Peer records file
     */
    Peers:FILE_PEERS,
    /**
     * Scoreboard state file
     */
    Scoreboard:FILE_STATE_SCOREBOARD,
    /**
     * Scorekeeper state file
     */
    Scorekeeper:FILE_STATE_SCOREKEEPER,
    /**
     * Camera state file
     */
    Camera:FILE_STATE_CAMERA,
    /**
     * Capture state file
     */
    Capture:FILE_STATE_CAPTURE,
    /**
     * Chat state file
     */
    Chat:FILE_STATE_CHAT,
    /**
     * Media Queue state file
     */
    MediaQueue:FILE_STATE_MEDIA_QUEUE,
    /**
     * Penalty state file
     */
    Penalty:FILE_STATE_PENALTY,
    /**
     * Raffle state file
     */
    Raffle:FILE_STATE_RAFFLE,
    /**
     * Roster state file
     */
    Roster:FILE_STATE_ROSTER,
    /**
     * Slideshow state file
     */
    Slideshow:FILE_STATE_SLIDESHOW,
    /**
     * Sponsor state file
     */
    Sponsor:FILE_STATE_SPONSOR,
    /**
     * Video state file
     */
    Video:FILE_STATE_VIDEO
}