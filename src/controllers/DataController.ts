/**
 * Controller and access for global data,
 * such as Skater records.
 */
import {CreateController, BaseReducer} from './functions.controllers';
import vars from 'tools/vars';
import {Files, IController} from './vars';
import ScoreboardController from './ScoreboardController';
import VideoController from './VideoController';
import RosterController from './RosterController';
import ChatController from './ChatController';
import Installation from 'tools/Installation';
import PenaltyController from './PenaltyController';
import ScorekeeperController from './ScorekeeperController';
import UIController from './UIController';

//individual data controllers
import SkatersController from './SkatersController';
import TeamsController from './TeamsController';
import VideosController from './VideosController';
import SlideshowsController from './SlideshowsController';
import PhasesController from './PhasesController';
import AnthemsController from './AnthemsController';
import PeersController from './PeersController';
import PenaltiesController from './PenaltiesController';
import AnnouncerCaptureController from './capture/Announcer';
import AnthemCaptureController from './capture/Anthem';
import PenaltyCaptureController from './capture/Penalty';
import RosterCaptureController from './capture/Roster';
import { AddMediaPath, RemoveMediaPath } from './functions';
import { RecordSavers, LoadJsonFile, StateSavers } from './functions.io';
import ScoreboardCaptureController, { JamClockCaptureController, JamCounterCaptureController, ScorebannerCaptureController } from './capture/Scoreboard';
import ScorekeeperCaptureController from './capture/Scorekeeper';
import { SetAuthEndpoint, SetEndpoint, SetValidateEndpoint, SetAuthToken } from './api/functions';
import SponsorCaptureController from './capture/Sponsor';
import SlideshowCaptureController from './capture/Slideshow';
import SlideshowController from './SlideshowController';
import SponsorController from './SponsorController';
import ScoresCaptureController from './capture/Scores';
import ScheduleCaptureController from './capture/Schedule';
import StandingsCaptureController from './capture/Standings';
import APIMatchesController from './api/Matches';
import APISeasonsController from './api/Seasons';
import APIBoutsController from './api/Bouts';
import APITeamsController from './api/Teams';

let path = require('path');
if(window && window.require) {
    path = window.require('path');
}

interface IDataController extends IController {
    Init:Function;
    RegisterSaveStates:Function;
    UnregisterSaveStates:Function;
    SaveRecord:{(record:any)};
    SaveMiscRecord:{(key:string,value:any)};
    GetMiscRecord:{(key:string)};
    LoadMiscRecords:Function;
    LoadConfig:Function;
    GetConfig:Function;
    GetPeers:Function;
    AddMediaPath:Function;
    RemoveMediaPath:Function;
    Basename:Function;
    DIALOG:any;
    PrepareStateForSending:Function;
};

/**
 * Defines user configuration
 */
export interface IConfigUser {
    /**
     * Determines if the application starts in full-screen mode or not
     */
    FullScreen:boolean;
    /**
     * Determines if the user has access to the capture window
     */
    Capture:boolean;
}

/**
 * Interface for the system config
 */
export interface IConfig {
    /**
     * User configuration 
     */
    UR:IConfigUser;
}

export interface SDataController {
    /**
     * Main configuration
     */
    Config:IConfig;
    ScoreboardConfig:any;
    MiscRecords:{
        LeagueLogo:string;
        LeagueBackground:string;
        NationalFlag:string;
        NextBoutFlier:string;
        APIEndpoint:string;
        APIAuthEndpoint:string;
        APIValidateEndpoint:string;
        APIUsername:string;
    }
}

const InitState:SDataController = {
    Config:{
        UR:{
            FullScreen:false,
            Capture:false
        }
    },
    ScoreboardConfig:{},
    MiscRecords:{
        LeagueBackground:'',
        LeagueLogo:'',
        NationalFlag:'',
        NextBoutFlier:"",
        APIEndpoint:"",
        APIAuthEndpoint:"",
        APIValidateEndpoint:"",
        APIUsername:""
    }
};

