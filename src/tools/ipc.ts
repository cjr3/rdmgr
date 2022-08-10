//main file for handling ipc renderer.
// import { ipcRenderer } from "electron";
import { ipcRenderer } from "electron";
import { Announcers } from "./announcers/functions";
import { Anthem } from "./anthem/functions";
import { Capture } from "./capture/functions";
import { MainController } from "./MainController";
import { PenaltyTracker } from "./penaltytracker/functions";
import { Raffle } from "./raffle/functions";
import { Roster } from "./roster/functions";
import { Scoreboard } from "./scoreboard/functions";
import { Scorekeeper } from "./scorekeeper/functions";
import { Slideshow } from "./slideshows/functions";
import { UIController } from "./UIController";
import { CaptureAction, ControlAction } from "./vars";
import { Videos } from "./videos/functions";

const ignore = () => {};

namespace CaptureIPC {
    
    export const Init = () => {
        ipcRenderer.on('control-capture-receive', receive);
    };

    /**
     * Called when receiving messages from the control window.
     * @param ev 
     * @param data 
     */
    const receive = (ev:Electron.IpcRendererEvent, data:CaptureAction) => {
    // const receive = (data:CaptureAction) => {
        if(data !== null && data !== undefined && typeof(data) === 'object') {
            try {
                switch(data.action) {
                    case 'announcer1' : Announcers.SetName(data.values.Name || '', 1); break;
                    case 'announcer2' : Announcers.SetName(data.values.Name || '', 2); break;
                    case 'anthem' : Anthem.Update(data.values); break;
                    case 'capture-announcer' : Capture.UpdateAnnouncer(data.values); break;
                    case 'capture-anthem' : Capture.UpdateAnthem(data.values); break;
                    case 'capture-autoshow' : Capture.UpdateAutoSlideshow(data.values); break;
                    case 'capture-camera' : Videos.UpdateMainCamera(data.values); break;
                    case 'capture-gameclock' : Capture.UpdateGameClock(data.values); break;
                    case 'capture-jamclock' : Capture.UpdateJamClock(data.values); break;
                    case 'capture-jamcounter' : Capture.UpdateJamCounter(data.values); break;
                    case 'capture-penalty' : Capture.UpdatePenaltyTracker(data.values); break;
                    case 'capture-raffle' : Capture.UpdateRaffle(data.values); break;
                    case 'capture-roster' : Capture.UpdateRoster(data.values); break;
                    case 'capture-schedule' : Capture.UpdateSchedule(data.values); break;
                    case 'capture-scorebanner' : Capture.UpdateScorebanner(data.values); break;
                    case 'capture-scoreboard' : Capture.UpdateScoreboard(data.values); break;
                    case 'capture-scorekeeper' : Capture.UpdateScorekeeper(data.values); break;
                    case 'capture-slideshow' : Capture.UpdateSlideshow(data.values); break;
                    case 'capture-standings' : Capture.UpdateStandings(data.values); break;
                    case 'penalty' : PenaltyTracker.Update(data.values); break;
                    case 'raffle' : Raffle.Update(data.values); break;
                    case 'roster' : Roster.Update(data.values); break;
                    case 'scoreboard' : Scoreboard.Update(data.values); break;
                    case 'scorekeeper' : Scorekeeper.Update(data.values); break;
                    case 'slideshow' : Slideshow.Update(data.values); break;
                    case 'ui-config' : 
                        UIController.UpdateConfigColors(data.values.Colors);
                        UIController.UpdateConfigMisc(data.values.Misc);
                        UIController.UpdateConfigScoreboard(data.values.Scoreboard);
                    break;
                    case 'video-config' :
                        UIController.UpdateMainVideo(data.values);
                    break;
                }
            } catch(er) {
    
            }
        }
    };

    /**
     * Send data to the capture window
     * @param data 
     * @returns 
     */
    export const Send = (data:CaptureAction) => {
        return new Promise(res => {
            try {
                ipcRenderer.invoke('control-capture', data).then(() => res(true)).catch(() => res(true));
            } catch(er) {
                return res(false);
            }
        });

    };
}

