import React from 'react';
import CaptureController, {StreamControls} from 'controllers/CaptureController';
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
    readonly state:SCaptureStreamControls = {
        currentControl:CaptureController.getState().StreamControl
    }

    protected remoteState:Function|null = null;

    constructor(props) {
        super(props);
        this.updateState = this.updateState.bind(this);
    }

    updateState() {
        this.setState({
            currentControl:CaptureController.getState().StreamControl
        })
    }

    /**
     * Triggered when the component mounts to the DOM
     */
    componentDidMount() {
        this.remoteState = CaptureController.subscribe(this.updateState);
    }

    /**
     * Triggered when the component will unmount from the DOM
     */
    componentWillUnmount() {
        if(this.remoteState)
            this.remoteState();
    }

    /**
     * Renders the component
     */
    render() {
        return (
            <div className="config-panels stream">
                <CaptureControlScorebanner
                    icon={IconSkate}
                    active={(this.state.currentControl === StreamControls.SCOREBOARD)}
                    name="Scorebanner"
                    toggle={CaptureController.ToggleScorebanner}
                    onClick={() => {
                        CaptureController.SetStreamControl(StreamControls.SCOREBOARD);
                    }}
                />
                <CaptureControlRoster
                    name="Intros"
                    active={(this.state.currentControl === StreamControls.ROSTER)}
                    onClick={() => {
                        //this.setState({currentControl:'roster'})
                        CaptureController.SetStreamControl(StreamControls.ROSTER);
                    }}
                />
            </div>
        )
    }
}

export default CaptureStreamControls;