import classNames from 'classnames';
import React from 'react';
import { Capture } from 'tools/capture/functions';
import Data from 'tools/data';
import { Roster } from 'tools/roster/functions';
import { Scoreboard } from 'tools/scoreboard/functions';
import { SkaterRoster } from 'tools/vars';

interface Props extends React.HTMLProps<HTMLDivElement> {
    stream:boolean;
}

/**
 * Roster / intro display.
 * @param props 
 * @returns 
 */
const RosterCapture:React.FunctionComponent<Props> = props => {
    const {stream, ...rprops} = {...props};
    const capture = Capture.GetRoster();
    const [visible, setVisible] = React.useState(capture.visible || false);
    const [currentTarget, setCurrentTarget] = React.useState<'A'|'B'|'C'>('B');
    const [side, setSide] = React.useState(capture.side || '');
    const [index, setIndex] = React.useState(typeof(capture.index) === 'number' ? capture.index : -1);
    const [skaters, setSkaters] = React.useState<SkaterRoster[]>([]);

    const [teamColor, setTeamColor] = React.useState('');
    const [teamLogo, setTeamLogo] = React.useState('');
    const [teamName, setTeamName] = React.useState('');

    const [photoA, setPhotoA] = React.useState('');
    const [thumbA, setThumbnailA] = React.useState('');
    const [nameA, setNameA] = React.useState('');
    const [numA, setNumberA] = React.useState('');
    const [roleA, setRoleA] = React.useState('');
    const [colorA, setColorA] = React.useState('');

    const [photoB, setPhotoB] = React.useState('');
    const [thumbB, setThumbnailB] = React.useState('');
    const [nameB, setNameB] = React.useState('');
    const [numB, setNumberB] = React.useState('');
    const [roleB, setRoleB] = React.useState(''); 
    const [colorB, setColorB] = React.useState('');

    React.useEffect(() => Capture.Subscribe(() => {
        const state = Capture.GetRoster();
        setVisible(state.visible || false);
        setSide(state.side || '');
        setIndex(typeof(state.index) === 'number' ? state.index : -1);
    }), []);

    React.useEffect(() => {
        if(side === '') {
            setCurrentTarget('C');
        } else {
            if(currentTarget === 'A')
                setCurrentTarget('B');
            else
                setCurrentTarget('A');
        }
    }, [index]);

    React.useEffect(() => Scoreboard.Subscribe(() => {
        const state = Scoreboard.GetState();
        if(side === 'A') {
            setTeamColor(state.TeamA?.Color || '');
            setTeamName(state.TeamA?.Name || '');
            setTeamLogo(state.TeamA?.Logo || '');
        } else if(side === 'B') {
            setTeamColor(state.TeamB?.Color || '');
            setTeamName(state.TeamB?.Name || '');
            setTeamLogo(state.TeamB?.Logo || '');
        }
    }), [side]);

    React.useEffect(() => Roster.Subscribe(() => {
        const state = Roster.Get();
        if(side === 'A') {
            setSkaters(state.SkatersA || [])
        } else if(side === 'B') {
            setSkaters(state.SkatersB || []);
        } else {
            setSkaters([]);
        }
    }), [side]);

    React.useEffect(() => {
        const state = Roster.Get();
        const scoreboard = Scoreboard.GetState();
        if(side === 'A') {
            setTeamColor(scoreboard.TeamA?.Color || '');
            setTeamName(scoreboard.TeamA?.Name || '');
            setTeamLogo(scoreboard.TeamA?.Logo || '');
            setSkaters(state.SkatersA || [])
        } else if(side === 'B') {
            setTeamColor(scoreboard.TeamB?.Color || '');
            setTeamName(scoreboard.TeamB?.Name || '');
            setTeamLogo(scoreboard.TeamB?.Logo || '');
            setSkaters(state.SkatersB || []);
        } else {
            setTeamColor('');
            setTeamName('');
            setTeamLogo('');
        }
    }, [side]);

    // console.log(`${side}:${index}:${visible}:${teamName}`)

    React.useEffect(() => {
        if(currentTarget === 'A') {
            if(index === -1) {
                setNameA(teamName);
                setPhotoA(teamLogo);
                setColorA(teamColor);
                setThumbnailA(teamLogo);
                setRoleA('');
                setNumberA('');
            } else if(index < skaters.length && skaters[index]) {
                const skater = skaters[index];
                setNameA(skater?.Name || '');
                setPhotoA(skater?.Photo || '');
                setColorA(teamColor);
                setThumbnailA(skater?.Thumbnail || '');
                setRoleA('');
                setNumberA(skater?.Number || '');
            }
        } else if(currentTarget === 'B') {
            if(index === -1) {
                setNameB(teamName);
                setPhotoB(teamLogo);
                setColorB(teamColor);
                setThumbnailB(teamLogo);
                setRoleB('');
                setNumberB('');
            } else if(index < skaters.length && skaters[index]) {
                const skater = skaters[index];
                setNameB(skater?.Name || '');
                setPhotoB(skater?.Photo || '');
                setColorB(teamColor);
                setThumbnailB(skater?.Thumbnail || '');
                setRoleB('');
                setNumberB(skater?.Number || '');
            }
        }
    }, [
        currentTarget, 
        // index, 
        // teamName, 
        // teamColor, 
        // teamLogo,
        skaters
    ]);

    return <div {...rprops} className={classNames('capture-roster', rprops.className, {active:visible})}>
        <RosterItem
            active={currentTarget === 'A'}
            color={colorA}
            name={nameA}
            num={numA}
            photo={photoA}
            stream={stream}
            thumbnail={thumbA}
        />
        <RosterItem
            active={currentTarget === 'B'}
            color={colorB}
            name={nameB}
            num={numB}
            photo={photoB}
            stream={stream}
            thumbnail={thumbB}
        />
    </div>
};

const RosterItem:React.FunctionComponent<{
    active:boolean;
    className?:string;
    color:string;
    name:string;
    num:string;
    photo:string;
    stream:boolean;
    thumbnail:string;
}> = props => {
    let label:string = '';
    if(props.num && props.name) {
        label = '#' + props.num + ' ' + props.name;
    } else if(props.name) {
        label = props.name;
    }
    return <div 
        className={classNames('roster-item', props.className, {active:props.active})}
        style={{
            backgroundColor:(props.stream ? props.color : undefined)
        }}
        >
            <div className='overlay'></div>
        {
            (props.stream) &&
            <div className='thumb'>
            {
                (props.thumbnail && props.thumbnail.length > 0) &&
                <img src={Data.GetMediaPath(props.thumbnail)} alt=''/>
            }
            </div>
        }
        {
            (!props.stream) &&
            <div className='photo'>
            {
                (props.photo && props.photo.length > 0) &&
                <img src={Data.GetMediaPath(props.photo)} alt=''/>
            }
            </div>
        }
        <div className='name'>{label}</div>
    </div>;
};

export {RosterCapture};