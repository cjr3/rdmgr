import classNames from 'classnames';
import React from 'react';
import { OBS } from 'tools/obs/functions';
import { SceneControl } from './scene';

interface Props extends React.HTMLProps<HTMLDivElement> {
    active:boolean;
}

/**
 * Media-queue controls for Open Broadcaster Studio
 * @param props 
 * @returns 
 */
const OBSMediaControl:React.FunctionComponent<Props> = props => {
    const {active, ...rprops} = {...props};
    const [connected, setConnected] = React.useState(OBS.GetState().OBSSettings.Connected);
    const [updateTime, setUpdateTime] = React.useState(0);
    const [sceneName, setSceneName] = React.useState(OBS.GetState().OBSScenes?.currentScene || '');

    React.useEffect(() => OBS.Subscribe(() => {
        setConnected(OBS.GetState().OBSSettings.Connected);
        setUpdateTime(OBS.GetState().UpdateTimeOBS);
    }), []);

    React.useEffect(() => {
        setSceneName(OBS.GetState().OBSSettings.CurrentSceneName);
    }, [updateTime]);

    return <div {...rprops} className={classNames('obs-media-control', props.className, {active:active})}>
        {
            (!connected) &&
            <div style={{padding:'16px'}}>
                <p>Unable to connect to Open Broadcaster Studio</p>
                <ul>
                    <li>Is OBS installed and running?</li>
                    <li>Is the obs-websocket plugin installed?</li>
                </ul>
            </div>
        }
        {
            (connected) &&
            <div>
                <SceneControl
                    active={true}
                    sceneName={sceneName}
                />
            </div>
        }
    </div>
};

export {OBSMediaControl};