import classNames from 'classnames';
import React from 'react';
import { Unsubscribe } from 'redux';
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

const defBackground = '#000000';

interface Props {

}

interface State {
    bgcolor:string;
    mode:string;
    scoreboardVisible:boolean;
}

/**
 * 
 */
class MainCapture extends React.PureComponent<Props, State> {
    readonly state:State = {
        bgcolor:defBackground,
        mode:'defmode',
        scoreboardVisible:false
    }

    protected remote?:Unsubscribe;

    /**
     * 
     */
    protected update = () => {
        const state = UIController.GetState();
        this.setState({
            bgcolor:state.Config.Colors?.CaptureBackground || defBackground,
            mode:state.Config.Misc?.Mode || 'defmode',
            scoreboardVisible:state.Capture?.Scoreboard?.visible || false
        });
    }

    /**
     * 
     * @param ev 
     */
    protected onDoubleClick = (ev:React.MouseEvent<HTMLElement>) => {
        ev.preventDefault();
        ev.stopPropagation();
    }

    componentDidMount() {
        this.update();
        this.remote = UIController.Subscribe(this.update);
    }

    componentWillUnmount() {
        if(this.remote)
            this.remote();
    }

    render(): React.ReactNode {

        return <div 
            className={classNames('app-capture', this.state.mode, {
                sbvisible:this.state.scoreboardVisible
            })}
            style={{backgroundColor:this.state.bgcolor}}
            >
            <div className='drag-box' onDoubleClick={this.onDoubleClick}></div>
            <MainCaptureCamera/>
            <StreamBanner/>
            {
                (this.state.mode === '') &&
                <>
                    <LargeGameClock/>
                    <LargeJamClock/>
                    <LargeJamCounter/>
                </>
            }
            <ScoreboardCapture/>
            <ScorekeeperCapture active={this.state.mode !== 'stream'}/>
            <PenaltyTrackerCapture/>
            <AutoSlideshowCapture/>
            <ManualSlidehowCapture/>
            <AnnouncerCapture/>
            <AnthemCapture stream={this.state.mode === 'stream'}/>
            <RaffleCapture/>
            <ScheduleCapture/>
            <StandingsCapture/>
            <RosterCapture stream={this.state.mode === 'stream'}/>
            <MainVideo/>
        </div>
    }
}

export {MainCapture};