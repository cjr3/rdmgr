import React from 'react';
import CaptureController, {CapturePanels} from 'controllers/CaptureController';
import CaptureControlRoster from './CaptureControlRoster';
import CaptureControlScorebanner from './CaptureControlScorebanner';
import {IconSkate} from 'components/Elements';

interface SCaptureStreamControls {
    /**
     * Current control
     */
    control:number;
    /**
     * Current panel to display
     */
    panel:string;
}

/**
 * Component for managing stream-related data
 * - OBS Control / Stats
 * - YouTube Chat
 */
class CaptureStreamControls extends React.PureComponent<any, SCaptureStreamControls> {
    readonly state:SCaptureStreamControls = {
        control:CaptureController.getState().Control,
        panel:'scorebanner'
    }

    protected remoteState:Function|null = null;

    constructor(props) {
        super(props);
        this.updateState = this.updateState.bind(this);
    }

    updateState() {
        this.setState({
            control:CaptureController.getState().Control
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
                    active={true}
                    controlled={(this.state.control === CapturePanels.SCOREBOARD)}
                    name="Scorebanner"
                    toggle={CaptureController.ToggleScorebanner}
                    onClick={() => {
                        this.setState({panel:'scorebanner'});
                    }}
                    onClickControl={() => {
                        CaptureController.SetCurrentControl(CapturePanels.SCOREBOARD);
                    }}
                />
            </div>
        )
    }
}

export default CaptureStreamControls;