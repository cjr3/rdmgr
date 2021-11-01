import { SUIController, ConfigScoreboard, ConfigColors, ConfigMisc, Config, CaptureSection, VideoStatus, VideoConfig, SCaptureAutoSlideshow, SCapture, SCaptureSchedule, SCaptureStandings, SCaptureRoster, SScorekeeperReel, CameraConfig, OBSSceneCollection } from "./vars";
import { createStore, Unsubscribe } from "redux";
import * as OBS from './obs';
import Data from './data';
import { SceneItem } from "obs-websocket-js";

const InitState:SUIController = {
    Capture:{
        Announcers:{
            backgroundImage:'',
            className:'',
            updateTime:0,
            visible:false,
            obsSettings:[],
        },
        Anthem:{
            backgroundImage:'',
            className:'',
            updateTime:0,
            visible:false,
            obsSettings:[],
        },
        AutoSlideshow:{
            className:'',
            status:false,
            slides:[],
            updateTime:0,
            visible:false,
            obsSettings:[],
        },
        GameClock:{
            className:'',
            updateTime:0,
            visible:true,
            obsSettings:[],
        },
        JamClock:{
            className:'',
            updateTime:0,
            visible:true,
            obsSettings:[]
        },
        JamCounter:{
            className:'',
            updateTime:0,
            visible:true,
            obsSettings:[]
        },
        PenaltyTracker:{
            className:'',
            visible:false,
            updateTime:0,
            obsSettings:[]
        },
        Raffle:{
            className:'',
            updateTime:0,
            visible:false,
            obsSettings:[]
        },
        Roster:{
            className:'',
            visible:true,
            updateTime:0,
            obsSettings:[]
        },
        Schedule:{
            className:'',
            bouts:[],
            seasonId:0,
            visible:false,
            obsSettings:[]
        },
        Scorebanner:{
            className:'',
            visible:false,
            updateTime:0,
            obsSettings:[]
        },
        Scoreboard:{
            className:'',
            visible:false,
            updateTime:0,
            obsSettings:[]
        },
        Scorekeeper:{
            className:'',
            visible:false,
            updateTime:0,
            obsSettings:[]
        },
        Slideshow:{
            className:'',
            visible:false,
            updateTime:0,
            obsSettings:[]
        },
        Standings:{
            className:'',
            visible:false,
            updateTime:0,
            seasonId:0,
            standings:[],
            obsSettings:[]
        }
    },
    Config:{
        Colors:{
            Active:'#009900',
            Background:'#000000',
            Calls:'#0099CC',
            CaptureBackground:'#000000',
            Danger:'#990000',
            Elements:'rgb(32, 26, 51)',
            Foreground:'#FFFFFF',
            Neutral:'#999999',
            Ready:'#009900',
            Stop:'#990000',
            Warning:'#CC9900'
        },
        Misc:{
            AppCode:'SB',
            AppMode:'',
            LeagueLogo:'',
            Mode:'stream'
        },
        Scoreboard:{
            LabelChallenges:'CHALLENGE',
            LabelInjury:'INJURY',
            LabelLeadJammer:'LEAD JAMMER',
            LabelOfficialTimeout:'OFFICIAL TIMEOUT',
            LabelOverturned:'CALL OVERTURNED',
            LabelPowerJam:'POWER JAM',
            LabelReview:'OFFICIAL REVIEW',
            LabelTimeouts:'TIMEOUT',
            LabelUpheld:'CALL UPHELD',
            MaxTeamChallenges:2,
            MaxTeamTimeouts:3
        }
    },
    MainCamera:{
        className:'',
        deviceId:'',
        height:720,
        width:1280,
        status:VideoStatus.PLAYING,
        visible:false
    },
    MainVideo:{
        AutoPlay:true,
        className:'',
        Controls:false,
        CurrentTime:0,
        Duration:0,
        Loop:false,
        Muted:false,
        Source:'',
        Status:VideoStatus.STOPPED,
        Volume:0.75
    },
    OBSSettings:{
        Connected:false,
        CurrentSceneId:0,
        CurrentSceneName:'',
        CurrentSourceId:0,
        CurrentSourceName:''
    },
    OBSScenes:{
        currentScene:"",
        messageId:"",
        scenes:[],
        status:""
    },
    OBSSceneItems:{},
    ScorekeeperReel:{
        indexA:-1,
        indexB:-1,
        skaterA:-1,
        skaterB:-1,
        visible:false
    },
    UpdateTimeConfig:0,
    UpdateTimeOBS:0,
    UpdateTimeOBSScenes:0
};

