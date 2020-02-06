import keycodes from 'tools/keycodes';
import vars from 'tools/vars';

import {IController, Files} from './vars';
import {CreateController, BaseReducer} from './functions.controllers';
import VideoCaptureController from './capture/Video';
import { RemoveMediaPath, AddMediaPath, PrepareObjectForSending } from './functions';

interface IVideoController extends IController {
    SetSource:{(source?:string|null)};
    SetVolume:{(volume:number)};
    SetRate:{(rate:number)};
    SetDuration:{(duration:number)};
    SetTime:{(time:number)};
    PlayNow:{(source:string, muted:boolean)};
    Play:Function;
    Stop:Function;
    Pause:Function;
    Mute:Function;
    UnMute:Function;
    SetStartEnd:{(start:number, end:number)};
    SetFrameSpeed:{(speed:number)};
    ToggleMute:Function;
    TogglePlayPause:Function;
    ToggleLoop:Function;
    ToggleAuto:Function;
    NextFrame:Function;
    PrevFrame:Function;
    IncreaseVolume:{(amount:number)};
    DecreaseVolume:{(amount:number)};
    IncreaseRate:{(amount:number)};
    DecreaseRate:{(amount:number)};
    onKeyUp:Function;
    PrepareStateForSending:Function;
};

enum Actions {
    SET_SOURCE,
    SET_VOLUME,
    SET_RATE,
    SET_FRAMESPEED,
    SET_STATUS,
    SET_TIME,
    SET_MUTE,
    SET_UNMUTE,
    SET_START_END,
    SET_DEFAULT,
    SET_DURATION,
    ADJUST_VOLUME,
    ADJUST_RATE,
    NEXT_FRAME,
    PREV_FRAME,
    TOGGLE_PLAY_PAUSE,
    TOGGLE_MUTE,
    TOGGLE_LOOP,
    TOGGLE_AUTO,
    PLAY_NOW,
    STOP
};

export interface SVideoController {
    /**
     * Status of the video, from vars.Video.Status
     */
    Status:number;
    /**
     * True to loop the video, false to not
     * - This may be deprecated with the introduction of MediaQueue
     */
    Loop:boolean;
    /**
     * True to auot-play when loaded
     */
    AutoPlay:boolean;
    /**
     * Filename / URL of the video to play
     */
    Source:string;
    /**
     * Volume of the video.
     * A value between 0.0 and 1.0
     */
    Volume:number;
    /**
     * Playback rate, a value between 0.15 to 4
     */
    Rate:number;
    /**
     * Length of the video, in milliseconds
     */
    Duration:number;
    /**
     * Current position of the video, in milliseconds
     */
    CurrentTime:number;
    /**
     * Determines if the video is muted or not
     */
    Muted:boolean;
    /**
     * Starting position of the video
     */
    Start:number;
    /**
     * Ending position of the video
     */
    End:number;
    /**
     * The number of frames to skip ahead when paused and forward / rewinding the video
     */
    FrameSpeed:number;
}

export const InitState:SVideoController = {
    Status:vars.Video.Status.Ready,
    Loop:false,
    AutoPlay:false,
    Source:'',
    Volume:0.75,
    Rate:1.0,
    Duration:0,
    CurrentTime:0,
    Muted:true,
    Start:0,
    End:0,
    FrameSpeed:0.05
};

const SetSource = (state:SVideoController, source?:string|null) => {
    return {...state, Source:source};
};

const AdjustVolume = (state:SVideoController, amount:number) => {
    return SetVolumne(state, state.Volume + amount);
};

const SetVolumne = (state:SVideoController, volume:number) => {
    return {...state, Volume:Math.max(Math.min(volume, 1), 0)};
};

const AdjustRate = (state:SVideoController, amount:number) => {
    return SetVolumne(state, state.Rate + amount);
};

const SetRate = (state:SVideoController, rate:number) => {
    return {...state, Rate:Math.max(Math.min(rate, 3), 0.25)};
};

const SetDuration = (state:SVideoController, duration:number) => {
    return {...state, Duration:duration};
};

const SetTime = (state:SVideoController, time:number) => {
    return {...state, CurrentTime:Math.max(Math.min(time, state.Duration), 0)};
};

const PlayNow = (state:SVideoController, source:string, muted:boolean = false) => {
    return {
        ...state,
        Status:vars.Video.Status.Playing,
        Source:source,
        CurrentTime:0,
        Muted:muted,
        Start:0,
        End:0
    };
};

const Play = (state:SVideoController) => {
    return {...state, Status:vars.Video.Status.Playing};
};

const Stop = (state:SVideoController) => {
    return {...state, Status:vars.Video.Status.Stopped, CurrentTime:0};
};

