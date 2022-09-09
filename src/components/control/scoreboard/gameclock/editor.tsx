import React from 'react';
import classNames from 'classnames';
import { IconCheck } from 'components/common/icons';
import { NumberInput } from 'components/common/inputs/numberinput';
import { GameClock } from 'tools/scoreboard/gameclock';
import { Scoreboard } from 'tools/scoreboard/functions';
import { ClockStatus } from 'tools/vars';
import { Clocks } from 'tools/clocks/functions';

interface Props extends React.HTMLProps<HTMLDivElement> {

}

/**
 * Component to edit game clock time.
 * @param props 
 * @returns 
 */
const GameClockEditor:React.FunctionComponent<Props> = props => {
    const [hour, setHour] = React.useState(0);
    const [minute, setMinute] = React.useState(0);
    const [second, setSecond] = React.useState(0);
    const [status, setStatus] = React.useState(Clocks.GetState().GameStatus || ClockStatus.STOPPED);

    const onClickSet = React.useCallback(() => {
        GameClock.set(hour, minute, second);
    }, [hour, minute, second]);

    React.useEffect(() => {
        return Clocks.Subscribe(() => {
            const state = Clocks.GetState();
            setStatus(state?.GameStatus || ClockStatus.STOPPED);
            if(state?.GameStatus === ClockStatus.RUNNING) {
                setHour(state.GameHour || 0);
                setMinute(state.GameMinute || 0);
                setSecond(state.GameSecond || 0);
            }
        })
    }, []);

    const disabled = status === ClockStatus.RUNNING ? true : false;
    return <div {...props} className={classNames('game-clock-editor', props.className, {active:disabled})}>
        <NumberInput 
            className='form-control'
            value={hour} 
            min={0} 
            max={23} 
            disabled={disabled}
            onChangeValue={setHour}
             /> :
        <NumberInput 
            className='form-control'
            value={minute} 
            onChangeValue={setMinute} 
            min={0} 
            max={59} 
            disabled={disabled}
        /> :
        <NumberInput 
            className='form-control'
            value={second} 
            onChangeValue={setSecond} 
            min={0} 
            max={59} 
            disabled={disabled}
            />
        <IconCheck onClick={onClickSet} title='Set Time' disabled={disabled}/>
    </div>
}

export {GameClockEditor};