import { __BaseRecord, AnthemSinger, Config, Peer, Penalty, Phase, SAnthem, SCapture, Season, Skater, Slideshow, SMediaQueue, SPenaltyTracker, Sponsor, SRaffle, SRoster, SScoreboard, SScorekeeper, SSlideshow, Team, Video } from "tools/vars";
const {remote} = require('electron');
const fs = remote.require('fs');
const wfa = require('write-file-atomic');
const tdate = new Date();
const strdate = tdate.getFullYear() +
    (tdate.getMonth() + 1).toString().padStart(2,'0') +
    (tdate.getDate().toString().padStart(2));

//this needs to be updated to be portable
// let FOLDER_MAIN = 'c:/ProgramData/RDMGRData';
// let FOLDER_MAIN = remote.app.getPath('appData')
let FOLDER_MAIN = remote.app.getPath('appData') + "/" + remote.app.getName();
if(process.env.NODE_ENV === 'development') {
    FOLDER_MAIN = 'c:/ProgramData/RDMGRData';
}

/**
 * Data file folder
 */
const FOLDER_DATA = FOLDER_MAIN + '/records';

/**
 * Media / uploads folder
 */
const FOLDER_MEDIA = FOLDER_MAIN + '/media';

/**
 * Folder for bouts
 */
const FOLDER_BOUTS = FOLDER_DATA + '/bouts';

/**
 * Folder for today's bout. Only changes at startup.
 */
const FOLDER_BOUT = FOLDER_BOUTS + '/' + strdate;

/**
 * Jam records for current bout (day)
 */
const FILE_BOUT_JAMS = FOLDER_BOUT + '/jams_' + strdate + '.json';

/**
 * Penalties issued for the current bout (day)
 */
const FILE_BOUT_PENALTIES = FOLDER_BOUT + '/penalties_' + strdate + '.json';

/**
 * National Anthem singers
 */
const FILE_RECORDS_ANTHEM = FOLDER_DATA + '/records.anthemsingers.json';

/**
 * Peer-to-peer files
 */
const FILE_RECORDS_PEERS = FOLDER_DATA + '/records.peers.json';

/**
 * Penalties
 */
const FILE_RECORDS_PENALTIES = FOLDER_DATA + '/records.penalties.json';

/**
 * Phases/quarters to choose from
 */
const FILE_RECORDS_PHASES = FOLDER_DATA + '/records.phases.json';

/**
 * Season records, for holding seasons, bouts, and individual matchups
 */
const FILE_RECORDS_SEASON = FOLDER_DATA + '/records.season.json';

/**
 * Skaters
 */
const FILE_RECORDS_SKATERS = FOLDER_DATA + '/records.skaters.json';

/**
 * Slideshows
 */
const FILE_RECORDS_SLIDESHOWS = FOLDER_DATA + '/records.slideshows.json';

/**
 * Sponsors
 */
const FILE_RECORDS_SPONSORS = FOLDER_DATA + '/records.sponsors.json';

/**
 * Teams
 */
const FILE_RECORDS_TEAMS = FOLDER_DATA + '/records.teams.json';

/**
 * Videos
 */
const FILE_RECORDS_VIDEOS = FOLDER_DATA + '/records.videos.json';

/**
 * Current anthem singer
 */
const FILE_STATE_ANTHEM = FOLDER_DATA + '/state.anthem.json';

/**
 * Current capture window state.
 */
const FILE_STATE_CAPTURE = FOLDER_DATA + '/state.capture.json';

/**
 * Config file
 */
const FILE_STATE_CONFIG = FOLDER_DATA + '/state.config.json';

/**
 * Media queue state
 */
const FILE_STATE_MEDIA = FOLDER_DATA + '/state.mediaqueue.json';

/**
 * Penalty tracker state
 */
const FILE_STATE_PENALTY = FOLDER_DATA + '/state.penalty.json';

/**
 * Raffle ticket state
 */
const FILE_STATE_RAFFLE = FOLDER_DATA + '/state.raffle.json';

/**
 * Roster state
 */
const FILE_STATE_ROSTER = FOLDER_DATA + '/state.roster.json';

/**
 * Scoreboard state
 */
const FILE_STATE_SCOREBOARD = FOLDER_DATA + '/state.scoreboard.json';

/**
 * Scorekeeper (positions) state
 */
const FILE_STATE_SCOREKEEPER = FOLDER_DATA + '/state.scorekeeper.json';

