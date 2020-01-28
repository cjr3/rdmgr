import React from 'react';
import ScoreboardController from 'controllers/ScoreboardController';
import { Unsubscribe } from 'redux';
import { AddMediaPath } from 'controllers/functions';

export default class Logo extends React.PureComponent<{
    side:'A' | 'B'
}, {
    Thumbnail:string;
}> {
    readonly state = {
        Thumbnail:''
    }

    protected remoteScoreboard?:Unsubscribe;

    constructor(props) {
        super(props);
        let src:string = ScoreboardController.GetState().TeamA.Thumbnail;
        if(this.props.side == 'B' )
            src = ScoreboardController.GetState().TeamB.Thumbnail;
        this.state.Thumbnail = src;
        this.updateScoreboard = this.updateScoreboard.bind(this);
    }

    protected updateScoreboard() {
        let src:string = ScoreboardController.GetState().TeamA.Thumbnail;
        if(this.props.side == 'B' )
            src = ScoreboardController.GetState().TeamB.Thumbnail;
        this.setState({Thumbnail:src});
    }

    componentDidMount() {
        this.remoteScoreboard = ScoreboardController.Subscribe(this.updateScoreboard);
    }

    componentWillUnmount() {
        if(this.remoteScoreboard)
            this.remoteScoreboard();
    }

    render() {
        return (
            <div className="logo">
                <img src={AddMediaPath(this.state.Thumbnail)} alt=""/>
            </div>
        );
    }
}