import {createStore} from 'redux';
import DataController from 'controllers/DataController';
import CaptureController from 'controllers/CaptureController';
import keycodes from 'tools/keycodes';
import vars from 'tools/vars';

const SET_STATE = 'SET_STATE';
const SET_SOURCE = 'SET_SOURCE';
const SET_VOLUME = 'SET_VOLUME';
const SET_RATE = 'SET_RATE'; //playback rate
const SET_FRAMESPEED = 'SET_FRAMESPEED'; //how far to advance the frame when paused
const SET_STATUS = 'SET_STATUS';
const SET_TIME = 'SET_TIME';
const SET_MUTE = 'SET_MUTE';
const SET_UNMUTE = 'SET_UNMUTE';
const SET_START_END = 'SET_START_END';
const SET_DEFAULT = 'SET_DEFAULT';
const SET_DURATION = 'SET_DURATION';
const SET_BRIGHTNESS = 'SET_BRIGHTNESS';
const SET_CONTRAST = 'SET_CONTRAST';
const SET_GRAYSCALE = 'SET_GRAYSCALE';
const SET_INVERSION = 'SET_INVERSION';
const SET_SATURATION = 'SET_SATURATION';
const SET_SEPIA = 'SET_SEPIA';
const SET_BLUR = 'SET_BLUR';

const ADJUST_VOLUME = 'ADJUST_VOLUME';
const ADJUST_RATE = 'ADJUST_RATE';

const NEXT_FRAME = 'NEXT_FRAME';
const PREV_FRAME = 'PREV_FRAME';

const TOGGLE_PLAY_PAUSE = 'TOGGLE_PLAY_PAUSE';
const TOGGLE_MUTE = 'TOGGLE_MUTE';
const TOGGLE_LOOP = 'TOGGLE_LOOP';
const TOGGLE_AUTO = 'TOGGLE_AUTO';

const InitState = {
    Status:vars.Video.Status.Ready,
    Loop:false,
    AutoPlay:false,
    Source:null,
    Volume:0.75,
    Rate:1.0,
    Duration:0,
    CurrentTime:0,
    Muted:true,
    Start:0,
    End:0,
    FrameSpeed:0.05,
    Brightness:100,
    Contrast:100,
    Grayscale:0,
    Inversion:0,
    Saturation:100,
    Sepia:0,
    Blur:0
};

function VideoReducer(state = InitState, action) {
    switch(action.type) {
        case SET_STATE :
            return Object.assign({}, state, action.values);

        case SET_DEFAULT :
            return Object.assign({}, state, InitState);

        case SET_FRAMESPEED :
            return Object.assign({}, state, {FrameSpeed:action.value});

        case SET_MUTE :
            return Object.assign({}, state, {Muted:true});

        case SET_DURATION :
            return Object.assign({}, state, {Duration:action.value});

        case SET_UNMUTE :
            return Object.assign({}, state, {Muted:false});

        case SET_TIME :
            return Object.assign({}, state, {CurrentTime:action.value});

        case SET_SOURCE :
            return Object.assign({}, state, {Source:action.value});
            
        case SET_VOLUME :
            return Object.assign({}, state, {Volume:action.value});
            
        case SET_STATUS :
            return Object.assign({}, state, {Status:action.value});

        case SET_RATE :
            return Object.assign({}, state, {Rate:action.value});

        case SET_START_END :
            return Object.assign({}, state, {Start:action.start,End:action.end});

        case SET_BRIGHTNESS :
            return Object.assign({}, state, {Brightness:action.value});

        case SET_CONTRAST :
            return Object.assign({}, state, {Contrast:action.value});

        case SET_GRAYSCALE :
            return Object.assign({}, state, {Grayscale:action.value});

        case SET_INVERSION :
            return Object.assign({}, state, {Inversion:action.value});

        case SET_SATURATION :
            return Object.assign({}, state, {Saturation:action.value});

        case SET_SEPIA :
            return Object.assign({}, state, {Sepia:action.value});

        case SET_BLUR :
            return Object.assign({}, state, {Blur:action.value});

        case TOGGLE_MUTE :
            return Object.assign({}, state, {Muted:!state.Muted});

        case TOGGLE_PLAY_PAUSE :
            if(state.Source === null || state.Source === '')
                return state;
            if(state.Status !== vars.Video.Status.Playing)
                return Object.assign({}, state, {Status:vars.Video.Status.Playing});
            return Object.assign({}, state, {Status:vars.Video.Status.Paused});

        case TOGGLE_LOOP :
            return Object.assign({}, state, {Loop:!state.Loop});

        case TOGGLE_AUTO :
            return Object.assign({}, state, {AutoPlay:!state.AutoPlay});
        
        case NEXT_FRAME :
            if(state.Status == vars.Video.Status.Playing)
                return state;
            if(state.CurrentTime < state.Duration) {
                var time = state.CurrentTime + state.FrameSpeed;
                if(time > state.Duration)
                    time = state.Duration;
                return Object.assign({}, state, {CurrentTime:time});
            } else {
                return state;
            }

        case PREV_FRAME :
            if(state.CurrentTime <= 0 || state.Status == vars.Video.Status.Playing)
                return state;
            var time = state.CurrentTime - state.FrameSpeed;
            if(time < 0)
                time = 0;
            return Object.assign({}, state, {CurrentTime:time});

        case ADJUST_VOLUME :
            var amount = state.Volume + action.value;
            if(amount < 0)
                amount = 0;
            else if(amount > 1)
                amount = 1;
            return Object.assign({}, state, {Volume:amount});

        case ADJUST_RATE :
            var amount = state.Rate + action.value;
            if(amount < 0.1)
                amount = 0.1;
            else if(amount > 3)
                amount = 3;
            return Object.assign({}, state, {Rate:amount});
            
        default :
            return state;
    }
}

