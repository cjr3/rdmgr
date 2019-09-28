import React from 'react';
import CameraController from 'controllers/CameraController';
import CaptureController, {CapturePanels} from 'controllers/CaptureController';
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
    IconTicket,
    IconTeam
} from 'components/Elements';
import vars from 'tools/vars';
import RaffleController from 'controllers/RaffleController';
import RosterController from 'controllers/RosterController';
import CaptureControlRoster from './CaptureControlRoster';

interface SCaptureDisplayControls {
    /**
     * currently controlled panel
     */
    control:number;
    /**
     * Current panel to display
     */
    panel:string;
}

/**
 * Component for configuring the elements on the capture window.
 */
class CaptureDisplayControls extends React.PureComponent<any, SCaptureDisplayControls> {

    readonly state:SCaptureDisplayControls = {
        control:CaptureController.getState().Control,
        panel:vars.RecordType.Announcer
    }

    Panels:any = {
        [RosterController.Key]:{
            type:CaptureControlRoster,
            name:"Intros",
            icon:IconTeam,
            toggle:CaptureController.ToggleRoster,
            control:CapturePanels.ROSTER
        },
        [vars.RecordType.Announcer]:{
            type:CaptureControlAnnouncers,
            name:"Announcers",
            icon:IconMic,
            toggle:CaptureController.ToggleAnnouncers,
            control:CapturePanels.ANNOUNCER
        },
        [vars.RecordType.Anthem]:{
            type:CaptureControlAnthem,
            name:"Anthem",
            icon:IconFlag,
            toggle:CaptureController.ToggleNationalAnthem,
            control:CapturePanels.ANTHEM
        },
        [CameraController.Key]:{
            type:CaptureControlCamera,
            name:"Camera",
            icon:IconStreamOff,
            toggle:CaptureController.ToggleMainCamera,
            control:CapturePanels.CAMERA
        },
        [PenaltyController.Key]:{
            type:CaptureControlPenaltyTracker,
            name:"Penalty Tracker",
            icon:IconWhistle,
            toggle:CaptureController.TogglePenaltyTracker,
            control:CapturePanels.PENALTY
        },
        [ScorekeeperController.Key]:{
            type:CaptureControlScorekeeper,
            name:"Scorekeeper",
            icon:IconClipboard,
            toggle:CaptureController.ToggleScorekeeper,
            control:CapturePanels.SCOREKEEPER
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
            control:CaptureController.getState().Control
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
                    active={(this.state.control === panel.control)}
                    controlled={(this.state.control === panel.control)}
                    onClick={() => {
                        CaptureController.SetCurrentControl(panel.control);
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