import { Panel, PanelContent, PanelFooter, PanelTitle } from 'components/common/panel';
import React from 'react';
import { Unsubscribe } from 'redux';
import { Capture } from 'tools/capture/functions';
import Data from 'tools/data';
import { UIController } from 'tools/UIController';

interface Props {
    active:boolean;
    onHide:{():void};
}

interface State {
    announcer:boolean;
    anthem:boolean;
    autoSlideshow:boolean;
    gameClock:boolean;
    jamClock:boolean;
    jamCounter:boolean;
    penalties:boolean;
    raffle:boolean;
    roster:boolean;
    schedule:boolean;
    scorebanner:boolean;
    scoreboard:boolean;
    scorekeeper:boolean;
    slideshow:boolean;
    standings:boolean;
}

/**
 * Popup panel to show/hide capture elements.
 * @param props 
 * @returns 
 */
const CaptureDisplayPanel:React.FunctionComponent<Props> = props => {
    const [mode, setMode] = React.useState(UIController.GetState().Config.Misc?.Mode || '');
    const [appMode, setAppMode] = React.useState(UIController.GetState().Config.Misc?.AppMode || '');

    const saveMode = React.useCallback((value:string) => {
        value = (UIController.GetState().Config.Misc?.Mode === value) ? '' : value;
        UIController.UpdateConfigMisc({Mode:value});
        Data.SaveConfig(UIController.GetState().Config);
        setMode(value);
    }, []);

    const saveAppMode = React.useCallback((value:string) => {
        value = (UIController.GetState().Config.Misc?.AppMode === value) ? '' : value;
        UIController.UpdateConfigMisc({AppMode:value});
        Data.SaveConfig(UIController.GetState().Config);
        setAppMode(value);
    }, []);

    const onClickStream = React.useCallback(() => { saveMode('stream')}, []);
    const onClickBanner = React.useCallback(() => { saveMode('banner')}, []);
    const onClickAppMode = React.useCallback(() => { saveAppMode('split')}, []);

    return <Panel active={props.active} onHide={props.onHide}>
        <PanelTitle onHide={props.onHide}>Show/Hide</PanelTitle>
        <PanelContent>
            <CaptureButtons/>
        </PanelContent>
        <PanelFooter>
            <button className={appMode === 'split' ? 'active' : ''} onClick={onClickAppMode}>Split Apps</button>
            <button className={mode === 'banner' ? 'active' : ''} onClick={onClickBanner}>Banner</button>
            <button className={mode === 'stream' ? 'active' : ''} onClick={onClickStream}>Stream</button>
        </PanelFooter>
    </Panel>
}

/**
 * Collection of capture buttons to display.
 */
class CaptureButtons extends React.PureComponent<any, State> {
    readonly state:State = {
        announcer:false,
        anthem:false,
        autoSlideshow:false,
        gameClock:false,
        jamClock:false,
        jamCounter:false,
        penalties:false,
        raffle:false,
        roster:false,
        schedule:false,
        scorebanner:false,
        scoreboard:false,
        scorekeeper:false,
        slideshow:false,
        standings:false
    }

    protected remote?:Unsubscribe;

    protected update = () => {
        const state = UIController.GetState().Capture;
        this.setState({
            announcer:state.Announcers.visible || false,
            anthem:state.Anthem.visible || false,
            autoSlideshow:state.AutoSlideshow.visible || false,
            gameClock:state.GameClock.visible || false,
            jamClock:state.JamClock.visible || false,
            jamCounter:state.JamCounter.visible || false,
            penalties:state.PenaltyTracker.visible || false,
            raffle:state.Raffle.visible || false,
            roster:state.Roster.visible || false,
            schedule:state.Schedule.visible || false,
            scorebanner:state.Scorebanner.visible || false,
            scoreboard:state.Scoreboard.visible || false,
            scorekeeper:state.Scorekeeper.visible || false,
            slideshow:state.Slideshow.visible || false,
            standings:state.Standings.visible || false
        });
    }

    componentDidMount() {
        this.update();
        this.remote = UIController.Subscribe(this.update);
    }

    componentWillUnmount() {
        if(this.remote)
            this.remote();
    }

    render() {
        return <>
            <ToggleButton active={this.state.announcer} onClick={Capture.ToggleAnnouncers}>Announcers</ToggleButton>
            <ToggleButton active={this.state.anthem} onClick={Capture.ToggleAnthem}>Anthem</ToggleButton>
            <ToggleButton active={this.state.autoSlideshow} onClick={Capture.ToggleAutoSlideshow}>Auto-Slideshow</ToggleButton>
            <ToggleButton active={this.state.gameClock} onClick={Capture.ToggleGameClock}>Game Clock</ToggleButton>
            <ToggleButton active={this.state.jamClock} onClick={Capture.ToggleJamClock}>Jam Clock</ToggleButton>
            <ToggleButton active={this.state.jamCounter} onClick={Capture.ToggleJamCounter}>Jam Counter</ToggleButton>
            <ToggleButton active={this.state.penalties} onClick={Capture.TogglePenaltyTracker}>Penalties</ToggleButton>
            <ToggleButton active={this.state.raffle} onClick={Capture.ToggleRaffle}>Raffle</ToggleButton>
            <ToggleButton active={this.state.roster} onClick={Capture.ToggleRoster}>Roster</ToggleButton>
            <ToggleButton active={this.state.schedule} onClick={Capture.ToggleSchedule}>Schedule</ToggleButton>
            <ToggleButton active={this.state.scorebanner} onClick={Capture.ToggleScorebanner}>Scorebanner</ToggleButton>
            <ToggleButton active={this.state.scoreboard} onClick={Capture.ToggleScoreboard}>Scoreboard</ToggleButton>
            <ToggleButton active={this.state.scorekeeper} onClick={Capture.ToggleScorekeeper}>Scorekeeper</ToggleButton>
            <ToggleButton active={this.state.slideshow} onClick={Capture.ToggleSlideshow}>Slideshow</ToggleButton>
            <ToggleButton active={this.state.standings} onClick={Capture.ToggleStandings}>Standings</ToggleButton>
        </>
    }
}

/**
 * 
 * @param props 
 * @returns 
 */
const ToggleButton:React.FunctionComponent<{
    active:boolean;
    onClick:{():void};
}> = props => {
    return <button 
        className={props.active ? 'active' : ''} 
        onClick={props.onClick}
        style={{width:'100%',display:'block',textAlign:'left'}}
        >{props.children}</button>
};

export {CaptureDisplayPanel};