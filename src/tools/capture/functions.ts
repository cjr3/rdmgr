import Data from "tools/data";
import { UIController } from "tools/UIController";
import { CaptureSection, SCapture, SCaptureAutoSlideshow, SCaptureRoster, SCaptureSchedule, SCaptureStandings } from "tools/vars";

namespace Capture {

    /**
     * 
     * @param state 
     * @returns 
     */
    const __GetVisibility = (state:CaptureSection) : boolean => state.visible || false;

    /**
     * Get capture State
     * @returns 
     */
    export const Get = () => UIController.GetState().Capture;

    /**
     * 
     * @returns 
     */
    export const GetAnnouncer = () => Get().Announcers;

    /**
     * 
     * @returns 
     */
    export const GetAnthem = () => Get().Anthem;

    /**
     * 
     */
    export const GetAutoSlideshow = () => Get().AutoSlideshow;

    /**
     * 
     * @returns 
     */
    export const GetGameClock = () => Get().GameClock;

    /**
     * 
     * @returns 
     */
    export const GetJamClock = () => Get().JamClock;

    /**
     * 
     * @returns 
     */
    export const GetJamCounter = () => Get().JamCounter;

    /**
     * 
     * @returns 
     */
    export const GetPenaltyTracker = () => Get().PenaltyTracker;

    /**
     * Get raffle state.
     * @returns 
     */
    export const GetRaffle = () => Get().Raffle;

    /**
     * 
     * @returns 
     */
    export const GetRoster = () => Get().Roster;

    /**
     * 
     * @returns SCaptureSchedule
     */
    export const GetSchedule = () => Get().Schedule;

    /**
     * Get scorebanner capture state
     * @returns 
     */
    export const GetScorebanner = () => Get().Scorebanner;

    /**
     * Get scoreboard capture state
     * @returns 
     */
    export const GetScoreboard = () => Get().Scoreboard;

    /**
     * 
     * @returns 
     */
    export const GetScorekeeper = () => Get().Scorekeeper;

    /**
     * 
     * @returns 
     */
    export const GetSlideshow = () => Get().Slideshow;

    /**
     * 
     * @returns 
     */
    export const GetStandings = () => Get().Standings;

    /**
     * 
     * @returns 
     */
    export const Init = () : Promise<boolean> => {
        return new Promise((res) => {
            Load().then().catch().finally(() => {
                let lastState:SCapture = Get();
                let saving = false;
                setInterval(() => {
                    const state = Get();
                    if(!saving && lastState !== state) {
                        saving = true;
                        lastState = state;
                        Data.SaveCapture(state).then().catch().finally(() => { saving = false; });
                    }
                }, 1000);
                return res(true);
            });
        })
    };

    /**
     * 
     * @returns 
     */
    export const Load = () : Promise<boolean> => {
        return new Promise((res, rej) => {
            Data.LoadCapture().then(values => {
                Update(values);
                return res(true);
            }).catch(er => rej(er));
        });
    }

    /**
     * Subscribe to changes to the UI controller
     * @param f 
     * @returns 
     */
    export const Subscribe = (f:{():void}) => UIController.Subscribe(f);
    
    /**
     * Toggle visibility of announcers
     */
    export const ToggleAnnouncers = () => {
        const state = GetAnnouncer();
        UpdateAnnouncer({visible:!__GetVisibility(state)});
    };

    /**
     * Toggle visibility of anthem singer
     */
    export const ToggleAnthem = () => {
        const state = GetAnthem();
        UpdateAnthem({visible:!__GetVisibility(state)});
    };

    /**
     * Toggle visibility of auto slideshow
     */
    export const ToggleAutoSlideshow = () => {
        const state = GetAutoSlideshow();
        UpdateAutoSlideshow({visible:!__GetVisibility(state)});
    };

    /**
     * 
     */
    export const ToggleGameClock = () => {
        const state = GetGameClock();
        UpdateGameClock({visible:!__GetVisibility(state)});
    };

    /**
     * 
     */
    export const ToggleJamClock = () => {
        const state = GetJamClock();
        UpdateJamClock({visible:!__GetVisibility(state)});
    };

    /**
     * 
     */
    export const ToggleJamCounter = () => {
        const state = GetJamCounter();
        UpdateJamCounter({visible:!__GetVisibility(state)});
    };

    /**
     * Toggle visibility of penalties
     */
    export const TogglePenaltyTracker = () => {
        const state = GetPenaltyTracker();
        UpdatePenaltyTracker({visible:!__GetVisibility(state)});
    };

