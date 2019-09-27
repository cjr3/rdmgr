import React from 'react';
import CaptureControlPanel, {PCaptureControlPanel} from './CaptureControlPanel';
import CaptureController from 'controllers/CaptureController';

interface SCaptureControlSponsor {
    /**
     * Determines if the sponsor slideshow is shown or not
     */
    Shown:boolean
}

/**
 * Component for configuring the sponsor slideshow.
 */
class CaptureControlSponsor extends React.PureComponent<PCaptureControlPanel, SCaptureControlSponsor> {

    readonly state:SCaptureControlSponsor = {
        Shown:CaptureController.getState().SponsorSlideshow.Shown
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
            return {Shown:CaptureController.getState().SponsorSlideshow.Shown};
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
                    Sponsor
                </CaptureControlPanel>
        );
    }
}

export default CaptureControlSponsor;