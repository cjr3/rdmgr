import VideoController from 'controllers/VideoController';
import SlideshowController from 'controllers/SlideshowController';
import CaptureStatus from 'tools/CaptureStatus';
import vars from 'tools/vars';
import keycodes from 'tools/keycodes';
import RosterController from './RosterController';
import AnthemCaptureController from 'controllers/capture/Anthem';
import RosterCaptureController from 'controllers/capture/Roster';
import SlideshowCaptureController from 'controllers/capture/Slideshow';
import VideoCaptureController from 'controllers/capture/Video';
import { IController, Files } from './vars';
import { CreateController, BaseReducer } from './functions.controllers';
import { AddMediaPath, PrepareObjectForSending, MoveElement } from './functions';
import VideosController from './VideosController';
import SlideshowsController from './SlideshowsController';
import AnthemsController from './AnthemsController';

interface IMediaQueueController extends IController {
    Start:Function;
    Next:Function;
    Prev:Function;
    SetRecord:Function;
    UpdateRecord:Function;
    Add:Function;
    Remove:Function;
    SwapRecords:Function;
    ToggleVisibility:Function;
    ToggleLoop:Function;
    CheckState:Function;
    CheckSlideshow:Function;
    onKeyUp:Function;
    autoTimer:number;
}

export enum Actions {
    TOGGLE_LOOP = 'TOGGLE_LOOP',
    UPDATE_RECORD = 'UPDATE_RECORD'
};

export interface SMediaQueueController {
    Index:number;
    Records:Array<any>;
    Record:any;
    Loop:boolean;
}

export const InitState:SMediaQueueController = {
    Index:-1,
    Records:[],
    Record:null,
    Loop:false
};

const ToggleLoop = (state:SMediaQueueController) => {
    return {...state, Loop:!state.Loop};
};

const UpdateRecord = (state:SMediaQueueController, index:number, record:any) => {
    if(!state.Records[index])
        return state;
    let records:Array<any> = state.Records.slice();
    records[index] = {...record};
    return {...state, Records:records};
}

/**
 * Reducer for the Media Queue
 * @param {Object} state 
 * @param {Object} action 
 */
const MediaQueueReducer = (state:SMediaQueueController = InitState, action) => {
    try {
        switch(action.type) {
            case Actions.TOGGLE_LOOP :
                return ToggleLoop(state);
            case Actions.UPDATE_RECORD :
                return UpdateRecord(state, action.index, action.record);
            default :
                return BaseReducer(state, action);
        }
    } catch(er) {
        return state;
    }
};

const MediaQueueController:IMediaQueueController = CreateController('MEQ', MediaQueueReducer);

MediaQueueController.autoTimer = 0;

MediaQueueController.Init = () => {
    CaptureStatus.subscribe(() => {
        MediaQueueController.CheckState();
    });

    SlideshowController.Subscribe(() => {
        MediaQueueController.CheckSlideshow();
    });
};

MediaQueueController.Start = () => {
    let state = MediaQueueController.GetState();
    SlideshowController.SetState({Index:0});
    if(state.Records.length >= 1) {
        MediaQueueController.SetRecord( 0 );
    } else {
        MediaQueueController.SetState({
            Index:-1,
            Record:null
        });
    }
};

