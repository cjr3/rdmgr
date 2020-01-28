import React from 'react';
import CameraController from 'controllers/CameraController';
import ScorekeeperController from 'controllers/ScorekeeperController';
import PenaltyController from 'controllers/PenaltyController';
import CaptureControlCamera from './CaptureControlCamera';
import CaptureControlScorekeeper from './CaptureControlScorekeeper';
import CaptureControlAnthem from './CaptureControlAnthem';
import CaptureControlAnnouncers from './CaptureControlAnnouncers';
import CaptureControlPenaltyTracker from './CaptureControlPenaltyTracker';
import CaptureControlMisc from './CaptureControlMisc';
import {
    IconMic,
    IconFlag,
    IconStreamOff,
    IconWhistle,
    IconClipboard,
    IconTeam,
    IconCapture
} from 'components/Elements';
import vars from 'tools/vars';
import RosterController from 'controllers/RosterController';
import CaptureControlRoster from './CaptureControlRoster';
import RosterCaptureController from 'controllers/capture/Roster';
import AnnouncerCaptureController from 'controllers/capture/Announcer';
import AnthemCaptureController from 'controllers/capture/Anthem';
import CameraCaptureController from 'controllers/capture/Camera';
import PenaltyCaptureController from 'controllers/capture/Penalty';
import ScorekeeperCaptureController from 'controllers/capture/Scorekeeper';

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
            toggle:RosterCaptureController.Toggle
        },
        [vars.RecordType.Announcer]:{
            type:CaptureControlAnnouncers,
            name:"Announcers",
            icon:IconMic,
            toggle:AnnouncerCaptureController.Toggle
        },
        [vars.RecordType.Anthem]:{
            type:CaptureControlAnthem,
            name:"Anthem",
            icon:IconFlag,
            toggle:AnthemCaptureController.Toggle
        },
        [CameraController.Key]:{
            type:CaptureControlCamera,
            name:"Camera #1",
            icon:IconStreamOff,
            toggle:CameraCaptureController.Toggle
        },
        [PenaltyController.Key]:{
            type:CaptureControlPenaltyTracker,
            name:"Penalty Tracker",
            icon:IconWhistle,
            toggle:PenaltyCaptureController.Toggle
        },
        [ScorekeeperController.Key]:{
            type:CaptureControlScorekeeper,
            name:"Scorekeeper",
            icon:IconClipboard,
            toggle:ScorekeeperCaptureController.Toggle
        },
        ['MISC']:{
            type:CaptureControlMisc,
            name:"Misc",
            icon:IconCapture,
            toggle:() => {}
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