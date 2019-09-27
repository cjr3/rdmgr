import React from 'react';
import CameraController from 'controllers/CameraController';
import CaptureController, {DisplayControls} from 'controllers/CaptureController';
import ScorekeeperController from 'controllers/ScorekeeperController';
import PenaltyController from 'controllers/PenaltyController';

import CaptureControlCamera from './CaptureControlCamera';
import CaptureControlScorekeeper from './CaptureControlScorekeeper';
import CaptureControlAnthem from './CaptureControlAnthem';
import CaptureControlRaffle from './CaptureControlRaffle';
import CaptureControlAnnouncers from './CaptureControlAnnouncers';
import CaptureControlPenaltyTracker from './CaptureControlPenaltyTracker';

import {
    IconMic,
    IconFlag,
    IconStreamOff,
    IconWhistle,
    IconClipboard,
    IconTicket
} from 'components/Elements';
import vars from 'tools/vars';
import RaffleController from 'controllers/RaffleController';

interface SCaptureDisplayControls {
    /**
     * Current controller key
     */
    currentControl:string
}

type PanelRecord = {
    type:any,
    name:string,
    icon:string,
    toggle:Function
}

/**
 * Component for configuring the elements on the capture window.
 */
class CaptureDisplayControls extends React.PureComponent<any, SCaptureDisplayControls> {

    readonly state:SCaptureDisplayControls = {
        currentControl:CaptureController.getState().DisplayControl
    }

    Panels:any = {
        [DisplayControls.ANNOUNCERS]:{
            type:CaptureControlAnnouncers,
            name:"Announcers",
            icon:IconMic,
            toggle:CaptureController.ToggleAnnouncers
        },
        [DisplayControls.ANTHEM]:{
            type:CaptureControlAnthem,
            name:"Anthem",
            icon:IconFlag,
            toggle:CaptureController.ToggleNationalAnthem
        },
        [DisplayControls.CAMERA]:{
            type:CaptureControlCamera,
            name:"Camera",
            icon:IconStreamOff,
            toggle:CaptureController.ToggleMainCamera
        },
        [DisplayControls.PENALTY]:{
            type:CaptureControlPenaltyTracker,
            name:"Penalty Tracker",
            icon:IconWhistle,
            toggle:CaptureController.TogglePenaltyTracker
        },
        [DisplayControls.SCOREKEEPER]:{
            type:CaptureControlScorekeeper,
            name:"Scorekeeper",
            icon:IconClipboard,
            toggle:CaptureController.ToggleScorekeeper
        }
    }

    /**
     * Listener for changes to the remote
     */
    protected remoteState:Function|null = null;

    constructor(props) {
        super(props);
        this.updateState = this.updateState.bind(this);
    }

    /**
     * Updates the state to match the capture controller
     */
    protected updateState() {
        this.setState({
            currentControl:CaptureController.getState().DisplayControl
        });
    }

    /**
     * Triggered when the component mounts to the DOM
     * - Listen to the controller
     */
    componentDidMount() {
        this.remoteState = CaptureController.subscribe(this.updateState);
    }

    /**
     * Triggered when the component will unmount from the DOM
     * - Stop listening to the controller
     */
    componentWillUnmount() {
        if(this.remoteState)
            this.remoteState();
    }

    /**
     * Renders the component.
     */
    render() {
        let panels:Array<React.ReactElement> = [];
        for(let pkey in this.Panels) {
            let panel = this.Panels[pkey];
            panels.push(
                <panel.type 
                    key={pkey}
                    name={panel.name}
                    toggle={panel.toggle}
                    icon={panel.icon}
                    active={(this.state.currentControl === pkey)}
                    onClick={() => {
                        //this.setState({currentControl:pkey});
                        CaptureController.SetDisplayControl(pkey);
                    }}
                    />
            );
        }

        return (
            <div className="config-panels">
                {panels}
            </div>
        );
    }
}

export default CaptureDisplayControls;