enum Actions {
    SET_CONFIG,
    SET_OBS_CONNECTION,
    SET_OBS_CURRENT_SCENE,
    SET_OBS_CURRENT_SOURCE,
    SET_OBS_SCENES,
    SET_OBS_SCENE_ITEMS,
    SET_SCOREKEEPER_REEL,
    UPDATE_AUTO_SLIDESHOW,
    UPDATE_CAPTURE,
    UPDATE_CAPTURE_ANNOUNCER,
    UPDATE_CAPTURE_ANTHEM,
    UPDATE_CAPTURE_GAMECLOCK,
    UPDATE_CAPTURE_JAMCLOCK,
    UPDATE_CAPTURE_JAMCOUNTER,
    UPDATE_CAPTURE_PENALTY,
    UPDATE_CAPTURE_ROSTER,
    UPDATE_CAPTURE_RAFFLE,
    UPDATE_CAPTURE_SCHEDULE,
    UPDATE_CAPTURE_SCOREBANNER,
    UPDATE_CAPTURE_SCOREBOARD,
    UPDATE_CAPTURE_SCOREKEEPER,
    UPDATE_CAPTURE_SLIDESHOW,
    UPDATE_CAPTURE_STANDINGS,
    UPDATE_CONFIG_COLORS,
    UPDATE_CONFIG_MISC,
    UPDATE_CONFIG_SCOREBOARD,
    UPDATE_MAIN_CAMERA,
    UPDATE_MAIN_VIDEO
}

/**
 * 
 * @param state 
 * @param values 
 * @returns 
 */
const SetConfig = (state:SUIController, values:Config) : SUIController => {
    return {
        ...state,
        Config:{
            ...state.Config,
            ...values,
        }
    }
};

/**
 * 
 * @param state 
 * @param values
 * @returns 
 */
const SetScorekeeperReel = (state:SUIController, values:SScorekeeperReel) : SUIController => {
    return {
        ...state,
        ScorekeeperReel:{
            ...state.ScorekeeperReel,
            ...values
        }
    };
}

/**
 * Update auto-slideshow state
 * @param state 
 * @param values 
 * @returns 
 */
const UpdateAutoSlideshow = (state:SUIController, values:SCaptureAutoSlideshow) : SUIController => {
    return {...state, Capture:{...state.Capture, AutoSlideshow:{...state.Capture.AutoSlideshow, ...values, updateTime:Date.now()}}};
};

/**
 * Update the capture state.
 * @param state 
 * @param values 
 * @returns 
 */
const UpdateCapture = (state:SUIController, values:SCapture) : SUIController => {
    const time = Date.now();
    // console.log(values);
    return {
        ...state,
        Capture:{
            ...state.Capture,
            ...values,
            Announcers:{
                ...state.Capture.Announcers,
                ...values.Announcers,
                updateTime:time
            },
            Anthem:{
                ...state.Capture.Anthem,
                ...values.Anthem,
                updateTime:time
            },
            AutoSlideshow:{
                ...state.Capture.AutoSlideshow,
                ...values.AutoSlideshow,
                updateTime:time
            },
            GameClock:{
                ...state.Capture.GameClock,
                ...values.GameClock,
                updateTime:time
            },
            JamClock:{
                ...state.Capture.JamClock,
                ...values.JamClock,
                updateTime:time
            },
            JamCounter:{
                ...state.Capture.JamCounter,
                ...values.JamCounter,
                updateTime:time
            },
            PenaltyTracker:{
                ...state.Capture.PenaltyTracker,
                ...values.PenaltyTracker,
                updateTime:time
            },
            Raffle:{
                ...state.Capture.Raffle,
                ...values.Raffle,
                updateTime:time
            },
            Roster:{
                ...state.Capture.Roster,
                ...values.Roster,
                updateTime:time
            },
            Schedule:{
                ...state.Capture.Schedule,
                ...values.Schedule,
                updateTime:time
            },
            Scorebanner:{
                ...state.Capture.Scorebanner,
                ...values.Scorebanner,
                updateTime:time
            },
            Scoreboard:{
                ...state.Capture.Scoreboard,
                ...values.Scoreboard,
                updateTime:time
            },
            Scorekeeper:{
                ...state.Capture.Scorekeeper,
                ...values.Scorekeeper,
                updateTime:time
            },
            Slideshow:{
                ...state.Capture.Slideshow,
                ...values.Slideshow,
                updateTime:time
            },
            Standings:{
                ...state.Capture.Standings,
                ...values.Standings,
                updateTime:time
            }
        }
    }
}

