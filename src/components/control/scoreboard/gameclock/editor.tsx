import React from 'react';
import classNames from 'classnames';
import { IconCheck } from 'components/common/icons';
import { NumberInput } from 'components/common/inputs/numberinput';
import { GameClock } from 'tools/scoreboard/gameclock';
import { Scoreboard } from 'tools/scoreboard/functions';
import { ClockStatus } from 'tools/vars';

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
    const [status, setStatus] = React.useState(Scoreboard.GetState().GameClock?.Status || ClockStatus.STOPPED);

    const onClickSet = React.useCallback(() => {
        GameClock.set(hour, minute, second);
    }, [hour, minute, second]);

    React.useEffect(() => {
        return Scoreboard.Subscribe(() => {
            const state = Scoreboard.GetState().GameClock;
            setStatus(state?.Status || ClockStatus.STOPPED);
            if(state?.Status === ClockStatus.RUNNING) {
                setHour(state.Hours || 0);
                setMinute(state.Minutes || 0);
                setSecond(state.Seconds || 0);
            }
        })
    }, []);

    const disabled = status === ClockStatus.RUNNING ? true : false;
    return <div {...props} className={classNames('game-clock-editor', props.className, {active:disabled})}>
        <NumberInput value={hour} onChangeValue={setHour} min={0} max={23} size={3} disabled={disabled}/> :
        <NumberInput value={minute} onChangeValue={setMinute} min={0} max={59} size={3} disabled={disabled}/> :
        <NumberInput value={second} onChangeValue={setSecond} min={0} max={59} size={3} disabled={disabled}/>
        <IconCheck onClick={onClickSet} title='Set Time' disabled={disabled}/>
    </div>
}

export {GameClockEditor};