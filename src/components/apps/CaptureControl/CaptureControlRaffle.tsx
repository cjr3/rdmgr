import React from 'react';
import RaffleController from 'controllers/RaffleController';
import CaptureController from 'controllers/CaptureController';
import CaptureControlPanel, {PCaptureControlPanel} from './CaptureControlPanel';

import {IconButton, IconDelete} from 'components/Elements';

interface SCaptureControlRaffle {
    /**
     * Determines if the raffle is displayed or ont
     */
    Shown:boolean,
    /**
     * The tickets to display
     */
    Tickets:Array<string>
}

/**
 * Component for configuring the raffle.
 */
class CaptureControlRaffle extends React.PureComponent<PCaptureControlPanel, SCaptureControlRaffle> {

    readonly state:SCaptureControlRaffle = {
        Shown:CaptureController.getState().Raffle.Shown,
        Tickets:RaffleController.getState().Tickets
    }

    remoteState:Function
    remoteCapture:Function

    constructor(props) {
        super(props);
        this.updateState = this.updateState.bind(this);
        this.updateCapture = this.updateCapture.bind(this);
        this.remoteState = RaffleController.subscribe(this.updateState);
        this.remoteCapture = CaptureController.subscribe(this.updateCapture);
    }

    /**
     * Updates the state to match the camera controller.
     */
    updateState() {
        this.setState(() => {
            return {Tickets:RaffleController.getState().Tickets}
        });
    }

    /**
     * Updates the state to match the capture controller.
     */
    updateCapture() {
        this.setState(() => {
            return {Shown:CaptureController.getState().Raffle.Shown};
        });
    }

    /**
     * Renders the component.
     */
    render() {
        var tickets:Array<React.ReactElement> = [];
        this.state.Tickets.forEach((ticket, index) => {
            tickets.push(
                <IconButton
                    key={`ticket-${index}`}
                    src={IconDelete}
                    onClick={() => {RaffleController.Remove(index);}}
                >{ticket}</IconButton>
            );
        });

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
                        {tickets}
                    </div>
                </CaptureControlPanel>
        );
    }
}

export default CaptureControlRaffle;