/**
 * 
 * @param state 
 * @param values 
 * @returns 
 */
const UpdateCaptureAnnnouncers = (state:SUIController, values:CaptureSection) : SUIController => {
    return {...state, Capture:{...state.Capture, Announcers:{...state.Capture.Announcers, ...values, updateTime:Date.now()}}};
}

/**
 * 
 * @param state 
 * @param values 
 * @returns 
 */
const UpdateCaptureAnthem = (state:SUIController, values:CaptureSection) : SUIController => {
    return {...state, Capture:{...state.Capture, Anthem:{...state.Capture.Anthem, ...values, updateTime:Date.now()}}};
}

/**
 * 
 * @param state 
 * @param values 
 * @returns 
 */
const UpdateCaptureGameClock = (state:SUIController, values:CaptureSection) : SUIController => {
    return {...state, Capture:{...state.Capture, GameClock:{...state.Capture.GameClock, ...values, updateTime:Date.now()}}};
};

/**
 * 
 * @param state 
 * @param values 
 * @returns 
 */
const UpdateCaptureJamClock = (state:SUIController, values:CaptureSection) : SUIController => {
    return {...state, Capture:{...state.Capture, JamClock:{...state.Capture.JamClock, ...values, updateTime:Date.now()}}};
};

/**
 * 
 * @param state 
 * @param values 
 * @returns 
 */
const UpdateCaptureJamCounter = (state:SUIController, values:CaptureSection) : SUIController => {
    return {...state, Capture:{...state.Capture, JamCounter:{...state.Capture.JamCounter, ...values, updateTime:Date.now()}}};
};

/**
 * Update the penalty capture state.
 * @param state 
 * @param values 
 * @returns 
 */
const UpdateCapturePenalty = (state:SUIController, values:CaptureSection) : SUIController => {
    return {...state, Capture:{ ...state.Capture, PenaltyTracker:{...state.Capture.PenaltyTracker, ...values, updateTime:Date.now()}}};
};

/**
 * Update raffle state
 * @param state 
 * @param values 
 * @returns 
 */
const UpdateCaptureRaffle = (state:SUIController, values:CaptureSection) : SUIController => {
    return {...state, Capture:{...state.Capture, Raffle:{...state.Capture.Raffle, ...values, updateTime:Date.now()}}};
}

/**
 * 
 * @param state 
 * @param values 
 * @returns 
 */
const UpdateCaptureRoster = (state:SUIController, values:SCaptureRoster) : SUIController => {
    return {...state, Capture:{ ...state.Capture, Roster:{...state.Capture.Roster, ...values, updateTime:Date.now()}}};
};

/**
 * Update the schedule capture state.
 * @param state 
 * @param values 
 * @returns 
 */
const UpdateCaptureSchedule = (state:SUIController, values:SCaptureSchedule) : SUIController => {
    return {...state, Capture:{ ...state.Capture, Schedule:{...state.Capture.Schedule, ...values, updateTime:Date.now()}}};
};

/**
 * Update the scorebanner capture state.
 * @param state 
 * @param values 
 * @returns 
 */
const UpdateCaptureScorebanner = (state:SUIController, values:CaptureSection) : SUIController => {
    return {...state, Capture:{ ...state.Capture, Scorebanner:{...state.Capture.Scorebanner, ...values, updateTime:Date.now()}}};
};

/**
 * Update the scoreboard capture state.
 * @param state 
 * @param values 
 * @returns 
 */
const UpdateCaptureScoreboard = (state:SUIController, values:CaptureSection) : SUIController => {
    return {...state, Capture:{ ...state.Capture, Scoreboard:{...state.Capture.Scoreboard, ...values, updateTime:Date.now()}}};
};

/**
 * Update the scorekeeper capture state.
 * @param state 
 * @param values 
 * @returns 
 */
const UpdateCaptureScorekeeper = (state:SUIController, values:CaptureSection) : SUIController => {
    return {...state, Capture:{ ...state.Capture, Scorekeeper:{...state.Capture.Scorekeeper, ...values, updateTime:Date.now()}}};
};


/**
 * Update the slideshow capture state.
 * @param state 
 * @param values 
 * @returns 
 */
const UpdateCaptureSlideshow = (state:SUIController, values:CaptureSection) : SUIController => {
    return {...state, Capture:{ ...state.Capture, Slideshow:{...state.Capture.Slideshow, ...values, updateTime:Date.now()}}};
};

