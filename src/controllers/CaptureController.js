/**
 * Main controller for the capture window.
 */

import {createStore} from 'redux'
import vars from 'tools/vars';
import DataController from './DataController';
import {startTimeout} from 'tools/functions';

const SET_STATE = 'SET_STATE';
const SET_DISPLAY = 'SET_DISPLAY';
const SET_SCOREBOARD = 'SET_SCOREBOARD';
const SET_SCOREBANNER = 'SET_SCOREBANNER';
const SET_CAMERA = 'SET_CAMERA';
const SET_VIDEO = 'SET_VIDEO';
const SET_SLIDESHOW = 'SET_SLIDESHOW';
const SET_SPONSORS = 'SET_SPONSORS';
const SET_PENALTY_TRACKER = 'SET_PENALTY_TRACKER';
const SET_ANTHEM = 'SET_ANTHEM';
const SET_RAFFLE = 'SET_RAFFLE';
const SET_CLASS_NAME = 'SET_CLASS_NAME';
const SET_ANNOUNCERS = 'SET_ANNOUNCERS';

const TOGGLE_SLIDESHOW = 'TOGGLE_SLIDESHOW';
const TOGGLE_SCOREBOARD = 'TOGGLE_SCOREBOARD';
const TOGGLE_JAM_CLOCK = 'TOGGLE_JAM_CLOCK';
const TOGGLE_JAM_COUNTER = 'TOGGLE_JAM_COUNTER';
const TOGGLE_SCOREBANNER = 'TOGGLE_SCOREBANNER';
const TOGGLE_SCOREBANNER_CLOCKS = 'TOGGLE_SCOREBANNER_CLOCKS';
const TOGGLE_MAIN_CAMERA = 'TOGGLE_MAIN_CAMERA';
const TOGGLE_MAIN_VIDEO = 'TOGGLE_MAIN_VIDEO';
const TOGGLE_SPONSORS = 'TOGGLE_SPONSORS';
const TOGGLE_PENALTY_TRACKER = 'TOGGLE_PENALTY_TRACKER';
const TOGGLE_ANNOUNCER = 'TOGGLE_ANNOUNCER';
const TOGGLE_ANTHEM = 'TOGGLE_ANTHEM';
const TOGGLE_RAFFLE = 'TOGGLE_RAFFLE';
const TOGGLE_ROSTER = 'TOGGLE_ROSTER';
const TOGGLE_SCOREBOARD_LIGHT = 'TOGGLE_SCOREBOARD_LIGHT';
const TOGGLE_SCOREKEEPER = 'TOGGLE_SCOREKEEPER';
const TOGGLE_SPONSOR_VIEW = 'TOGGLE_SPONSOR_VIEW';

