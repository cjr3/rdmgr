import Data from "tools/data";
import { UIController } from "tools/UIController";
import { CaptureSection, SCapture, SCaptureAutoSlideshow, SCaptureRoster, SCaptureSchedule, SCaptureStandings } from "tools/vars";

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
const Get = () => UIController.GetState().Capture;

/**
 * 
 * @returns 
 */
const GetAnnouncer = () => Get().Announcers;

/**
 * 
 * @returns 
 */
const GetAnthem = () => Get().Anthem;

/**
 * 
 */
const GetAutoSlideshow = () => Get().AutoSlideshow;

/**
 * 
 * @returns 
 */
const GetGameClock = () => Get().GameClock;

/**
 * 
 * @returns 
 */
const GetJamClock = () => Get().JamClock;

/**
 * 
 * @returns 
 */
const GetJamCounter = () => Get().JamCounter;

/**
 * 
 * @returns 
 */
const GetPenaltyTracker = () => Get().PenaltyTracker;

/**
 * Get raffle state.
 * @returns 
 */
const GetRaffle = () => Get().Raffle;

/**
 * 
 * @returns 
 */
const GetRoster = () => Get().Roster;

/**
 * 
 * @returns SCaptureSchedule
 */
const GetSchedule = () => Get().Schedule;

/**
 * Get scorebanner capture state
 * @returns 
 */
const GetScorebanner = () => Get().Scorebanner;

/**
 * Get scoreboard capture state
 * @returns 
 */
const GetScoreboard = () => Get().Scoreboard;

/**
 * 
 * @returns 
 */
const GetScorekeeper = () => Get().Scorekeeper;

/**
 * 
 * @returns 
 */
const GetSlideshow = () => Get().Slideshow;

/**
 * 
 * @returns 
 */
const GetStandings = () => Get().Standings;

/**
 * Initial capture state saving.
 * @returns 
 */
const Init = async () : Promise<boolean> => {
    try {
        await Load();
        let lastState = Get();
        let saving = false;
        setInterval(async () => {
            const state = Get();
            if(!saving && lastState !== state) {
                saving = true;
                lastState = state;
                try {
                    await Data.SaveCapture(state);
                } catch(er) {

                } finally {
                    saving = false;
                }
            }
        }, 1000);
    } catch(er) {

    }

    return true;
};

/**
 * 
 * @returns 
 */
const Load = async () : Promise<boolean> => {
    try {
        const state = await Data.LoadCapture();
        Update(state);
        return true;
    } catch(er) {
        throw er;
    }
}

/**
 * Subscribe to changes to the UI controller
 * @param f 
 * @returns 
 */
const Subscribe = (f:{():void}) => UIController.Subscribe(f);

/**
 * Toggle visibility of announcers
 */
const ToggleAnnouncers = () => {
    const state = GetAnnouncer();
    UpdateAnnouncer({visible:!__GetVisibility(state)});
};

/**
 * Toggle visibility of anthem singer
 */
const ToggleAnthem = () => {
    const state = GetAnthem();
    UpdateAnthem({visible:!__GetVisibility(state)});
};

/**
 * Toggle visibility of auto slideshow
 */
const ToggleAutoSlideshow = () => {
    const state = GetAutoSlideshow();
    UpdateAutoSlideshow({visible:!__GetVisibility(state)});
};

/**
 * 
 */
const ToggleGameClock = () => {
    const state = GetGameClock();
    UpdateGameClock({visible:!__GetVisibility(state)});
};

/**
 * 
 */
const ToggleJamClock = () => {
    const state = GetJamClock();
    UpdateJamClock({visible:!__GetVisibility(state)});
};

/**
 * 
 */
const ToggleJamCounter = () => {
    const state = GetJamCounter();
    UpdateJamCounter({visible:!__GetVisibility(state)});
};

/**
 * Toggle visibility of penalties
 */
const TogglePenaltyTracker = () => {
    const state = GetPenaltyTracker();
    UpdatePenaltyTracker({visible:!__GetVisibility(state)});
};

/**
 * Toggle raffle visibility.
 */
const ToggleRaffle = () => {
    const state = GetRaffle();
    UpdateRaffle({visible:!__GetVisibility(state)});
};

/**
 * 
 */
const ToggleRoster = () => {
    const state = GetRoster();
    UpdateRoster({visible:!__GetVisibility(state)});
};

/**
 * Toggle schedule visibility
 */
const ToggleSchedule = () => {
    const state = GetSchedule();
    UpdateSchedule({visible:!__GetVisibility(state)});
};

/**
 * Toggle visibility of scorebanner
 */
const ToggleScorebanner = () => {
    const state = GetScorebanner();
    UpdateScorebanner({visible:!__GetVisibility(state)});
};

/**
 * Toggle visibility of the scoreboard
 */
const ToggleScoreboard = () => {
    const state = GetScoreboard();
    UpdateScoreboard({visible:!__GetVisibility(state)});
};

/**
 * Toggle visibility of the scorekeeper
 */
const ToggleScorekeeper = () => {
    const state = GetScorekeeper();
    UpdateScorekeeper({visible:!__GetVisibility(state)});
};

/**
 * Toggle manual slideshow visibility on the capture window.
 */
const ToggleSlideshow = () => {
    const state = GetSlideshow();
    UpdateSlideshow({visible:!__GetVisibility(state)});
};

/**
 * Toggle standings visibility on the capture window.
 */
