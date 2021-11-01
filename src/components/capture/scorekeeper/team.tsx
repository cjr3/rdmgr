import classNames from 'classnames';
import React from 'react';
import Data from 'tools/data';
import { Scoreboard } from 'tools/scoreboard/functions';
import { TeamSide } from 'tools/vars';
import { SkaterItem } from './skater';

interface Props extends React.HTMLProps<HTMLDivElement> {
    side:TeamSide;
}

/**
 * Display a team on the scorekeeper.
 * @param props 
 * @returns 
 */
const Team:React.FunctionComponent<Props> = props => {
    const {side, ...rprops} = {...props};
    const [color, setColor] = React.useState('');
    const [name, setName] = React.useState('');
    const [logo, setLogo] = React.useState('');

    React.useEffect(() => {
        return Scoreboard.Subscribe(() => {
            const team = (side === 'A') ? Scoreboard.GetState().TeamA : Scoreboard.GetState().TeamB;
            setColor(team?.Color || '#000000');
            setName(team?.Name || '');
            setLogo(team?.Logo || '');
        })
    }, []);

    return <div 
        {...rprops}
        className={classNames('team team-' + side, rprops.className)}>
        <div className='logo'>
            {
                (logo && logo.length > 0) &&
                <img src={Data.GetMediaPath(logo)} alt=''/>
            }
        </div>
        <div className='name' style={{backgroundColor:color}}>{name}</div>
        <div className='skaters'>
            <SkaterItem side={side} deck='Track' position='Jammer'/>
            <SkaterItem side={side} deck='Track' position='Pivot'/>
            <SkaterItem side={side} deck='Track' position='Blocker1'/>
            <SkaterItem side={side} deck='Track' position='Blocker2'/>
            <SkaterItem side={side} deck='Track' position='Blocker3'/>
        </div>
    </div>
};

export {Team};