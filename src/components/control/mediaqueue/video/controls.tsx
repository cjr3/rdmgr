import classNames from 'classnames';
import { IconPause, IconPlay, IconStop, IconVolumeMute, IconVolumeNoMute } from 'components/common/icons';
import React from 'react';
import { VideoStatus } from 'tools/vars';

interface Props extends React.HTMLProps<HTMLDivElement> {
    loop:boolean;
    muted:boolean;
    source:string;
    status:VideoStatus;
    volume:number;
    onClickLoop:{():void};
    onClickMute:{():void};
    onClickPause:{():void};
    onClickPlay:{():void};
    onClickStop:{():void};
    onChangeVolume:{(value:number):void};
}

/**
 * 
 * @param props 
 * @returns 
 */
const VideoControls:React.FunctionComponent<Props> = props => {
    const {disabled, loop, muted, source, status, volume, onClickLoop, onClickMute, onClickPause, onClickPlay, onClickStop, onChangeVolume, ...rprops} = {...props};
    const onChangeVolumeValue = React.useCallback((ev:React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(ev.target.value);
        onChangeVolume(value * 0.01);
    }, [onChangeVolume]);

    return <div {...rprops} className={classNames('video-controls', rprops.className)}>
        <IconStop onClick={onClickStop} title='Stop' disabled={disabled}/>
        <IconPlay onClick={onClickPlay} title='Play' disabled={disabled} style={{display:(status !== VideoStatus.PLAYING) ? 'inline-flex' : 'none'}}/>
        <IconPause onClick={onClickPause} title='Pause' disabled={disabled} style={{display:(status === VideoStatus.PLAYING) ? 'inline-flex' : 'none'}}/>
        <IconVolumeMute onClick={onClickMute} title='Un-Mute' disabled={disabled} style={{display:(muted) ? 'inline-flex' : 'none'}}/>
        <IconVolumeNoMute onClick={onClickMute} title='Mute' disabled={disabled} style={{display:(!muted) ? 'inline-flex' : 'none'}}/>
        <input
            disabled={disabled}
            type='range'
            style={{verticalAlign:'top',marginTop:'16px'}}
            min={0}
            max={100}
            value={volume * 100}
            onChange={onChangeVolumeValue}
        />
    </div>
};

export {VideoControls};