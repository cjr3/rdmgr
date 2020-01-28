import { Record } from "tools/vars";
let os = require('os');
if(window && window.require) {
    os = window.require('os');
}

const USER_PATH = os.homedir();

export interface IController {
    /**
     * Unique key for the controller
     */
    Key:string;
    /**
     * Initializes the controller
     */
    Init:Function;
    /**
     * Gets the store object of the controller
     */
    GetStore:Function;
    /**
     * Gets the current state of the controller
     */
    GetState:Function;
    /**
     * Sets the current state of the controller
     */
    SetState:Function;
    /**
     * Subscribes to the store for the controller
     */
    Subscribe:Function;
    /**
     * Builds the API for the controller
     */
    BuildAPI:Function;
    /**
     * Loads the controller's data from a file or database
     */
    Load:Function;
    /**
     * Saves the controller's data to a file or database
     */
    Save:Function;
    /**
     * Gets the controller's primary data (full state, records)
     */
    Get:Function;
    /**
     * Sets the controller's primary data (full state, records)
     */
    Set:Function;
    /**
     * Dispatches an action to the controller's redux store
     */
    Dispatch:Function;
    /**
     * Internal state saver; calls the Save() method when the state changes
     */
    _StateSaver:Function;
};

export enum ControllerActions {
    SET_STATE = 'SET_STATE'
}

/**
 * Interface for Record Controllers
 */
export interface IRecordController extends IController {
    RecordType:string;
    Add:Function;
    Update:Function;
    Delete:Function;
    SaveRecord:Function;
    NewRecord:Function;
    GetRecord:Function;
};

export interface IRecordControllerState {
    Records:Array<Record>
};

export enum RecordControllerActions {
    SET_STATE = 'SET_STATE',
    ADD = 'ADD',
    UPDATE = 'UPDATE',
    DELETE = 'DELETE',
    SET = 'SET'
};

//file constants
let FOLDER_MAIN = '';
switch(os.platform()) {
    case 'win32' :
        FOLDER_MAIN = 'c:/ProgramData/RDMGR';
        if(process.env.NODE_ENV && (process.env.NODE_ENV == 'development' || process.env.NODE_ENV == 'test')) {
            FOLDER_MAIN = 'c:/rdmgrdata';
        }
    break;

    default :
        throw new Error("Unrecognized OS!");
    break;
}

const FOLDER_DATA = FOLDER_MAIN + "/files";
const FOLDER_MEDIA_ROOT = FOLDER_MAIN + "/images";
const FOLDER_MEDIA = FOLDER_MAIN + "/images/uploads";
const FOLDER_RECORDS = FOLDER_DATA + "/records";
const FOLDER_STATES = FOLDER_DATA + "/states";
const FOLDER_MEDIA_DEFAULT = FOLDER_MEDIA + "/default";
const FOLDER_MEDIA_VIDEOS = FOLDER_MEDIA + "/videos";
const FOLDER_MEDIA_SLIDESHOWS = FOLDER_MEDIA + "/slideshows";

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
//const FILE_PRIZES = FOLDER_RECORDS + "/records.raffle.json";

//const FILE_TEST = FOLDER_DATA + "/test.txt";