/**
 * Update the standings capture state.
 * @param state 
 * @param values 
 * @returns 
 */
const UpdateCaptureStandings = (state:SUIController, values:SCaptureStandings) : SUIController => {
    return {...state, Capture:{...state.Capture, Standings:{...state.Capture.Standings, ...values, updateTime:Date.now()}}};
};

/**
 * Update color configuration
 * @param state 
 * @param values 
 * @returns 
 */
const UpdateConfigColors = (state:SUIController, values:ConfigColors) : SUIController => {
    return {...state, Config:{
        ...state.Config,
        Colors:{
            ...state.Config.Colors,
            ...values
        }
    }};
};

/**
 * Update misc configuration
 * @param state 
 * @param values 
 * @returns 
 */
const UpdateConfigMisc = (state:SUIController, values:ConfigMisc) : SUIController => {
    return {...state, Config:{
        ...state.Config,
        Misc:{
            ...state.Config.Misc,
            ...values
        }
    }};
};

/**
 * Update scoreboard configuration
 * @param state 
 * @param values 
 * @returns 
 */
const UpdateConfigScoreboard = (state:SUIController, values:ConfigScoreboard) : SUIController => {
    return {...state, Config:{
        ...state.Config,
        Scoreboard:{
            ...state.Config.Scoreboard,
            ...values
        }
    }};
};

/**
 * Update main camera state.
 * @param state 
 * @param values 
 * @returns 
 */
const UpdateMainCamera = (state:SUIController, values:CameraConfig) : SUIController => {
    return {
        ...state,
        MainCamera:{
            ...state.MainCamera,
            ...values
        }
    }
};

/**
 * Update the values of the main video.
 * These values should only be used for display purposes, and controls should be sent via IPC.
 * @param state 
 * @param values 
 * @returns 
 */
const UpdateMainVideo = (state:SUIController, values:VideoConfig) : SUIController => {
    return {
        ...state,
        MainVideo:{
            ...state.MainVideo,
            ...values
        }
    };
};

/**
 * Main reducer for UI Controller
 * @param state 
 * @param action 
 * @returns 
 */
const MainReducer = (state:SUIController = InitState, action:any) : SUIController => {
    try {
        switch(action.type) {
            case Actions.SET_CONFIG : return SetConfig(state, action.values);
            case Actions.SET_OBS_CONNECTION : return OBS.SetConnected(state, action.flag);
            case Actions.SET_OBS_CURRENT_SCENE : return OBS.SetCurrentScene(state, action.name, action.id);
            case Actions.SET_OBS_CURRENT_SOURCE : return OBS.SetCurrentSource(state, action.name, action.id, action.sceneName, action.sceneId);
            case Actions.SET_OBS_SCENES : return OBS.SetSceneCollection(state, action.value);
            case Actions.SET_OBS_SCENE_ITEMS : return OBS.SetSceneItems(state, action.key, action.items);
            case Actions.SET_SCOREKEEPER_REEL : return SetScorekeeperReel(state, action.values);

            case Actions.UPDATE_AUTO_SLIDESHOW : return UpdateAutoSlideshow(state, action.values);
            case Actions.UPDATE_CAPTURE : return UpdateCapture(state, action.values);
            case Actions.UPDATE_CAPTURE_ANNOUNCER : return UpdateCaptureAnnnouncers(state, action.values);
            case Actions.UPDATE_CAPTURE_ANTHEM : return UpdateCaptureAnthem(state, action.values);
            case Actions.UPDATE_CAPTURE_GAMECLOCK : return UpdateCaptureGameClock(state, action.values);
            case Actions.UPDATE_CAPTURE_JAMCLOCK : return UpdateCaptureJamClock(state, action.values);
            case Actions.UPDATE_CAPTURE_JAMCOUNTER : return UpdateCaptureJamCounter(state, action.values);
            case Actions.UPDATE_CAPTURE_PENALTY : return UpdateCapturePenalty(state, action.values);
            case Actions.UPDATE_CAPTURE_RAFFLE : return UpdateCaptureRaffle(state, action.values);
            case Actions.UPDATE_CAPTURE_ROSTER : return UpdateCaptureRoster(state, action.values);
            case Actions.UPDATE_CAPTURE_SCHEDULE : return UpdateCaptureSchedule(state, action.values);
            case Actions.UPDATE_CAPTURE_SCOREBANNER : return UpdateCaptureScorebanner(state, action.values);
            case Actions.UPDATE_CAPTURE_SCOREBOARD : return UpdateCaptureScoreboard(state, action.values);
            case Actions.UPDATE_CAPTURE_SCOREKEEPER : return UpdateCaptureScorekeeper(state, action.values);
            case Actions.UPDATE_CAPTURE_SLIDESHOW : return UpdateCaptureSlideshow(state, action.values);
            case Actions.UPDATE_CAPTURE_STANDINGS : return UpdateCaptureStandings(state, action.values);

            case Actions.UPDATE_CONFIG_COLORS : return UpdateConfigColors(state, action.values);
            case Actions.UPDATE_CONFIG_MISC : return UpdateConfigMisc(state, action.values);
            case Actions.UPDATE_CONFIG_SCOREBOARD : return UpdateConfigScoreboard(state, action.values);

            case Actions.UPDATE_MAIN_CAMERA : return UpdateMainCamera(state, action.values);
            case Actions.UPDATE_MAIN_VIDEO : return UpdateMainVideo(state, action.values);
            default : return state;
        }
    } catch(er) {

    }

    return state;
};

