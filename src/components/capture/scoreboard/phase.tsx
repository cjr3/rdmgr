import classNames from 'classnames';
import React from 'react';
import { Scoreboard } from 'tools/scoreboard/functions';

interface Props extends React.HTMLProps<HTMLDivElement> {

}

/**
 * Display phase name.
 * @param props 
 * @returns 
 */
const ScoreboardPhase:React.FunctionComponent<Props> = props => {
    const [label, setLabel] = React.useState(Scoreboard.GetState().PhaseName || '');
    React.useEffect(() => {
        return Scoreboard.Subscribe(() => {
            setLabel(Scoreboard.GetState().PhaseName || '');
        })
    }, []);
    return <div {...props} className={classNames('phase', props.className)}>{label}</div>
}

export {ScoreboardPhase};