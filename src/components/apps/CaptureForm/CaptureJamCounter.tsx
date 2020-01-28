import React from 'react';
import ScoreboardController from 'controllers/ScoreboardController';
import cnames from 'classnames';
import { JamCounterCaptureController } from 'controllers/capture/Scoreboard';
import { Unsubscribe } from 'redux';

/**
 * Component for displaying a large jam counter on the CaptureForm
 */
export default class CaptureJamCounter extends React.PureComponent<any, {
    JamCounter:number;
    Shown:boolean;
    className:string;
}> {
    readonly state = {
        JamCounter:ScoreboardController.GetState().JamCounter,
        Shown:JamCounterCaptureController.GetState().Shown,
        className:JamCounterCaptureController.GetState().className
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
            JamCounter:ScoreboardController.GetState().JamCounter
        });
    }

    protected updateCapture() {
        this.setState({
            Shown:JamCounterCaptureController.GetState().Shown,
            className:JamCounterCaptureController.GetState().className
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
        var className = cnames('capture-jam-counter', {shown:this.props.shown});
        return (
            <div className={className}>
                {this.state.JamCounter.toString().padStart(2,'0')}
            </div>
        )
    }
}