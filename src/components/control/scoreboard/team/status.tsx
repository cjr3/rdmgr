import classNames from 'classnames';
import React from 'react';
import { Scoreboard } from 'tools/scoreboard/functions';
import { ScoreboardTeamStatus, TeamSide } from 'tools/vars';

interface Props {
    side:TeamSide;
    status:number;
}

const getClassName = (status:number) => {
    return classNames('label', {
        challenge:status === ScoreboardTeamStatus.CHALLENGE,
        injury:status === ScoreboardTeamStatus.INJURY,
        lead:status === ScoreboardTeamStatus.LEADJAM,
        power:status === ScoreboardTeamStatus.POWERJAM,
        timeout:status === ScoreboardTeamStatus.TIMEOUT
    })
}

/**
 * Display team status.
 * @param props 
 * @returns 
 */
const TeamStatus:React.FunctionComponent<Props> = props => {
    const [label, setLabel] = React.useState(Scoreboard.GetTeamStatusLabel(props.side));
    const [className, setClassName] = React.useState(getClassName(props.status));
    React.useEffect(() => {
        if(props.status !== ScoreboardTeamStatus.NORMAL) {
            setLabel(Scoreboard.GetTeamStatusLabel(props.side));
            setClassName(getClassName(props.status));
        }
    }, [props.status, props.side]);
    return <div className={classNames('status transform-container', {
        active:props.status !== ScoreboardTeamStatus.NORMAL
    })}>
        <div className={className}>{label}</div>
    </div>
};

export {TeamStatus};