import { IconBolt, IconFlag, IconNo, IconPlus } from 'components/common/icons';
import React from 'react';
import { Scoreboard } from 'tools/scoreboard/functions';
import { ScoreboardTeamStatus, TeamSide } from 'tools/vars';

interface Props {
    side:TeamSide;
    status:number;
}

const ctrlAmount = 5;
const baseAmount = 1;

const TeamButtons:React.FunctionComponent<Props> = props => {
    const onClickChallenge = React.useCallback(() => {
        Scoreboard.SetTeamStatus(props.side, ScoreboardTeamStatus.CHALLENGE);
        Scoreboard.SetTeamStatus((props.side === 'A') ? 'B' : 'A', ScoreboardTeamStatus.NORMAL);
    }, [props.side]);

    const onClickTimeout = React.useCallback(() => {
        Scoreboard.SetTeamStatus(props.side, ScoreboardTeamStatus.TIMEOUT);
        Scoreboard.SetTeamStatus((props.side === 'A') ? 'B' : 'A', ScoreboardTeamStatus.NORMAL);
    }, [props.side]);

    const onClickLead = React.useCallback(() => {
        Scoreboard.SetTeamStatus(props.side, ScoreboardTeamStatus.LEADJAM);
        Scoreboard.SetTeamStatus((props.side === 'A') ? 'B' : 'A', ScoreboardTeamStatus.NORMAL);
    }, [props.side]);

    const onClickScore = React.useCallback((ev:React.MouseEvent<HTMLButtonElement>) => {
        const amount = (ev.ctrlKey) ? ctrlAmount : baseAmount;
        if(ev.shiftKey) {
            if(!Scoreboard.DecreaseTeamJamPoints(props.side, amount))
                Scoreboard.DecreaseTeamScore(props.side, amount);
        }
        else {
            if(!Scoreboard.IncreaseTeamJamPoints(props.side, amount))
                Scoreboard.IncreaseTeamScore(props.side, amount);
        }
    }, [props.side]);

    const onContextAll = React.useCallback(() => Scoreboard.SetTeamStatus(props.side, ScoreboardTeamStatus.NORMAL), [props.side]);

    const onContextLead = React.useCallback(() => {
        Scoreboard.SetTeamStatus(props.side, ScoreboardTeamStatus.POWERJAM);
        Scoreboard.SetTeamStatus((props.side === 'A') ? 'B' : 'A', ScoreboardTeamStatus.NORMAL);
    }, [props.side]);

    const onContextScore = React.useCallback(() => {
        if(!Scoreboard.DecreaseTeamJamPoints(props.side, baseAmount))
            Scoreboard.DecreaseTeamScore(props.side, baseAmount);
    }, [props.side]);
    
    return <>
        <IconFlag 
            active={props.status === ScoreboardTeamStatus.CHALLENGE}
            title='Challenge'
            onClick={onClickChallenge} 
            onContextMenu={onContextAll} 
            />
        <IconNo 
            active={props.status === ScoreboardTeamStatus.TIMEOUT}
            title='Timeout'
            onClick={onClickTimeout} 
            onContextMenu={onContextAll} 
            />
        <IconBolt
            active={props.status === ScoreboardTeamStatus.LEADJAM || props.status === ScoreboardTeamStatus.POWERJAM} 
            title='Lead Jammer'
            onClick={onClickLead} 
            onContextMenu={onContextLead} 
            />
        <IconPlus onClick={onClickScore} onContextMenu={onContextScore} title='Score'/>
    </>
}

export {TeamButtons}