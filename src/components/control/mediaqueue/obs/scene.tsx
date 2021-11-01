import classNames from 'classnames';
import { SceneItem } from 'obs-websocket-js';
import React from 'react';
import { OBS } from 'tools/obs/functions';
import { SceneItemControl } from './sceneitem';

interface Props extends React.HTMLProps<HTMLDivElement> {
    active:boolean;
    sceneName:string;
}

/**
 * 
 * @param props 
 * @returns 
 */
const SceneControl:React.FunctionComponent<Props> = props => {
    const {active, sceneName, ...rprops} = {...props};
    const [sources, setSources] = React.useState<SceneItem[]>([]);

    React.useEffect(() => {
        const scene = OBS.GetScene(sceneName);
        setSources(scene?.sources || []);
    }, [sceneName]);


    return <div {...rprops} className={classNames('scene-item', props.className)}>
        <div className='scene-name'>
            {sceneName}
        </div>
        {
            sources.map((source, index) => {
                return <SceneItemControl
                    sceneName={sceneName}
                    sourceName={source.name}
                    key={`source-${source.name}-${source.id}-${index}`}
                />
            })
        }
    </div>
};

export {SceneControl};