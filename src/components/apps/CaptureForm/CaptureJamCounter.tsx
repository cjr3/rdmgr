import React from 'react';
import ScoreboardController from 'controllers/ScoreboardController';
import cnames from 'classnames';
import { JamCounterCaptureController } from 'controllers/capture/Scoreboard';
import { Unsubscribe } from 'redux';
import './css/JamCounter.scss';
import vars from 'tools/vars';

/**
 * Component for displaying a large jam counter on the CaptureForm
 */
export default class CaptureJamCounter extends React.PureComponent<any, {
    JamCounter:number;
    JamState:number;
    JamSeconds:number;
    MaxJamSeconds:number;
    Shown:boolean;
    className:string;
    Duration:number;
}> {
    readonly state = {
        JamCounter:ScoreboardController.GetState().JamCounter,
        JamState:ScoreboardController.GetState().JamState,
        JamSeconds:ScoreboardController.GetState().JamSecond,
        MaxJamSeconds:ScoreboardController.GetState().MaxJamSeconds,
        Shown:JamCounterCaptureController.GetState().Shown,
        className:JamCounterCaptureController.GetState().className,
        Duration:Math.round(JamCounterCaptureController.GetState().Duration/1000)
    }

    protected remoteScoreboard?:Unsubscribe;
    protected remoteCapture?:Unsubscribe;

    /**
     * Constructor
     * @param props 
     */
    constructor(props) {
        super(props);
        this.updateState = this.updateState.bind(this);
        this.updateCapture = this.updateCapture.bind(this);
    }

    /**
     * Updates the state to match the Scoreboard Controller
     */
    protected updateState() {
        this.setState({
            JamCounter:ScoreboardController.GetState().JamCounter,
            JamState:ScoreboardController.GetState().JamState,
            JamSeconds:ScoreboardController.GetState().JamSecond,
            MaxJamSeconds:ScoreboardController.GetState().MaxJamSeconds,
        });
    }

    protected updateCapture() {
        this.setState({
            Shown:JamCounterCaptureController.GetState().Shown,
            className:JamCounterCaptureController.GetState().className,
            Duration:Math.round(JamCounterCaptureController.GetState().Duration/1000)
        });
    }

    /**
     * Start listeners
     */
    componentDidMount() {
        this.remoteScoreboard = ScoreboardController.Subscribe(this.updateState);
        this.remoteCapture = JamCounterCaptureController.Subscribe(this.updateCapture);
    }

    /**
     * Close listeners
     */
    componentWillUnmount() {
        if(this.remoteScoreboard)
            this.remoteScoreboard();
        if(this.remoteCapture)
            this.remoteCapture();
    }

    /**
     * Renders the component
     */
    render() {
        let className:string = cnames('capture-jam-counter', {
            shown:this.state.Shown,
            jamming:(this.state.JamState == vars.Clock.Status.Running),
            showing:((this.state.MaxJamSeconds - this.state.JamSeconds) <= this.state.Duration)
        });
        return (
            <div className={className}>
                {this.state.JamCounter.toString().padStart(2,'0')}
            </div>
        )
    }
}