const MainStore = createStore(MainReducer);

/**
 * UI Controller
 */
class Controller {

    /**
     * Get the current state
     * @returns 
     */
    GetState = () : SUIController => MainStore.getState();

    /**
     * 
     * @returns 
     */
    Load = () : Promise<boolean> => {
        return new Promise(async (res) => {
            try {
                const values = await Data.LoadConfig();
                MainStore.dispatch({
                    type:Actions.SET_CONFIG,
                    values:values
                });
            } catch(er) {

            }

            try {
                const values = await Data.LoadCapture();
                MainStore.dispatch({
                    type:Actions.UPDATE_CAPTURE,
                    values:values
                });
            } catch(er) {

            }

            return res(true);
        });
    };

    /**
     * Set OBS Connection flag
     * @param flag true if connected, false if not connected
     */
    SetOBSConnection = (flag:boolean) => {
        MainStore.dispatch({
            type:Actions.SET_OBS_CONNECTION,
            flag:flag
        });
    }

    /**
     * Set current OBS Scene
     * @param name 
     */
    SetOBSCurrentScene = (name:string) => {
        MainStore.dispatch({
            type:Actions.SET_OBS_CURRENT_SCENE,
            name:name,
            id:0
        });
    };

    /**
     * Set current OBS Source
     * @param name 
     * @param id 
     */
    SetOBSCurrentSource = (name:string, id:number) => {
        MainStore.dispatch({
            type:Actions.SET_OBS_CURRENT_SCENE,
            name:name,
            id:id
        });
    };

    /**
     * Set Scenes collection.
     * @param value 
     */
    SetOBSScenes = (value:OBSSceneCollection) => {
        MainStore.dispatch({
            type:Actions.SET_OBS_SCENES,
            value:value
        })
    };

    /**
     * 
     * @param key 
     * @param items 
     */
    SetOBSSceneItems = (key:string, items:SceneItem[]) => {
        MainStore.dispatch({
            type:Actions.SET_OBS_SCENE_ITEMS,
            key:key,
            items:items
        })
    }

    /**
     * Update scorekeeper reel values
     * @param values
     */
    SetScorekeeperReel = (values:SScorekeeperReel) => {
        MainStore.dispatch({
            type:Actions.SET_SCOREKEEPER_REEL,
            values:values
        });
    }

    /**
     * Subscribe to changes from the state.
     * @param f 
     * @returns 
     */
    Subscribe = (f:{():void}) : Unsubscribe => MainStore.subscribe(f);

    /**
     * 
     * @param values 
     */
    UpdateAutoSlideshow = (values:SCaptureAutoSlideshow) => {
        MainStore.dispatch({
            type:Actions.UPDATE_AUTO_SLIDESHOW,
            values:values
        });
    };

    /**
     * 
     * @param values 
     */
    UpdateCapture = (values:SCapture) => {
        MainStore.dispatch({
            type:Actions.UPDATE_CAPTURE,
            values:values
        });
    };

    /**
     * 
     * @param values 
     */
    UpdateCaptureAnnouncer = (values:CaptureSection) => {
        MainStore.dispatch({
            type:Actions.UPDATE_CAPTURE_ANNOUNCER,
            values:values
        });
    };

