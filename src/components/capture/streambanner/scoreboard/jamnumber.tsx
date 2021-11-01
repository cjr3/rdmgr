import classNames from 'classnames';
import React from 'react';
import { Capture } from 'tools/capture/functions';
import { Scoreboard } from 'tools/scoreboard/functions';

interface Props extends React.HTMLProps<HTMLDivElement> {

}

/**
 * Display jam number for capture window.
 * @param props 
 * @returns 
 */
const JamNumber:React.FunctionComponent<Props> = props => {
    const [jamNumber, setJamNumber] = React.useState(Scoreboard.GetState().JamNumber || 0);
    const [visible, setVisible] = React.useState(Capture.GetJamCounter().visible || false);
    const [clockVisible, setClockVisible] = React.useState(Capture.GetGameClock().visible || false);
    React.useEffect(() => {
        return Scoreboard.Subscribe(() => {
            setJamNumber(Scoreboard.GetState().JamNumber || 0);
        });
    },[]);
    React.useEffect(() => Capture.Subscribe(() => {
        setVisible(Capture.GetJamCounter().visible || false);
        setClockVisible(Capture.GetGameClock().visible || false);
    }), []);

    let label = '#' + jamNumber.toString().padStart(2,'0');
    if(!clockVisible) {
        label = 'JAM ' + label;
    }

    return <div {...props} className={classNames('jam-number', props.className, {active:visible,gameclockhidden:!clockVisible})}>{label}</div>
};

export {JamNumber};