/**
 * Slideshow state
 */
const FILE_STATE_SLIDESHOW = FOLDER_DATA + '/state.slideshow.json';

const mediaRX = new RegExp(FOLDER_MEDIA, 'ig');

/**
 * Check that the given directory exists, and create it if it doesn't.
 * @param name 
 * @returns 
 */
const __CheckDirectory = async (name:string) : Promise<boolean> => {
    try {
        // console.log('checking directory ' + name);
        const stat = await fs.promises.stat(name);
        if(stat.isDirectory && stat.isDirectory()) {
            // console.log('directory ' + name + ' exists');
            return true;
        }
        return false;
    } catch(er:any) {
        // console.error(er);
        if(er && er.code && er.code === 'ENOENT') {
            try {
                // console.log('creating directory ' + name);
                await fs.promises.mkdir(name);
                return true;
            } catch(er) {
                return false;
            }
        } else {
            return false;
        }
    }
    // return new Promise(res => {
    //     fs.stat(name + 'ccccc', (err:any, stats:any) => {
    //         if(err) {
    //             if(err.code === 'ENOENT') {

    //             } else {
    //                 // console.error(err.code);
    //                 return res(false);
    //             }
    //         } else {
    //             console.log(stats);
    //             return res(true);
    //         }
    //     });
    //     // const response = ipcRenderer.sendSync('check-directory', name);
    //     // return res(response);
    // })
}

/**
 * Check that the given file exists, and create it if it doesn't.
 * @param filename 
 * @param content Default file content
 * @returns 
 */
const __CheckFile = async (filename:string, content:string) : Promise<boolean> => {
    try {
        // console.log('checking file ' + filename);
        const stat = await fs.promises.stat(filename);
        if(stat.isDirectory && stat.isFile()) {
            // console.log('file ' + filename + ' exists');
            return true;
        }
        return false;
    } catch(er:any) {
        // console.error(er);
        if(er && er.code && er.code === 'ENOENT') {
            try {
                // console.log('creating directory ' + name);
                await wfa(filename, content || '');
                return true;
            } catch(er) {
                return false;
            }
        } else {
            return false;
        }
    }
    // return new Promise(res => {
    //     const response = ipcRenderer.sendSync('check-file', filename, content);
    //     return res(response);
    // });
}

/**
 * Read file
 * @param filename 
 * @param contentType
 */
const __ReadFile = async (filename:string, contentType:string = '') : Promise<string|Buffer|null> => {
    if(!filename)
        throw new Error('Failed to read file: No filename provided.');
    try {
        if(contentType === 'json') {
            //read as string
            const content = await fs.promises.readFile(filename, {encoding:'utf8'});
            if(typeof(content) === 'string')
                return content;
        } else {
            //read as buffer
            const content = fs.promises.readFile(filename);
            if(typeof(content) === 'object') {
                if(content instanceof Buffer)
                    return content;
                if(content instanceof Error)
                    throw content;
                return content.toString();
            }
        }
    } catch(er:any) {
        // console.error(er);
        return null;
    }
    return null;
    // return new Promise((res, rej) => {
    //     if(!filename)
    //         return rej('Failed to read file: No filename provided');
    //     const content = ipcRenderer.sendSync('read-file', filename, contentType);
    //     if(typeof(content) === 'object') {
    //         if(content instanceof Buffer)
    //             return res(content);
    //         if(content instanceof Error)
    //             return rej(content);
    //         return res(content.toString());
    //     } else if(typeof(content) === 'string')
    //         return res(content);
    //     return rej('Failed to read file content: Unknown content type returned.')
    // });
}

/**
 * Read JSON file
 * @param filename 
 * @returns 
 */
const __ReadJSONFile = <T>(filename:string) : Promise<T> => {
    return new Promise((res, rej) => {
        __ReadFile(filename, 'json').then(content => {
            if(typeof(content) === 'string') {
                return res(JSON.parse(content))
            }
            const whatever:any = {};
            return res(whatever);
        }).catch(er => rej(er));
    })
}

/**
 * Write to a file
 * @param filename 
 * @param content 
 * @returns 
 */
const __WriteFile = async (filename:string, content:string|Buffer) : Promise<boolean> => {
    try {
        
        await wfa(filename, content || '');
        return true;
    } catch(er:any) {
        return false;
    }
    // return new Promise((res, rej) => {
    //     if(!filename)
    //         return rej('No file name provided');
    //     ipcRenderer.invoke('save-file', filename, content).then(() => {
    //         return res(true);
    //     }).catch((er:any) => rej(er));
    // });
};

