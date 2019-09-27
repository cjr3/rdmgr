import React from 'react';
import CaptureControlPanel, {PCaptureControlPanel} from './CaptureControlPanel';
import CaptureController from 'controllers/CaptureController';

import {
    IconButton,
    IconShown,
    IconHidden
} from 'components/Elements';

interface SCaptureControlScoreboard {
    /**
     * Determines of the full screen scoreboard is shown
     */
    Shown:boolean,
    /**
     * Determines if the full size jam clock is shown
     */
    JamClockShown:boolean,
    /**
     * Determines if the full size jam counter is shown
     */
    JamCounterShown:boolean
}

/**
 * Component for configuring the main slideshow.
 */
class CaptureControlScoreboard extends React.PureComponent<PCaptureControlPanel, SCaptureControlScoreboard> {

    readonly state:SCaptureControlScoreboard = {
        Shown:CaptureController.getState().Scoreboard.Shown,
        JamClockShown:CaptureController.getState().Scoreboard.JamClockShown,
        JamCounterShown:CaptureController.getState().Scoreboard.JamCounterShown
    }

    remoteCapture:Function

    constructor(props) {
        super(props);
        this.updateCapture = this.updateCapture.bind(this);
        this.remoteCapture = CaptureController.subscribe(this.updateCapture);
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
                onClickControl={this.props.onClickControl}
                controlled={this.props.controlled}
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

export default CaptureControlScoreboard;