namespace ControlIPC {
    let ann1 = MainController.GetState().Announcer1;
    let ann2 = MainController.GetState().Announcer2;
    let annUI = UIController.GetState().Capture.Announcers;
    let anthemState = MainController.GetState().Anthem;
    let anthemUI = UIController.GetState().Capture.Anthem;
    let autoShowState = UIController.GetState().Capture.AutoSlideshow;
    let cameraUI = UIController.GetState().MainCamera;
    let penaltyState = MainController.GetState().PenaltyTracker;
    let gameClockUI = UIController.GetState().Capture.GameClock;
    let jamClockUI = UIController.GetState().Capture.JamClock;
    let jamCounterUI = UIController.GetState().Capture.JamCounter;
    let penaltyUI = UIController.GetState().Capture.PenaltyTracker;
    let raffleState = MainController.GetState().Raffle;
    let raffleUI = UIController.GetState().Capture.Raffle;
    let rosterState = MainController.GetState().Roster;
    let rosterUI = UIController.GetState().Capture.Roster;
    let scheduleUI = UIController.GetState().Capture.Schedule;
    let scoreboardState = MainController.GetState().Scoreboard;
    let scorebannerUI = UIController.GetState().Capture.Scorebanner;
    let scoreboardUI = UIController.GetState().Capture.Scoreboard;
    let scorekeeperState = MainController.GetState().Scorekeeper;
    let scorekeeperUI = UIController.GetState().Capture.Scorekeeper;
    let slideshowState = MainController.GetState().Slideshow;
    let slideshowUI = UIController.GetState().Capture.Slideshow;
    let standingsUI = UIController.GetState().Capture.Standings;
    let uiConfig = UIController.GetState().Config;

    export const Init = () => {
        MainController.Subscribe(onMainUpdate);
        UIController.Subscribe(onCaptureUpdate);
        ipcRenderer.on('capture-control-receive', receive);
    }

    /**
     * Called when receiving messages from the capture window.
     * @param ev 
     * @param data 
     */
    const receive = (ev:Electron.IpcRendererEvent, data:ControlAction) => {
    // const receive = (data:ControlAction) => {
        if(data !== null && data !== undefined && typeof(data) === 'object') {
            try {
                switch(data.action) {
                    case 'video' :
                        Videos.UpdateMainVideo(data.values, false);
                    break;
                }
            } catch(er) {
    
            }
        }
    };

    /**
     * Called when the main controller state is updated.
     */
    const onMainUpdate = async () => {
        const state = MainController.GetState();

        if(ann1 !== state.Announcer1) {
            ann1 = state.Announcer1;
            CaptureIPC.Send({action:'announcer1', values:state.Announcer1}).then(ignore).catch(ignore);
        }

        if(ann2 !== state.Announcer2) {
            ann2 = state.Announcer2;
            CaptureIPC.Send({action:'announcer2', values:state.Announcer2}).then(ignore).catch(ignore);
        }

        if(anthemState !== state.Anthem) {
            anthemState = state.Anthem;
            CaptureIPC.Send({action:'anthem', values:state.Anthem}).then(ignore).catch(ignore);
        }

        if(penaltyState !== state.PenaltyTracker) {
            penaltyState = state.PenaltyTracker;
            CaptureIPC.Send({action:'penalty', values:state.PenaltyTracker}).then(ignore).catch(ignore);
        }

        if(raffleState !== state.Raffle) {
            raffleState = state.Raffle;
            CaptureIPC.Send({action:'raffle', values:state.Raffle}).then(ignore).catch(ignore);
        }

        if(rosterState !== state.Roster) {
            rosterState = state.Roster;
            CaptureIPC.Send({action:'roster', values:state.Roster}).then(ignore).catch(ignore);
        }

        if(scoreboardState !== state.Scoreboard) {
            scoreboardState = state.Scoreboard;
            CaptureIPC.Send({action:'scoreboard', values:state.Scoreboard}).then(ignore).catch(ignore);
        }

        if(scorekeeperState !== state.Scorekeeper) {
            scorekeeperState = state.Scorekeeper;
            CaptureIPC.Send({action:'scorekeeper', values:state.Scorekeeper}).then(ignore).catch(ignore);
        }

        if(slideshowState !== state.Slideshow) {
            slideshowState = state.Slideshow;
            CaptureIPC.Send({action:'slideshow', values:state.Slideshow}).then(ignore).catch(ignore);
        }
    };

