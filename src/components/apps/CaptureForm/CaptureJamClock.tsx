import React from 'react';
import ScoreboardController from 'controllers/ScoreboardController';
import cnames from 'classnames';

interface SCaptureJamClock {
    JamSecond:number
}

interface PCaptureJamClock {
    shown?:boolean
}

class CaptureJamClock extends React.PureComponent<PCaptureJamClock, SCaptureJamClock> {
    readonly state:SCaptureJamClock = {
        JamSecond:ScoreboardController.getState().JamSecond
    }
    remoteScoreboard:Function
    constructor(props) {
        super(props);
        this.updateState = this.updateState.bind(this);
        this.remoteScoreboard = ScoreboardController.subscribe(this.updateState);
    }

    updateState() {
        this.setState({JamSecond:ScoreboardController.getState().JamSecond});
    }

    render() {
        var className = cnames('capture-jam-clock', {
            shown:this.props.shown,
            warning:(this.state.JamSecond <= 10),
            danger:(this.state.JamSecond <= 5)
        });
        return (
            <div className={className}>
                {this.state.JamSecond.toString().padStart(2,'0')}
            </div>
        )
    }
}

export default CaptureJamClock;