    /**
     * 
     * @param values 
     */
    UpdateCaptureAnthem = (values:CaptureSection) => {
        MainStore.dispatch({
            type:Actions.UPDATE_CAPTURE_ANTHEM,
            values:values
        });
    };

    /**
     * 
     * @param values 
     */
    UpdateCaptureGameClock = (values:CaptureSection) => {
        MainStore.dispatch({
            type:Actions.UPDATE_CAPTURE_GAMECLOCK,
            values:values
        });
    };

    /**
     * 
     * @param values 
     */
    UpdateCaptureJamClock = (values:CaptureSection) => {
        MainStore.dispatch({
            type:Actions.UPDATE_CAPTURE_JAMCLOCK,
            values:values
        });
    };

    /**
     * 
     * @param values 
     */
    UpdateCaptureJamCounter = (values:CaptureSection) => {
        MainStore.dispatch({
            type:Actions.UPDATE_CAPTURE_JAMCOUNTER,
            values:values
        });
    };

    /**
     * 
     * @param values 
     */
    UpdateCapturePenaltyTracker = (values:CaptureSection) => {
        MainStore.dispatch({
            type:Actions.UPDATE_CAPTURE_PENALTY,
            values:values
        })
    };

    /**
     * 
     * @param values 
     */
    UpdateCaptureRoster = (values:SCaptureRoster) => {
        MainStore.dispatch({
            type:Actions.UPDATE_CAPTURE_ROSTER,
            values:values
        })
    };

    /**
     * Update raffle capture values.
     * @param values 
     */
    UpdateCaptureRaffle = (values:CaptureSection) => {
        MainStore.dispatch({
            type:Actions.UPDATE_CAPTURE_RAFFLE,
            values:values
        });
    };

    /**
     * Update schedule capture values.
     * @param values 
     */
    UpdateCaptureSchedule = (values:SCaptureSchedule) => {
        MainStore.dispatch({
            type:Actions.UPDATE_CAPTURE_SCHEDULE,
            values:values
        });
    };

    /**
     * 
     * @param values 
     */
    UpdateCaptureScorebanner = (values:CaptureSection) => {
        MainStore.dispatch({
            type:Actions.UPDATE_CAPTURE_SCOREBANNER,
            values:values
        });
    };

    /**
     * 
     * @param values 
     */
    UpdateCaptureScoreboard = (values:CaptureSection) => {
        MainStore.dispatch({
            type:Actions.UPDATE_CAPTURE_SCOREBOARD,
            values:values
        });
    };

    /**
     * 
     * @param values 
     */
    UpdateCaptureScorekeeper = (values:CaptureSection) => {
        MainStore.dispatch({
            type:Actions.UPDATE_CAPTURE_SCOREKEEPER,
            values:values
        });
    };

    
    /**
     * 
     * @param values 
     */
    UpdateCaptureSlideshow = (values:CaptureSection) => {
        MainStore.dispatch({
            type:Actions.UPDATE_CAPTURE_SLIDESHOW,
            values:values
        });
    };

    /**
     * Update capture standings
     * @param values 
     */
    UpdateCaptureStandings = (values:SCaptureStandings) => {
        MainStore.dispatch({
            type:Actions.UPDATE_CAPTURE_STANDINGS,
            values:values
        });
    };

    /**
     * Update color configuration
     * @param values 
     */
    UpdateConfigColors = (values:ConfigColors) => {
        MainStore.dispatch({
            type:Actions.UPDATE_CONFIG_COLORS,
            values:values
        });
    };

    /**
     * Update misc configuration
     * @param values 
     */
    UpdateConfigMisc = (values:ConfigMisc) => {
        MainStore.dispatch({
            type:Actions.UPDATE_CONFIG_MISC,
            values:values
        });
    };

    /**
     * Update scoreboard configuration
     * @param values 
     */
    UpdateConfigScoreboard = (values:ConfigScoreboard) => {
        MainStore.dispatch({
            type:Actions.UPDATE_CONFIG_SCOREBOARD,
            values:values
        });
    };

    /**
     * Update main camera config.
     * @param values 
     */
    UpdateMainCamera = (values:CameraConfig) => {
        MainStore.dispatch({
            type:Actions.UPDATE_MAIN_CAMERA,
            values:values
        });
    };

    /**
     * Update main video config.
     * @param values 
     */
    UpdateMainVideo = (values:VideoConfig) => {
        MainStore.dispatch({
            type:Actions.UPDATE_MAIN_VIDEO,
            values:values
        });
    };
}

const UIController = new Controller();
export {UIController};