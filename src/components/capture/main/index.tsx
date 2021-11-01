import classNames from 'classnames';
import React from 'react';
import { UIController } from 'tools/UIController';
import { AnnouncerCapture } from '../announcers';
import { AnthemCapture } from '../anthem';
import { MainCaptureCamera } from '../media/maincamera';
import { MainVideo } from '../media/mainvideo';
import { PenaltyTrackerCapture } from '../penalty';
import { RaffleCapture } from '../raffle';
import { RosterCapture } from '../roster';
import { ScheduleCapture } from '../schedule';
import { ScoreboardCapture } from '../scoreboard';
import { LargeGameClock, LargeJamClock, LargeJamCounter } from '../scoreboard/large';
import { ScorekeeperCapture } from '../scorekeeper';
import { AutoSlideshowCapture } from '../slideshow/auto';
import { ManualSlidehowCapture } from '../slideshow/manual';
import { StandingsCapture } from '../standings';
import { StreamBanner } from '../streambanner';

interface Props {

}

const defBackground = '#000000';

/**
 * Main component for capture window.
 * @param props 
 * @returns 
 */
const MainCapture:React.FunctionComponent<Props> = props => {
    const [bgcolor, setBackgroundColor] = React.useState(UIController.GetState().Config.Colors?.CaptureBackground || defBackground);
    const [mode, setMode] = React.useState(UIController.GetState().Config.Misc?.Mode || '');

    React.useEffect(() => {
        return UIController.Subscribe(() => {
            setBackgroundColor(UIController.GetState().Config.Colors?.CaptureBackground || defBackground);
            setMode(UIController.GetState().Config.Misc?.Mode || '');
        });
    }, []);

    return <div className={classNames('app-capture', mode)} style={{backgroundColor:bgcolor}}>
        <div className='drag-box' onDoubleClick={ev => ev.preventDefault()}></div>
        <MainCaptureCamera/>
        <StreamBanner/>
        {
            (mode === '') &&
            <>
                <LargeGameClock/>
                <LargeJamClock/>
                <LargeJamCounter/>
            </>
        }
        <ScoreboardCapture/>
        <ScorekeeperCapture active={mode !== 'stream'}/>
        <PenaltyTrackerCapture/>
        <AutoSlideshowCapture/>
        <ManualSlidehowCapture/>
        <AnnouncerCapture/>
        <AnthemCapture stream={mode === 'stream'}/>
        <RaffleCapture/>
        <ScheduleCapture/>
        <StandingsCapture/>
        <RosterCapture stream={mode === 'stream'}/>
        <MainVideo/>
    </div>
};

export {MainCapture};