import { IconAV, IconClipboard, IconOBS, IconSettings, IconSkate, IconStream, IconStreamSend, IconTeam, IconTicket, IconWhistle } from 'components/common/icons';
import React from 'react';
import Data from 'tools/data';
import { UIController } from 'tools/UIController';
import { TaskbarStatus } from './status';

interface Props {
    onSelectCamera:{():void};
    onSelectCapture:{():void};
    onSelectConfig:{():void};
    onSelectOBS:{():void};
    onSelectRaffle:{():void};
}

/**
 * Display icons and current status.
 */
const Taskbar:React.FunctionComponent<Props> = props => {
    const [appCode, setAppCode] = React.useState(UIController.GetState().Config.Misc?.AppCode || 'SB');
    const setApplication = React.useCallback((code:string) => {
        UIController.UpdateConfigMisc({AppCode:code});
        Data.SaveConfig(UIController.GetState().Config);
    }, []);

    const onClickScoreboard = React.useCallback(() => setApplication('SB'), []);
    const onClickRoster = React.useCallback(() => setApplication('ROS'), []);
    const onClickPenalty = React.useCallback(() => setApplication('PT'), []);
    const onClickScorekeeper = React.useCallback(() => setApplication('SK'), []);
    const onClickMediaQueue = React.useCallback(() => setApplication('MQ'), []);
    
    React.useEffect(() => UIController.Subscribe(() => {
        setAppCode(UIController.GetState().Config.Misc?.AppCode || 'SB');
    }), []);
    
    return <div className='taskbar'>
        <div className='app-icons'>
            <IconSkate active={appCode === 'SB'} onClick={onClickScoreboard}  title='Scoreboard'/>
            <IconTeam active={appCode === 'ROS'} onClick={onClickRoster} title='Roster'/>
            <IconWhistle active={appCode === 'PT'} onClick={onClickPenalty} title='Penalty Tracker'/>
            <IconClipboard active={appCode === 'SK'} onClick={onClickScorekeeper} title='Scorekeeper'/>
            <IconAV active={appCode === 'MQ'} onClick={onClickMediaQueue} title='Media'/>
        </div>
        <TaskbarStatus/>
        <div className='misc-icons'>
            <IconOBS onClick={props.onSelectOBS} title='OBS'/>
            <IconStream onClick={props.onSelectCamera} title='Camera'/>
            <IconTicket onClick={props.onSelectRaffle} title='Raffle'/>
            <IconStreamSend onClick={props.onSelectCapture} title='Capture Display'/>
            <IconSettings onClick={props.onSelectConfig} title='Settings'/>
        </div>
    </div>
}

export {Taskbar};