    /**
     * Toggle raffle visibility.
     */
    export const ToggleRaffle = () => {
        const state = GetRaffle();
        UpdateRaffle({visible:!__GetVisibility(state)});
    };

    /**
     * 
     */
    export const ToggleRoster = () => {
        const state = GetRoster();
        UpdateRoster({visible:!__GetVisibility(state)});
    };

    /**
     * Toggle schedule visibility
     */
    export const ToggleSchedule = () => {
        const state = GetSchedule();
        UpdateSchedule({visible:!__GetVisibility(state)});
    };

    /**
     * Toggle visibility of scorebanner
     */
    export const ToggleScorebanner = () => {
        const state = GetScorebanner();
        UpdateScorebanner({visible:!__GetVisibility(state)});
    };

    /**
     * Toggle visibility of the scoreboard
     */
    export const ToggleScoreboard = () => {
        const state = GetScoreboard();
        UpdateScoreboard({visible:!__GetVisibility(state)});
    };

    /**
     * Toggle visibility of the scorekeeper
     */
    export const ToggleScorekeeper = () => {
        const state = GetScorekeeper();
        UpdateScorekeeper({visible:!__GetVisibility(state)});
    };

    /**
     * Toggle manual slideshow visibility on the capture window.
     */
    export const ToggleSlideshow = () => {
        const state = GetSlideshow();
        UpdateSlideshow({visible:!__GetVisibility(state)});
    };

    /**
     * Toggle standings visibility on the capture window.
     */
    export const ToggleStandings = () => {
        const state = GetStandings();
        UpdateStandings({visible:!__GetVisibility(state)})
    };

    /**
     * 
     * @param values 
     * @returns 
     */
    export const Update = (values:SCapture) => UIController.UpdateCapture(values);

    /**
     * 
     * @param values 
     * @returns 
     */
    export const UpdateAnnouncer = (values:CaptureSection) => UIController.UpdateCaptureAnnouncer(values);

    /**
     * Update anthem state.
     * @param values 
     * @returns 
     */
    export const UpdateAnthem = (values:CaptureSection) => UIController.UpdateCaptureAnthem(values);

    /**
     * Update auto-slideshow values
     * @param values 
     * @returns 
     */
    export const UpdateAutoSlideshow = (values:SCaptureAutoSlideshow) => UIController.UpdateAutoSlideshow(values);

    /**
     * Update game clock
     * @param values 
     * @returns 
     */
    export const UpdateGameClock = (values:CaptureSection) => UIController.UpdateCaptureGameClock(values);

    /**
     * Update jam clock
     * @param values 
     * @returns 
     */
    export const UpdateJamClock = (values:CaptureSection) => UIController.UpdateCaptureJamClock(values);

    /**
     * Update jam counter
     * @param values 
     * @returns 
     */
    export const UpdateJamCounter = (values:CaptureSection) => UIController.UpdateCaptureJamCounter(values);
    
    /**
     * Update penalty tracker values
     * @param values 
     * @returns 
     */
    export const UpdatePenaltyTracker = (values:CaptureSection) => UIController.UpdateCapturePenaltyTracker(values);

    /**
     * Update raffle capture values
     * @param values 
     * @returns 
     */
    export const UpdateRaffle = (values:CaptureSection) => UIController.UpdateCaptureRaffle(values);

    /**
     * 
     * @param values 
     * @returns 
     */
    export const UpdateRoster = (values:SCaptureRoster) => UIController.UpdateCaptureRoster(values);

    /**
     * 
     * @param values 
     * @returns 
     */
    export const UpdateSchedule = (values:SCaptureSchedule) => UIController.UpdateCaptureSchedule(values);

    /**
     * Update scorebanner capture
     * @param values 
     * @returns 
     */
    export const UpdateScorebanner = (values:CaptureSection) => UIController.UpdateCaptureScorebanner(values);

    /**
     * Update scoreboard capture
     * @param values 
     * @returns 
     */
    export const UpdateScoreboard = (values:CaptureSection) => UIController.UpdateCaptureScoreboard(values);

    /**
     * Update scorekeeper capture
     * @param values 
     * @returns 
     */
    export const UpdateScorekeeper = (values:CaptureSection) => UIController.UpdateCaptureScorekeeper(values);

     /**
      * 
      * @param values 
      * @returns 
      */
    export const UpdateSlideshow = (values:CaptureSection) => UIController.UpdateCaptureSlideshow(values);

    /**
     * 
     * @param values 
     * @returns 
     */
    export const UpdateStandings = (values:SCaptureStandings) => UIController.UpdateCaptureStandings(values);
}

export {Capture};