const Pause = (state:SVideoController) => {
    return {...state, Status:vars.Video.Status.Paused};
};

const Mute = (state:SVideoController) => {
    return {...state, Muted:true};
};

const UnMute = (state:SVideoController) => {
    return {...state, Muted:false};
};

const SetStartEnd = (state:SVideoController, start:number, end:number) => {
    return {...state, Start:start, End:end};
};

const SetFrameSpeed = (state:SVideoController, speed:number) => {
    return {...state, FrameSpeed:Math.max(Math.min(speed, 1), 0.05)};
};

const ToggleMute = (state:SVideoController) => {
    return {...state, Muted:!state.Muted};
};

const TogglePlayPause = (state:SVideoController) => {
    if(!state.Source)
        return state;
    if(state.Status != vars.Video.Status.Playing)
        return {...state, Status:vars.Video.Status.Playing};
    return {...state, Status:vars.Video.Status.Paused};
};

const ToggleLoop = (state:SVideoController) => {
    return {...state, Loop:!state.Loop};
};

const ToggleAuto = (state:SVideoController) => {
    return {...state, AutoPlay:!state.AutoPlay};
};

const NextFrame = (state:SVideoController) => {
    if(state.Status == vars.Video.Status.Playing)
        return state;
    if(state.CurrentTime >= state.Duration)
        return state;
    return SetTime(state, state.CurrentTime + state.FrameSpeed);
};

const PrevFrame = (state:SVideoController) => {
    if(state.Status == vars.Video.Status.Playing || state.CurrentTime <= 0)
        return state;
    return SetTime(state, state.CurrentTime - state.FrameSpeed);
};

const IncreaseVolume = (state:SVideoController, amount:number) => {
    return SetVolumne(state, state.Volume + amount);
};

const DecreaseVolume = (state:SVideoController, amount:number) => {
    return SetVolumne(state, state.Volume - amount);
};

const IncreaseRate = (state:SVideoController, amount:number) => {
    return SetRate(state, state.Rate + amount);
};

const DecreaseRate = (state:SVideoController, amount:number) => {
    return SetRate(state, state.Rate - amount);
};

const SetStatus = (state:SVideoController, status:number) => {
    return {...state, Status:status};
};

const VideoReducer = (state:SVideoController = InitState, action) => {
    try {
        switch(action.type) {
            case Actions.SET_FRAMESPEED :
                return SetFrameSpeed(state, action.value);
            case Actions.SET_MUTE :
                return Mute(state);
            case Actions.SET_UNMUTE :
                return UnMute(state);
            case Actions.SET_DURATION :
                return SetDuration(state, action.value);
            case Actions.SET_TIME :
                return SetTime(state, action.value);
            case Actions.SET_SOURCE :
                return SetSource(state, action.value);
            case Actions.SET_VOLUME :
                return SetVolumne(state, action.value);
            case Actions.SET_STATUS :
                return SetStatus(state, action.value);
            case Actions.SET_RATE :
                return SetRate(state, action.value);
            case Actions.SET_START_END :
                return SetStartEnd(state, action.start, action.end);
            case Actions.TOGGLE_MUTE :
                return ToggleMute(state);
            case Actions.TOGGLE_PLAY_PAUSE :
                return TogglePlayPause(state);
            case Actions.TOGGLE_LOOP :
                return ToggleLoop(state);
            case Actions.TOGGLE_AUTO :
                return ToggleAuto(state);
            case Actions.NEXT_FRAME :
                return NextFrame(state);
            case Actions.PREV_FRAME :
                return PrevFrame(state);
            case Actions.ADJUST_VOLUME :
                return AdjustVolume(state, action.value);
            case Actions.ADJUST_RATE :
                return AdjustRate(state, action.value);
            case Actions.PLAY_NOW :
                return PlayNow(state, action.source, action.muted);
            case Actions.STOP :
                return Stop(state);
            default :
                return BaseReducer(state, action);
        }
    } catch(er) {
        return state;
    }
}

