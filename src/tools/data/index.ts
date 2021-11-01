import { __BaseRecord, AnthemSinger, Config, Peer, Penalty, Phase, SAnthem, SCapture, Season, Skater, Slideshow, SMediaQueue, SPenaltyTracker, Sponsor, SRaffle, SRoster, SScoreboard, SScorekeeper, SSlideshow, Team, Video } from "tools/vars";
const {ipcRenderer, remote} = require('electron');

//this needs to be updated to be portable
// let FOLDER_MAIN = 'c:/ProgramData/RDMGRData';
// let FOLDER_MAIN = remote.app.getPath('appData')
let FOLDER_MAIN = remote.app.getPath('appData') + "/" + remote.app.getName();
if(process.env.NODE_ENV === 'development') {
    FOLDER_MAIN = 'c:/ProgramData/RDMGRData';
}

const FOLDER_DATA = FOLDER_MAIN + '/records';
const FOLDER_MEDIA = FOLDER_MAIN + '/media';
const FILE_RECORDS_ANTHEM = FOLDER_DATA + '/records.anthemsingers.json';
const FILE_RECORDS_PEERS = FOLDER_DATA + '/records.peers.json';
const FILE_RECORDS_PENALTIES = FOLDER_DATA + '/records.penalties.json';
const FILE_RECORDS_PHASES = FOLDER_DATA + '/records.phases.json';
const FILE_RECORDS_SEASON = FOLDER_DATA + '/records.season.json';
const FILE_RECORDS_SKATERS = FOLDER_DATA + '/records.skaters.json';
const FILE_RECORDS_SLIDESHOWS = FOLDER_DATA + '/records.slideshows.json';
const FILE_RECORDS_SPONSORS = FOLDER_DATA + '/records.sponsors.json';
const FILE_RECORDS_TEAMS = FOLDER_DATA + '/records.teams.json';
const FILE_RECORDS_VIDEOS = FOLDER_DATA + '/records.videos.json';
const FILE_STATE_ANTHEM = FOLDER_DATA + '/state.anthem.json';
const FILE_STATE_CAPTURE = FOLDER_DATA + '/state.capture.json';
const FILE_STATE_CONFIG = FOLDER_DATA + '/state.config.json';
const FILE_STATE_MEDIA = FOLDER_DATA + '/state.mediaqueue.json';
const FILE_STATE_PENALTY = FOLDER_DATA + '/state.penalty.json';
const FILE_STATE_RAFFLE = FOLDER_DATA + '/state.raffle.json';
const FILE_STATE_ROSTER = FOLDER_DATA + '/state.roster.json';
const FILE_STATE_SCOREBOARD = FOLDER_DATA + '/state.scoreboard.json';
const FILE_STATE_SCOREKEEPER = FOLDER_DATA + '/state.scorekeeper.json';
const FILE_STATE_SLIDESHOW = FOLDER_DATA + '/state.slideshow.json';

const mediaRX = new RegExp(FOLDER_MEDIA, 'ig');

namespace Data {
    /**
     * Check that the given directory exists, and create it if it doesn't.
     * @param name 
     * @returns 
     */
    const __CheckDirectory = (name:string) : Promise<boolean> => {
        return new Promise(res => {
            const response = ipcRenderer.sendSync('check-directory', name);
            return res(response);
        })
    }

    /**
     * Check that the given file exists, and create it if it doesn't.
     * @param filename 
     * @param content 
     * @returns 
     */
    const __CheckFile = (filename:string, content:string) : Promise<boolean> => {
        return new Promise(res => {
            const response = ipcRenderer.sendSync('check-file', filename, content);
            return res(response);
        });
    }

