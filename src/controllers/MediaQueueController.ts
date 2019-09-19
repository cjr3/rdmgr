import {createStore} from 'redux';
import DataController from 'controllers/DataController';
import VideoController from 'controllers/VideoController';
import SlideshowController from 'controllers/SlideshowController';
import CaptureController from 'controllers/CaptureController';
import CaptureStatus from 'tools/CaptureStatus';
import vars, {Record, SlideshowRecord, VideoRecord, AnthemRecord} from 'tools/vars';
import keycodes from 'tools/keycodes';

const SET_STATE = 'SET_STATE';
const TOGGLE_LOOP = 'TOGGLE_LOOP';

export interface SMediaQueueController {
    Index:number,
    Records:Array<SlideshowRecord | VideoRecord | AnthemRecord>,
    Record:Record | VideoRecord | AnthemRecord | SlideshowRecord | null,
    Loop:boolean
}

const InitState:SMediaQueueController = {
    Index:-1,
    Records:[],
    Record:null,
    Loop:false
};

/**
 * Reducer for the Media Queue
 * @param {Object} state 
 * @param {Object} action 
 */
function MediaQueueReducer(state = InitState, action) {
    switch(action.type) {
        case SET_STATE :
            return Object.assign({}, state, action.values);

        //Toggle looping status of all records
        case TOGGLE_LOOP :
            return Object.assign({}, state, {Loop:!state.Loop});

        default :
            return state;
    }
}

const MediaQueueStore = createStore(MediaQueueReducer);

