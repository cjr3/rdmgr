import React from 'react'
import cnames from 'classnames'
import vars from 'tools/vars'

class Status extends React.PureComponent {
    render() {
        const classNames = cnames({
            status:true,
            leadjammer:(this.props.status === vars.Team.Status.LeadJammer),
            powerjam:(this.props.status === vars.Team.Status.PowerJam),
            timeout:(this.props.status === vars.Team.Status.Timeout),
            challenge:(this.props.status === vars.Team.Status.Challenge),
            injury:(this.props.status === vars.Team.Status.Injury)
        });

        return (
            <div className={classNames}>{vars.Team.StatusText[this.props.status]}</div>
        )
    }
}

export default Status;