import {createStore} from 'redux'
import vars, { AnthemRecord } from 'tools/vars';
import DataController from './DataController';
import {startTimeout} from 'tools/functions';
import { IGamepadButtonMap, IGamepadAxes } from './GameController';
import ScoreboardController from './ScoreboardController';
import RosterController from './RosterController';
import keycodes from 'tools/keycodes';

export enum Actions {
    SET_STATE,
    SET_SCOREBOARD,
    SET_SCOREBANNER,
    SET_CAMERA,
    SET_VIDEO,
    SET_SLIDESHOW,
    SET_SPONSORS,
    SET_PENALTY_TRACKER,
    SET_ANTHEM,
    SET_RAFFLE,
    SET_ROSTER,
    SET_CLASS_NAME,
    SET_ANNOUNCERS,
    SET_STREAM_CONTROL,
    SET_DISPLAY_CONTROL,
    SET_CONTROL,
    TOGGLE_SLIDESHOW,
    TOGGLE_SCOREBOARD,
    TOGGLE_JAM_CLOCK,
    TOGGLE_JAM_COUNTER,
    TOGGLE_SCOREBANNER,
    TOGGLE_SCOREBANNER_CLOCKS,
    TOGGLE_MAIN_CAMERA,
    TOGGLE_MAIN_VIDEO,
    TOGGLE_SPONSORS,
    TOGGLE_PENALTY_TRACKER,
    TOGGLE_ANNOUNCER,
    TOGGLE_ANTHEM,
    TOGGLE_RAFFLE,
    TOGGLE_ROSTER,
    TOGGLE_SCOREBOARD_LIGHT,
    TOGGLE_SCOREKEEPER,
    TOGGLE_SPONSOR_VIEW
}

export enum CapturePanels {
    SCOREBOARD,
    ROSTER,
    ANNOUNCER,
    ANTHEM,
    CAMERA,
    PENALTY,
    SCOREKEEPER,
}

export enum Controllers {
    APPLICATION,
    SCOREBOARD,
    ROSTER,
    MEDIA
}

export interface CaptureStateBase {
    Shown:boolean;
    className:string;
}

export interface CaptureStateAnnouncer extends CaptureStateBase {
    Announcer1:string;
    Announcer2:string;
    Duration:number
}

export interface CaptureStateMonitor extends CaptureStateBase {
    ID:string;
    Width:number;
    Height:number;
}

export interface CaptureStateScoreboard extends CaptureStateBase {
    Light:boolean;
    JamCounterShown:boolean;
    JamClockShown:boolean;
}

export interface CaptureStateScorebanner extends CaptureStateBase {
    ClocksShown:boolean;
    /**
     * Background image for the scorebanner
     */
    BackgroundImage?:string;
}

export interface CaptureStateSponsor extends CaptureStateBase {
    Delay:number;
}

export interface CaptureStatePenalty extends CaptureStateBase {
    Duration:number;
}

export interface CaptureStateAnthem extends CaptureStateBase {
    Record:AnthemRecord;
}

export interface CaptureControllerState {
    className:string;
    Control:number;
    Announcers:CaptureStateAnnouncer;
    Monitor:CaptureStateMonitor;
    Scoreboard:CaptureStateScoreboard;
    Scorebanner:CaptureStateScorebanner;
    MainCamera:CaptureStateBase;
    PeerCamera:CaptureStateBase;
    MainVideo:CaptureStateBase;
    SponsorSlideshow:CaptureStateSponsor;
    MainSlideshow:CaptureStateBase;
    PenaltyTracker:CaptureStatePenalty;
    NationalAnthem:CaptureStateAnthem;
    Raffle:CaptureStateBase;
    Roster:CaptureStateBase;
    Scorekeeper:CaptureStateBase;
}