    /**
     * Called when the UI Controller state is updated
     */
    const onCaptureUpdate = async () => {
        const state = UIController.GetState();

        if(annUI !== state.Capture.Announcers) {
            annUI = state.Capture.Announcers;
            CaptureIPC.Send({action:'capture-announcer', values:state.Capture.Announcers}).then(ignore).catch(ignore);
        }

        if(anthemUI !== state.Capture.Anthem) {
            anthemUI = state.Capture.Anthem;
            CaptureIPC.Send({action:'capture-anthem', values:state.Capture.Anthem}).then(ignore).catch(ignore);
        }

        if(autoShowState !== state.Capture.AutoSlideshow) {
            autoShowState = state.Capture.AutoSlideshow;
            CaptureIPC.Send({action:'capture-autoshow', values:state.Capture.AutoSlideshow}).then(ignore).catch(ignore);
        }

        if(cameraUI !== state.MainCamera) {
            cameraUI = state.MainCamera;
            CaptureIPC.Send({action:'capture-camera', values:state.MainCamera}).then(ignore).catch(ignore);
        }

        if(gameClockUI !== state.Capture.GameClock) {
            gameClockUI = state.Capture.GameClock;
            CaptureIPC.Send({action:'capture-gameclock', values:state.Capture.GameClock}).then(ignore).catch(ignore);
        }

        if(jamClockUI !== state.Capture.JamClock) {
            jamClockUI = state.Capture.JamClock;
            CaptureIPC.Send({action:'capture-jamclock', values:state.Capture.JamClock}).then(ignore).catch(ignore);
        }

        if(jamCounterUI !== state.Capture.JamCounter) {
            jamCounterUI = state.Capture.JamCounter;
            CaptureIPC.Send({action:'capture-jamcounter', values:state.Capture.JamCounter}).then(ignore).catch(ignore);
        }

        if(penaltyUI !== state.Capture.PenaltyTracker) {
            penaltyUI = state.Capture.PenaltyTracker;
            CaptureIPC.Send({action:'capture-penalty', values:state.Capture.PenaltyTracker}).then(ignore).catch(ignore);
        }

        if(raffleUI !== state.Capture.Raffle) {
            raffleUI = state.Capture.Raffle;
            CaptureIPC.Send({action:'capture-raffle', values:state.Capture.Raffle}).then(ignore).catch(ignore);
        }

        if(rosterUI !== state.Capture.Roster) {
            rosterUI = state.Capture.Roster;
            CaptureIPC.Send({action:'capture-roster', values:state.Capture.Roster}).then(ignore).catch(ignore);
        }

        if(scheduleUI !== state.Capture.Schedule) {
            scheduleUI = state.Capture.Schedule;
            CaptureIPC.Send({action:'capture-schedule', values:state.Capture.Schedule}).then(ignore).catch(ignore);
        }

        if(scorebannerUI !== state.Capture.Scorebanner) {
            scorebannerUI = state.Capture.Scorebanner;
            CaptureIPC.Send({action:'capture-scorebanner', values:state.Capture.Scorebanner}).then(ignore).catch(ignore);
        }

        if(scoreboardUI !== state.Capture.Scoreboard) {
            scoreboardUI = state.Capture.Scoreboard;
            CaptureIPC.Send({action:'capture-scoreboard', values:state.Capture.Scoreboard}).then(ignore).catch(ignore);
        }

        if(scorekeeperUI !== state.Capture.Scorekeeper) {
            scorekeeperUI = state.Capture.Scorekeeper;
            CaptureIPC.Send({action:"capture-scorekeeper", values:state.Capture.Scorekeeper}).then(ignore).catch(ignore);
        }

        if(slideshowUI !== state.Capture.Slideshow) {
            slideshowUI = state.Capture.Slideshow;
            CaptureIPC.Send({action:'capture-slideshow', values:state.Capture.Slideshow}).then(ignore).catch(ignore);
        }

        if(standingsUI !== state.Capture.Standings) {
            standingsUI = state.Capture.Standings;
            CaptureIPC.Send({action:'capture-standings', values:state.Capture.Standings}).then(ignore).catch(ignore);
        }

        if(uiConfig !== state.Config) {
            uiConfig = state.Config;
            CaptureIPC.Send({action:'ui-config', values:state.Config}).then(ignore).catch(ignore);
        }
    }

    /**
     * 
     * @param data 
     * @returns 
     */
    export const Send = (data:ControlAction) => {
        return new Promise((res) => {
            // console.log(data);
            try {
                ipcRenderer.invoke('capture-control', data).then(() => res(true)).catch(() => res(true));
            } catch(er) {
                // console.error(er);
                return res(false);
            }
        });
    }
}

export {ControlIPC, CaptureIPC};