import classNames from 'classnames';
import { IconReset, IconStopwatch, IconTeam } from 'components/common/icons';
import React from 'react';
import { Scoreboard } from 'tools/scoreboard/functions';
import { ScoreboardTeamStatus } from 'tools/vars';
import { BreakClockControl } from './breakclock';
import { ScoreboardEdit } from './edit';
import { GameClockControl } from './gameclock';
import { JamClockControl } from './jamclock';
import { JamControl } from './jamclock/control';
import { JamCounterControl } from './jamcounter';
import { ScoreboardPanels } from './panels';
import { ScoreboardPhase } from './phase';
import { ScoreboardStatusLabel } from './status';
import { ScoreboardButtons } from './status/buttons';
import { Team } from './team';
import { TeamButtons } from './team/buttons';

interface Props extends React.HTMLProps<HTMLDivElement> {
    active:boolean;
}

/**
 * Main scoreboard control.
 * @param props 
 * @returns 
 */
const ScoreboardControl:React.FunctionComponent<Props> = props => {
    const scoreboard = Scoreboard.GetState();
    const [panel, setPanel] = React.useState('');
    const [dialog, setDialog] = React.useState('');
    const [statusA, setTeamAStatus] = React.useState(typeof(scoreboard.TeamA?.Status) === 'number' ? scoreboard.TeamA.Status : ScoreboardTeamStatus.NORMAL);
    const [statusB, setTeamBStatus] = React.useState(typeof(scoreboard.TeamB?.Status) === 'number' ? scoreboard.TeamB.Status : ScoreboardTeamStatus.NORMAL);
    const onHidePanel = React.useCallback(() => setPanel(''), []);
    const togglePanel = React.useCallback((v:string) => {
        setPanel(panel === v ? '' : v);
    }, [panel]);

    const togglePhase = React.useCallback(() => togglePanel('phase'), [panel]);
    const toggleTeams = React.useCallback(() => togglePanel('teams'), [panel]);
    const toggleJamReset = React.useCallback(() => togglePanel('jamreset'), [panel]);
    const onClickEdit = React.useCallback(() => setDialog('edit'), []);

    const onHideDialog = React.useCallback(() => setDialog(''), []);

    React.useEffect(() => Scoreboard.Subscribe(() => {
        const scoreboard = Scoreboard.GetState();
        setTeamAStatus(typeof(scoreboard.TeamA?.Status) === 'number' ? scoreboard.TeamA.Status : ScoreboardTeamStatus.NORMAL);
        setTeamBStatus(typeof(scoreboard.TeamB?.Status) === 'number' ? scoreboard.TeamB.Status : ScoreboardTeamStatus.NORMAL);
    }), []);

    return <>
        <div className={classNames('scoreboard-control app', props.className, {active:props.active})}>
            <div className='content'>
                <Team className='team-a' side='A'/>
                <div className='center-controls'>
                    <JamClockControl/>
                    <div className='jam-break'>
                        <JamCounterControl/>
                        <BreakClockControl/>
                    </div>
                    <ScoreboardStatusLabel/>
                    <ScoreboardPhase/>
                    <GameClockControl/>
                </div>
                <Team className='team-b' side='B'/>
                <div className='bottom-controls'>
                    <div className='team-buttons team-a'>
                        <TeamButtons side={'A'} status={statusA}/>
                    </div>
                    <JamControl/>
                    <div className='team-buttons team-b'>
                        <TeamButtons side={'B'} status={statusB}/>
                    </div>
                </div>
                <ScoreboardPanels
                    active={(panel && panel.length > 0) ? true : false}
                    panel={panel}
                    onHide={onHidePanel}
                />
            </div>
            <div className='buttons'>
                <ScoreboardButtons/>
                <IconStopwatch 
                    active={(panel === 'phase')}
                    asButton={true} 
                    onClick={togglePhase}>
                    QUARTER
                </IconStopwatch>
                <IconTeam
                    active={panel === 'teams'}
                    asButton={true}
                    onClick={toggleTeams}
                    >
                    Teams
                </IconTeam>
                <IconReset 
                    active={panel === 'jamreset'}
                    asButton={true}
                    onClick={toggleJamReset}
                    >
                    Reset
                </IconReset>
                <button onClick={onClickEdit}>EDIT</button>
            </div>
        </div>
        {
            (props.active && dialog === 'edit') &&
            <ScoreboardEdit onHide={onHideDialog}/>
        }
    </>
};

export {ScoreboardControl};