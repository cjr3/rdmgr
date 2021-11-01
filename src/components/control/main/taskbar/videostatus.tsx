import classNames from 'classnames';
import React from 'react';
import { SecondsToTime } from 'tools/functions';
import { VideoStatus } from 'tools/vars';
import { Videos } from 'tools/videos/functions';

interface Props extends React.HTMLProps<HTMLDivElement> {

}

const VideoStatusBar:React.FunctionComponent<Props> = props => {
    const vstate = Videos.GetMainVideo();
    const [vStatus, setVideoStatus] = React.useState<VideoStatus>(vstate.Status || VideoStatus.STOPPED);
    const [vTime, setVideoTime] = React.useState(vstate.CurrentTime || 0);
    const [vDuration, setVideoDuration] = React.useState(vstate.Duration || 0);

    React.useEffect(() => Videos.SubscribeUI(() => {
        const state = Videos.GetMainVideo();
        // console.log('...updated?')
        setVideoStatus(typeof(state.Status) === 'number' ? state.Status : VideoStatus.STOPPED);
        setVideoTime(state.CurrentTime || 0);
        setVideoDuration(state.Duration || 0);
    }), []);

    let label = '';
    if(vStatus === VideoStatus.PLAYING)
        label = 'Playing';
    else if(vStatus === VideoStatus.PAUSED)
        label = 'Paused';

    let timePercent = 0;
    if(vTime > 0 && vDuration > 0) {
        if(vTime === vDuration)
            timePercent = 100;
        else
            timePercent = Math.round(vTime / vDuration * 100);
        timePercent = Math.min(100, timePercent);
    }

    const onChangeTime = () => {}

    return <div className={classNames('section video', {active:vStatus !== VideoStatus.STOPPED})}>
        <div className='status'>
            {label}
        </div>
        <div className='progress'>
            <input
                disabled={true}
                type='range'
                value={timePercent}
                onChange={onChangeTime}
                min={0}
                max={100}
            />
        </div>
        <div className='time'>
            {SecondsToTime(vTime)} / {SecondsToTime(vDuration)}
        </div>
    </div>
}

export {VideoStatusBar};