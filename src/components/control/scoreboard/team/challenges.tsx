import { CounterButton } from 'components/common/inputs/counter';
import React from 'react';
import { Scoreboard } from 'tools/scoreboard/functions';
import { TeamSide } from 'tools/vars';

interface Props {
    amount:number;
    side:TeamSide;
}

/**
 * Control team challenges
 * @param props 
 * @returns 
 */
const TeamChallengesControl:React.FunctionComponent<Props> = props => {
    const onAdd = React.useCallback(() => {
        Scoreboard.IncreaseTeamChallenges(props.side, 1);
    }, [props.side]);
    
    const onSubtract = React.useCallback(() => {
        Scoreboard.DecreaseTeamChallenges(props.side, 1);
    }, [props.side]);
    
    return <CounterButton
        amount={props.amount}
        padding={2}
        onAdd={onAdd}
        onSubtract={onSubtract}
    >
        <span className='caption'>Challenges</span>
    </CounterButton>
}

export {TeamChallengesControl}