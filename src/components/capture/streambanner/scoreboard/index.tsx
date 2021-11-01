import classNames from 'classnames';
import React from 'react';
import { BoardStatus } from './boardstatus';
import { GameClock } from './gameclock';
import { Team } from './team';

interface Props extends React.HTMLProps<HTMLDivElement> {

}

/**
 * Main component for scorebanner scoreboard.
 * @param props 
 * @returns 
 */
const ScorebannerScoreboard:React.FunctionComponent<Props> = props => {
    return <>
        <div {...props} className={classNames('teams', props.className)}>
            <Team side='A'/>
            <Team side='B'/>
        </div>
        <GameClock/>
        <BoardStatus/>
    </>
}

export {ScorebannerScoreboard};