/**
 * Actions for the data controller
 */
export enum Actions {
    /**
     * Sets the misc records object
     */
    SET_MISC_RECORDS = 'SET_MISC_RECORDS',
    /**
     * Sets the user configuration
     */
    SET_CONFIG_USER = 'SET_CONFIG_USER',
    /**
     * Sets the scoreboard configuration
     */
    SET_CONFIG_SCOREBOARD = 'SET_CONFIG_SCOREBOARD'
}

/**
 * Reducer for the DataController
 * @param {Object} state 
 * @param {Object} action 
 */
const DataReducer = (state:SDataController = InitState, action) => {
    try {
        switch(action.type) {
            //Sets the user configuration
            case Actions.SET_CONFIG_USER :
                return Object.assign({}, state, {
                    Config:Object.assign({}, state.Config, action.config)
                });
    
            case Actions.SET_CONFIG_SCOREBOARD :
                return Object.assign({}, state, {
                    ScoreboardConfig:Object.assign({}, state.ScoreboardConfig, action.config)
                });
    
            //Sets the misc records object
            case Actions.SET_MISC_RECORDS :
                return Object.assign({}, state, {
                    MiscRecords:Object.assign({}, state.MiscRecords, action.values)
                });
    
            default :
                return BaseReducer(state, action);
        }
    } catch(er) {
        return state;
    }
}

//const DataStore = createStore(DataReducer);

const DataController:IDataController = CreateController('DATA', DataReducer);