MediaQueueController.Next = () => {
    var state = MediaQueueController.GetState();
    var sstate = SlideshowController.GetState();
    var rstate = RosterController.GetState();
    const record = state.Record;
    var index = state.Index + 1;
    if(index >= state.Records.length) {
        if(record === null) {
            MediaQueueController.SetRecord( -1 );
            return;
        } else if(record.RecordType === vars.RecordType.Slideshow
            && (sstate.Index + 1) >= sstate.Slides.length) {
            MediaQueueController.SetRecord( -1 );
            return;
        } else if(record.RecordType === vars.RecordType.Roster) {
            if(rstate.CurrentTeam === 'A') {
                //Side A
                if((rstate.SkaterIndex+1) < rstate.TeamA.Skaters.length) {
                    RosterController.Next();
                    return;
                } else {
                    MediaQueueController.SetRecord(-1);
                    return;
                }
            } else {
                //Side B
                if((rstate.SkaterIndex+1) < rstate.TeamB.Skaters.length) {
                    RosterController.Next();
                    return;
                } else {
                    MediaQueueController.SetRecord(-1);
                    return;
                }
            }
        }
    }

    if(record === null) {
        MediaQueueController.SetRecord(index);
        return;
    }

    var update = true;
    switch(record.RecordType) {
        //Video - Stop Playing
        case vars.RecordType.Video :
            VideoCaptureController.Hide();
            VideoController.SetState({
                Loop:false,
                AutoPlay:false,
                Muted:true,
                Status:vars.Video.Status.Stopped,
                CurrentTime:0
            });
        break;

        //Slideshow
        case vars.RecordType.Slideshow :
            if((sstate.Index + 1) >= sstate.Slides.length) {
                //slideshow has reached the last slide
                SlideshowCaptureController.Hide();
            } else {
                update = false;
                SlideshowController.Next();
            }
        break;

        //National Anthem Singer
        case vars.RecordType.Anthem :
            AnthemCaptureController.Hide();
        break;

        //Roster
        case vars.RecordType.Roster :
            if(rstate.CurrentTeam === 'A' && (rstate.SkaterIndex+1) < rstate.TeamA.Skaters.length) {
                update = false;
                RosterController.Next();
            } else if(rstate.CurrentTeam === 'B' && (rstate.SkaterIndex+1) < rstate.TeamB.Skaters.length) {
                update = false;
                RosterController.Next();
            }
        break;
    }

    if(update) {
        MediaQueueController.SetRecord( index );
    }
};

MediaQueueController.Prev = () => {
    var state = MediaQueueController.GetState();
    var sstate = SlideshowController.GetState();
    var rstate = RosterController.GetState();
    const record = state.Record;
    var index = state.Index - 1;
    var update = true;
    if(index < 0 || !(index in state.Records) || record === null) {
        if(record !== null) {

            if(record.RecordType === vars.RecordType.Slideshow && sstate.Index <= 0) {
                MediaQueueController.SetRecord( -1 );
                return;
            } else if(record.RecordType === vars.RecordType.Roster) {
                if(rstate.SkaterIndex <= 0) {
                    MediaQueueController.SetRecord( -1 );
                    return;
                }
            }
        } else {
            MediaQueueController.SetRecord( -1 );
            return;
        }
    }

    //affect current record
    switch(record.RecordType) {
        //Video - Hide and stop playing
        case vars.RecordType.Video :
            VideoCaptureController.Hide();
            VideoController.SetState({
                Loop:false,
                AutoPlay:false,
                Muted:true,
                Status:vars.Video.Status.Stopped,
                CurrentTime:0
            });
        break;

        //Slideshow
        //Previous record only if the slide index is currently zero
        case vars.RecordType.Slideshow :
            if(sstate.Index === 0) {
                SlideshowCaptureController.Hide();
            } else {
                SlideshowController.Prev();
                update = false;
            }
        break;

        //National Anthem Singer
        case vars.RecordType.Anthem :
            AnthemCaptureController.Hide();
        break;

        //Roster
        case vars.RecordType.Roster :
            if(rstate.SkaterIndex <= 0)
                RosterCaptureController.Hide();
            else {
                RosterController.Prev();
                update = false;
            }
        break;
    }

    if(update) {
        MediaQueueController.SetRecord(index);
    }
};


MediaQueueController.SetRecord = (index:number|string) => {
    if(typeof(index) === 'string')
        index = parseInt( index );
    var state = MediaQueueController.GetState();
    if(index >= 0 && state.Records[index]) {
        var record = {...state.Records[index]};
        MediaQueueController.SetState({
            Index:index,
            Record:record
        });

        switch(record.RecordType) {
            //play video
            case vars.RecordType.Video :
                VideoCaptureController.Hide();
                VideoController.SetState({
                    Muted:false,
                    AutoPlay:false,
                    Source:AddMediaPath('videos/' + record.Filename)
                });
                SlideshowCaptureController.Hide();
                RosterCaptureController.Hide();
                AnthemCaptureController.Hide();
            break;

            //start slideshow
            case vars.RecordType.Slideshow :
                SlideshowController.SetSlides(record.Records, record.RecordID, record.Name);
                VideoCaptureController.Hide();
                RosterCaptureController.Hide();
                AnthemCaptureController.Hide();
                SlideshowCaptureController.Show();
            break;

            //National Anthem
            case vars.RecordType.Anthem :
                SlideshowCaptureController.Hide();
                VideoCaptureController.Hide();
                RosterCaptureController.Hide();
                AnthemCaptureController.Show();
                AnthemCaptureController.SetRecord(record);
            break;

            //Roster
            case vars.RecordType.Roster :
                SlideshowCaptureController.Hide();
                VideoCaptureController.Hide();
                AnthemCaptureController.Hide();
                RosterController.SetSkater(record.Side, -1);
                RosterCaptureController.Show();
            break;
        }

    } else {
        MediaQueueController.SetState({
            Index:-1,
            Record:null
        });
        VideoController.SetState({Source:'', Status:vars.Video.Status.Stopped});
        SlideshowController.SetSlides([], 0, '');
        VideoCaptureController.Hide();
        SlideshowCaptureController.Hide();
        AnthemCaptureController.Hide();
        RosterCaptureController.Hide();
    }
};