const VideoController:IVideoController = CreateController('VID', VideoReducer);
VideoController.SetSource = async (source?:string|null) => {
    VideoController.Dispatch({
        type:Actions.SET_SOURCE,
        value:source
    });
};
VideoController.SetVolume = async (volume:number) => {
    VideoController.Dispatch({
        type:Actions.SET_VOLUME,
        value:volume
    });
};
VideoController.SetRate = async (rate:number) => {
    VideoController.Dispatch({
        type:Actions.SET_RATE,
        value:rate
    });
};
VideoController.SetDuration = async (duration:number) => {
    VideoController.Dispatch({
        type:Actions.SET_DURATION,
        value:duration
    });
};
VideoController.SetTime = async (time:number) => {
    VideoController.Dispatch({
        type:Actions.SET_TIME,
        value:time
    });
};
VideoController.PlayNow = async (source:string, muted:boolean = false) => {
    VideoController.Dispatch({
        type:Actions.PLAY_NOW,
        source:source,
        muted:muted
    });
    VideoCaptureController.Show();
};
VideoController.Play = async () => {
    VideoController.Dispatch({
        type:Actions.SET_STATUS,
        value:vars.Video.Status.Playing
    });
    VideoCaptureController.Show();
};
VideoController.Stop = async () => {
    VideoController.Dispatch({
        type:Actions.STOP
    });
};
VideoController.Pause = async () => {
    VideoController.Dispatch({
        type:Actions.SET_STATUS,
        value:vars.Video.Status.Paused
    });
};
VideoController.Mute = async () => {
    VideoController.Dispatch({
        type:Actions.SET_MUTE
    });
};
VideoController.UnMute = async () => {
    VideoController.Dispatch({
        type:Actions.SET_UNMUTE
    });
};
VideoController.SetStartEnd = async (start:number, end:number) => {
    VideoController.Dispatch({
        type:Actions.SET_START_END,
        start:start,
        end:end
    });
};
VideoController.SetFrameSpeed = async (speed:number) => {
    VideoController.Dispatch({
        type:Actions.SET_FRAMESPEED,
        value:speed
    });
};
VideoController.ToggleMute = async () => {
    VideoController.Dispatch({
        type:Actions.TOGGLE_MUTE
    });
};
VideoController.TogglePlayPause = async () => {
    VideoController.Dispatch({
        type:Actions.TOGGLE_PLAY_PAUSE
    });
};
VideoController.ToggleLoop = async () => {
    VideoController.Dispatch({
        type:Actions.TOGGLE_LOOP
    });
};
VideoController.ToggleAuto = async () => {
    VideoController.Dispatch({
        type:Actions.TOGGLE_AUTO
    });
};
VideoController.NextFrame = async () => {
    VideoController.Dispatch({
        type:Actions.NEXT_FRAME
    });
};
VideoController.PrevFrame = async () => {
    VideoController.Dispatch({
        type:Actions.PREV_FRAME
    });
};
VideoController.IncreaseVolume = async (amount:number) => {
    VideoController.Dispatch({
        type:Actions.ADJUST_VOLUME,
        value:Math.abs(amount)
    });
};
VideoController.DecreaseVolume = async (amount:number) => {
    VideoController.Dispatch({
        type:Actions.ADJUST_VOLUME,
        value:Math.abs(amount)*-1
    });
};
VideoController.IncreaseRate = async (amount:number) => {
    VideoController.Dispatch({
        type:Actions.ADJUST_RATE,
        value:Math.abs(amount)
    });
};
VideoController.DecreaseRate = async (amount:number) => {
    VideoController.Dispatch({
        type:Actions.ADJUST_RATE,
        value:Math.abs(amount)*-1
    });
};
VideoController.onKeyUp = async (ev) => {
    switch(ev.keyCode) {
        case keycodes.SPACEBAR :
        case keycodes.ENTER :
        case keycodes.P :
            VideoController.TogglePlayPause();
        break;

        case keycodes.RIGHT :
            VideoController.NextFrame();
        break;

        case keycodes.LEFT :
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
    }
};

VideoController.PrepareStateForSending = () => {
    let cstate:SVideoController = Object.assign({}, VideoController.GetState());
    cstate.Source = RemoveMediaPath(cstate.Source);
    cstate.AutoPlay = true;
    if(window && window.LocalServer) {
        cstate.Source = window.LocalServer.getVideoURL(cstate.Source);
    }
    return cstate;
};

VideoController.BuildAPI = async () => {

    const server = window.LocalServer;
    const exp = server.ExpressApp;

    //get state
    exp.get(/^\/api\/video(\/?)$/i, (req, res) => {
        res.send(server.PrepareObjectForSending(PrepareObjectForSending(VideoController.GetState())));
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
                        AddMediaPath('videos/' + req.body.src),
                        (req.body.muted === true) ? true : false
                    );
                break;
            }
        }
        res.end();
    });

    //stream a video
    exp.get(/^\/api\/video\/(.*?)\.{1}(mp4|wmv|webm){1}/i, (req, res) => {
        var file = AddMediaPath("videos/" + req.params[0] + "." + req.params[1]);
        let fs = require('fs');
        fs.stat(file, function(err, stats) {
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
    
          var stream = fs.createReadStream(file, { start: start, end: end, autoClose:true })
            .on("open", function() {
              stream.pipe(res);
            }).on("error", function(err) {
              res.end(err);
            });
        });
    });
};

export default VideoController;