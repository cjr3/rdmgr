import React from 'react';
import ScorekeeperController from 'controllers/ScorekeeperController';
import PenaltyController from 'controllers/PenaltiesController';
import { SkaterRecord } from 'tools/vars';
import { Unsubscribe } from 'redux';
import ScoreboardController from 'controllers/ScoreboardController';
import {SkaterItem} from 'components/apps/Scorekeeper/Positions';
import Positions from 'components/apps/Scorekeeper/Positions';

export default class StatusPanel extends React.PureComponent<any, {
    JammerA:SkaterRecord;
    JammerB:SkaterRecord;
    TeamAColor:string;
    TeamBColor:string;
    Penalties:Array<SkaterRecord>;
}> {
    readonly state = {
        JammerA:ScorekeeperController.GetState().TeamA.Track.Jammer,
        JammerB:ScorekeeperController.GetState().TeamB.Track.Jammer,
        TeamAColor:ScoreboardController.GetState().TeamA.Color,
        TeamBColor:ScoreboardController.GetState().TeamB.Color,
        Penalties:PenaltyController.GetState().Skaters
    }

    protected remoteScorekeeper?:Unsubscribe;
    protected remotePenalty?:Unsubscribe;
    protected remoteScoreboard?:Unsubscribe;

    constructor(props) {
        super(props);
        this.updateScorekeeper = this.updateScorekeeper.bind(this);
        this.updatePenalty = this.updatePenalty.bind(this);
        this.updateScoreboard = this.updateScoreboard.bind(this);
    }

    protected updateScorekeeper() {
        this.setState({
            JammerA:ScorekeeperController.GetState().TeamA.Track.Jammer,
            JammerB:ScorekeeperController.GetState().TeamB.Track.Jammer
        });
    }

    protected updatePenalty() {
        this.setState({
            Penalties:PenaltyController.GetState().Skaters
        });
    }

    protected updateScoreboard() {
        this.setState({
            TeamAColor:ScoreboardController.GetState().TeamA.Color,
            TeamBColor:ScoreboardController.GetState().TeamB.Color
        });
    }

    componentDidMount() {
        this.remoteScoreboard = ScoreboardController.Subscribe(this.updateScoreboard);
        this.remotePenalty = PenaltyController.Subscribe(this.updatePenalty);
        this.remoteScorekeeper = ScorekeeperController.Subscribe(this.updateScorekeeper);
    }

    componentWillUnmount() {
        if(this.remotePenalty)
            this.remotePenalty();
        if(this.remoteScoreboard)
            this.remoteScoreboard();
        if(this.remoteScorekeeper)
            this.remoteScorekeeper();
    }

    render() {
        return (
            <div className="status-panel">
                <div className="scorekeeper">
                    <Positions/>
                </div>
            </div>
        )
    }
}