/**
 * Prepend the media folder path to the given file name
 * @param filename 
 * @returns 
 */
const GetMediaPath = (filename:string, prefix:string = '') : string => {
    if(filename && filename.length) {
        const name = filename.toLowerCase();
        if(name.search(mediaRX) === 0) {
            if(prefix && name.search(prefix) < 0)
                return prefix + filename.replace(/\\/ig, '/');
            return filename.replace(/\\/ig, '/');
        }
        else if(name.startsWith('http://') || name.startsWith('https://'))
            return filename;
        else if(name.startsWith('file:') || name.startsWith('c:')) {
            if(prefix && name.search(prefix) < 0)
                return prefix + filename.replace(/\\/ig,'/');
            return filename.replace(/\\/ig, '/')
        }
        return FOLDER_MEDIA + '/' + filename;
    }

    return '';
}

/**
 * 
 * @returns 
 */
const Init = () : Promise<boolean> => {
    return new Promise(async (res, rej) => {
        try {
            let response = await __CheckDirectory(FOLDER_MAIN);
            if(!response)
                return rej(new Error('Failed to create main data directory.'));
            response = await __CheckDirectory(FOLDER_DATA);
            if(!response)
                return rej(new Error('Failed to create record directory.'));
                
            response = await __CheckDirectory(FOLDER_MEDIA);
            if(!response)
                return rej(new Error('Failed to create media directory.'));

            response = await __CheckDirectory(FOLDER_BOUTS);
            if(!response)
                return rej(new Error('Failed to create bouts directory.'));

            response = await __CheckDirectory(FOLDER_BOUT);
            if(!response)
                return rej(new Error('Failed to create bout directory.'));
            
            const ar = '[]';
            const ob = '{}';
            Promise.all([
                __CheckFile(FILE_RECORDS_ANTHEM, ar),
                __CheckFile(FILE_RECORDS_PEERS, ar),
                __CheckFile(FILE_RECORDS_PENALTIES, ar),
                __CheckFile(FILE_RECORDS_PHASES, ar),
                __CheckFile(FILE_RECORDS_SEASON, ar),
                __CheckFile(FILE_RECORDS_SKATERS, ar),
                __CheckFile(FILE_RECORDS_SLIDESHOWS, ar),
                __CheckFile(FILE_RECORDS_SPONSORS, ar),
                __CheckFile(FILE_RECORDS_TEAMS, ar),
                __CheckFile(FILE_RECORDS_VIDEOS, ar),
                __CheckFile(FILE_STATE_ANTHEM, ob),
                __CheckFile(FILE_STATE_CAPTURE, ob),
                __CheckFile(FILE_STATE_CONFIG, ob),
                __CheckFile(FILE_STATE_MEDIA, ob),
                __CheckFile(FILE_STATE_PENALTY, ob),
                __CheckFile(FILE_STATE_RAFFLE, ob),
                __CheckFile(FILE_STATE_ROSTER, ob),
                __CheckFile(FILE_STATE_SCOREBOARD, ob),
                __CheckFile(FILE_STATE_SCOREKEEPER, ob),
                __CheckFile(FILE_STATE_SLIDESHOW, ob),
                __CheckFile(FILE_BOUT_JAMS, ar),
                __CheckFile(FILE_BOUT_PENALTIES, ar)
            ]).then(() => res(true)).catch(er => rej(er))
        } catch(er) {
            return rej(er);
        }
    });
};

/**
 * Load anthem
 * @returns 
 */
const LoadAnthem = () : Promise<SAnthem> => __ReadJSONFile<SAnthem>(FILE_STATE_ANTHEM);

/**
 * Load anthem singer records.
 * @returns 
 */
const LoadAnthemSingers = () : Promise<AnthemSinger[]> => __ReadJSONFile<AnthemSinger[]>(FILE_RECORDS_ANTHEM);

/**
 * Load capture state.
 * @returns 
 */
const LoadCapture = () : Promise<SCapture> => __ReadJSONFile<SCapture>(FILE_STATE_CAPTURE);

/**
 * Load config
 * @returns 
 */
const LoadConfig = () : Promise<Config> => __ReadJSONFile<Config>(FILE_STATE_CONFIG);

/**
 * Load media queue state
 * @returns 
 */
