import classNames from 'classnames';
import { IconAlphaSort, IconHidden, IconLeft, IconReset, IconRight, IconSkater, IconTeam, IconVisible, IconX } from 'components/common/icons';
import React from 'react';
import { Capture } from 'tools/capture/functions';
import { compareStrings } from 'tools/functions';
import { Roster } from 'tools/roster/functions';
import { Scoreboard } from 'tools/scoreboard/functions';
import { RosterSkaterList } from './skaters';
import { RosterTeamControl } from './team';

interface Props extends React.HTMLProps<HTMLDivElement> {
    active:boolean;
    stream:boolean;
}

/**
 * Main roster control.
 * @param props 
 * @returns 
 */
const RosterControl:React.FunctionComponent<Props> = props => {
    const {active, stream, ...rprops} = {...props};
    const [dragSide, setDragSide] = React.useState('');
    const [tab, setTab] = React.useState('team-a');
    const [acolor, setAColor] = React.useState(Scoreboard.GetState().TeamA?.Color || '');
    const [aname, setAName] = React.useState(Scoreboard.GetState().TeamA?.Name || 'Left Team');
    const [bcolor, setBColor] = React.useState(Scoreboard.GetState().TeamB?.Color || '');
    const [bname, setBName] = React.useState(Scoreboard.GetState().TeamB?.Name || 'Right Team');
    const [visible, setVisible] = React.useState(Capture.GetRoster().visible || false);
    const onClickClear = React.useCallback(() => {
        Roster.SetSkaters('A', []);
        Roster.SetSkaters('B', []);
    }, []);

    const onClickReset = React.useCallback(() => Roster.Reset(), []);
    const onClickSort = React.useCallback(() => {
        const as = Roster.GetSkaters('A').slice();
        const bs = Roster.GetSkaters('B').slice();
        as.sort((a, b) => compareStrings(a.Name, b.Name, 'ASC'));
        bs.sort((a, b) => compareStrings(a.Name, b.Name, 'ASC'));
        Roster.SetSkaters('A', as);
        Roster.SetSkaters('B', bs);
    }, []);

    React.useEffect(() => {
        return Capture.Subscribe(() => {
            setVisible(Capture.GetRoster().visible || false);
        })
    }, []);

    React.useEffect(() => {
        return Scoreboard.Subscribe(() => {
            setAColor(Scoreboard.GetState()?.TeamA?.Color || '');
            setAName(Scoreboard.GetState()?.TeamA?.Name || '');
            setBColor(Scoreboard.GetState()?.TeamB?.Color || '');
            setBName(Scoreboard.GetState()?.TeamB?.Name || '');
        });
    }, []);

    return <div {...rprops} className={classNames('roster-control app', {active:props.active})}>
        <div className='content'>
            {
                (!stream || tab === 'team-a') &&
                <RosterTeamControl side='A' dragSide={dragSide} onDragSkater={setDragSide}/>
            }
            {
                (!stream || tab === 'skaters') &&
                <RosterSkaterList/>
            }
            {
                (!stream || tab === 'team-b') && 
                <RosterTeamControl side='B' dragSide={dragSide} onDragSkater={setDragSide}/>
            }
        </div>
        <div className='buttons'>
            <IconLeft asButton={true} onClick={Roster.Previous}>{(!stream) && <>PREVIOUS</>}</IconLeft>
            <IconRight asButton={true} onClick={Roster.Next}>{(!stream) && <>NEXT</>}</IconRight>
            {
                (stream) &&
                <>
                    <IconSkater asButton={true} onClick={() => setTab('skaters')} title='All Skaters' active={tab === 'skaters'}/>
                    <IconTeam asButton={true} onClick={() => setTab('team-a')} title={aname} active={tab === 'team-a'} style={{backgroundColor:acolor}}/>
                    <IconTeam asButton={true} onClick={() => setTab('team-b')} title={bname} active={tab === 'team-b'} style={{backgroundColor:bcolor}}/>
                </>
            }
            <IconVisible 
                asButton={true} 
                active={true}
                onClick={Capture.ToggleRoster} 
                title='Hide Roster'
                style={{display:(visible) ? 'inline-flex' : 'none'}}
                >
                {
                    (!stream) && <>VISIBLE</>
                }
            </IconVisible>
            <IconHidden 
                asButton={true} 
                onClick={Capture.ToggleRoster} 
                title='Show Roster'
                style={{display:(!visible) ? 'inline-flex' : 'none'}}
                >
                {
                    (!stream) && <>HIDDEN</>
                }
            </IconHidden>
            <IconX asButton={true} onClick={onClickClear} title='Remove all skaters'>
                {
                    (!stream) && <>Clear</>
                } 
            </IconX>
            <IconAlphaSort onClick={onClickSort} asButton={true} title='Sort skaters by name'>
                {
                    (!stream) && <>Sort</>
                }
            </IconAlphaSort>
            <IconReset asButton={true} onClick={onClickReset} title='Reset roster to match team assignment'>
                {
                    (!stream) && <>Reset</>
                }
            </IconReset>
        </div>
    </div>
};

export {RosterControl};