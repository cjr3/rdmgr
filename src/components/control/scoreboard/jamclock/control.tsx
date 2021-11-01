import React from 'react';
import { JamClock } from 'tools/scoreboard/jamclock';
import { ClockStatus } from 'tools/vars';
import cnames from 'classnames';
import { Scoreboard } from 'tools/scoreboard/functions';

interface Props {

}

interface State {
    status:number;
}

class Main extends React.PureComponent<Props, State> {
    readonly state:State = {
        status:0
    }

    constructor(props:Props) {
        super(props);
        JamClock.OnTick.push((h, m, s, t, st) => {
            this.setState({status:st});
        });
        JamClock.OnStop.push(() => {
            this.setState({status:ClockStatus.STOPPED})
        });
    }

    render() {
        const label = (this.state.status === ClockStatus.RUNNING) ? 'STOP JAM' : 'START JAM';
        return <div className={cnames('jam-control', {
            stopped:this.state.status === ClockStatus.STOPPED,
            running:this.state.status === ClockStatus.RUNNING
        })}>
            <button onClick={Scoreboard.ToggleJamClock}>{label}</button>
        </div>
    }
}

export {Main as JamControl};