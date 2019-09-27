import React from 'react';
import CaptureControlPanel, {PCaptureControlPanel} from './CaptureControlPanel';
import CaptureController from 'controllers/CaptureController';

interface SCaptureControlSlideshow {
    /**
     * Determines if the slideshow is shown or not.
     */
    Shown:boolean
}

/**
 * Component for configuring the current slideshow.
 */
class CaptureControlSlideshow extends React.PureComponent<PCaptureControlPanel, SCaptureControlSlideshow> {

    readonly state:SCaptureControlSlideshow = {
        Shown:CaptureController.getState().MainSlideshow.Shown
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
            return {Shown:CaptureController.getState().MainSlideshow.Shown};
        })
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
                    Slideshow
                </CaptureControlPanel>
        );
    }
}

export default CaptureControlSlideshow;