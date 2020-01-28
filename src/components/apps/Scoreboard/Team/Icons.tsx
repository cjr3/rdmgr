import React from 'react';import ScoreboardController from 'controllers/ScoreboardController';
import {
    IconButton,
    IconBolt,
    IconNo,
    IconFlag
} from 'components/Elements'
import vars from 'tools/vars';

export default class Icons extends React.PureComponent<{
    side:'A' | 'B';
}, {
    Status:number;
}> {
    readonly state = {
        Status:0
    }

    constructor(props) {
        super(props);
        this.state.Status = ScoreboardController.GetState().TeamA.Status;
        if(this.props.side == 'B')
            this.state.Status = ScoreboardController.GetState().TeamB.Status;
        this.updateScoreboard = this.updateScoreboard.bind(this);
        this.onClickChallenge = this.onClickChallenge.bind(this);
        this.onClickLeadJammer = this.onClickLeadJammer.bind(this);
        this.onClickTimeout = this.onClickTimeout.bind(this);
        this.onClickScore = this.onClickScore.bind(this);
        this.onContextMenuLeadJammer = this.onContextMenuLeadJammer.bind(this);
        this.onContextMenuScore = this.onContextMenuScore.bind(this);
    }

    protected updateScoreboard() {
        let status = ScoreboardController.GetState().TeamA.Status;
        if(this.props.side == 'B')
            status = ScoreboardController.GetState().TeamB.Status;
        this.setState({Status:status});
    }

    protected onClickTimeout() {
        ScoreboardController.SetTeamStatus(this.props.side, vars.Team.Status.Timeout);
    }

    protected onClickChallenge() {
        ScoreboardController.SetTeamStatus(this.props.side, vars.Team.Status.Challenge);
    }

    protected onClickScore() {
        ScoreboardController.IncreaseTeamScore(this.props.side, 1);
    }

    protected onContextMenuScore() {
        ScoreboardController.DecreaseTeamScore(this.props.side, 1);
    }

    protected onClickLeadJammer() {
        ScoreboardController.SetTeamStatus(this.props.side, vars.Team.Status.LeadJammer);
    }

    protected onContextMenuLeadJammer() {
        ScoreboardController.SetTeamStatus(this.props.side, vars.Team.Status.PowerJam);
    }

    componentDidMount() {
        this.updateScoreboard = ScoreboardController.Subscribe(this.updateScoreboard);
    }

    componentWillUnmount() {
        if(this.updateScoreboard)
            this.updateScoreboard();
    }

    /**
     * Renders team icons
     */
    render() {
        
        return (
            <div className={`team-controls team-${this.props.side}`}>
                <IconButton
                    src={IconNo}
                    onClick={this.onClickTimeout}
                    title="Timeout"
                    active={(this.state.Status ==  vars.Team.Status.Timeout)}
                />
                <IconButton
                    src={IconFlag}
                    onClick={this.onClickChallenge}
                    title="Challenge"
                    active={(this.state.Status ==  vars.Team.Status.Challenge)}
                />
                <IconButton
                    src={IconBolt}
                    onClick={this.onClickLeadJammer}
                    onContextMenu={this.onContextMenuLeadJammer}
                    title="Lead Jammer"
                    active={(this.state.Status ==  vars.Team.Status.LeadJammer || this.state.Status == vars.Team.Status.PowerJam)}
                />
                <IconButton
                    src={IconNo}
                    onClick={this.onClickScore}
                    onContextMenu={this.onContextMenuScore}
                    title="Score"
                />
            </div>
        );
    }
}