const LoadMediaQueue = () : Promise<SMediaQueue> => __ReadJSONFile<SMediaQueue>(FILE_STATE_MEDIA);

/**
 * Load peer records
 * @returns 
 */
const LoadPeers = () : Promise<Peer[]> => __ReadJSONFile<Peer[]>(FILE_RECORDS_PEERS);

/**
 * Load penalty records
 * @returns 
 */
const LoadPenalties = () : Promise<Penalty[]> => __ReadJSONFile<Penalty[]>(FILE_RECORDS_PENALTIES);

/**
 * Load penalty tracker state.
 * @returns 
 */
const LoadPenaltyTracker = () : Promise<SPenaltyTracker> => __ReadJSONFile<SPenaltyTracker>(FILE_STATE_PENALTY);

/**
 * Load phase records
 * @returns 
 */
const LoadPhases = () : Promise<Phase[]> => __ReadJSONFile<Phase[]>(FILE_RECORDS_PHASES);

/**
 * Load raffle state
 * @returns 
 */
const LoadRaffle = () : Promise<SRaffle> => __ReadJSONFile<SRaffle>(FILE_STATE_RAFFLE);

/**
 * Load roster state.
 * @returns 
 */
const LoadRoster = () : Promise<SRoster> => __ReadJSONFile<SRoster>(FILE_STATE_ROSTER);

/**
 * Load season records.
 * @returns 
 */
const LoadSeasons = () : Promise<Season[]> => __ReadJSONFile<Season[]>(FILE_RECORDS_SEASON);

/**
 * Load the scoreboard state
 * @returns 
 */
const LoadScoreboard = () : Promise<SScoreboard> => __ReadJSONFile<SScoreboard>(FILE_STATE_SCOREBOARD);

/**
 * Load scorekeeper state
 * @returns 
 */
const LoadScorekeeper = () : Promise<SScorekeeper> => __ReadJSONFile<SScorekeeper>(FILE_STATE_SCOREKEEPER);

/**
 * Load skater records
 * @returns 
 */
const LoadSkaters = () : Promise<Skater[]> => __ReadJSONFile<Skater[]>(FILE_RECORDS_SKATERS);

/**
 * Load auto-slideshow state
 * @returns 
 */
const LoadSlideshow = () : Promise<SSlideshow> => __ReadJSONFile<SSlideshow>(FILE_STATE_SLIDESHOW);

/**
 * Load slideshow records
 * @returns 
 */
const LoadSlideshows = () : Promise<Slideshow[]> => __ReadJSONFile<Slideshow[]>(FILE_RECORDS_SLIDESHOWS);

/**
 * Load sponsor records
 * @returns 
 */
const LoadSponsors = () : Promise<Sponsor[]> => __ReadJSONFile<Sponsor[]>(FILE_RECORDS_SPONSORS);

/**
 * Load team records
 * @returns 
 */
const LoadTeams = () : Promise<Team[]> => __ReadJSONFile<Team[]>(FILE_RECORDS_TEAMS);

/**
 * Load video records.
 * @returns 
 */
const LoadVideos = () : Promise<Video[]> => __ReadJSONFile<Video[]>(FILE_RECORDS_VIDEOS);

/**
 * Save national anthem state.
 * @param state 
 * @returns 
 */
const SaveAnthem = (state:SAnthem) => __WriteFile(FILE_STATE_ANTHEM, JSON.stringify(state));

/**
 * Save anthem singer records.
 * @param records 
 * @returns 
 */
const SaveAnthemSingers = (records:AnthemSinger[]) => __WriteFile(FILE_RECORDS_ANTHEM, JSON.stringify(records));

/**
 * Save capture config.
 * @param state 
 * @returns 
 */
const SaveCapture = (state:SCapture) => __WriteFile(FILE_STATE_CAPTURE, JSON.stringify(state));

/**
 * Save config file.
 * @param state 
 * @returns 
 */
const SaveConfig = (state:Config) => __WriteFile(FILE_STATE_CONFIG, JSON.stringify(state));

/**
 * Save peer records
 * @param records 
 * @returns 
 */
const SavePeers = (records:Peer[]) => __WriteFile(FILE_RECORDS_PEERS, JSON.stringify(records));

/**
 * Save penalty records.
 * @param records 
 * @returns 
 */
const SavePenalties = (records:Penalty[]) => __WriteFile(FILE_RECORDS_PENALTIES, JSON.stringify(records));

