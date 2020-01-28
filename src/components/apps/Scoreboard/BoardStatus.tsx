import React from 'react';
import cnames from 'classnames';
import vars from 'tools/vars';
import ScoreboardController from 'controllers/ScoreboardController';

export default class BoardStatus extends React.PureComponent<any, {
    status:number;
}> {
    readonly state = {
        status:ScoreboardController.GetState().BoardStatus
    }

    protected remoteScoreboard:Function|null = null;

    constructor(props) {
        super(props);
        this.updateScoreboard = this.updateScoreboard.bind(this);
    }

    protected updateScoreboard() {
        let state = ScoreboardController.GetState();
        if(state.BoardStatus !== this.state.status) {
            this.setState({status:state.BoardStatus});
        }
    }

    componentDidMount() {
        this.remoteScoreboard = ScoreboardController.Subscribe(this.updateScoreboard);
    }
    
    componentWillUnmount() {
        if(this.remoteScoreboard !== null) {
            this.remoteScoreboard();
        }
    }
    
    render() {
        var classNames = cnames({
            boardstatus:true,
            timeout:(this.state.status === vars.Scoreboard.Status.Timeout),
            injury:(this.state.status === vars.Scoreboard.Status.Injury),
            upheld:(this.state.status === vars.Scoreboard.Status.Upheld),
            overturned:(this.state.status === vars.Scoreboard.Status.Overturned),
            review:(this.state.status === vars.Scoreboard.Status.Review)
        });
        return (
            <div className={classNames}>{vars.Scoreboard.StatusText[this.state.status]}</div>
        );
    }
}