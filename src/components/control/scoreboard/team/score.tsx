import React from 'react';
import { Scoreboard } from 'tools/scoreboard/functions';
import { TeamSide } from 'tools/vars';

interface Props {
    color:string;
    score:number;
    side:TeamSide;
}

const InitAmount = 1;
const LargeAmount = 5;

/**
 * Display team score.
 * User can click to increase / decrease.
 * @param props 
 * @returns 
 */
const Score:React.FunctionComponent<Props> = props => {
    const onClick = React.useCallback((ev:React.MouseEvent<HTMLDivElement>) => {
        ev.stopPropagation();
        ev.preventDefault();
        if(ev.shiftKey)
            Scoreboard.DecreaseTeamScore(props.side, ev.ctrlKey ? LargeAmount : InitAmount);
        else
            Scoreboard.IncreaseTeamScore(props.side, ev.ctrlKey ? LargeAmount : InitAmount);
    }, [props.side]);

    const onContextMenu = React.useCallback((ev:React.MouseEvent<HTMLDivElement>) => {
        ev.stopPropagation();
        ev.preventDefault();
        Scoreboard.DecreaseTeamScore(props.side, ev.ctrlKey ? LargeAmount : InitAmount);
    }, [props.side]);

    return <div className='score' onClick={onClick} onContextMenu={onContextMenu}>
        <div className='value' style={{backgroundColor:props.color}}>{props.score}</div>
    </div>
}

export {Score};