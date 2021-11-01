import { CounterButton } from 'components/common/inputs/counter';
import React from 'react';
import { Scoreboard } from 'tools/scoreboard/functions';
import { TeamSide } from 'tools/vars';

interface Props {
    amount:number;
    side:TeamSide;
}

const TeamJamPointsControl:React.FunctionComponent<Props> = props => {

    const onAdd = React.useCallback(() => Scoreboard.IncreaseTeamJamPoints(props.side, 1), [props.side]);
    const onSubtract = React.useCallback(() => Scoreboard.DecreaseTeamJamPoints(props.side, 1), [props.side]);

    return <CounterButton
        amount={props.amount}
        padding={2}
        onAdd={onAdd}
        onSubtract={onSubtract}
    >
        <span className='caption'>Jam Pts</span>
    </CounterButton>
}

export {TeamJamPointsControl}