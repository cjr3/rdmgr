import classNames from 'classnames';
import React from 'react';
import { Capture } from 'tools/capture/functions';
import Data from 'tools/data';
import { Scoreboard } from 'tools/scoreboard/functions';
import { Scorekeeper } from 'tools/scorekeeper/functions';
import { TeamSide } from 'tools/vars';

interface Props extends React.HTMLProps<HTMLDivElement> {

}

/**
 * 
 * @param props 
 * @returns 
 */
const ScorekeeperStatusbar:React.FunctionComponent<Props> = props => {
    const [visible, setVisible] = React.useState(Capture.GetScorekeeper().visible || false);
    React.useEffect(() => Capture.Subscribe(() => {
        const state = Capture.GetScorekeeper();
        setVisible(state.visible || false);
    }), []);

    return <div {...props} className={classNames('section scorekeeper', props.className, {active:visible})}>
        <JammerItem side='A'/>
        <JammerItem side='B'/>
    </div>
};

/**
 * 
 * @param props 
 * @returns 
 */
const JammerItem:React.FunctionComponent<{side:TeamSide}> = props => {
    const team = (props.side === 'A') ? Scoreboard.GetState().TeamA : Scoreboard.GetState().TeamB;
    const skater = Scorekeeper.GetSkater(props.side, 'Track', 'Jammer');
    const [name, setName] = React.useState(skater?.Name || '');
    const [num, setNumber] = React.useState(skater?.Number || '');
    const [thumbnail, setThumbnail] = React.useState(skater?.Thumbnail || '');
    const [logo, setLogo] = React.useState(team?.Logo || '');

    let src = thumbnail || logo || '';
    let label = '';
    if(name && num) {
        label = '#' + num + ' ' + name;
    } else if(name) {
        label = name;
    } else if(num) {
        label = '#' + num;
    }

    React.useEffect(() => Scorekeeper.Subscribe(() => {
        const skater = Scorekeeper.GetSkater(props.side, 'Track', 'Jammer');
        setName(skater?.Name || '');
        setNumber(skater?.Number || '');
        setThumbnail(skater?.Thumbnail || '');
    }), [props.side]);

    React.useEffect(() => Scoreboard.Subscribe(() => {
        const team = (props.side === 'A') ? Scoreboard.GetState().TeamA : Scoreboard.GetState().TeamB;
        setLogo(team?.Logo || '');
    }), [props.side]);

    return <div 
        className={classNames('skater', {active:(skater !== undefined && skater?.Number) ? true : false})}
        >
        <div className='thumb'>
            {
                (src && src.length > 0) && <img src={Data.GetMediaPath(src)} alt=''/>
            }
        </div>
        <div className='label'>
            {label}
        </div>
    </div>
};

export {ScorekeeperStatusbar};