import {Folders, Files} from 'controllers/vars';

//default states
import {InitState as ScoreboardState} from 'controllers/ScoreboardController';
import {InitState as ScorekeeperState} from 'controllers/ScorekeeperController';
import {InitState as CameraState} from 'controllers/CameraController';
import {InitState as CaptureState} from 'controllers/CaptureController';
import {InitState as ChatState} from 'controllers/ChatController';
import {InitState as MediaState} from 'controllers/MediaQueueController';
import {InitState as PenaltyState} from 'controllers/PenaltyController';
import {InitState as RaffleState} from 'controllers/RaffleController';
import {InitState as RosterState} from 'controllers/RosterController';
import {InitState as SlideshowState} from 'controllers/SlideshowController';
import {InitState as SponsorState} from 'controllers/SponsorController';
import {InitState as VideoState} from 'controllers/VideoController';
import {InitState as UIState} from 'controllers/UIController';
import {InitState as CaptureAnthemState} from 'controllers/capture/Anthem';
import {InitState as CaptureAnnouncerState} from 'controllers/capture/Announcer';
import {InitState as CapturePenaltyState} from 'controllers/capture/Penalty';
import {InitState as CaptureScheduleState} from 'controllers/capture/Schedule';
import {InitBannerState as CaptureScorebannerState} from 'controllers/capture/Scoreboard';
import {InitState as CaptureSponsorState} from 'controllers/capture/Sponsor';
import {InitState as CaptureStandingsState} from 'controllers/capture/Standings';
import {InitState as CaptureScoresState} from 'controllers/capture/Scores';

//import for record helpers
import PeersController from 'controllers/PeersController';
import PhasesController from 'controllers/PhasesController';
import TeamsController from 'controllers/TeamsController';

export interface PathCheckResponse {
    path:string,
    exists:boolean
}

/**
 * Class exclusively for checking files during startup and installation
 * - Checks for the existance of folders and files
 * - Creates needed folders and files
 */
class Installation {
    /**
     * File system access for Node
     */
    protected FS:any = null;
    constructor() {
        if(window && window.require) {
            this.FS = window.require('fs');
        } else {
            this.FS = require('fs');
        }
    }

    /**
     * Checks for the existance of required folders
     * The returned promise is an array of PathCheckResponse objects,
     * each containing a path (string), and exists (boolean)
     */
    async CheckFolders() : Promise<Array<PathCheckResponse>|string> {
        return new Promise(async (res, rej) => {
            let responses:Array<PathCheckResponse> = [];
            for(let key in Folders) {
                let response:boolean = await this.PathExists(Folders[key]);
                if(!response) {
                    response = await this.CreateFolder(Folders[key]);
                    if(response !== true)
                        rej(`Failed to create folder ${Folders[key]}`);
                }
                responses.push({
                    path:Folders[key],
                    exists:response
                });
            }
            res(responses);
        });
    }

    /**
     * Checks if the provided folder or file exists
     * The promise, when complete, returns a boolean of true
     * if the folder or file exists, false if not
     * @param path String
     */
    protected async PathExists(path:string) : Promise<boolean> {
        return new Promise((res, rej) => {
            this.FS.promises.access(path).then(() => {
                res(true);
            }).catch(() => {
                res(false);
            })
        });
    }

    /**
     * Attempts to create a folder.
     * The folder MUST reside, or BE, the root folder
     * for RDMGR! (Let's try not to mess with people's stuff...)
     * @param path string
     */
    protected async CreateFolder(path:string) : Promise<boolean> {
        if(path.indexOf(Folders.Main) !== 0)
            throw new Error("Folder must be in the RDMGR folder only!");
        return new Promise(async (res) => {
            let failed = await this.FS.promises.mkdir(path);
            if(failed) {
                res(false);
            } else {
                res(true);
            }
        });
    }

    /**
     * Attempts to create the provided file
     * The file must start with the main RDMGR folder, or an error will be thrown
     * @param path String
     */
    protected async CreateFile(path:string) : Promise<boolean> {
        if(path.indexOf(Folders.Main) !== 0)
            throw new Error("File must be in the RDMGR folder only!");
        return new Promise(async (res) => {
            let failed = await this.FS.promises.writeFile(path);
            if(failed)
                res(false);
            else
                res(true);
        });
    }