const ToggleStandings = () => {
    const state = GetStandings();
    UpdateStandings({visible:!__GetVisibility(state)})
};

/**
 * 
 * @param values 
 * @returns 
 */
const Update = (values:SCapture) => UIController.UpdateCapture(values);

/**
 * 
 * @param values 
 * @returns 
 */
const UpdateAnnouncer = (values:CaptureSection) => UIController.UpdateCaptureAnnouncer(values);

/**
 * Update anthem state.
 * @param values 
 * @returns 
 */
const UpdateAnthem = (values:CaptureSection) => UIController.UpdateCaptureAnthem(values);

/**
 * Update auto-slideshow values
 * @param values 
 * @returns 
 */
const UpdateAutoSlideshow = (values:SCaptureAutoSlideshow) => UIController.UpdateAutoSlideshow(values);

/**
 * Update game clock
 * @param values 
 * @returns 
 */
const UpdateGameClock = (values:CaptureSection) => UIController.UpdateCaptureGameClock(values);

/**
 * Update jam clock
 * @param values 
 * @returns 
 */
const UpdateJamClock = (values:CaptureSection) => UIController.UpdateCaptureJamClock(values);

/**
 * Update jam counter
 * @param values 
 * @returns 
 */
const UpdateJamCounter = (values:CaptureSection) => UIController.UpdateCaptureJamCounter(values);

/**
 * Update penalty tracker values
 * @param values 
 * @returns 
 */
const UpdatePenaltyTracker = (values:CaptureSection) => UIController.UpdateCapturePenaltyTracker(values);

/**
 * Update raffle capture values
 * @param values 
 * @returns 
 */
const UpdateRaffle = (values:CaptureSection) => UIController.UpdateCaptureRaffle(values);

/**
 * 
 * @param values 
 * @returns 
 */
const UpdateRoster = (values:SCaptureRoster) => UIController.UpdateCaptureRoster(values);

/**
 * 
 * @param values 
 * @returns 
 */
const UpdateSchedule = (values:SCaptureSchedule) => UIController.UpdateCaptureSchedule(values);

/**
 * Update scorebanner capture
 * @param values 
 * @returns 
 */
const UpdateScorebanner = (values:CaptureSection) => UIController.UpdateCaptureScorebanner(values);

/**
 * Update scoreboard capture
 * @param values 
 * @returns 
 */
const UpdateScoreboard = (values:CaptureSection) => UIController.UpdateCaptureScoreboard(values);

/**
 * Update scorekeeper capture
 * @param values 
 * @returns 
 */
const UpdateScorekeeper = (values:CaptureSection) => UIController.UpdateCaptureScorekeeper(values);

/**
 * 
 * @param values 
 * @returns 
 */
const UpdateSlideshow = (values:CaptureSection) => UIController.UpdateCaptureSlideshow(values);

/**
 * 
 * @param values 
 * @returns 
 */
const UpdateStandings = (values:SCaptureStandings) => UIController.UpdateCaptureStandings(values);

const Capture = {
    Get:Get,
    GetAnnouncer:GetAnnouncer,
    GetAnthem:GetAnthem,
    GetAutoSlideshow:GetAutoSlideshow,
    GetGameClock:GetGameClock,
    GetJamClock:GetJamClock,
    GetJamCounter:GetJamCounter,
    GetPenaltyTracker:GetPenaltyTracker,
    GetRaffle:GetRaffle,
    GetRoster:GetRoster,
    GetSchedule:GetSchedule,
    GetScorebanner:GetScorebanner,
    GetScoreboard:GetScoreboard,
    GetScorekeeper:GetScorekeeper,
    GetSlideshow:GetSlideshow,
    GetStandings:GetStandings,
    Init:Init,
    Load:Load,
    Subscribe:Subscribe,
    ToggleAnnouncers:ToggleAnnouncers,
    ToggleAnthem:ToggleAnthem,
    ToggleAutoSlideshow:ToggleAutoSlideshow,
    ToggleGameClock:ToggleGameClock,
    ToggleJamClock:ToggleJamClock,
    ToggleJamCounter:ToggleJamCounter,
    TogglePenaltyTracker:TogglePenaltyTracker,
    ToggleRaffle:ToggleRaffle,
    ToggleRoster:ToggleRoster,
    ToggleSchedule:ToggleSchedule,
    ToggleScorebanner:ToggleScorebanner,
    ToggleScoreboard:ToggleScoreboard,
    ToggleScorekeeper:ToggleScorekeeper,
    ToggleSlideshow:ToggleSlideshow,
    ToggleStandings:ToggleStandings,
    Update:Update,
    UpdateAnnouncer:UpdateAnnouncer,
    UpdateAnthem:UpdateAnthem,
    UpdateAutoSlideshow:UpdateAutoSlideshow,
    UpdateGameClock:UpdateGameClock,
    UpdateJamClock:UpdateJamClock,
    UpdateJamCounter:UpdateJamCounter,
    UpdatePenaltyTracker:UpdatePenaltyTracker,
    UpdateRaffle:UpdateRaffle,
    UpdateRoster:UpdateRoster,
    UpdateSchedule:UpdateSchedule,
    UpdateScorebanner:UpdateScorebanner,
    UpdateScoreboard:UpdateScoreboard,
    UpdateScorekeeper:UpdateScorekeeper,
    UpdateSlideshow:UpdateSlideshow,
    UpdateStandings:UpdateStandings
}

export {Capture};