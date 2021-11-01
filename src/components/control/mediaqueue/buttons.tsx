import { IconHidden, IconLeft, IconRight, IconVisible } from 'components/common/icons';
import React from 'react';
import { Capture } from 'tools/capture/functions';
import { Slideshow } from 'tools/slideshows/functions';
import { RecordType, VideoStatus } from 'tools/vars';
import { Videos } from 'tools/videos/functions';
import { VideoControls } from './video/controls';

interface Props {
    recordType:RecordType;
}

const MediaQueueButtons:React.FunctionComponent<Props> = props => {
    switch(props.recordType) {
        case 'ANT' : return <AnthemButtons/>;
        case 'SLS' : return <SlideshowButtons/>;
        case 'VID' : return <VideoButtons/>;
        default : return null;
    }
};

const AnthemButtons:React.FunctionComponent<{}> = props => {
    const [visible, setVisible] = React.useState(Capture.GetAnthem().visible || false);
    
    React.useEffect(() => Capture.Subscribe(() => {
        setVisible(Capture.GetAnthem().visible || false);
    }), []);

    return <>
        {
            (visible) &&
            <IconVisible asButton={true} active={true} onClick={Capture.ToggleAnthem}>Visible</IconVisible>
        }
        {
            (!visible) &&
            <IconHidden asButton={true} active={false} onClick={Capture.ToggleAnthem}>Hidden</IconHidden>
        }
    </>
}

/**
 * 
 * @param props 
 * @returns 
 */
const SlideshowButtons:React.FunctionComponent<{}> = props => {
    const [visible, setVisible] = React.useState(Capture.GetSlideshow().visible || false);
    const onNext = React.useCallback(() => {
        Slideshow.Next();
        Capture.UpdateSlideshow({visible:true});
    }, []);

    const onPrevious = React.useCallback(() => {
        Slideshow.Previous();
        Capture.UpdateSlideshow({visible:true});
    }, []);

    React.useEffect(() => Capture.Subscribe(() => {
        setVisible(Capture.GetSlideshow().visible || false);
    }), []);

    return <>
        {
            (visible) && 
            <IconVisible asButton={true} active={true} title='Click to Hide' onClick={Capture.ToggleSlideshow}>VISIBLE</IconVisible>
        }
        {
            (!visible) && 
            <IconHidden asButton={true} title='Click to Show' onClick={Capture.ToggleSlideshow}>HIDDEN</IconHidden>
        }
        <IconLeft asButton={true} title='Previous Slide' onClick={onPrevious}>PREV</IconLeft>
        <IconRight asButton={true} title='Next Slide' onClick={onNext}>NEXT</IconRight>
    </>
}

/**
 * 
 * @param props 
 * @returns 
 */
const VideoButtons:React.FunctionComponent<{}> = props => {
    const state = Videos.GetMainVideo();
    const [src, setSource] = React.useState(state.Source || '');
    const [status, setStatus] = React.useState(typeof(state.Status) === 'number' ? state.Status : VideoStatus.STOPPED);
    const [muted, setMuted] = React.useState(typeof(state.Muted) === 'boolean' ? state.Muted : false);
    const [loop, setLoop] = React.useState(typeof(state.Loop) === 'boolean' ? state.Loop : false);
    const [volume, setVolume] = React.useState(typeof(state.Volume) === 'number' ? state.Volume : 0.75);

    const onClickPlay = React.useCallback(() => {
        Videos.UpdateMainVideo({Status:VideoStatus.PLAYING}, true);
    }, []);

    const onClickPause = React.useCallback(() => {
        Videos.UpdateMainVideo({Status:VideoStatus.PAUSED}, true);
    }, []);

    const onClickStop = React.useCallback(() => {
        Videos.UpdateMainVideo({Status:VideoStatus.STOPPED}, true);
    }, []);

    const onChangeVolume = React.useCallback((volume:number) => {
        Videos.UpdateMainVideo({Volume:volume}, true);
    }, []);

    const onClickLoop = React.useCallback(() => {
        Videos.UpdateMainVideo({Loop:!loop}, true)
    }, [loop]);

    const onClickMute = React.useCallback(() => {
        Videos.UpdateMainVideo({Muted:!muted}, true);
    }, [muted]);

    React.useEffect(() => Capture.Subscribe(() => {
        const state = Videos.GetMainVideo();
        setSource(state.Source || '');
        setStatus(typeof(state.Status) === 'number' ? state.Status : VideoStatus.STOPPED);
        setMuted(typeof(state.Muted) === 'boolean' ? state.Muted : false);
        setLoop(typeof(state.Loop) === 'boolean' ? state.Loop : false);
        setVolume(typeof(state.Volume) === 'number' ? state.Volume : 0);
    }), []);

    return <VideoControls
        loop={loop}
        muted={muted}
        source={src}
        status={status}
        volume={volume}
        onClickMute={onClickMute}
        onClickPause={onClickPause}
        onClickPlay={onClickPlay}
        onClickStop={onClickStop}
        onChangeVolume={onChangeVolume}
        onClickLoop={onClickLoop}
    />
};

export {MediaQueueButtons};