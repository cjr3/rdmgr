import classNames from 'classnames';
import { IconHidden, IconTeam, IconVisible, IconX } from 'components/common/icons';
import React from 'react';
import { Capture } from 'tools/capture/functions';
import { PenaltyTracker } from 'tools/penaltytracker/functions';
import { Scoreboard } from 'tools/scoreboard/functions';
import { PenaltyTrackerBench } from './bench';
import { PenaltyTrackerPenaltyList } from './penalties';
import { PenaltyTrackerTeam } from './team';

interface Props extends React.HTMLProps<HTMLDivElement> {
    active:boolean;
    stream:boolean;
}

/**
 * Main Penalty Tracker control
 * @param props 
 * @returns 
 */
const PenaltyTrackerControl:React.FunctionComponent<Props> = props => {
    const {active, stream, ...rprops} = {...props};
    const [skaterId, setSkaterID] = React.useState(0);
    const [visible, setVisible] = React.useState(Capture.GetPenaltyTracker().visible || false);
    const [acolor, setAColor] = React.useState(Scoreboard.GetState().TeamA?.Color || '');
    const [aname, setAName] = React.useState(Scoreboard.GetState().TeamA?.Name || 'Left Team');
    const [bcolor, setBColor] = React.useState(Scoreboard.GetState().TeamB?.Color || '');
    const [bname, setBName] = React.useState(Scoreboard.GetState().TeamB?.Name || 'Right Team');
    const [tab, setTab] = React.useState('team-a');
    const onSelectSkater = React.useCallback((id:number) => {
        setSkaterID(skaterId === id ? 0 : id);
    }, [skaterId]);

    React.useEffect(() => {
        return Capture.Subscribe(() => {
            setVisible(Capture.GetPenaltyTracker().visible || false);
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

    const onClickClear = React.useCallback(() => {
        setSkaterID(0);
        PenaltyTracker.Reset();
    }, []);

    return <div {...rprops} className={classNames('penalty-control app', {active:active})}>
        <div className='content'>
            {
                (!stream || tab === 'team-a') &&
                <PenaltyTrackerTeam side='A' skaterId={skaterId} onSelectSkater={onSelectSkater}/>
            }
            {
                (!stream || tab === 'team-b') &&
                <PenaltyTrackerTeam side='B' skaterId={skaterId} onSelectSkater={onSelectSkater}/>
            }
            <div className='penalty-side'>
                <PenaltyTrackerPenaltyList skaterId={skaterId}/>
                <PenaltyTrackerBench skaterId={skaterId} onSelectSkater={onSelectSkater}/>
            </div>
        </div>
        <div className='buttons'>
            {
                (stream) &&
                <>
                    <IconTeam asButton={true} onClick={() => setTab('team-a')} title={aname} active={tab === 'team-a'} style={{backgroundColor:acolor}}/>
                    <IconTeam asButton={true} onClick={() => setTab('team-b')} title={bname} active={tab === 'team-b'} style={{backgroundColor:bcolor}}/>
                </>
            }
            <IconVisible 
                asButton={true} 
                active={true} 
                title='Click to Hide' 
                onClick={Capture.TogglePenaltyTracker}
                style={{display:(visible) ? 'inline-flex' : 'none'}}
                >
                {(!stream) && <>VISIBLE</>}
            </IconVisible>
            <IconHidden 
                asButton={true} 
                title='Click to Show' 
                onClick={Capture.TogglePenaltyTracker}
                style={{display:(!visible) ? 'inline-flex' : 'none'}}
            >
                {(!stream) && <>HIDDEN</>}
            </IconHidden>
            <IconX asButton={true} onClick={onClickClear} title='Clear bench'>{(!stream) && <>CLEAR</>}</IconX>
        </div>
    </div>
}

export {PenaltyTrackerControl};