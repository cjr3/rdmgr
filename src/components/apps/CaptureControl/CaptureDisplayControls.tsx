import React from 'react';
import CameraController from 'controllers/CameraController';
import CaptureController, {CapturePanels} from 'controllers/CaptureController';
import ScorekeeperController from 'controllers/ScorekeeperController';
import PenaltyController from 'controllers/PenaltyController';
import CaptureControlCamera from './CaptureControlCamera';
import CaptureControlScorekeeper from './CaptureControlScorekeeper';
import CaptureControlAnthem from './CaptureControlAnthem';
import CaptureControlAnnouncers from './CaptureControlAnnouncers';
import CaptureControlPenaltyTracker from './CaptureControlPenaltyTracker';
import {
    IconMic,
    IconFlag,
    IconStreamOff,
    IconWhistle,
    IconClipboard,
    IconTeam,
    IconOffline
} from 'components/Elements';
import vars from 'tools/vars';
import RosterController from 'controllers/RosterController';
import CaptureControlRoster from './CaptureControlRoster';
import CaptureControlCameraPeer from './CaptureControlCameraPeer';

/**
 * Component for configuring the elements on the capture window.
 */
export default class CaptureDisplayControls extends React.PureComponent<any, {
    /**
     * Current panel to display
     */
    panel:string;
}> {

    readonly state = {
        panel:RosterController.Key
    }

    protected readonly Panels:any = {
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
            name:"Camera #1",
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
                    active={(this.state.panel === pkey)}
                    onClick={() => {this.setState({panel:pkey});}}
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