//state files
const FILE_STATE_SCOREBOARD = FOLDER_STATES + "/scoreboard.state.json";
const FILE_STATE_SCOREKEEPER = FOLDER_STATES + "/scorekeeper.state.json";
const FILE_STATE_CAMERA = FOLDER_STATES + "/camera.state.json";
const FILE_STATE_CAPTURE = FOLDER_STATES + "/capture.state.json";
const FILE_STATE_CAPTURE_ANNOUNCER = FOLDER_STATES + "/capture.announcer.json";
const FILE_STATE_CAPTURE_ANTHEM = FOLDER_STATES + "/capture.anthem.json";
const FILE_STATE_CAPTURE_PENALTY = FOLDER_STATES + "/capture.penalty.json";
const FILE_STATE_CAPTURE_RAFFLE = FOLDER_STATES + "/capture.raffle.json";
const FILE_STATE_CAPTURE_ROSTER = FOLDER_STATES + "/capture.roster.json";
const FILE_STATE_CAPTURE_SCHEDULE = FOLDER_STATES + "/capture.schedule.json";
const FILE_STATE_CAPTURE_SCOREBOARD = FOLDER_STATES + "/capture.scoreboard.json";
const FILE_STATE_CAPTURE_SCOREBANNER = FOLDER_STATES + "/capture.scorebanner.json";
const FILE_STATE_CAPTURE_JAMCLOCK = FOLDER_STATES + "/capture.jamclock.json";
const FILE_STATE_CAPTURE_JAMCOUNTER = FOLDER_STATES + "/capture.jamcounter.json";
const FILE_STATE_CAPTURE_SCOREKEEPER = FOLDER_STATES + "/capture.scorekeeper.json";
const FILE_STATE_CAPTURE_SCORES = FOLDER_STATES + "/capture.scores.json";
const FILE_STATE_CAPTURE_SLIDESHOW = FOLDER_STATES + "/capture.slideshow.json";
const FILE_STATE_CAPTURE_SPONSOR = FOLDER_STATES + "/capture.sponsor.json";
const FILE_STATE_CAPTURE_STANDINGS = FOLDER_STATES + "/capture.standings.json";
const FILE_STATE_CAPTURE_VIDEO = FOLDER_STATES + "/capture.video.json";
const FILE_STATE_CHAT = FOLDER_STATES + "/chat.state.json";
const FILE_STATE_PENALTY = FOLDER_STATES + "/penalty.state.json";
const FILE_STATE_RAFFLE = FOLDER_STATES + "/raffle.state.json";
const FILE_STATE_ROSTER = FOLDER_STATES + "/roster.state.json";
const FILE_STATE_SLIDESHOW = FOLDER_STATES + "/slideshow.state.json";
const FILE_STATE_SPONSOR = FOLDER_STATES + "/sponsor.state.json";
const FILE_STATE_VIDEO = FOLDER_STATES + "/video.state.json";
const FILE_STATE_MEDIA_QUEUE = FOLDER_STATES + "/media.state.json";
const FILE_STATE_UI = FOLDER_STATES + "/ui.state.json";


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
    CaptureAnnouncer:FILE_STATE_CAPTURE_ANNOUNCER,
    CaptureAnthem:FILE_STATE_CAPTURE_ANTHEM,
    CapturePenalty:FILE_STATE_CAPTURE_PENALTY,
    CaptureRaffle:FILE_STATE_CAPTURE_RAFFLE,
    CaptureRoster:FILE_STATE_CAPTURE_ROSTER,
    CaptureSchedule:FILE_STATE_CAPTURE_SCHEDULE,
    CaptureScoreboard:FILE_STATE_CAPTURE_SCOREBOARD,
    CaptureScorebanner:FILE_STATE_CAPTURE_SCOREBANNER,
    CaptureJamClock:FILE_STATE_CAPTURE_JAMCLOCK,
    CaptureJamCounter:FILE_STATE_CAPTURE_JAMCOUNTER,
    CaptureScorekeeper:FILE_STATE_CAPTURE_SCOREKEEPER,
    CaptureScores:FILE_STATE_CAPTURE_SCORES,
    CaptureSlideshow:FILE_STATE_CAPTURE_SLIDESHOW,
    CaptureSponsor:FILE_STATE_CAPTURE_SPONSOR,
    CaptureStandings:FILE_STATE_CAPTURE_STANDINGS,
    CaptureVideo:FILE_STATE_CAPTURE_VIDEO,
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
    Video:FILE_STATE_VIDEO,
    /**
     * 
     */
    UI:FILE_STATE_UI
}