DataController.Init = () => {
    if(window && window.location && window.location.search.substr(1) === 'control') {
        DataController.DIALOG = window.require('electron').remote.dialog;
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
};

DataController.RegisterSaveStates = () => {
    for(var key in RecordSavers) {
        RecordSavers[key].Start();
    }

    for(var key in StateSavers) {
        StateSavers[key].Start();
    }
};

DataController.UnregisterSaveStates = () => {
    for(var key in RecordSavers) {
        RecordSavers[key].Pause();
    }

    for(var key in StateSavers) {
        StateSavers[key].Pause();
    }
};

DataController.SaveRecord = async (record:any) => {
    if(record === null || typeof(record) !== "object") {
        return new Promise((res, rej) => rej('Record not spplied.'));
    }

    switch(record.RecordType) {

        case vars.RecordType.Anthem :
            return AnthemsController.SaveRecord(record);
        break;

        case vars.RecordType.Peer :
            return PeersController.SaveRecord(record);
        break;

        case vars.RecordType.Penalty :
            return PenaltiesController.SaveRecord(record);
        break;

        case vars.RecordType.Phase :
            return PhasesController.SaveRecord(record);
        break;

        case vars.RecordType.Skater :
            return SkatersController.SaveRecord(record);
        break;

        case vars.RecordType.Slideshow :
            return SlideshowsController.SaveRecord(record);
        break;

        case vars.RecordType.Team :
            return TeamsController.SaveRecord(record);
        break;

        case vars.RecordType.Video :
            return VideosController.SaveRecord(record);
        break;

        default :
            return new Promise((res) => {
                res(false);
            });
        break;
    }
};

DataController.Load = async () => {
    
    return Promise.all([
        //records first
        SkatersController.Load(),
        TeamsController.Load(),
        PhasesController.Load(),
        SlideshowsController.Load(),
        VideosController.Load(),
        PenaltiesController.Load(),
        AnthemsController.Load(),
        DataController.LoadMiscRecords()
    ]).then(() => {
        //then states (because they rely on records)

        SetAuthEndpoint(DataController.GetMiscRecord('APIAuthEndpoint'));
        SetEndpoint(DataController.GetMiscRecord('APIEndpoint'));
        SetValidateEndpoint(DataController.GetMiscRecord('APIValidateEndpoint'));

        return Promise.all([
            ScoreboardController.Load(),
            ChatController.Load(),
            PenaltyController.Load(),
            ScorekeeperController.Load(),
            RosterController.Load(),
            SponsorController.Load(),
            SlideshowController.Load(),
            UIController.Load(),

            SlideshowCaptureController.Load(),
            SponsorCaptureController.Load(),
            RosterCaptureController.Load(),
            ScorekeeperCaptureController.Load(),
            PenaltyCaptureController.Load(),
            AnnouncerCaptureController.Load(),
            AnthemCaptureController.Load(),
            JamClockCaptureController.Load(),
            JamCounterCaptureController.Load(),
            ScorebannerCaptureController.Load(),
            ScoreboardCaptureController.Load(),
            ScoresCaptureController.Load(),
            ScheduleCaptureController.Load(),
            StandingsCaptureController.Load()
        ]).then((res) => {
            APIMatchesController.Load();
            APISeasonsController.Load();
            APIBoutsController.Load();
            APITeamsController.Load();
            return true;
        }).catch(() => {
            return false;
        });
    })
};

DataController.SaveMiscRecord = async (key:string, value:any) => {
    return new Promise((res) => {
        let records = {...DataController.GetState().MiscRecords};
        if(typeof(value) === "object" && value !== null)
            records[key] = {...value};
        else
            records[key] = value;
        if(RecordSavers['MISC']) {
            RecordSavers['MISC'].Save(JSON.stringify(records, null, 4));
        }
        DataController.Dispatch({
            type:Actions.SET_MISC_RECORDS,
            values:records
        });
        res(true);
    });
};

DataController.GetMiscRecord = (key:string) : any => {
    let records = DataController.GetState().MiscRecords;
    if((key in records))
        return records[key];
    return null;
};

DataController.LoadMiscRecords = async () => {
    return new Promise((res) => {
        LoadJsonFile(Files.MiscRecords).then((data) => {
            DataController.Dispatch({
                type:Actions.SET_MISC_RECORDS,
                values:data
            });

            //API keys

            if(data.APIAuthEndpoint)
                SetAuthEndpoint(data.APIAuthEndpoint);

            if(data.APIEndpoint)
                SetEndpoint(data.APIEndpoint);

            if(data.APIValidateEndpoint)
                SetValidateEndpoint(data.APIValidateEndpoint);

            res(true);
        }).catch((er) => {
            res(false);
        });
    });
};

DataController.LoadConfig = async () => {
    return new Promise((res, rej) => {
        LoadJsonFile(Files.Config).then((data) => {
            DataController.Dispatch({
                type:Actions.SET_CONFIG_USER,
                config:data
            });
            res(true);
        }).catch((er) => {
            rej(er);
        });
    });
};

DataController.GetConfig = () => {
    return DataController.GetState().Config;
};

DataController.BuildAPI = async () => {
    
    const server = window.LocalServer;
    const exp = server.ExpressApp;
    
    //get image
    exp.get(/^\/api\/image\/(.*?)\.{1}(png|jpg|jpeg|gif){1}/i, (req, res) => {
        res.sendFile(AddMediaPath(req.params[0] + "." + req.params[1]));
    });

    //get thumbnail
    exp.get(/^\/api\/thumbnail\/(.*?)\.{1}(png|jpg|jpeg|gif){1}/i, (req, res) => {
        res.sendFile(AddMediaPath(req.params[0] + "." + req.params[1]));
    });
};

DataController.GetPeers = () => {
    return PeersController.Get();
};

DataController.AddMediaPath = (value:any) => {
    return AddMediaPath(value);
};

DataController.RemoveMediaPath = (value:any) => {
    return RemoveMediaPath(value);
};

DataController.Basename = (filepath:string) => {
    if(path && path.basename)
        return path.basename(filepath);
    return filepath;
};

DataController.PrepareStateForSending = (app:string, state:any) => {
    switch(app) {
        case VideoController.Key :
            return VideoController.PrepareStateForSending(state);
        default :
            return state;
    }
};

export default DataController;