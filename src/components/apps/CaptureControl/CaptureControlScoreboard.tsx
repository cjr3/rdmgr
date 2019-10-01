import React from 'react';
import CaptureControlPanel, {PCaptureControlPanel} from './CaptureControlPanel';
import CaptureController from 'controllers/CaptureController';
import {
    IconButton,
    IconShown,
    IconHidden
} from 'components/Elements';

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
        Shown:CaptureController.getState().Scoreboard.Shown,
        JamClockShown:CaptureController.getState().Scoreboard.JamClockShown,
        JamCounterShown:CaptureController.getState().Scoreboard.JamCounterShown
    }

    /**
     * Listener for capture controller
     */
    protected remoteCapture:Function|null = null;

    constructor(props) {
        super(props);
        this.updateCapture = this.updateCapture.bind(this);
    }

    /**
     * Updates the state to match the capture controller.
     */
    updateCapture() {
        this.setState(() => {
            return {Shown:CaptureController.getState().Scoreboard.Shown};
        });
    }

    /**
     * Start listeners
     */
    componentDidMount() {
        this.remoteCapture = CaptureController.subscribe(this.updateCapture);
    }

    /**
     * Close listeners
     */
    componentWillUnmount() {
        if(this.remoteCapture !== null)
            this.remoteCapture();
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
                            onClick={CaptureController.ToggleJamClock}
                            active={this.state.JamClockShown}
                            >Jam Clock</IconButton>
                        <IconButton
                            src={(this.state.JamCounterShown) ? IconShown : IconHidden}
                            onClick={CaptureController.ToggleJamCounter}
                            active={this.state.JamCounterShown}
                            >Jam Counter</IconButton>
                    </div>
                </CaptureControlPanel>
        );
    }
}