const MediaQueueController = {
    Key:'MEQ',
    remoteData:null,
    remoteSlideshow:null,
    remoteVideo:null,
    remoteCapture:null,
    autoTimer:0,

    Init() {
        CaptureStatus.subscribe(() => {
            MediaQueueController.checkState();
        });

        SlideshowController.subscribe(() => {
            MediaQueueController.checkSlideshow();
        });
    },

    /**
     * Sets the state of the store.
     * @param {Object} values 
     */
    SetState(values) {
        MediaQueueController.getStore().dispatch({
            type:SET_STATE,
            values:values
        });
    },

    /**
     * Starts the media queue.
     */
    Start() {
        var state = MediaQueueController.getState();
        SlideshowController.SetState({Index:0});
        if(state.Records.length >= 1) {
            MediaQueueController.SetRecord( 0 );
        } else {
            MediaQueueController.getStore().dispatch({
                type:SET_STATE,
                values:{
                    Index:-1,
                    Record:null
                }
            });
        }
    },

    /**
     * Shows the next record or the next slide.
     */
    Next() {
        var state = MediaQueueController.getState();
        var sstate = SlideshowController.getState();
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
                CaptureController.SetMainVideoVisibility( false );
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
                    CaptureController.SetMainSlideshowVisibility( false );
                } else {
                    update = false;
                    SlideshowController.Next();
                }
            break;

            //National Anthem Singer
            case vars.RecordType.Anthem :
                CaptureController.SetNationalAnthemSingerVisibility( false );
            break;
        }

        if(update) {
            MediaQueueController.SetRecord( index );
        }
    },

    /**
     * Shows the previous record or previous slide.
     */
    Prev() {
        var state = MediaQueueController.getState();
        var sstate = SlideshowController.getState();
        const record = state.Record;
        var index = state.Index - 1;
        var update = true;
        if(index < 0 || !(index in state.Records) || record === null) {
            if(record !== null) {

                if(record.RecordType === vars.RecordType.Slideshow && sstate.Index <= 0) {
                    MediaQueueController.SetRecord( -1 );
                    return;
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
                CaptureController.SetMainVideoVisibility( false );
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
                    CaptureController.SetMainSlideshowVisibility( false );
                } else {
                    SlideshowController.Prev();
                    update = false;
                }
            break;

            //National Anthem Singer
            case vars.RecordType.Anthem :
                CaptureController.SetNationalAnthemSingerVisibility( false );
            break;
        }

        if(update) {
            MediaQueueController.SetRecord(index);
        }
    },

    /**
     * Sets the current record.
     * @param {Number} index 
     */
    SetRecord( index ) {
        index = parseInt( index );
        var state = MediaQueueController.getState();
        if(index >= 0 && state.Records[index]) {
            var record = Object.assign({}, state.Records[index]);
            MediaQueueController.getStore().dispatch({
                type:SET_STATE,
                values:{
                    Index:index,
                    Record:record
                }
            });

            switch(record.RecordType) {
                //play video
                case vars.RecordType.Video :
                    CaptureController.SetMainVideoVisibility( false );
                    VideoController.SetState({
                        Muted:false,
                        AutoPlay:false,
                        Source:DataController.mpath('videos/' + record.Filename, false)
                    });
                    CaptureController.SetMainSlideshowVisibility( false );
                    CaptureController.SetNationalAnthemSingerVisibility( false );
                break;

                //start slideshow
                case vars.RecordType.Slideshow :
                    SlideshowController.SetSlides(record.Records, record.RecordID, record.Name);
                    CaptureController.SetMainSlideshowVisibility( true );
                    CaptureController.SetMainVideoVisibility( false );
                    CaptureController.SetNationalAnthemSingerVisibility( false );
                break;

                //National Anthem
                case vars.RecordType.Anthem :
                    CaptureController.SetMainSlideshowVisibility( false );
                    CaptureController.SetMainVideoVisibility( false );
                    CaptureController.SetNationalAnthemSinger(record);
                    CaptureController.SetNationalAnthemSingerVisibility( true );
                break;
            }

        } else {
            MediaQueueController.getStore().dispatch({
                type:SET_STATE,
                values:{
                    Index:-1,
                    Record:null
                }
            });
            VideoController.SetState({Source:'', Status:vars.Video.Status.Stopped});
            SlideshowController.SetSlides([], 0, '');
            CaptureController.SetMainVideoVisibility( false );
            CaptureController.SetMainSlideshowVisibility( false );
            CaptureController.SetNationalAnthemSingerVisibility( false );
        }
    },

    /**
     * Adds the record to the queue.
     * @param {Object} record 
     */
    Add(record) {
        //console.log(record);
        var state = MediaQueueController.getState();
        var records = state.Records.slice();
        records.push(record);
        MediaQueueController.getStore().dispatch({
            type:SET_STATE,
            values:{
                Records:records
            }
        });
    },

    /**
     * Removes the record at the given index.
     * @param {Number} index 
     */
    Remove(index) {
        index = parseInt( index );
        var state = MediaQueueController.getState();
        if((index in state.Records)) {
            var records = state.Records.slice();
            var record = records[index];
            if(index == state.Index) {
                switch(record.RecordType) {
                    case vars.RecordType.Video :
                        VideoController.Stop();
                    break;

                    case vars.RecordType.Slideshow :
                        CaptureController.SetMainSlideshowVisibility( false );
                        SlideshowController.SetSlides([], 0, '');
                    break;

                    case vars.RecordType.Anthem :
                        CaptureController.SetNationalAnthemSingerVisibility( false );
                    break;
                }
            }

            records.splice(index, 1);

            if(records.length <= 0) {
                MediaQueueController.getStore().dispatch({
                    type:SET_STATE,
                    values:{
                        Record:null,
                        Index:-1,
                        Records:[]
                    }
                });
                CaptureController.SetMainVideoVisibility( false );
                CaptureController.SetMainSlideshowVisibility( false );
                CaptureController.SetNationalAnthemSingerVisibility( false );
            } else if(state.Index >= index) {
                MediaQueueController.getStore().dispatch({
                    type:SET_STATE,
                    values:{
                        Records:records,
                        Index:state.Index - 1
                    }
                });
            } else {
                MediaQueueController.getStore().dispatch({
                    type:SET_STATE,
                    values:{
                        Records:records
                    }
                });
            }
        }
    },

    /**
     * Swaps records.
     * @param {Number} a 
     * @param {Number} b 
     * @param {Boolean} right 
     */
    SwapRecords(a, b, right) {
        var state:SMediaQueueController = MediaQueueController.getState();
        var records = state.Records.slice();
        var index = state.Index;
        if(a <= index || b <= index)
            index = -1;
        DataController.MoveElement(records, a, b, right);
        MediaQueueController.SetState({
            Records:records,
            Index:index
        });
    },

    /**
     * Toggles the visibility of the current record.
     */
    ToggleVisibility() {
        var state = MediaQueueController.getState();
        if(state.Record === null) {
            CaptureController.SetMainVideoVisibility( false );
            CaptureController.SetMainSlideshowVisibility( false );
            CaptureController.SetNationalAnthemSingerVisibility( false );
        } else {
            switch(state.Record.RecordType) {
                case vars.RecordType.Video :
                    CaptureController.ToggleMainVideo();
                break;

                case vars.RecordType.Slideshow :
                    CaptureController.ToggleSlideshow();
                break;

                case vars.RecordType.Anthem :
                    CaptureController.ToggleNationalAnthem();
                break;
            }
        }
    },

    /**
     * Toggles the looping behavior of the media queue.
     */
    ToggleLoop() {
        try {
            clearTimeout(MediaQueueController.autoTimer);
        } catch(er) {

        }
        MediaQueueController.getStore().dispatch({
            type:TOGGLE_LOOP
        });
    },

    /**
     * Triggered when the status is updated
     */
    checkState() {
        var state = MediaQueueController.getState();
        var status = CaptureStatus.getState();

        if(state.Records && state.Records.length) {
            //loop only on the last record
            if(state.Loop && state.Record) {

                //loop video when complete
                if(state.Record.RecordType === vars.RecordType.Video
                    && status.Video.Status == vars.Video.Status.Stopped
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
    },

    /**
     * Triggered when the slideshow controller is updated.
     */
    checkSlideshow() {
        var state = MediaQueueController.getState();
        var show = SlideshowController.getState();
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
                            var mstate = MediaQueueController.getState();
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
                        var mstate = MediaQueueController.getState();
                        if(mstate.Loop) {
                            MediaQueueController.Next();
                        }
                    }, show.Delay);
                }
            }
        }
    },

    /**
     * Triggered when the user presses a key on the keyboard.
     * @param {KeyEvent} ev 
     */
    onKeyUp(ev) {
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
                MediaQueueController.Next();
            break;

            case keycodes.LEFT :
                if(ev.ctrlKey)
                    MediaQueueController.Start();
                else
                    MediaQueueController.Prev();
            break;
        }
    },

    getState() {
        return MediaQueueStore.getState();
    },

    getStore() {
        return MediaQueueStore;
    },

    subscribe(f) {
        return MediaQueueStore.subscribe(f);
    },

    /**
     * Builds the API to the local server for the media queue controller.
     */
    buildAPI() {
        const server = window.LocalServer;
        const exp = server.ExpressApp;

        //get state
        exp.get(/^\/api\/media(\/?)$/i, (req, res) => {
            res.send(server.PrepareObjectForSending(DataController.PrepareObjectForSending(Object.assign({}, MediaQueueController.getState()))));
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
                let record = DataController.getRecord(req.body.recordType, req.body.recordId);
                if(record !== null) {
                    switch(record.RecordType) {
                        case vars.RecordType.Video :
                        case vars.RecordType.Slideshow :
                        case vars.RecordType.Anthem :
                            MediaQueueController.Add(Object.assign({}, record));
                        break;
                        default :

                        break;
                    }
                }
                res.send("OK");
            } else {
                res.send("Please provide a recordType code and recordId.");
            }
            res.end();
        });

    }
};

MediaQueueController.Init();

export default MediaQueueController;