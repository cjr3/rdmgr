import React from 'react';
import CaptureController from 'controllers/CaptureController';
import CaptureControlRoster from './CaptureControlRoster';
import CaptureControlScorebanner from './CaptureControlScorebanner';

import {IconSkate} from 'components/Elements';

interface SCaptureStreamControls {
    /**
     * Current panel to display
     */
    currentControl:string
}

/**
 * Component for managing stream-related data
 * - OBS Control / Stats
 * - YouTube Chat
 */
class CaptureStreamControls extends React.PureComponent<any, SCaptureStreamControls> {
    constructor(props) {
        super(props);
        this.state = {
            currentControl:'roster'
        };
    }

    render() {
        return (
            <div className="config-panels stream">
                <CaptureControlRoster
                    name="Intros"
                    active={(this.state.currentControl === 'roster')}
                    onClick={() => {
                        this.setState({currentControl:'roster'})
                    }}
                />
                <CaptureControlScorebanner
                    icon={IconSkate}
                    active={(this.state.currentControl === 'scorebanner')}
                    name="Scorebanner"
                    toggle={CaptureController.ToggleScorebanner}
                    onClick={() => {
                        this.setState({currentControl:'scorebanner'});
                    }}
                />
            </div>
        )
    }
}

export default CaptureStreamControls;