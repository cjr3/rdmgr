import React from 'react';
import CaptureControlPanel, {PCaptureControlPanel} from './CaptureControlPanel';
import {
    IconButton,
    IconShown,
    IconHidden
} from 'components/Elements';
import ScoreboardCaptureController, { JamClockCaptureController, JamCounterCaptureController } from 'controllers/capture/Scoreboard';
import { Unsubscribe } from 'redux';

/**
 * Component for configuring the main slideshow.
 */
export default class CaptureControlScoreboard extends React.PureComponent<PCaptureControlPanel, {
    /**
     * Determines of the full screen scoreboard is shown
     */
    Shown:boolean;
    /**
     * Determines if the full size jam clock is shown
     */
    JamClockShown:boolean;
    /**
     * Determines if the full size jam counter is shown
     */
    JamCounterShown:boolean;
}> {

    readonly state = {
        Shown:ScoreboardCaptureController.GetState().Shown,
        JamClockShown:JamClockCaptureController.GetState().Shown,
        JamCounterShown:JamCounterCaptureController.GetState().Shown
    }

    protected remoteCapture?:Unsubscribe;
    protected remoteJamClock?:Unsubscribe;
    protected remoteJamCounter?:Unsubscribe;

    constructor(props) {
        super(props);
        this.updateCapture = this.updateCapture.bind(this);
    }

    /**
     * Updates the state to match the capture controller.
     */
    protected updateCapture() {
        this.setState(() => {
            return {Shown:ScoreboardCaptureController.GetState().Scoreboard.Shown};
        });
    }

    protected updateJamClock() {
        this.setState({
            JamClockShown:JamClockCaptureController.GetState().Shown
        });
    }

    protected updateJamCounter() {
        this.setState({
            JamCounterShown:JamCounterCaptureController.GetState().Shown
        });
    }

    /**
     * Start listeners
     */
    componentDidMount() {
        this.remoteCapture = ScoreboardCaptureController.Subscribe(this.updateCapture);
        this.remoteJamClock = JamClockCaptureController.Subscribe(this.updateJamClock);
        this.remoteJamCounter = JamCounterCaptureController.Subscribe(this.updateJamCounter);
    }

    /**
     * Close listeners
     */
    componentWillUnmount() {
        if(this.remoteCapture)
            this.remoteCapture();
        if(this.remoteJamClock)
            this.remoteJamClock();
        if(this.remoteJamCounter)
            this.remoteJamCounter();
    }

    /**
     * Renders the component.
     */
    render() {
        return (
            <CaptureControlPanel
                active={this.props.active}
                name={this.props.name}
                icon={this.props.icon}
                toggle={this.props.toggle}
                shown={this.state.Shown}
                onClick={this.props.onClick}>
                    <div className="record-list">
                        <IconButton
                            src={(this.state.JamClockShown) ? IconShown : IconHidden}
                            onClick={JamClockCaptureController.Toggle}
                            active={this.state.JamClockShown}
                            >Jam Clock</IconButton>
                        <IconButton
                            src={(this.state.JamCounterShown) ? IconShown : IconHidden}
                            onClick={JamCounterCaptureController.Toggle}
                            active={this.state.JamCounterShown}
                            >Jam Counter</IconButton>
                    </div>
                </CaptureControlPanel>
        );
    }
}