import React from 'react';
import ScoreboardController from 'controllers/ScoreboardController';
import cnames from 'classnames';

interface SCaptureJamCounter {
    JamCounter:number
}

interface PCaptureJamCounter {
    shown?:boolean
}

class CaptureJamCounter extends React.PureComponent<PCaptureJamCounter, SCaptureJamCounter> {
    readonly state:SCaptureJamCounter = {
        JamCounter:ScoreboardController.getState().JamCounter
    }

    remoteScoreboard:Function
    constructor(props) {
        super(props);
        this.updateState = this.updateState.bind(this);
        this.remoteScoreboard = ScoreboardController.subscribe(this.updateState);
    }

    updateState() {
        this.setState({
            JamCounter:ScoreboardController.getState().JamCounter
        });
    }

    render() {
        var className = cnames('capture-jam-counter', {shown:this.props.shown});
        return (
            <div className={className}>
                {this.state.JamCounter.toString().padStart(2,'0')}
            </div>
        )
    }
}

export default CaptureJamCounter;