MediaQueueController.Add = (record:any) => {
    var state = MediaQueueController.GetState();
    var records = state.Records.slice();
    records.push(record);
    MediaQueueController.SetState({
        Records:records
    });
};

MediaQueueController.Remove = (index:number|string) => {
    if(typeof(index) === 'string')
        index = parseInt( index );
    var state = MediaQueueController.GetState();
    if((index in state.Records)) {
        var records = state.Records.slice();
        var record = records[index];
        if(index === state.Index) {
            switch(record.RecordType) {
                case vars.RecordType.Video :
                    VideoController.Stop();
                break;

                case vars.RecordType.Slideshow :
                    SlideshowCaptureController.Hide();
                    SlideshowController.SetSlides([], 0, '');
                break;

                case vars.RecordType.Anthem :
                    AnthemCaptureController.Hide();
                break;

                case vars.RecordType.Roster :
                    RosterCaptureController.Hide();
                break;
            }
        }

        records.splice(index, 1);

        if(records.length <= 0) {
            MediaQueueController.SetState({
                Record:null,
                Index:-1,
                Records:[]
            });
            VideoCaptureController.Hide();
            SlideshowCaptureController.Hide();
            AnthemCaptureController.Hide();
            RosterCaptureController.Hide();
        } else if(state.Index >= index) {
            MediaQueueController.SetState({
                Records:records,
                Index:state.Index - 1
            });
        } else {
            MediaQueueController.SetState({
                Records:records
            });
        }
    }
};

MediaQueueController.SwapRecords = (a:number, b:number, right:boolean = false) => {
    var state:SMediaQueueController = MediaQueueController.GetState();
    var records = state.Records.slice();
    var index = state.Index;
    if(a <= index || b <= index)
        index = -1;
    MoveElement(records, a, b, right);
    MediaQueueController.SetState({
        Records:records,
        Index:index
    });
};

MediaQueueController.ToggleVisibility = () => {
    var state = MediaQueueController.GetState();
    if(state.Record === null) {
        VideoCaptureController.Hide();
        SlideshowCaptureController.Hide();
        AnthemCaptureController.Hide();
        RosterCaptureController.Hide();
    } else {
        switch(state.Record.RecordType) {
            case vars.RecordType.Video :
                VideoCaptureController.Toggle();
            break;

            case vars.RecordType.Slideshow :
                SlideshowCaptureController.Toggle();
            break;

            case vars.RecordType.Anthem :
                AnthemCaptureController.Toggle();
            break;

            case vars.RecordType.Roster :
                RosterCaptureController.Toggle();
            break;
        }
    }
};

MediaQueueController.ToggleLoop = () => {
    try {
        clearTimeout(MediaQueueController.autoTimer);
    } catch(er) {

    } finally {
        MediaQueueController.Dispatch({
            type:Actions.TOGGLE_LOOP
        });
    }
};

MediaQueueController.CheckState = () => {
    var state = MediaQueueController.GetState();
    var status = CaptureStatus.getState();

    if(state.Records && state.Records.length) {
        //loop only on the last record
        if(state.Loop && state.Record) {

            //loop video when complete
            if(state.Record.RecordType === vars.RecordType.Video
                && status.Video.Status === vars.Video.Status.Stopped
                && status.Video.CurrentTime >= status.Video.Duration
                && status.Video.Duration > 0
                ) {
                    //1 record on playlist - loop video immediately
                    if(state.Records.length === 1)
                        VideoController.SetTime(0);
                    else {
                        //show next record
                        var index = state.Index + 1;
                        if(index >= state.Records.length)
                            index = 0;
                        MediaQueueController.SetRecord( index );
                    }
            }
        }
    }
};