    /**
     * Checks for the existance of required files, and creates them in necessary
     */
    async CheckFiles() : Promise<Array<PathCheckResponse>> {
        return new Promise(async (res, rej) => {
            let responses:Array<PathCheckResponse> = [];
            for(let key in Files) {
                let response:boolean = await this.PathExists(Files[key]);
                if(!response) {
                    let writeResponse = await this.WriteFileDefaults(Files[key]);
                    if(writeResponse === true)
                        response = true;
                    else if(await this.PathExists(Files[key]) === false)
                        rej(`Failed to create file ${Files[key]}`);
                }
                responses.push({
                    path:Folders[key],
                    exists:response
                });
            }
            res(responses);
        });
    }

    /**
     * Writes the default values for the provided path
     * @param path String
     */
    protected WriteFileDefaults(path:string) {
        let data:any = null;
        let records:Array<any> = [];
        switch(path) {
            //general record files
            case Files.AnthemSingers :
            case Files.Jams :
            case Files.Skaters :
            case Files.Videos :
            case Files.Slideshows :
            case Files.Sponsors :
            case Files.Penalties :
                data = {Records:[]};
            break;

            //Peers
            case Files.Peers :
                let peer = PeersController.NewRecord();
                peer.PeerID = 'SCR01-RDMGR';
                peer.Name = 'SCR01';
                peer.ShortName = 'Scoreboard';
                data = {Records:[peer]};
            break;

            //phases
            case Files.Phases :
                records.push(
                    PhasesController.NewRecord(), //setup
                    PhasesController.NewRecord(), //warmup
                    PhasesController.NewRecord(), //intros
                    PhasesController.NewRecord(), //1st
                    PhasesController.NewRecord(), //break
                    PhasesController.NewRecord(), //2nd
                    PhasesController.NewRecord(), //halftime
                    PhasesController.NewRecord(), //3rd
                    PhasesController.NewRecord(), //break
                    PhasesController.NewRecord(), //4th
                    PhasesController.NewRecord() //final
                );

                //Setup
                records[0] = Object.assign({}, records[0], {
                    RecordID:1,
                    Name:"DERBY!",
                    PhaseTime:"02:00:00",
                    Duration:[2,0,0]
                });

                //warmups
                records[1] = Object.assign({}, records[1], {
                    RecordID:2,
                    Name:"Warmups",
                    PhaseTime:"00:40:00",
                    Duration:[0,40,0]
                });

                //intros
                records[2] = Object.assign({}, records[2], {
                    RecordID:3,
                    Name:"Intros",
                    PhaseTime:"00:10:00",
                    Duration:[0,10,0]
                });

                //1st
                records[3] = Object.assign({}, records[3], {
                    RecordID:4,
                    Name:"1st QTR",
                    PhaseTime:"00:15:00",
                    Duration:[0,15,0],
                    PhaseQtr:1
                });

                //break
                records[4] = Object.assign({}, records[4], {
                    RecordID:5,
                    Name:"Break",
                    PhaseTime:"00:05:00",
                    Duration:[0,5,0]
                });

                //2nd
                records[5] = Object.assign({}, records[5], {
                    RecordID:6,
                    Name:"2nd QTR",
                    PhaseTime:"00:15:00",
                    Duration:[0,15,0],
                    PhaseQtr:2
                });

                //halftime
                records[6] = Object.assign({}, records[6], {
                    RecordID:7,
                    Name:"Halftime",
                    PhaseTime:"00:20:00",
                    Duration:[0,20,0]
                });
                
                //3rd
                records[7] = Object.assign({}, records[7], {
                    RecordID:8,
                    Name:"3rd QTR",
                    PhaseTime:"00:15:00",
                    Duration:[0,15,0],
                    PhaseQtr:3
                });
                
                //break
                records[8] = Object.assign({}, records[8], {
                    RecordID:9,
                    Name:"Break",
                    PhaseTime:"00:05:00",
                    Duration:[0,5,0]
                });

                //4th
                records[9] = Object.assign({}, records[9], {
                    RecordID:10,
                    Name:"3th QTR",
                    PhaseTime:"00:15:00",
                    Duration:[0,15,0],
                    PhaseQtr:4
                });

                //final
                records[10] = Object.assign({}, records[10], {
                    RecordID:11,
                    Name:"FINAL",
                    PhaseTime:"00:0:00",
                    Duration:[0,0,0]
                });

                data = {Records:records};
            break;

            //Teams - 2 default Teams
            case Files.Teams :
                records.push(
                    TeamsController.NewRecord(), //A
                    TeamsController.NewRecord() //B
                );
                records[0] = Object.assign({}, records[0], {
                    RecordID:1,
                    Name:"Team A",
                    Color:"#990000"
                });

                records[1] = Object.assign({}, records[1], {
                    RecordID:2,
                    Name:"Team B",
                    Color:"#000099"
                });

                data = {Records:records};
            break;

            //Misc records
            case Files.MiscRecords :
                data = {Records:{
                    Raffle:{
                        Background:""
                    },
                    Announcers:{
                        Announcer1:"",
                        Announcer2:""
                    },
                    DefaultApp:"SB"
                }};
            break;

            //Scoreboard state
            case Files.Scoreboard :
                data = Object.assign({}, ScoreboardState);
            break;

            //Scorekeeper state
            case Files.Scorekeeper :
                data = Object.assign({}, ScorekeeperState);
            break;

            //Camera state
            case Files.Camera :
                data = Object.assign({}, CameraState);
            break;

            //Capture state
            case Files.Capture :
                data = Object.assign({}, CaptureState);
            break;

            //General Capture Controllers
            case Files.CaptureScoreboard :
            case Files.CaptureJamClock :
            case Files.CaptureJamCounter :
            case Files.CaptureRaffle :
            case Files.CaptureRoster :
            case Files.CaptureScorekeeper :
            case Files.CaptureSlideshow :
            case Files.CaptureVideo :
                data = {Shown:false,className:''};
            break;

            //Announcer
            case Files.CaptureAnnouncer :
                data = Object.assign({}, CaptureAnnouncerState);
            break;

            //Anthem
            case Files.CaptureAnthem :
                data = Object.assign({}, CaptureAnthemState);
            break;

            //Penalty Tracker Capture
            case Files.CapturePenalty :
                data = Object.assign({}, CapturePenaltyState);
            break;

            //Schedule
            case Files.CaptureSchedule :
                data = Object.assign({}, CaptureScheduleState);
            break;

            //Scorebanner
            case Files.CaptureScorebanner :
                data = Object.assign({}, CaptureScorebannerState);
            break;

            //Sponsor
            case Files.CaptureSponsor :
                data = Object.assign({}, CaptureSponsorState);
            break;

            //Standings
            case Files.CaptureStandings :
                data = Object.assign({}, CaptureStandingsState);
            break;

            //Scores
            case Files.CaptureScores :
                data = Object.assign({}, CaptureScoresState);
            break;

            //Chat state
            case Files.Chat :
                data = Object.assign({}, ChatState);
            break;

            //Media queue state
            case Files.MediaQueue :
                data = Object.assign({}, MediaState);
            break;

            //Penalty state
            case Files.Penalty :
                data = Object.assign({}, PenaltyState);
            break;

            //Raffle state
            case Files.Raffle :
                data = Object.assign({}, RaffleState);
            break;

            //Roster state
            case Files.Roster : 
                data = Object.assign({}, RosterState);
            break;

            //Slideshow state
            case Files.Slideshow :
                data = Object.assign({}, SlideshowState);
            break;

            //Sponsor state
            case Files.Sponsor :
                data = Object.assign({}, SponsorState);
            break;

            //Video state
            case Files.Video :
                data = Object.assign({}, VideoState);
            break;

            case Files.UI :
                data = Object.assign({}, UIState);
            break;

            //base configuration file
            case Files.Config :
                data = {
                    UR:{
                        FullScreen:false,
                        Capture:true
                    }
                };
            break;
        }

        return new Promise(async (res, rej) => {
            
            try {
                if(data === null) {
                    res(`Failed to create file: Failed to generate data for file: ${path}`);
                    return;
                }

                let content = JSON.stringify(data);
                if(typeof(content) !== 'string') {
                    res(`Failed to create file: Failed to parse data for: ${path}`);
                    return;
                }
    
                if(content.trim().length <= 0) {
                    res(`Failed to create file: No content generated for ${path}`);
                    return;
                }

                let response = await this.FS.promises.writeFile(path, content);
                if(response)
                    res(response);
                else {
                    res(true);
                }
            } catch(er) {
                rej(er.message);
            }
        });

    }
}

export default Installation;