import classNames from 'classnames';
import React from 'react';
import { Capture } from 'tools/capture/functions';
import { ScoreboardBoardStatus } from './boardstatus';
import { ScoreboardBreakClock } from './breakclock';
import { GameClock } from './gameclock';
import { JamClock } from './jamclock';
import { ScoreboardLeagueLogo } from './logo';
import { ScoreboardPhase } from './phase';
import { Team } from './team';

interface Props extends React.HTMLProps<HTMLDivElement> {

}

/**
 * Main scoreboard capture component.
 * @param props 
 * @returns 
 */
const ScoreboardCapture:React.FunctionComponent<Props> = props => {
    const [active, setActive] = React.useState(Capture.GetScoreboard().visible || false);
    const [className, setClassName] = React.useState(Capture.GetScoreboard().className);
    React.useEffect(() => {
        return Capture.Subscribe(() => {
            setActive(Capture.GetScoreboard().visible || false);
            setClassName(Capture.GetScoreboard().className);
        });
    }, []);
    return <div {...props} className={classNames('capture-scoreboard', props.className, className, {active:active})}>
        <Team side='A'/>
        <JamClock/>
        <Team side='B'/>
        <ScoreboardPhase/>
        <GameClock/>
        <ScoreboardBoardStatus/>
        <ScoreboardLeagueLogo/>
        <ScoreboardBreakClock/>
    </div>
};

export {ScoreboardCapture};