import React from 'react';
import CaptureController from 'controllers/CaptureController';
import PenaltyController from 'controllers/PenaltyController';
import CaptureControlPanel, {PCaptureControlPanel} from './CaptureControlPanel';

import {
    IconButton,
    IconCheck
} from 'components/Elements';

interface SCaptureControlPenaltyTracker {
    /**
     * Duration, in seconds, to display penalties
     */
    Duration:number,
    /**
     * Collection of penalized skaters
     */
    Skaters:Array<any>,
    /**
     * Determines if the penalty tracker is shown or not
     */
    Shown:boolean
}

/**
 * Component for configuring penalty tracker elements.
 */
class CaptureControlPenaltyTracker extends React.PureComponent<PCaptureControlPanel, SCaptureControlPenaltyTracker> {

    readonly state:SCaptureControlPenaltyTracker = {
        Duration:CaptureController.getState().PenaltyTracker.Duration/1000,
        Shown:CaptureController.getState().PenaltyTracker.Shown,
        Skaters:PenaltyController.getState().Skaters
    }

    remoteState:Function
    remoteCapture:Function

    constructor(props) {
        super(props);

        this.onChangeDuration = this.onChangeDuration.bind(this);
        this.onClickSubmit = this.onClickSubmit.bind(this);

        this.updateState = this.updateState.bind(this);
        this.updateCapture = this.updateCapture.bind(this);

        this.remoteState = PenaltyController.subscribe(this.updateState);
        this.remoteCapture = CaptureController.subscribe(this.updateCapture);
    }

    /**
     * Updates the state to match the camera controller.
     */
    updateState() {
        this.setState(() => {
            return {
                Skaters:PenaltyController.getState().Skaters
            }
        }, () => {
            if(this.state.Skaters.length >= 1) {
                CaptureController.SetPenaltyTrackerVisibility( true );
            }
        });
    }

    /**
     * Updates the state to match the capture controller.
     */
    updateCapture() {
        this.setState(() => {
            return {
                Shown:CaptureController.getState().PenaltyTracker.Shown
            }
        });
    }

    /**
     * Triggered when the user changes the value for the duration to hide the penalty tracker.
     * @param {Event} ev 
     */
    onChangeDuration(ev) {
        var value = parseInt(ev.target.value);
        this.setState(() => {
            return {Duration:value};
        });
    }

    /**
     * Triggered when the user clicks the submit button.
     */
    onClickSubmit() {
        CaptureController.SetPenaltyTrackerDuration(this.state.Duration * 1000);
    }

    /**
     * Renders the component.
     */
    render() {
        const buttons = [
            <IconButton
                key="btn-submit"
                src={IconCheck}
                onClick={this.onClickSubmit}
                title="Save Changes">Save</IconButton>
        ];

        var skaters:Array<React.ReactElement> = [];
        this.state.Skaters.forEach((skater) => {
            var codes:Array<string> = [];
            skater.Penalties.forEach((pen:any) => {
                if(pen.Acronym)
                    codes.push(pen.Acronym);
                else if(pen.Code)
                    codes.push(pen.Code);
            });
            skaters.push(
                <div className="stack-panel s2" key={`${skater.RecordID}-${skater.RecordID}`}>
                    <div>{skater.Number}</div>
                    <div>{codes.join(', ')}</div>
                </div>
            );
        });

        return (
            <CaptureControlPanel
                active={this.props.active}
                name={this.props.name}
                icon={this.props.icon}
                toggle={this.props.toggle}
                shown={this.state.Shown}
                buttons={buttons}
                onClick={this.props.onClick}>
                    <div className="text">
                        Display for 
                            <input
                                type="number"
                                size={4}
                                maxLength={2}
                                min={5}
                                max={20}
                                step={1}
                                value={this.state.Duration}
                                onChange={this.onChangeDuration}
                                /> seconds.
                    </div>
                    {skaters}
                </CaptureControlPanel>
        );
    }
}

export default CaptureControlPenaltyTracker;