import React from 'react'
import cnames from 'classnames'
import vars from 'tools/vars';

interface PStatus {
    /**
     * Status code, from vars.Team.Status
     */
    status:number;
}

/**
 * Component for displaying a team's status on the scoreboard control
 * @param props PStatus
 */
export default function Status(props:PStatus) {
    const classNames = cnames({
        status:true,
        leadjammer:(props.status === vars.Team.Status.LeadJammer),
        powerjam:(props.status === vars.Team.Status.PowerJam),
        timeout:(props.status === vars.Team.Status.Timeout),
        challenge:(props.status === vars.Team.Status.Challenge),
        injury:(props.status === vars.Team.Status.Injury)
    });

    return (
        <div className={classNames}>{vars.Team.StatusText[props.status]}</div>
    );
}