const VideoStore = createStore(VideoReducer);

const VideoController = {
    Key:'VID',

    SetState(state) {
        VideoController.getStore().dispatch({
            type:SET_STATE,
            values:state
        });
    },

    SetSource(value) {
        VideoController.getStore().dispatch({
            type:SET_SOURCE,
            value:value
        });
    },

    SetVolume(value) {
        VideoController.getStore().dispatch({
            type:SET_VOLUME,
            value:value
        });
    },

    SetRate(value) {
        VideoController.getStore().dispatch({
            type:SET_RATE,
            value:value
        });
    },

    SetDuration(value) {
        VideoController.getStore().dispatch({
            type:SET_DURATION,
            value:value
        });
    },

    SetValues(values) {
        VideoController.getStore().dispatch({
            type:SET_STATE,
            values:values
        });
    },

    SetTime(value) {
        VideoController.getStore().dispatch({
            type:SET_TIME,
            value:value
        });
    },

    PlayNow(source, muted) {
        VideoController.getStore().dispatch({
            type:SET_STATE,
            values:{
                Status:vars.Video.Status.Playing,
                Source:source,
                CurrentTime:0,
                Shown:true,
                Muted:muted
            }
        });
        CaptureController.SetMainVideoVisibility(true);
    },

    Play() {
        VideoController.getStore().dispatch({
            type:SET_STATUS,
            value:vars.Video.Status.Playing
        });
        CaptureController.SetMainVideoVisibility(true);
    },

    Stop() {
        VideoController.getStore().dispatch({
            type:SET_STATE,
            values:{
                Status:vars.Video.Status.Stopped,
                Shown:false,
                Source:''
            }
        });
        CaptureController.SetMainVideoVisibility(false);
    },

    Pause() {
        VideoController.getStore().dispatch({
            type:SET_STATUS,
            value:vars.Video.Status.Paused
        });
    },

    Mute() {
        VideoController.getStore().dispatch({
            type:SET_MUTE
        });
    },

    UnMute() {
        VideoController.getStore().dispatch({
            type:SET_UNMUTE
        });
    },

    SetStartEnd(start, end) {
        VideoController.getStore().dispatch({
            type:SET_START_END,
            Start:start,
            End:end
        });
    },

    SetFrameSpeed(value) {
        VideoController.getStore().dispatch({
            type:SET_FRAMESPEED,
            value:value
        })
    },

    SetBrightness(value) {
        VideoController.getStore().dispatch({
            type:SET_BRIGHTNESS,
            value:value
        });
    },

    SetContrast(value) {
        VideoController.getStore().dispatch({
            type:SET_CONTRAST,
            value:value
        });
    },

    SetGrayscale(value) {
        VideoController.getStore().dispatch({
            type:SET_GRAYSCALE,
            value:value
        });
    },

    SetInversion(value) {
        VideoController.getStore().dispatch({
            type:SET_INVERSION,
            value:value
        });
    },

    SetSaturation(value) {
        VideoController.getStore().dispatch({
            type:SET_SATURATION,
            value:value
        });
    },

    SetSepia(value) {
        VideoController.getStore().dispatch({
            type:SET_SEPIA,
            value:value
        });
    },

    SetBlur(value) {
        VideoController.getStore().dispatch({
            type:SET_BLUR,
            value:value
        });
    },

    ToggleMute() {
        VideoController.getStore().dispatch({
            type:TOGGLE_MUTE
        });
    },

    TogglePlayPause() {
        VideoController.getStore().dispatch({
            type:TOGGLE_PLAY_PAUSE
        });
    },

    ToggleLoop() {
        VideoController.getStore().dispatch({
            type:TOGGLE_LOOP
        });
    },

    ToggleAuto() {
        VideoController.getStore().dispatch({
            type:TOGGLE_AUTO
        });
    },

    NextFrame() {
        VideoController.getStore().dispatch({
            type:NEXT_FRAME
        });
    },

    PrevFrame() {
        VideoController.getStore().dispatch({
            type:PREV_FRAME
        });
    },

    IncreaseVolume(amount) {
        VideoController.getStore().dispatch({
            type:ADJUST_VOLUME,
            value:Math.abs(amount)
        });
    },

    DecreaseVolume(amount) {
        VideoController.getStore().dispatch({
            type:ADJUST_VOLUME,
            value:Math.abs(amount)*-1
        });
    },

    IncreaseRate(amount) {
        VideoController.getStore().dispatch({
            type:ADJUST_RATE,
            value:Math.abs(amount)
        });
    },

    DecreaseRate(amount) {
        VideoController.getStore().dispatch({
            type:ADJUST_RATE,
            value:Math.abs(amount)*-1
        });
    },
    
    /**
     * Handles keyboard commands for the VideoPlayer app.
     * @param {KeyEvent} ev 
     */
    onKeyUp(ev) {
        switch(ev.keyCode) {
            case keycodes.SPACEBAR :
            case keycodes.ENTER :
            case keycodes.P :
                VideoController.TogglePlayPause();
            break;

            case keycodes.RIGHT :
                //VideoController.IncreaseRate(0.1);
                VideoController.NextFrame();
            break;

            case keycodes.LEFT :
                //VideoController.DecreaseRate(0.1);
                VideoController.PrevFrame();
            break;

            case keycodes.M :
                VideoController.ToggleMute();
            break;

            case keycodes.UP :
                VideoController.IncreaseVolume(0.05);
            break;

            case keycodes.DOWN :
                VideoController.DecreaseVolume(0.05);
            break;

            //case keycodes.OPENBRACKET :
                //VideoController.PrevFrame();
            //break;

            //case keycodes.CLOSEBRACKET :
                //VideoController.NextFrame();
            //break;
        }
    },

    /**
     * Gets the state of the capture controller
     */
    getState() {
        return VideoStore.getState();
    },

    /**
     * Gets the capture controller store
     */
    getStore() {
        return VideoStore;
    },

    /**
     * Subscribes to the capture controller
     * @param {Function} f 
     */
    subscribe(f) {
        return VideoStore.subscribe(f);
    },

    prepareStateForSending(state) {
        let cstate = Object.assign({}, state);
        cstate.Source = DataController.mpath(cstate.Source, true);
        cstate.AutoPlay = true;
        if(window && window.LocalServer) {
            cstate.Source = window.LocalServer.getVideoURL(cstate.Source);
        }
        return cstate;
    },

    /**
     * Builds the REST API for the Video Controller
     */
    buildAPI() {
        const server = window.LocalServer;
        const exp = server.ExpressApp;

        //get state
        exp.get(/^\/api\/video(\/?)$/i, (req, res) => {
            res.send(server.PrepareObjectForSending(DataController.PrepareObjectForSending(VideoController.getState())));
            res.end();
        });

        //video instructions
        exp.post(/^\/api\/video(\/?)$/i, (req, res) => {
            if(req.body && req.body.action) {
                switch(req.body.action.toString().toLowerCase()) {
                    case 'play' :
                        VideoController.Play();
                    break;
                    case 'pause' :
                        VideoController.Pause();
                    break;
                    case 'stop' :
                        VideoController.Stop();
                    break;
                    //set video source and play video
                    case 'play-now' :
                        VideoController.PlayNow(
                            DataController.mpath('videos/' + req.body.src),
                            (req.body.muted === true) ? true : false
                        );
                    break;
                }
            }
            res.end();
        });

        //stream a video
        exp.get(/^\/api\/video\/(.*?)\.{1}(mp4|wmv|webm){1}/i, (req, res) => {
            var file = DataController.mpath("videos/" + req.params[0] + "." + req.params[1]);
            DataController.FS.stat(file, function(err, stats) {
              if (err) {
                if (err.code === 'ENOENT') {
                  // 404 Error if file not found
                  return res.sendStatus(404);
                }
                res.end(err);
              }
              var range = req.headers.range;
              if (!range) {
               // 416 Wrong range
               //return res.sendStatus(416);
               range = "bytes=0-10";
              }
              var positions = range.replace(/bytes=/, "").split("-");
              var start = parseInt(positions[0], 10);
              var total = stats.size;
              var end = positions[1] ? parseInt(positions[1], 10) : total - 1;
              var chunksize = (end - start) + 1;
        
              res.writeHead(206, {
                "Content-Range": "bytes " + start + "-" + end + "/" + total,
                "Accept-Ranges": "bytes",
                "Content-Length": chunksize,
                "Content-Type": "video/mp4"
              });
        
              var stream = DataController.FS.createReadStream(file, { start: start, end: end, autoClose:true })
                .on("open", function() {
                  stream.pipe(res);
                }).on("error", function(err) {
                  res.end(err);
                });
            });
        });
    }
};

export default VideoController;