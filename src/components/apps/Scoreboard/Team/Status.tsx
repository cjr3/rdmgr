import React from 'react'
import cnames from 'classnames'
import vars from 'tools/vars';
import ScoreboardController from 'controllers/ScoreboardController';

/**
 * Component for displaying a team's status on the scoreboard control
 */
export default class Status extends React.PureComponent<{
    side:string;
}, {
    status:number;
}>{
    readonly state = {
        status:0
    }

    protected remoteScoreboard:Function|null = null;

    constructor(props) {
        super(props);
        this.updateScoreboard = this.updateScoreboard.bind(this);
    }

    updateScoreboard() {
        let cstate = ScoreboardController.getState();
        let status = cstate.TeamA.Status;
        if(this.props.side == cstate.TeamB.Side)
            status = cstate.TeamB.Status;
        if(status !== this.state.status) {
            this.setState({status:status});
        }
    }

    componentDidMount() {
        this.remoteScoreboard = ScoreboardController.subscribe(this.updateScoreboard);
    }

    componentWillUnmount() {
        if(this.remoteScoreboard !== null)
            this.remoteScoreboard();
    }

    render() {
        const classNames = cnames({
            status:true,
            leadjammer:(this.state.status === vars.Team.Status.LeadJammer),
            powerjam:(this.state.status === vars.Team.Status.PowerJam),
            timeout:(this.state.status === vars.Team.Status.Timeout),
            challenge:(this.state.status === vars.Team.Status.Challenge),
            injury:(this.state.status === vars.Team.Status.Injury)
        });
        return (
            <div className={classNames}>{vars.Team.StatusText[this.state.status]}</div>
        );
    }
    
}