/**
 * Save penalty tracker state.
 * @param state 
 * @returns 
 */
const SavePenaltyTracker = (state:SPenaltyTracker) => __WriteFile(FILE_STATE_PENALTY, JSON.stringify(state));

/**
 * Save phase records
 * @param records 
 * @returns 
 */
const SavePhases = (records:Phase[]) => __WriteFile(FILE_RECORDS_PHASES, JSON.stringify(records));

/**
 * Save the roster state.
 * @param state 
 * @returns 
 */
const SaveRoster = (state:SRoster) => __WriteFile(FILE_STATE_ROSTER, JSON.stringify(state));

/**
 * Save season records.
 * @param records 
 * @returns 
 */
const SaveSeasons = (records:Season[]) => __WriteFile(FILE_RECORDS_SEASON, JSON.stringify(records));

/**
 * Save the scoreboard state.
 * @param state 
 * @returns 
 */
const SaveScoreboard = (state:SScoreboard) : Promise<boolean> => __WriteFile(FILE_STATE_SCOREBOARD, JSON.stringify(state));

/**
 * Save scorekeeper state
 * @param state 
 * @returns 
 */
const SaveScorekeeper = (state:SScorekeeper) => __WriteFile(FILE_STATE_SCOREKEEPER, JSON.stringify(state));

/**
 * Save skater records.
 * @param records 
 * @returns 
 */
const SaveSkaters = (records:Skater[]) => __WriteFile(FILE_RECORDS_SKATERS, JSON.stringify(records));

/**
 * Save slideshow records.
 * @param records 
 * @returns 
 */
const SaveSlideshows = (records:Slideshow[]) => __WriteFile(FILE_RECORDS_SLIDESHOWS, JSON.stringify(records));

/**
 * Save slideshow state.
 * @param state 
 * @returns 
 */
const SaveSlideshow = (state:SSlideshow) => __WriteFile(FILE_STATE_SLIDESHOW, JSON.stringify(state));

/**
 * Save sponsor records
 * @param records 
 * @returns 
 */
const SaveSponsors = (records:Sponsor[]) => __WriteFile(FILE_RECORDS_SPONSORS, JSON.stringify(records));

/**
 * Save team records.
 * @param records 
 * @returns 
 */
const SaveTeams = (records:Team[]) => __WriteFile(FILE_RECORDS_TEAMS, JSON.stringify(records));

/**
 * Save video records.
 * @param records 
 * @returns 
 */
const SaveVideos = (records:Video[]) => __WriteFile(FILE_RECORDS_VIDEOS, JSON.stringify(records));

const Data = {
    GetMediaPath:GetMediaPath,
    Init:Init,
    LoadAnthem:LoadAnthem,
    LoadAnthemSingers:LoadAnthemSingers,
    LoadCapture:LoadCapture,
    LoadConfig,
    LoadMediaQueue:LoadMediaQueue,
    LoadPeers:LoadPeers,
    LoadPenalties:LoadPenalties,
    LoadPenaltyTracker:LoadPenaltyTracker,
    LoadPhases:LoadPhases,
    LoadRaffle:LoadRaffle,
    LoadRoster:LoadRoster,
    LoadSeasons:LoadSeasons,
    LoadScoreboard:LoadScoreboard,
    LoadScorekeeper:LoadScorekeeper,
    LoadSkaters:LoadSkaters,
    LoadSlideshow:LoadSlideshow,
    LoadSlideshows:LoadSlideshows,
    LoadSponsors:LoadSponsors,
    LoadTeams:LoadTeams,
    LoadVideos:LoadVideos,
    SaveAnthem:SaveAnthem,
    SaveAnthemSingers:SaveAnthemSingers,
    SaveCapture:SaveCapture,
    SaveConfig:SaveConfig,
    SavePeers:SavePeers,
    SavePenalties:SavePenalties,
    SavePenaltyTracker:SavePenaltyTracker,
    SavePhases:SavePhases,
    SaveRoster:SaveRoster,
    SaveSeasons:SaveSeasons,
    SaveScoreboard:SaveScoreboard,
    SaveScorekeeper:SaveScorekeeper,
    SaveSkaters:SaveSkaters,
    SaveSlideshows:SaveSlideshows,
    SaveSlideshow:SaveSlideshow,
    SaveSponsors:SaveSponsors,
    SaveTeams:SaveTeams,
    SaveVideos:SaveVideos
};

export default Data;