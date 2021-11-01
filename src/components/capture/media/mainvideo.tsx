import React from 'react';
import { ControlIPC } from 'tools/ipc';
import { UIController } from 'tools/UIController';
import { VideoConfig, VideoStatus } from 'tools/vars';
import { Videos } from 'tools/videos/functions';
import { VideoView } from './videoview';

interface Props extends React.HTMLProps<HTMLDivElement> {

}

/**
 * Main video capture component.
 * @param props 
 * @returns 
 */
const MainVideo:React.FunctionComponent<Props> = props => {
    const [className, setClassName] = React.useState('');
    const [status, setStatus] = React.useState<VideoStatus>(VideoStatus.STOPPED);
    const [muted, setMuted] = React.useState(false);
    const [volume, setVolume] = React.useState(1);
    const [src, setSource] = React.useState('');

    React.useEffect(() => {
        return UIController.Subscribe(() => {
            const values = Videos.GetMainVideo();
            setSource(values.Source || '');
            setClassName(values.className || '');
            if(typeof(values.Muted) === 'boolean')
                setMuted(values.Muted);
            if(typeof(values.Volume) === 'number')
                setVolume(values.Volume);
            if(typeof(values.Status) === 'number')
                setStatus(values.Status);
        });
    }, []);

    const onTimeUpdate = React.useCallback((ev:React.SyntheticEvent<HTMLVideoElement, Event>) => {
        const values:VideoConfig = {CurrentTime:ev.currentTarget.currentTime}
        ControlIPC.Send({action:'video',values:values});
    }, []);

    const onCanPlayThrough = React.useCallback((ev:React.SyntheticEvent<HTMLVideoElement, Event>) => {
        const values:VideoConfig = {Duration:ev.currentTarget.duration};
        ControlIPC.Send({action:'video', values:values});
    }, []);

    return <VideoView
        autoPlay={false}
        controls={false}
        className={className}
        muted={muted}
        src={src}
        status={status}
        volume={volume}
        onTimeUpdate={onTimeUpdate}
        onCanPlayThrough={onCanPlayThrough}
    />
}

export {MainVideo};