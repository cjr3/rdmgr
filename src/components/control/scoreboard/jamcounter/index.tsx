import { CounterButton } from 'components/common/inputs/counter';
import React from 'react';
import { Scoreboard } from 'tools/scoreboard/functions';

interface Props {

}

/**
 * Control jam counter.
 * @param props 
 * @returns 
 */
const JamCounterControl:React.FunctionComponent<Props> = props => {
    const [value, setValue] = React.useState(Scoreboard.GetState().JamNumber || 0);

    const onAdd = React.useCallback(() => Scoreboard.IncreaseJamCounter(), []);
    const onSubtract = React.useCallback(() => Scoreboard.DecreaseJamCounter(), []);

    React.useEffect(() => {
        return Scoreboard.Subscribe(() => {
            setValue(Scoreboard.GetState().JamNumber || 0);
        });
    }, []);

    return <CounterButton
        onAdd={onAdd}
        onSubtract={onSubtract}
        padding={2}
        amount={value}
        className='jam-counter'
    >
        <span className='caption'>Jam #</span>
    </CounterButton>;
}

export {JamCounterControl};