import classNames from 'classnames';
import { VideoView } from 'components/capture/media/videoview';
import React from 'react';
import { Capture } from 'tools/capture/functions';
import { VideoStatus } from 'tools/vars';
import { Videos } from 'tools/videos/functions';
import { VideoControls } from './controls';

interface Props extends React.HTMLProps<HTMLDivElement> {
    active:boolean;
}

const VideoControl:React.FunctionComponent<Props> = props => {
    const {active, ...rprops} = {...props};
    const state = Videos.GetMainVideo();
    const [src, setSource] = React.useState(state.Source || '');
    const [status, setStatus] = React.useState(typeof(state.Status) === 'number' ? state.Status : VideoStatus.STOPPED);

    React.useEffect(() => Capture.Subscribe(() => {
        const state = Videos.GetMainVideo();
        setSource(state.Source || '');
        setStatus(typeof(state.Status) === 'number' ? state.Status : VideoStatus.STOPPED);
    }), []);

    return <div {...rprops} className={classNames('video-control mq-control', rprops.className, {active:active})}>
        <div className={classNames('preview', {
            playing:status === VideoStatus.PLAYING
        })}>
            <PreviewVideoControls source={src} mainStatus={status}/>
        </div>
    </div>
};

/**
 * Controls for video preview, default muted, and stops playing when the main video starts.
 * @param props 
 * @returns 
 */
const PreviewVideoControls:React.FunctionComponent<{
    mainStatus:VideoStatus;
    source:string;
}> = props => {
    const [status, setStatus] = React.useState(VideoStatus.STOPPED);
    const [muted, setMuted] = React.useState(true);
    const [loop, setLoop] = React.useState(false);
    const [volume, setVolume] = React.useState(0.25);

    const onClickLoop = React.useCallback(() => setLoop(!loop), [loop]);
    const onClickMute = React.useCallback(() => setMuted(!muted), [muted]);
    const onClickPause = React.useCallback(() => setStatus(VideoStatus.PAUSED), []);
    const onClickPlay = React.useCallback(() => {
        if(props.mainStatus !== VideoStatus.PLAYING)
            setStatus(VideoStatus.PLAYING)
    }, [props.mainStatus]);
    const onClickStop = React.useCallback(() => setStatus(VideoStatus.STOPPED), []);

    React.useEffect(() => {
        setStatus(VideoStatus.STOPPED);
    }, [props.source]);

    React.useEffect(() => {
        if(props.mainStatus === VideoStatus.PLAYING) {
            // console.log(props.mainStatus);
            setMuted(true);
            setStatus(VideoStatus.PAUSED);
        }
    }, [props.mainStatus]);

    const onClick = React.useCallback((ev:React.MouseEvent<HTMLVideoElement>) => {
        ev.stopPropagation();
        ev.preventDefault();
        if(props.mainStatus !== VideoStatus.PLAYING) {
            if(status === VideoStatus.PLAYING)
                setStatus(VideoStatus.PAUSED);
            else
                setStatus(VideoStatus.PLAYING);
        }
    }, [props.mainStatus, status]);

    return <>
        <VideoView
            status={status}
            autoPlay={false}
            volume={volume}
            loop={loop}
            muted={muted}
            src={props.source}
            onClick={onClick}
        >
            <VideoControls
                disabled={props.mainStatus === VideoStatus.PLAYING}
                loop={loop}
                muted={muted}
                volume={volume}
                status={status}
                source={props.source}
                onChangeVolume={setVolume}
                onClickLoop={onClickLoop}
                onClickMute={onClickMute}
                onClickPause={onClickPause}
                onClickPlay={onClickPlay}
                onClickStop={onClickStop}
            />
        </VideoView>
    </>
}

export {VideoControl};