const InitState = {
    Source:'',
    className:'',
    Monitor:{
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
        className:'video-def',
        Status:vars.Video.Status.Ready,
        Source:null,
        Volume:0.75,
        Rate:1.0,
        Duration:0,
        CurrentTime:0,
        Muted:true,
        Start:0,
        End:0
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
            Name:'',
            Biography:''
        },
        Name:'',
        Bio:'',
        Background:''
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

function CaptureReducer(state = InitState, action) {
    switch(action.type) {
        //update entire state
        case SET_STATE :
            return Object.assign({}, state, action.state);

        //sets the class name
        case SET_CLASS_NAME :
            return Object.assign({}, state, {className:action.className});

        case TOGGLE_SPONSOR_VIEW :
            if(state.className === 'sponsor-board')
                return Object.assign({}, state, {className:''});
            return Object.assign({}, state, {className:'sponsor-board'});

        //update display options
        case SET_DISPLAY :
            return Object.assign({}, state, {
                Display:Object.assign({}, state.Display, action.Display)
            });

        case SET_CAMERA :
            return Object.assign({}, state, {
                MainCamera:Object.assign({}, state.MainCamera, action.values)
            });

        case SET_VIDEO :
            return Object.assign({}, state, {
                MainVideo:Object.assign({}, state.MainVideo, action.values)
            });

        case SET_SCOREBANNER :
            return Object.assign({}, state, {
                Scorebanner:Object.assign({}, state.Scorebanner, action.values)
            });

        case SET_SCOREBOARD :
            return Object.assign({}, state, {
                Scoreboard:Object.assign({}, state.Scoreboard, action.values)
            });

        case SET_SLIDESHOW :
            return Object.assign({}, state, {
                MainSlideshow:Object.assign({}, state.MainSlideshow, action.values)
            });

        case SET_SPONSORS :
            return Object.assign({}, state, {
                SponsorSlideshow:Object.assign({}, state.SponsorSlideshow, action.values)
            });

        case SET_PENALTY_TRACKER :
            return Object.assign({}, state, {
                PenaltyTracker:Object.assign({}, state.PenaltyTracker, action.values)
            });

        case SET_ANNOUNCERS :
            return Object.assign({}, state, {
                Announcers:Object.assign({}, state.Announcers, action.values)
            });

        case SET_ANTHEM :
            return Object.assign({}, state, {
                NationalAnthem:Object.assign({}, state.NationalAnthem, action.values)
            });

        case SET_RAFFLE :
            return Object.assign({}, state, {
                Raffle:Object.assign({}, state.Raffle, action.values)
            });
        
        //toggle slideshow visibility
        case TOGGLE_SLIDESHOW :
            return Object.assign({}, state, {
                MainSlideshow:Object.assign({}, state.MainSlideshow, {
                    Shown:!state.MainSlideshow.Shown
                })
            });

        case  TOGGLE_SCOREBANNER :
            return Object.assign({}, state, {
                Scoreboard:Object.assign({}, state.Scoreboard, {Shown:false}),
                Scorebanner:Object.assign({}, state.Scorebanner, {Shown:!state.Scorebanner.Shown})
            });

        case TOGGLE_SCOREBANNER_CLOCKS :
            return Object.assign({}, state, {
                Scoreboard:Object.assign({}, state.Scoreboard, {Shown:false}),
                Scorebanner:Object.assign({}, state.Scorebanner, {ClocksShown:!state.Scorebanner.ClocksShown})
            });


        case  TOGGLE_SCOREBOARD :
            return Object.assign({}, state, {
                Scorebanner:Object.assign({}, state.Scorebanner, {Shown:false}),
                Scoreboard:Object.assign({}, state.Scoreboard, {Shown:!state.Scoreboard.Shown})
            });

        case TOGGLE_JAM_CLOCK :
            return Object.assign({}, state, {
                Scoreboard:Object.assign({}, state.Scoreboard, {
                    JamClockShown:!state.Scoreboard.JamClockShown
                })
            });

        case TOGGLE_JAM_COUNTER :
            return Object.assign({}, state, {
                Scoreboard:Object.assign({}, state.Scoreboard, {
                    JamCounterShown:!state.Scoreboard.JamCounterShown
                })
            });

        case TOGGLE_MAIN_CAMERA :
            return Object.assign({}, state, {
                MainCamera:Object.assign({}, state.MainCamera, {
                    Shown:!state.MainCamera.Shown
                })
            });

        case TOGGLE_MAIN_VIDEO :
            return Object.assign({}, state, {
                MainVideo:Object.assign({}, state.MainVideo, {
                    Shown:!state.MainVideo.Shown
                })
            });

        case TOGGLE_SPONSORS :
            return Object.assign({}, state, {
                SponsorSlideshow:Object.assign({}, state.SponsorSlideshow, {
                    Shown:!state.SponsorSlideshow.Shown
                })
            });

        case TOGGLE_PENALTY_TRACKER :
            return Object.assign({}, state, {
                PenaltyTracker:Object.assign({}, state.PenaltyTracker, {
                    Shown:!state.PenaltyTracker.Shown
                })
            });

        case TOGGLE_ANNOUNCER :
            return Object.assign({}, state, {
                Announcers:Object.assign({}, state.Announcers, {
                    Shown:!state.Announcers.Shown
                })
            });

        case TOGGLE_ANTHEM :
            return Object.assign({}, state, {
                NationalAnthem:Object.assign({}, state.NationalAnthem, {
                    Shown:!state.NationalAnthem.Shown
                })
            });

        case TOGGLE_RAFFLE :
            return Object.assign({}, state, {
                Raffle:Object.assign({}, state.Raffle, {
                    Shown:!state.Raffle.Shown
                })
            });

        case TOGGLE_ROSTER :
            return Object.assign({}, state, {
                Roster:Object.assign({}, state.Roster, {
                    Shown:!state.Roster.Shown
                })
            });

        case TOGGLE_SCOREBOARD_LIGHT :
            return Object.assign({}, state, {
                Scoreboard:Object.assign({}, state.Scoreboard, {
                    Light:!state.Scoreboard.Light
                })
            });

        case TOGGLE_SCOREKEEPER :
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

/**
 * Timers for auto-hiding elements
 */
const Timers = {
    Announcers:null,
    Penalty:null
};

const CaptureController = {
    Key:"CC",

    /**
     * Sets the state of the capture controller.
     * @param {Object} state 
     */
    SetState(state) {
        CaptureController.getStore().dispatch({
            type:SET_STATE,
            state:state
        });
    },

    /**
     * Sets the scoreboard visibility.
     * @param {Boolean} value 
     */
    SetScoreboardVisibility(value) {
        CaptureController.getStore().dispatch({
            type:SET_SCOREBOARD,
            values:{Shown:value}
        });
    },

    /**
     * Sets the scorebanner visibility.
     * @param {Boolean} value 
     */
    SetScorebannerVisibility(value) {
        CaptureController.getStore().dispatch({
            type:SET_SCOREBANNER,
            values:{Shown:value}
        })
    },

    /**
     * Sets the class of the Scorebanner
     * @param {String} value 
     */
    SetScorebannerClassName(value) {
        CaptureController.getStore().dispatch({
            type:SET_SCOREBANNER,
            values:{className:value}
        });
    },

    /**
     * Sets the main camera visibility.
     * @param {Boolean} value 
     */
    SetMainCameraVisibility(value) {
        CaptureController.getStore().dispatch({
            type:SET_CAMERA,
            values:{Shown:value}
        })
    },

    /**
     * Sets the main video visibility.
     * @param {Boolean} value 
     */
    SetMainVideoVisibility(value) {
        CaptureController.getStore().dispatch({
            type:SET_VIDEO,
            values:{Shown:value}
        });
    },

    /**
     * Sets the main slideshow visibility.
     * @param {Boolean} value 
     */
    SetMainSlideshowVisibility(value) {
        CaptureController.getStore().dispatch({
            type:SET_SLIDESHOW,
            values:{Shown:value}
        });
    },

    /**
     * Sets the slideshow visibility.
     * @param {Boolean} value 
     */
    SetSponsorSlideshowVisibility(value) {
        CaptureController.getStore().dispatch({
            type:SET_SPONSORS,
            values:{Shown:value}
        });
    },

    /**
     * Sets the penalty tracker visibility.
     * @param {Boolean} value 
     */
    SetPenaltyTrackerVisibility(value) {
        CaptureController.getStore().dispatch({
            type:SET_PENALTY_TRACKER,
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
    SetNationalAnthemSingerVisibility(value) {
        CaptureController.getStore().dispatch({
            type:SET_ANTHEM,
            values:{Shown:value}
        });
    },

    /**
     * Sets the raffle visibility flag.
     * @param {Boolean} value 
     */
    SetRaffleVisibility(value) {
        CaptureController.getStore().dispatch({
            type:SET_RAFFLE,
            values:{Shown:value}
        });
    },

    /**
     * Sets the National Anthem singer and bio.
     * @param {Object} record
     */
    SetNationalAnthemSinger(record) {
        CaptureController.getStore().dispatch({
            type:SET_ANTHEM,
            values:{Record:record}
        });
    },

    /**
     * Sets the className of the national anthem singer.
     * - '' (default, full screen)
     * - 'banner' (banner, bottom center)
     * @param {String} name 
     */
    SetNationalAnthemClass(name) {
        CaptureController.getStore().dispatch({
            type:SET_ANTHEM,
            values:{className:name}
        });
    },

    /**
     * Sets the visibility of the jam clock.
     * @param {Boolean} value true|false
     */
    SetJamClockVisibility(value) {
        CaptureController.getStore().dispatch({
            type:SET_SCOREBOARD,
            values:{
                JamClockShown:value
            }
        });
    },

    /**
     * Sets the visibility of the jam counter.
     * @param {Boolean} value true|false
     */
    SetJamCounterVisibility(value) {
        CaptureController.getStore().dispatch({
            type:SET_SCOREBOARD,
            values:{
                JamCounterShown:value
            }
        });
    },

    /**
     * Set the main video class.
     * @param {String} name 
     */
    SetMainVideoClass(name) {
        CaptureController.getStore().dispatch({
            type:SET_VIDEO,
            values:{
                className:name
            }
        });
    },

    /**
     * Set the main camera class.
     * @param {String} name 
     */
    SetMainCameraClass(name) {
        CaptureController.getStore().dispatch({
            type:SET_CAMERA,
            values:{
                className:name
            }
        });
    },

    /**
     * Sets the duration of the penalty tracker.
     * @param {Number} duration 
     */
    SetPenaltyTrackerDuration(duration) {
        CaptureController.getStore().dispatch({
            type:SET_PENALTY_TRACKER,
            values:{
                Duration:duration
            }
        });
    },

    /**
     * Sets the values of the announcer object.
     * @param {Object} values 
     */
    async SetAnnouncers(values) {
        CaptureController.getStore().dispatch({
            type:SET_ANNOUNCERS,
            values:values
        });
    },

    /**
     * Toggles the Main Scoreboard visibility.
     */
    async ToggleScoreboard() {
        CaptureController.getStore().dispatch({
            type:TOGGLE_SCOREBOARD
        });
    },

    /**
     * Toggles the scoreboard from light / dark. (dark is default)
     */
    async ToggleScoreboardLight() {
        CaptureController.getStore().dispatch({
            type:TOGGLE_SCOREBOARD_LIGHT
        });
    },

    /**
     * Toggles the screen-size Jam Clock visibility.
     */
    async ToggleJamClock() {
        CaptureController.getStore().dispatch({
            type:TOGGLE_JAM_CLOCK
        });
    },

    /**
     * Toggles the screen-size Jam Counter visibility.
     */
    async ToggleJamCounter() {
        CaptureController.getStore().dispatch({
            type:TOGGLE_JAM_COUNTER
        });
    },

    /**
     * Toggles the Scorebanner visibility.
     */
    async ToggleScorebanner() {
        CaptureController.getStore().dispatch({
            type:TOGGLE_SCOREBANNER
        });
    },

    /**
     * Toggles the visibility of clocks on the main Scorebanner.
     */
    async ToggleScorebannerClocks() {
        CaptureController.getStore().dispatch({
            type:TOGGLE_SCOREBANNER_CLOCKS
        });
    },

    /**
     * Toggles the Slideshow visibility.
     */
    async ToggleSlideshow() {
        CaptureController.getStore().dispatch({
            type:TOGGLE_SLIDESHOW
        });
    },

    /**
     * Toggles the Sponsor visibility.
     */
    async ToggleSponsors() {
        CaptureController.getStore().dispatch({
            type:TOGGLE_SPONSORS
        });
    },

    /**
     * Toggles the Main Camera visibility.
     */
    async ToggleMainCamera() {
        CaptureController.getStore().dispatch({
            type:TOGGLE_MAIN_CAMERA
        });
    },

    /**
     * Toggles the Main Video visibility.
     */
    async ToggleMainVideo() {
        CaptureController.getStore().dispatch({
            type:TOGGLE_MAIN_VIDEO
        });
    },

    /**
     * Toggles the Penalty Tracker visibility.
     */
    async TogglePenaltyTracker() {
        CaptureController.getStore().dispatch({
            type:TOGGLE_PENALTY_TRACKER
        });
        Timers.Penalty = startTimeout(Timers.Penalty, () => {
            CaptureController.SetPenaltyTrackerVisibility(false)
        }, CaptureController.getState().PenaltyTracker.Duration);
    },

    /**
     * Toggles the National Anthem visibility.
     */
    async ToggleNationalAnthem() {
        CaptureController.getStore().dispatch({
            type:TOGGLE_ANTHEM
        });
    },

    /**
     * Toggles the Announcer visibility.
     */
    async ToggleAnnouncers() {
        CaptureController.getStore().dispatch({
            type:TOGGLE_ANNOUNCER
        });
        Timers.Announcers = startTimeout(Timers.Announcers, () => {
            CaptureController.SetAnnouncers({Shown:false});
        }, CaptureController.getState().Announcers.Duration);
    },

    /**
     * Toggles the Raffle visibility.
     */
    async ToggleRaffle() {
        CaptureController.getStore().dispatch({
            type:TOGGLE_RAFFLE
        });
    },

    /**
     * Toggles the Roster visibility.
     */
    async ToggleRoster() {
        CaptureController.getStore().dispatch({
            type:TOGGLE_ROSTER
        });
    },

    /**
     * Toggles the Scorekeeper visibility.
     */
    async ToggleScorekeeper() {
        CaptureController.getStore().dispatch({
            type:TOGGLE_SCOREKEEPER
        });
    },

    /**
     * Toggles the Sponsor View class.
     */
    async ToggleSponsorView() {
        CaptureController.getStore().dispatch({
            type:TOGGLE_SPONSOR_VIEW
        });
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
    buildAPI() {
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

        //control classes
        //path: /api/capture/class/[name]/[className]
        //example: /api/capture/class/camera/video-def (sets camera to default class)
    }
};

export default CaptureController;