export const InitState:CaptureControllerState = {
    className:'',
    Control:0,
    Monitor:{
        Shown:true,
        className:'',
        ID:'',
        Width:1280,
        Height:720
    },
    Scoreboard:{
        Shown:false,
        Light:false,
        JamCounterShown:false,
        JamClockShown:false,
        className:''
    },
    Scorebanner:{
        Shown:false,
        className:"pos-top",
        ClocksShown:false
    },
    MainCamera:{
        Shown:true,
        className:'video-def'
    },
    PeerCamera:{
        Shown:false,
        className:''
    },
    MainVideo:{
        Shown:false,
        className:'video-def'
    },
    SponsorSlideshow:{
        Shown:false,
        Delay:10000,
        className:''
    },
    MainSlideshow:{
        Shown:false,
        className:''
    },
    Announcers:{
        Shown:false,
        className:'',
        Announcer1:'',
        Announcer2:'',
        Duration:7000
    },
    PenaltyTracker:{
        Shown:true,
        className:'',
        Duration:7000
    },
    NationalAnthem:{
        Shown:false,
        className:'',
        Record:{
            RecordID:0,
            RecordType:vars.RecordType.Anthem,
            Name:'',
            Biography:''
        }
    },
    Raffle:{
        Shown:false,
        className:''
    },
    Roster:{
        Shown:false,
        className:''
    },
    Scorekeeper:{
        Shown:true,
        className:''
    }
};

function CaptureReducer(state:CaptureControllerState = InitState, action) {
    switch(action.type) {
        //update entire state
        case Actions.SET_STATE :
            return Object.assign({}, state, action.state);

        //sets the class name
        case Actions.SET_CLASS_NAME :
            return Object.assign({}, state, {className:action.className});

        case Actions.TOGGLE_SPONSOR_VIEW :
            if(state.className === 'sponsor-board')
                return Object.assign({}, state, {className:''});
            return Object.assign({}, state, {className:'sponsor-board'});

        case Actions.SET_CAMERA :
            return Object.assign({}, state, {
                MainCamera:Object.assign({}, state.MainCamera, action.values)
            });

        case Actions.SET_VIDEO :
            return Object.assign({}, state, {
                MainVideo:Object.assign({}, state.MainVideo, action.values)
            });

        case Actions.SET_SCOREBANNER :
            return Object.assign({}, state, {
                Scorebanner:Object.assign({}, state.Scorebanner, action.values)
            });

        case Actions.SET_SCOREBOARD :
            return Object.assign({}, state, {
                Scoreboard:Object.assign({}, state.Scoreboard, action.values)
            });

        case Actions.SET_SLIDESHOW :
            return Object.assign({}, state, {
                MainSlideshow:Object.assign({}, state.MainSlideshow, action.values)
            });

        case Actions.SET_SPONSORS :
            return Object.assign({}, state, {
                SponsorSlideshow:Object.assign({}, state.SponsorSlideshow, action.values)
            });

        case Actions.SET_PENALTY_TRACKER :
            return Object.assign({}, state, {
                PenaltyTracker:Object.assign({}, state.PenaltyTracker, action.values)
            });

        case Actions.SET_ANNOUNCERS :
            return Object.assign({}, state, {
                Announcers:Object.assign({}, state.Announcers, action.values)
            });

        case Actions.SET_ANTHEM :
            return Object.assign({}, state, {
                NationalAnthem:Object.assign({}, state.NationalAnthem, action.values)
            });

        case Actions.SET_RAFFLE :
            return Object.assign({}, state, {
                Raffle:Object.assign({}, state.Raffle, action.values)
            });

        case Actions.SET_ROSTER :
            return Object.assign({}, state, {
                Roster:Object.assign({}, state.Roster, action.values)
            });

        case Actions.SET_CONTROL : {
            return Object.assign({}, state, {
                Control:action.value
            });
        }
        
        //toggle slideshow visibility
        case Actions.TOGGLE_SLIDESHOW :
            return Object.assign({}, state, {
                MainSlideshow:Object.assign({}, state.MainSlideshow, {
                    Shown:!state.MainSlideshow.Shown
                })
            });

        case Actions.TOGGLE_SCOREBANNER :
            return Object.assign({}, state, {
                Scoreboard:Object.assign({}, state.Scoreboard, {Shown:false}),
                Scorebanner:Object.assign({}, state.Scorebanner, {Shown:!state.Scorebanner.Shown})
            });

        case Actions.TOGGLE_SCOREBANNER_CLOCKS :
            return Object.assign({}, state, {
                Scoreboard:Object.assign({}, state.Scoreboard, {Shown:false}),
                Scorebanner:Object.assign({}, state.Scorebanner, {ClocksShown:!state.Scorebanner.ClocksShown})
            });


        case Actions.TOGGLE_SCOREBOARD :
            return Object.assign({}, state, {
                Scorebanner:Object.assign({}, state.Scorebanner, {Shown:false}),
                Scoreboard:Object.assign({}, state.Scoreboard, {Shown:!state.Scoreboard.Shown})
            });

        case Actions.TOGGLE_JAM_CLOCK :
            return Object.assign({}, state, {
                Scoreboard:Object.assign({}, state.Scoreboard, {
                    JamClockShown:!state.Scoreboard.JamClockShown
                })
            });

        case Actions.TOGGLE_JAM_COUNTER :
            return Object.assign({}, state, {
                Scoreboard:Object.assign({}, state.Scoreboard, {
                    JamCounterShown:!state.Scoreboard.JamCounterShown
                })
            });

        case Actions.TOGGLE_MAIN_CAMERA :
            return Object.assign({}, state, {
                MainCamera:Object.assign({}, state.MainCamera, {
                    Shown:!state.MainCamera.Shown
                })
            });

        case Actions.TOGGLE_MAIN_VIDEO :
            return Object.assign({}, state, {
                MainVideo:Object.assign({}, state.MainVideo, {
                    Shown:!state.MainVideo.Shown
                })
            });

        case Actions.TOGGLE_SPONSORS :
            return Object.assign({}, state, {
                SponsorSlideshow:Object.assign({}, state.SponsorSlideshow, {
                    Shown:!state.SponsorSlideshow.Shown
                })
            });

        case Actions.TOGGLE_PENALTY_TRACKER :
            return Object.assign({}, state, {
                PenaltyTracker:Object.assign({}, state.PenaltyTracker, {
                    Shown:!state.PenaltyTracker.Shown
                })
            });

        case Actions.TOGGLE_ANNOUNCER :
            return Object.assign({}, state, {
                Announcers:Object.assign({}, state.Announcers, {
                    Shown:!state.Announcers.Shown
                })
            });

        case Actions.TOGGLE_ANTHEM :
            return Object.assign({}, state, {
                NationalAnthem:Object.assign({}, state.NationalAnthem, {
                    Shown:!state.NationalAnthem.Shown
                })
            });

        case Actions.TOGGLE_RAFFLE :
            return Object.assign({}, state, {
                Raffle:Object.assign({}, state.Raffle, {
                    Shown:!state.Raffle.Shown
                })
            });

        case Actions.TOGGLE_ROSTER :
            return Object.assign({}, state, {
                Roster:Object.assign({}, state.Roster, {
                    Shown:!state.Roster.Shown
                })
            });

        case Actions.TOGGLE_SCOREBOARD_LIGHT :
            return Object.assign({}, state, {
                Scoreboard:Object.assign({}, state.Scoreboard, {
                    Light:!state.Scoreboard.Light
                })
            });

        case Actions.TOGGLE_SCOREKEEPER :
            return Object.assign({}, state, {
                Scorekeeper:Object.assign({}, state.Scorekeeper, {
                    Shown:!state.Scorekeeper.Shown
                })
            });

        default :
            return state;
    }
}

