import classNames from 'classnames';
import React from 'react';
import { DataControl } from '../data';
import { RosterControl } from '../roster';
import { ScoreboardControl } from '../scoreboard';
import { PenaltyTrackerControl } from '../penaltytracker';
import { Taskbar } from './taskbar';
import { Titlebar } from './titlebar';
import { ScorekeeperControl } from '../scorekeeper';
import { MediaQueueControl } from '../mediaqueue';
import { CaptureDisplayPanel } from './capturepanel';
import { UIController } from 'tools/UIController';
import { RafflePanel } from './rafflepanel';
import { QuickVideoPanel } from './videopanel';
import { ScorekeeperReel } from '../scorekeeper/reel';
import { CameraPanel } from './camerapanel';
import { OBSControl } from '../obs';

interface Props extends React.HTMLProps<HTMLDivElement> {

}

/**
 * Main user interface component.
 * @param props 
 * @returns 
 */
const MainControl:React.FunctionComponent<Props> = props => {
    const [appCode, setAppCode] = React.useState(UIController.GetState().Config.Misc?.AppCode || 'SB');
    const [appMode, setAppMode] = React.useState(UIController.GetState().Config.Misc?.AppMode || '');
    const [panel, setPanel] = React.useState('');
    
    const toggleCamera = React.useCallback(() => setPanel(panel === 'camera' ? '' : 'camera'), [panel]);
    const toggleCapture = React.useCallback(() => setPanel(panel === 'capture' ? '' : 'capture'), [panel]);
    const toggleConfig = React.useCallback(() => setPanel(panel === 'config' ? '' : 'config'), [panel]);
    const toggleObs = React.useCallback(() => setPanel(panel === 'obs' ? '' : 'obs'), [panel]);
    const toggleRaffle = React.useCallback(() => setPanel(panel === 'raffle' ? '' : 'raffle'), [panel]);
    const hidePanel = React.useCallback(() => {setPanel('');}, []);

    React.useEffect(() => {
        return UIController.Subscribe(() => {
            setAppCode(UIController.GetState().Config.Misc?.AppCode || 'SB');
            setAppMode(UIController.GetState().Config.Misc?.AppMode || '');
        });
    }, []);

    return <div
        {...props}
        className={classNames('app-control', props.className, {
            split:appMode === 'split' && appCode !== 'SB'
        })}
        onContextMenu={ev => ev.preventDefault()}
        >
        <Titlebar/>
        <div className='content'>
            <ScoreboardControl active={appCode === 'SB' || appCode === 'split'}/>
            <RosterControl active={appCode === 'ROS'} stream={appMode === 'split'}/>
            <PenaltyTrackerControl active={appCode === 'PT'} stream={appMode === 'split'}/>
            <ScorekeeperControl active={appCode === 'SK'} stream={appMode === 'split'}/>
            <MediaQueueControl active={appCode === 'MQ'}/>
            <DataControl active={(panel === 'config')} onHide={hidePanel}/>
            <CaptureDisplayPanel active={(panel === 'capture')} onHide={hidePanel}/>
            <QuickVideoPanel active={(panel === 'video')} onHide={hidePanel}/>
            <RafflePanel active={panel === 'raffle'} onHide={hidePanel}/>
            <OBSControl active={panel === 'obs'} onHide={hidePanel}/>
            <ScorekeeperReel/>
            <CameraPanel active={(panel === 'camera')} onHide={hidePanel}/>
        </div>
        <Taskbar
            onSelectCamera={toggleCamera}
            onSelectCapture={toggleCapture}
            onSelectConfig={toggleConfig}
            onSelectOBS={toggleObs}
            onSelectRaffle={toggleRaffle}
        />
    </div>
}

export {MainControl};