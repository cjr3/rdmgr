import React from 'react';
import cnames from 'classnames';
import vars from 'tools/vars';

interface PBoardStatus {
    status:number,
    className?:string
}

export default function BoardStatus(props:PBoardStatus) {
    var classNames = cnames({
        boardstatus:true,
        timeout:(props.status === vars.Scoreboard.Status.Timeout),
        injury:(props.status === vars.Scoreboard.Status.Injury),
        upheld:(props.status === vars.Scoreboard.Status.Upheld),
        overturned:(props.status === vars.Scoreboard.Status.Overturned),
        review:(props.status === vars.Scoreboard.Status.Review)
    }, props.className);

    return (
        <div className={classNames}>{vars.Scoreboard.StatusText[props.status]}</div>
    );
}