MediaQueueController.CheckSlideshow = () => {

    var state = MediaQueueController.GetState();
    var show = SlideshowController.GetState();
    if(state.Record && state.Record.RecordType === vars.RecordType.Slideshow
        && show.Slides && show.Slides.length) {
        if(state.Loop) {
            try {
                clearTimeout(MediaQueueController.autoTimer);
            } catch(er) {

            }
            if((show.Index+1) >= show.Slides.length) {
                //end of slideshow
                if(state.Records.length === 1) {
                    //restart show
                    MediaQueueController.autoTimer = window.setTimeout(() => {
                        MediaQueueController.SetRecord( 0 );
                    }, show.Delay);
                }
                else {
                    //next record
                    MediaQueueController.autoTimer = window.setTimeout(() => {
                        var mstate = MediaQueueController.GetState();
                        if(mstate.Loop) {
                            var index = mstate.Index+1;
                            if(index >= state.Records.length)
                                index = 0;
                            MediaQueueController.SetRecord( index );
                        }
                    }, show.Delay);
                }
            } else {
                MediaQueueController.autoTimer = window.setTimeout(() => {
                    var mstate = MediaQueueController.GetState();
                    if(mstate.Loop) {
                        MediaQueueController.Next();
                    }
                }, show.Delay);
            }
        }
    }
};

MediaQueueController.UpdateRecord = async (index:number, record:any) => {
    MediaQueueController.Dispatch({
        type:Actions.UPDATE_RECORD,
        index:index,
        record:record
    });
};

MediaQueueController.onKeyUp = (ev:KeyboardEvent) => {
    ev.stopPropagation();
    ev.preventDefault();
    switch(ev.keyCode) {
        case keycodes.ENTER :
            if(ev.ctrlKey) {
                MediaQueueController.Start();
            } else {
                MediaQueueController.Next();
            }
        break;
        case keycodes.SPACEBAR :
        case keycodes.RIGHT :
        case keycodes.DOWN :
            MediaQueueController.Next();
        break;

        case keycodes.LEFT :
        case keycodes.UP :
            if(ev.ctrlKey)
                MediaQueueController.Start();
            else
                MediaQueueController.Prev();
        break;
    }
};

MediaQueueController.BuildAPI = () => {

    const server = window.LocalServer;
    const exp = server.ExpressApp;

    //get state
    exp.get(/^\/api\/media(\/?)$/i, (req, res) => {
        res.send(server.PrepareObjectForSending(PrepareObjectForSending(Object.assign({}, MediaQueueController.GetState()))));
        res.end();
    });

    //control the queue
    exp.get(/^\/api\/media\/control\/(toggle|next|prev|play|mute|loop{1}(\/?))$/i, (req, res) => {
        if(req.params && req.params[0]) {
            switch(req.params[0].toString().toLowerCase()) {
                case 'toggle' :
                    MediaQueueController.ToggleVisibility();
                break;

                case 'next' :
                    MediaQueueController.Next();
                break;

                case 'prev' :
                    MediaQueueController.Prev();
                break;

                case 'mute' :
                    VideoController.ToggleMute();
                break;

                case 'loop' :
                    MediaQueueController.ToggleLoop();
                break;

                case 'play' :
                    MediaQueueController.Start();
                break;
            }
        }
        res.end();
    });

    //remove a record
    exp.delete(/^\/api\/media\/remove\/([0-9]?)$/i, (req, res) => {
        if(req.params && typeof(req.params[0]) !== 'undefined' && !Number.isNaN(req.params[0])) {
            MediaQueueController.Remove(parseInt( req.params[0] ) );
        } else {
            MediaQueueController.Remove(0);
        }
        res.send("OK");
        res.end();
    });

    //add a record
    exp.post(/^\/api\/media\/add(\/?)$/i, (req, res) => {
        if(req.body && req.body.recordType && req.body.recordId) {
            let record = null;
            switch(req.body.recordtype) {
                case vars.RecordType.Video :
                    record = VideosController.GetRecord(req.body.recordId);
                    break;
                case vars.RecordType.Slideshow :
                    record = SlideshowsController.GetRecord(req.body.recordId);
                    break;
                case vars.RecordType.Anthem :
                    record = AnthemsController.GetRecord(req.body.recordId);
                    break;
            }
            if(record != null) {
                MediaQueueController.Add(record);
            }
            res.send("OK");
        } else {
            res.send("Please provide a recordType code and recordId.");
        }
        res.end();
    });
};

MediaQueueController.Init();

export default MediaQueueController;