const CaptureStore = createStore(CaptureReducer);

interface CaptureTimers {
    Announcers:number,
    Penalty:number
}

/**
 * Timers for auto-hiding elements
 */
const Timers:CaptureTimers = {
    Announcers:0,
    Penalty:0
};

const CaptureController = {
    Key:"CC",
    /**
     * Number of controllers available to the user
     */
    PanelSize:0,

    Init() {
        for(var key in CapturePanels) {
            if(typeof(CapturePanels[key]) === 'number')
                CaptureController.PanelSize++;
        }
    },

    /**
     * Sets the state of the capture controller.
     * @param {Object} state 
     */
    SetState(state:object) {
        CaptureController.getStore().dispatch({
            type:Actions.SET_STATE,
            state:state
        });
    },

    /**
     * Sets the scoreboard visibility.
     * @param {Boolean} value 
     */
    SetScoreboardVisibility(value:boolean) {
        CaptureController.getStore().dispatch({
            type:Actions.SET_SCOREBOARD,
            values:{Shown:value}
        });
    },

    /**
     * Sets the scorebanner visibility.
     * @param {Boolean} value 
     */
    SetScorebannerVisibility(value:boolean) {
        CaptureController.getStore().dispatch({
            type:Actions.SET_SCOREBANNER,
            values:{Shown:value}
        })
    },

    /**
     * Sets the class of the Scorebanner
     * @param {String} value 
     */
    SetScorebannerClassName(value:string) {
        CaptureController.getStore().dispatch({
            type:Actions.SET_SCOREBANNER,
            values:{className:value}
        });
    },

    /**
     * Sets the background image of the scorebanner
     * @param value string
     */
    SetScorebannerBackground(value:string) {
        CaptureController.getStore().dispatch({
            type:Actions.SET_SCOREBANNER,
            values:{BackgroundImage:value}
        });
    },

    /**
     * Sets the main camera visibility.
     * @param {Boolean} value 
     */
    SetMainCameraVisibility(value:boolean) {
        CaptureController.getStore().dispatch({
            type:Actions.SET_CAMERA,
            values:{Shown:value}
        })
    },

    /**
     * Sets the main video visibility.
     * @param {Boolean} value 
     */
    SetMainVideoVisibility(value:boolean) {
        CaptureController.getStore().dispatch({
            type:Actions.SET_VIDEO,
            values:{Shown:value}
        });
    },

    /**
     * Sets the main slideshow visibility.
     * @param {Boolean} value 
     */
    SetMainSlideshowVisibility(value:boolean) {
        CaptureController.getStore().dispatch({
            type:Actions.SET_SLIDESHOW,
            values:{Shown:value}
        });
    },

    /**
     * Sets the slideshow visibility.
     * @param {Boolean} value 
     */
    SetSponsorSlideshowVisibility(value:boolean) {
        CaptureController.getStore().dispatch({
            type:Actions.SET_SPONSORS,
            values:{Shown:value}
        });
    },

    /**
     * Sets the penalty tracker visibility.
     * @param {Boolean} value 
     */
    SetPenaltyTrackerVisibility(value:boolean) {
        CaptureController.getStore().dispatch({
            type:Actions.SET_PENALTY_TRACKER,
            values:{Shown:value}
        });
        if(value === true) {
            Timers.Penalty = startTimeout(Timers.Penalty, () => {
                CaptureController.SetPenaltyTrackerVisibility(false)
            }, CaptureController.getState().PenaltyTracker.Duration);
        }
    },

    /**
     * Sets the national anthem singer visibility.
     * @param {Boolean} value 
     */
    SetNationalAnthemSingerVisibility(value:boolean) {
        CaptureController.getStore().dispatch({
            type:Actions.SET_ANTHEM,
            values:{Shown:value}
        });
    },

    /**
     * Sets the raffle visibility flag.
     * @param {Boolean} value 
     */
    SetRaffleVisibility(value:boolean) {
        CaptureController.getStore().dispatch({
            type:Actions.SET_RAFFLE,
            values:{Shown:value}
        });
    },

    /**
     * Sets the roster visibility flag.
     * @param {Boolean} value 
     */
    SetRosterVisibility(value:boolean) {
        CaptureController.getStore().dispatch({
            type:Actions.SET_ROSTER,
            values:{Shown:value}
        });
    },

    /**
     * Sets the National Anthem singer and bio.
     * @param {Object} record
     */
    SetNationalAnthemSinger(record:object) {
        CaptureController.getStore().dispatch({
            type:Actions.SET_ANTHEM,
            values:{Record:Object.assign({}, record)}
        });
    },

    /**
     * Sets the className of the national anthem singer.
     * - '' (default, full screen)
     * - 'banner' (banner, bottom center)
     * @param {String} name 
     */
    SetNationalAnthemClass(name:string) {
        CaptureController.getStore().dispatch({
            type:Actions.SET_ANTHEM,
            values:{className:name}
        });
    },

    /**
     * Sets the visibility of the jam clock.
     * @param {Boolean} value true|false
     */
    SetJamClockVisibility(value:boolean) {
        CaptureController.getStore().dispatch({
            type:Actions.SET_SCOREBOARD,
            values:{
                JamClockShown:value
            }
        });
    },

    /**
     * Sets the visibility of the jam counter.
     * @param {Boolean} value true|false
     */
    SetJamCounterVisibility(value:boolean) {
        CaptureController.getStore().dispatch({
            type:Actions.SET_SCOREBOARD,
            values:{
                JamCounterShown:value
            }
        });
    },

    /**
     * Set the main video class.
     * @param {String} name 
     */
    SetMainVideoClass(name:string) {
        CaptureController.getStore().dispatch({
            type:Actions.SET_VIDEO,
            values:{
                className:name
            }
        });
    },

    /**
     * Set the main camera class.
     * @param {String} name 
     */
    SetMainCameraClass(name:string) {
        CaptureController.getStore().dispatch({
            type:Actions.SET_CAMERA,
            values:{
                className:name
            }
        });
    },

    /**
     * Sets the duration of the penalty tracker.
     * @param {Number} duration 
     */
    SetPenaltyTrackerDuration(duration:number) {
        CaptureController.getStore().dispatch({
            type:Actions.SET_PENALTY_TRACKER,
            values:{
                Duration:duration
            }
        });
    },

    /**
     * Sets the values of the announcer object.
     * @param {string} announcer1 
     * @param {string} announcer2 
     * @param {string} duration 
     */
    SetAnnouncers(announcer1:string, announcer2:string, duration:number = 7000) {
        DataController.SaveMiscRecord('Announcers', {
            Announcer1:announcer1,
            Announcer2:announcer2
        }).then(() => {
            CaptureController.getStore().dispatch({
                type:Actions.SET_ANNOUNCERS,
                values:{
                    Announcer1:announcer1,
                    Announcer2:announcer2,
                    Duration:duration
                }
            });
        }).catch(() => {

        })
    },

    /**
     * Sets the visibility of the announcer on the capture window
     * @param value boolean
     */
    SetAnnouncerVisibility(value:boolean) {
        CaptureController.getStore().dispatch({
            type:Actions.SET_ANNOUNCERS,
            values:{
                Shown:value
            }
        });
    },

    /**
     * Sets the current control for the capture control form
     * @param control number
     */
    SetCurrentControl(control:number) {
        CaptureController.getStore().dispatch({
            type:Actions.SET_CONTROL,
            value:control
        });
    },

    /**
     * Sets the current stream control for the capture control form
     * @param control string
     */
    SetStreamControl(control:string) {
        CaptureController.getStore().dispatch({
            type:Actions.SET_STREAM_CONTROL,
            value:control
        });
    },

    /**
     * Sets the current display control for the capture control form
     * @param control string
     */
    SetDisplayControl(control:string) {
        CaptureController.getStore().dispatch({
            type:Actions.SET_DISPLAY_CONTROL,
            value:control
        });
    },

    /**
     * Toggles the Main Scoreboard visibility.
     */
    ToggleScoreboard() {
        CaptureController.getStore().dispatch({
            type:Actions.TOGGLE_SCOREBOARD
        });
    },

    /**
     * Toggles the scoreboard from light / dark. (dark is default)
     */
    ToggleScoreboardLight() {
        CaptureController.getStore().dispatch({
            type:Actions.TOGGLE_SCOREBOARD_LIGHT
        });
    },

    /**
     * Toggles the screen-size Jam Clock visibility.
     */
    ToggleJamClock() {
        CaptureController.getStore().dispatch({
            type:Actions.TOGGLE_JAM_CLOCK
        });
    },

    /**
     * Toggles the screen-size Jam Counter visibility.
     */
    ToggleJamCounter() {
        CaptureController.getStore().dispatch({
            type:Actions.TOGGLE_JAM_COUNTER
        });
    },

    /**
     * Toggles the Scorebanner visibility.
     */
    ToggleScorebanner() {
        CaptureController.getStore().dispatch({
            type:Actions.TOGGLE_SCOREBANNER
        });
    },

    /**
     * Toggles the visibility of clocks on the main Scorebanner.
     */
    ToggleScorebannerClocks() {
        CaptureController.getStore().dispatch({
            type:Actions.TOGGLE_SCOREBANNER_CLOCKS
        });
    },

    /**
     * Toggles the Slideshow visibility.
     */
    ToggleSlideshow() {
        CaptureController.getStore().dispatch({
            type:Actions.TOGGLE_SLIDESHOW
        });
    },

    /**
     * Toggles the Sponsor visibility.
     */
    ToggleSponsors() {
        CaptureController.getStore().dispatch({
            type:Actions.TOGGLE_SPONSORS
        });
    },

    /**
     * Toggles the Main Camera visibility.
     */
    ToggleMainCamera() {
        CaptureController.getStore().dispatch({
            type:Actions.TOGGLE_MAIN_CAMERA
        });
    },

    /**
     * Toggles the Main Video visibility.
     */
    ToggleMainVideo() {
        CaptureController.getStore().dispatch({
            type:Actions.TOGGLE_MAIN_VIDEO
        });
    },

    /**
     * Toggles the Penalty Tracker visibility.
     */
    TogglePenaltyTracker() {
        CaptureController.getStore().dispatch({
            type:Actions.TOGGLE_PENALTY_TRACKER
        });
        Timers.Penalty = startTimeout(Timers.Penalty, () => {
            CaptureController.SetPenaltyTrackerVisibility(false)
        }, CaptureController.getState().PenaltyTracker.Duration);
    },

    /**
     * Toggles the National Anthem visibility.
     */
    ToggleNationalAnthem() {
        CaptureController.getStore().dispatch({
            type:Actions.TOGGLE_ANTHEM
        });
    },

    /**
     * Toggles the Announcer visibility.
     */
    ToggleAnnouncers() {
        CaptureController.getStore().dispatch({
            type:Actions.TOGGLE_ANNOUNCER
        });
        Timers.Announcers = startTimeout(Timers.Announcers, () => {
            CaptureController.SetAnnouncerVisibility(false);
        }, CaptureController.getState().Announcers.Duration);
    },

    /**
     * Toggles the Raffle visibility.
     */
    ToggleRaffle() {
        CaptureController.getStore().dispatch({
            type:Actions.TOGGLE_RAFFLE
        });
    },

    /**
     * Toggles the Roster visibility.
     */
    ToggleRoster() {
        CaptureController.getStore().dispatch({
            type:Actions.TOGGLE_ROSTER
        });
    },

    /**
     * Toggles the Scorekeeper visibility.
     */
    ToggleScorekeeper() {
        CaptureController.getStore().dispatch({
            type:Actions.TOGGLE_SCOREKEEPER
        });
    },

    /**
     * Toggles the Sponsor View class.
     */
    ToggleSponsorView() {
        CaptureController.getStore().dispatch({
            type:Actions.TOGGLE_SPONSOR_VIEW
        });
    },

    /**
     * Triggered when the capture controller receives the KeyUp event from the user
     * @param ev KeyEvent
     */
    onKeyUp(ev:any) {

        const state = CaptureController.getState();

        switch(ev.keyCode) {
            case keycodes.PAGEDOWN : {
                CaptureController.__nextControl();
                return;
            }
            break;

            case keycodes.PAGEUP : {
                CaptureController.__prevControl();
                return;
            }
            break;

            case keycodes.V : {
                switch(state.Control) {
                    case CapturePanels.SCOREBOARD :
                        CaptureController.ToggleScorebanner();
                    break;

                    case CapturePanels.ROSTER :
                        CaptureController.ToggleRoster();
                    break;

                    case CapturePanels.ANNOUNCER :
                        CaptureController.ToggleAnnouncers();
                    break;

                    case CapturePanels.ANTHEM :
                        CaptureController.ToggleNationalAnthem();
                    break;

                    case CapturePanels.CAMERA :
                        CaptureController.ToggleMainCamera();
                    break;

                    case CapturePanels.PENALTY :
                        CaptureController.TogglePenaltyTracker();
                    break;

                    case CapturePanels.SCOREKEEPER :
                        CaptureController.ToggleScorekeeper();
                    break;
                }

                return;
            }
            break;

            default : break;
        }

        //send command up to controller
        switch(state.Control) {
            case CapturePanels.SCOREBOARD :
                ScoreboardController.onKeyUp(ev);
            break;
            case CapturePanels.ROSTER :
                RosterController.onKeyUp(ev);
            break;
            default : break;
        }
    },

    /**
     * Triggered when the user presses a controller button
     * @param buttons IGamepadButtonMap
     */
    onGamepadButtonPress(buttons:IGamepadButtonMap) {

        //L3
        if(buttons.L3.pressed) {
            CaptureController.__prevControl();
            return;
        }

        //R3
        if(buttons.R3.pressed) {
            CaptureController.__nextControl();
            return;
        }

        const state = CaptureController.getState();

        //send command up to controller
        switch(state.Control) {
            //Scoreboard / Scorebanner
            case CapturePanels.SCOREBOARD :
                if(buttons.Y.pressed) {
                    CaptureController.ToggleScorebanner();
                    return;
                }
                ScoreboardController.onGamepadButtonPress(buttons);
            break;
            //Roster / Intros
            case CapturePanels.ROSTER :
                RosterController.onGamepadButtonPress(buttons);
            break;

            //Announcers
            case CapturePanels.ANNOUNCER : {
                if(buttons.Y.pressed) {
                    CaptureController.ToggleAnnouncers();
                    return;
                }
            }
            break;

            //National Anthem
            case CapturePanels.ANTHEM : {
                //Toggle visibility
                if(buttons.Y.pressed) {
                    CaptureController.ToggleNationalAnthem();
                    return;
                }

                //Toggle Banner
                if(buttons.B.pressed) {
                    if(state.NationalAnthem.className === 'banner')
                        CaptureController.SetNationalAnthemClass('');
                    else
                        CaptureController.SetNationalAnthemClass('banner');
                    return;
                }

                //select previous anthem singer
                if(buttons.UP.pressed) {
                    let singers:Array<AnthemRecord> = DataController.getAnthemSingers(true);
                    let sindex:number = 0;
                    if(state.NationalAnthem.Record.RecordID > 0) {
                        let index:number = singers.findIndex((singer) => {
                            return (singer.RecordID === state.NationalAnthem.Record.RecordID)
                        });
                        index--;
                        if(index < 0)
                            index = singers.length - 1;
                        sindex = index;
                    } else if(singers.length >= 1) {
                        sindex = 0;
                    }

                    if(singers[sindex] !== undefined)
                        CaptureController.SetNationalAnthemSinger(singers[sindex]);
                    return;
                }

                //select next anthem singer
                if(buttons.DOWN.pressed) {
                    let singers:Array<AnthemRecord> = DataController.getAnthemSingers(true);
                    let sindex:number = 0;
                    if(state.NationalAnthem.Record.RecordID > 0) {
                        let index:number = singers.findIndex((singer) => {
                            return (singer.RecordID === state.NationalAnthem.Record.RecordID)
                        });
                        index++;
                        if(index >= singers.length)
                            index = 0;
                        sindex = index;
                    } else if(singers.length >= 1) {
                        sindex = 0;
                    }

                    if(singers[sindex] !== undefined)
                        CaptureController.SetNationalAnthemSinger(singers[sindex]);
                    return;
                }
            }
            break;

            //Camera
            case CapturePanels.CAMERA : {
                if(buttons.Y.pressed) {
                    CaptureController.ToggleMainCamera();
                    return;
                }
            }
            break;

            //Penalty Tracker
            case CapturePanels.PENALTY : {
                if(buttons.Y.pressed) {
                    CaptureController.TogglePenaltyTracker();
                    return;
                }
            }
            break;

            //Scorekeeper
            case CapturePanels.SCOREKEEPER : {
                if(buttons.Y.pressed) {
                    CaptureController.ToggleScorekeeper();
                    return;
                }
            }
            break;

            default : break;
        }
    },

    /**
     * Triggered when the user holds down a controller button
     * @param buttons IGamepadButtonMap
     */
    onGamepadButtonDown(buttons:IGamepadButtonMap) {
        
    },

    /**
     * Triggered when the control stick value has changed
     * @param buttons IGamepadButtonMap
     */
    onGamepadAxis(buttons:IGamepadAxes) {
        // if(buttons.RSTICK.x === -1 && (buttons.RSTICK.y < 0.2 || buttons.RSTICK.y > -0.2)) {
        //     CaptureController.__prevControl();
        // } else if(buttons.RSTICK.x === 1 && (buttons.RSTICK.y < 0.2 || buttons.RSTICK.y > -0.2)) {
        //     CaptureController.__nextControl();
        // }
    },

    /**
     * Moves control of the keyboard / game controls to the next panel
     */
    __nextControl() {
        let control:number = CaptureController.getState().Control;
        control++;
        if(control >= CaptureController.PanelSize)
            control = 0;
        CaptureController.SetCurrentControl(control);
    },

    /**
     * Moves control of the keyboard / game controls to the previous panel
     */
    __prevControl() {
        let control:number = CaptureController.getState().Control;
        control--;
        if(control < 0)
            control = CaptureController.PanelSize - 1;
        CaptureController.SetCurrentControl(control);
    },
    
    getState() {
        return CaptureStore.getState();
    },

    getStore() {
        return CaptureStore;
    },

    subscribe(f) {
        return CaptureStore.subscribe(f);
    },

    /**
     * Builds the REST API for the Capture Controller
     */
    async buildAPI() {
        const server = window.LocalServer;
        const exp = server.ExpressApp;

        //get state
        exp.get(/^\/api\/capture(\/?)$/i, (req, res) => {
            res.send(server.PrepareObjectForSending(DataController.PrepareObjectForSending(CaptureController.getState())));
            res.end();
        });

        //request to show / hide an element
        //path: /api/capture/[show|hide]/[name]
        exp.get(/^\/api\/capture\/(hide|show|toggle{1})\/([A-Z]{1,30})\/?$/i, (req, res) => {
            if(req.params[0] && req.params[1]) {

                if(req.params[0] === 'toggle') {
                    switch(req.params[1].toString().toLowerCase()) {
                        //main camera
                        case 'camera' :
                            CaptureController.ToggleMainCamera();
                        break;
                        //video
                        case 'video' :
                            CaptureController.ToggleMainVideo();
                        break;
                        //scoreboard
                        case 'scoreboard' :
                            CaptureController.ToggleScoreboard();
                        break;
                        //Scorebanner
                        case 'scorebanner' :
                            CaptureController.ToggleScorebanner();
                        break;
                        //Jam Clock
                        case 'jamclock' :
                            CaptureController.ToggleJamClock();
                        break;
                        //Jam Counter
                        case 'jamcounter' :
                            CaptureController.ToggleJamCounter();
                        break;
                        //National Anthem
                        case 'anthem' :
                            CaptureController.ToggleNationalAnthem();
                        break;
                        //Sponsor Slideshow
                        case 'sponsor' :
                            CaptureController.ToggleSponsors();
                        break;
                        //Raffle
                        case 'raffle' :
                            CaptureController.ToggleRaffle();
                        break;
                        //Penalties
                        case 'penalty' :
                            CaptureController.TogglePenaltyTracker();
                        break;
    
                        default :
                        break;
                    }
                } else {
                    var shown = (req.params[0] === 'show') ? true : false;
                    switch(req.params[1].toString().toLowerCase()) {
                        //main camera
                        case 'camera' :
                            CaptureController.SetMainCameraVisibility(shown);
                        break;
                        //video
                        case 'video' :
                            CaptureController.SetMainVideoVisibility(shown);
                        break;
                        //scoreboard
                        case 'scoreboard' :
                            CaptureController.SetScoreboardVisibility(shown);
                        break;
                        //Scorebanner
                        case 'scorebanner' :
                            CaptureController.SetScorebannerVisibility(shown);
                        break;
                        //Jam Clock
                        case 'jamclock' :
                            CaptureController.SetJamClockVisibility(shown);
                        break;
                        //Jam Counter
                        case 'jamcounter' :
                            CaptureController.SetJamCounterVisibility(shown);
                        break;
                        //National Anthem
                        case 'anthem' :
                            CaptureController.SetNationalAnthemSingerVisibility(shown);
                        break;
                        //Sponsor Slideshow
                        case 'sponsor' :
                            CaptureController.SetSponsorSlideshowVisibility(shown);
                        break;
                        //Raffle
                        case 'raffle' :
                            CaptureController.SetRaffleVisibility(shown);
                        break;
                        //Penalties
                        case 'penalty' :
                            CaptureController.SetPenaltyTrackerVisibility(shown);
                        break;
    
                        default :
                        break;
                    }
                }

                res.send(req.params[0] + "-" + req.params[1]);
            } else {
                res.send("Request not recognized.");
            }
            res.end();
        });
    }
};

export default CaptureController;