    /**
     * Read file
     * @param filename 
     * @param contentType
     */
    const __ReadFile = (filename:string, contentType:string = 'json') : Promise<string|Buffer> => {
        return new Promise((res, rej) => {
            if(!filename)
                return rej('Failed to read file: No filename provided');
            const content = ipcRenderer.sendSync('read-file', filename, contentType);
            if(typeof(content) === 'object') {
                if(content instanceof Buffer)
                    return res(content);
                if(content instanceof Error)
                    return rej(content);
                return res(content.toString());
            } else if(typeof(content) === 'string')
                return res(content);
            return rej('Failed to read file content: Unknown content type returned.')
        });
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
    const __WriteFile = (filename:string, content:string|Buffer) : Promise<boolean> => {
        return new Promise((res, rej) => {
            if(!filename)
                return rej('No file name provided');
            ipcRenderer.invoke('save-file', filename, content).then(() => {
                return res(true);
            }).catch((er:any) => rej(er));
        });
    };

    /**
     * Prepend the media folder path to the given file name
     * @param filename 
     * @returns 
     */
    export const GetMediaPath = (filename:string, prefix:string = '') : string => {
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
    export const Init = () : Promise<boolean> => {
        return new Promise(async (res, rej) => {
            try {
                let response = await __CheckDirectory(FOLDER_MAIN);
                if(!response)
                    return rej(new Error('Failed to create main data directory. Please ensure you have the correct permissions in your system\'s program data folder.'));
                response = await __CheckDirectory(FOLDER_DATA);
                if(!response)
                    return rej(new Error('Failed to create record directory. Please ensure you have the correct permissions in your system\'s program data folder.'));
                    
                response = await __CheckDirectory(FOLDER_MEDIA);
                if(!response)
                    return rej(new Error('Failed to create media directory. Please ensure you have the correct permissions in your system\'s program data folder.'));
                
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
    export const LoadAnthem = () : Promise<SAnthem> => __ReadJSONFile<SAnthem>(FILE_STATE_ANTHEM);

    /**
     * Load anthem singer records.
     * @returns 
     */
    export const LoadAnthemSingers = () : Promise<AnthemSinger[]> => __ReadJSONFile<AnthemSinger[]>(FILE_RECORDS_ANTHEM);

    /**
     * Load capture state.
     * @returns 
     */
    export const LoadCapture = () : Promise<SCapture> => __ReadJSONFile<SCapture>(FILE_STATE_CAPTURE);

    /**
     * Load config
     * @returns 
     */
    export const LoadConfig = () : Promise<Config> => __ReadJSONFile<Config>(FILE_STATE_CONFIG);

    /**
     * Load media queue state
     * @returns 
     */
    export const LoadMediaQueue = () : Promise<SMediaQueue> => __ReadJSONFile<SMediaQueue>(FILE_STATE_MEDIA);

    /**
     * Load peer records
     * @returns 
     */
    export const LoadPeers = () : Promise<Peer[]> => __ReadJSONFile<Peer[]>(FILE_RECORDS_PEERS);

    /**
     * Load penalty records
     * @returns 
     */
    export const LoadPenalties = () : Promise<Penalty[]> => __ReadJSONFile<Penalty[]>(FILE_RECORDS_PENALTIES);

    /**
     * Load penalty tracker state.
     * @returns 
     */
    export const LoadPenaltyTracker = () : Promise<SPenaltyTracker> => __ReadJSONFile<SPenaltyTracker>(FILE_STATE_PENALTY);

    /**
     * Load phase records
     * @returns 
     */
    export const LoadPhases = () : Promise<Phase[]> => __ReadJSONFile<Phase[]>(FILE_RECORDS_PHASES);

    /**
     * Load raffle state
     * @returns 
     */
    export const LoadRaffle = () : Promise<SRaffle> => __ReadJSONFile<SRaffle>(FILE_STATE_RAFFLE);

    /**
     * Load roster state.
     * @returns 
     */
    export const LoadRoster = () : Promise<SRoster> => __ReadJSONFile<SRoster>(FILE_STATE_ROSTER);

    /**
     * Load season records.
     * @returns 
     */
    export const LoadSeasons = () : Promise<Season[]> => __ReadJSONFile<Season[]>(FILE_RECORDS_SEASON);

    /**
     * Load the scoreboard state
     * @returns 
     */
    export const LoadScoreboard = () : Promise<SScoreboard> => __ReadJSONFile<SScoreboard>(FILE_STATE_SCOREBOARD);

    /**
     * Load scorekeeper state
     * @returns 
     */
    export const LoadScorekeeper = () : Promise<SScorekeeper> => __ReadJSONFile<SScorekeeper>(FILE_STATE_SCOREKEEPER);

    /**
     * Load skater records
     * @returns 
     */
    export const LoadSkaters = () : Promise<Skater[]> => __ReadJSONFile<Skater[]>(FILE_RECORDS_SKATERS);

    /**
     * Load auto-slideshow state
     * @returns 
     */
    export const LoadSlideshow = () : Promise<SSlideshow> => __ReadJSONFile<SSlideshow>(FILE_STATE_SLIDESHOW);

    /**
     * Load slideshow records
     * @returns 
     */
    export const LoadSlideshows = () : Promise<Slideshow[]> => __ReadJSONFile<Slideshow[]>(FILE_RECORDS_SLIDESHOWS);

    /**
     * Load sponsor records
     * @returns 
     */
    export const LoadSponsors = () : Promise<Sponsor[]> => __ReadJSONFile<Sponsor[]>(FILE_RECORDS_SPONSORS);

    /**
     * Load team records
     * @returns 
     */
    export const LoadTeams = () : Promise<Team[]> => __ReadJSONFile<Team[]>(FILE_RECORDS_TEAMS);

    /**
     * Load video records.
     * @returns 
     */
    export const LoadVideos = () : Promise<Video[]> => __ReadJSONFile<Video[]>(FILE_RECORDS_VIDEOS);

    /**
     * Save national anthem state.
     * @param state 
     * @returns 
     */
    export const SaveAnthem = (state:SAnthem) => __WriteFile(FILE_STATE_ANTHEM, JSON.stringify(state));

    /**
     * Save anthem singer records.
     * @param records 
     * @returns 
     */
    export const SaveAnthemSingers = (records:AnthemSinger[]) => __WriteFile(FILE_RECORDS_ANTHEM, JSON.stringify(records));

    /**
     * Save capture config.
     * @param state 
     * @returns 
     */
    export const SaveCapture = (state:SCapture) => __WriteFile(FILE_STATE_CAPTURE, JSON.stringify(state));

    /**
     * Save config file.
     * @param state 
     * @returns 
     */
    export const SaveConfig = (state:Config) => __WriteFile(FILE_STATE_CONFIG, JSON.stringify(state));

    /**
     * Save peer records
     * @param records 
     * @returns 
     */
    export const SavePeers = (records:Peer[]) => __WriteFile(FILE_RECORDS_PEERS, JSON.stringify(records));

    /**
     * Save penalty records.
     * @param records 
     * @returns 
     */
    export const SavePenalties = (records:Penalty[]) => __WriteFile(FILE_RECORDS_PENALTIES, JSON.stringify(records));

    /**
     * Save penalty tracker state.
     * @param state 
     * @returns 
     */
    export const SavePenaltyTracker = (state:SPenaltyTracker) => __WriteFile(FILE_STATE_PENALTY, JSON.stringify(state));

    /**
     * Save phase records
     * @param records 
     * @returns 
     */
    export const SavePhases = (records:Phase[]) => __WriteFile(FILE_RECORDS_PHASES, JSON.stringify(records));

    /**
     * Save the roster state.
     * @param state 
     * @returns 
     */
    export const SaveRoster = (state:SRoster) => __WriteFile(FILE_STATE_ROSTER, JSON.stringify(state));

    /**
     * Save season records.
     * @param records 
     * @returns 
     */
    export const SaveSeasons = (records:Season[]) => __WriteFile(FILE_RECORDS_SEASON, JSON.stringify(records));

    /**
     * Save the scoreboard state.
     * @param state 
     * @returns 
     */
    export const SaveScoreboard = (state:SScoreboard) : Promise<boolean> => __WriteFile(FILE_STATE_SCOREBOARD, JSON.stringify(state));

    /**
     * Save scorekeeper state
     * @param state 
     * @returns 
     */
    export const SaveScorekeeper = (state:SScorekeeper) => __WriteFile(FILE_STATE_SCOREKEEPER, JSON.stringify(state));

    /**
     * Save skater records.
     * @param records 
     * @returns 
     */
    export const SaveSkaters = (records:Skater[]) => __WriteFile(FILE_RECORDS_SKATERS, JSON.stringify(records));

    /**
     * Save slideshow records.
     * @param records 
     * @returns 
     */
    export const SaveSlideshows = (records:Slideshow[]) => __WriteFile(FILE_RECORDS_SLIDESHOWS, JSON.stringify(records));

    /**
     * Save slideshow state.
     * @param state 
     * @returns 
     */
    export const SaveSlideshow = (state:SSlideshow) => __WriteFile(FILE_STATE_SLIDESHOW, JSON.stringify(state));

    /**
     * Save sponsor records
     * @param records 
     * @returns 
     */
    export const SaveSponsors = (records:Sponsor[]) => __WriteFile(FILE_RECORDS_SPONSORS, JSON.stringify(records));

    /**
     * Save team records.
     * @param records 
     * @returns 
     */
    export const SaveTeams = (records:Team[]) => __WriteFile(FILE_RECORDS_TEAMS, JSON.stringify(records));

    /**
     * Save video records.
     * @param records 
     * @returns 
     */
    export const SaveVideos = (records:Video[]) => __WriteFile(FILE_RECORDS_VIDEOS, JSON.stringify(records));
}

export default Data;