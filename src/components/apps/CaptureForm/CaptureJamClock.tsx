import React from 'react';
import ScoreboardController from 'controllers/ScoreboardController';
import cnames from 'classnames';
import { JamClockCaptureController } from 'controllers/capture/Scoreboard';
import { Unsubscribe } from 'redux';
import vars from 'tools/vars';

/**
 * Component for displaying a large jam clock on the capture window
 */
export default class CaptureJamClock extends React.PureComponent<any, {
    JamSecond:number;
    JamState:number;
    MaxJamSeconds:number;
    Shown:boolean;
}> {
    readonly state = {
        JamSecond:ScoreboardController.GetState().JamSecond,
        MaxJamSeconds:ScoreboardController.GetState().MaxJamSeconds,
        JamState:ScoreboardController.GetState().JamState,
        Shown:JamClockCaptureController.GetState().Shown
    }

    protected remoteScoreboard?:Unsubscribe;
    protected remoteJamClock?:Unsubscribe;

    /**
     * 
     * @param props 
     */
    constructor(props) {
        super(props);
        this.updateScoreboard = this.updateScoreboard.bind(this);
        this.updateCapture = this.updateCapture.bind(this);
    }

    /**
     * Updates the state to match the ScoreboardController
     */
    protected updateScoreboard() {
        this.setState({
            JamSecond:ScoreboardController.GetState().JamSecond,
            JamState:ScoreboardController.GetState().JamState,
            MaxJamSeconds:ScoreboardController.GetState().MaxJamSeconds
        });
    }

    protected updateCapture() {
        this.setState({
            Shown:JamClockCaptureController.GetState().Shown
        });
    }

    /**
     * Start listeners
     */
    componentDidMount() {
        this.remoteScoreboard = ScoreboardController.Subscribe(this.updateScoreboard);
        this.remoteJamClock = JamClockCaptureController.Subscribe(this.updateCapture);
    }

    /**
     * Close listeners
     */
    componentWillUnmount() {
        if(this.remoteScoreboard)
            this.remoteScoreboard();
        if(this.remoteJamClock)
            this.remoteJamClock();
    }

    /**
     * Renders the component
     */
    render() {
        let className:string = cnames('capture-jam-clock', {
            shown:(this.state.Shown && this.state.JamState == vars.Clock.Status.Running),
            warning:(this.state.JamSecond <= vars.Clock.Warning),
            danger:(this.state.JamSecond <= vars.Clock.Danger)
        });

        let text:string = this.state.JamSecond.toString().padStart(2,'0');

        if(this.state.JamSecond > 60 || this.state.MaxJamSeconds > 60) {
            let seconds:number = this.state.JamSecond;
            let minutes:number = 0;
            while(seconds >= 60) {
                minutes++;
                seconds -= 60;
            }
            text = minutes.toString().padStart(2,'0') + ":" + seconds.toString().padStart(2,'0');
        }

        return (
            <div className={className}>
                {text}
            </div>
        )
    }
}