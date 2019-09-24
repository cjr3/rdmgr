import React from 'react';
import CameraController from 'controllers/CameraController';
import CaptureController from 'controllers/CaptureController';
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
        currentControl:CameraController.Key
    }

    Panels:any = {
        ANC:{
            type:CaptureControlAnnouncers,
            name:"Announcers",
            icon:IconMic,
            toggle:CaptureController.ToggleAnnouncers
        },
        [vars.RecordType.Anthem]:{
            type:CaptureControlAnthem,
            name:"Anthem",
            icon:IconFlag,
            toggle:CaptureController.ToggleNationalAnthem
        },
        [CameraController.Key]:{
            type:CaptureControlCamera,
            name:"Camera",
            icon:IconStreamOff,
            toggle:CaptureController.ToggleMainCamera
        },
        [PenaltyController.Key]:{
            type:CaptureControlPenaltyTracker,
            name:"Penalty Tracker",
            icon:IconWhistle,
            toggle:CaptureController.TogglePenaltyTracker
        },
        [ScorekeeperController.Key]:{
            type:CaptureControlScorekeeper,
            name:"Scorekeeper",
            icon:IconClipboard,
            toggle:CaptureController.ToggleScorekeeper
        },
        /*
        [RaffleController.Key]:{
            type:CaptureControlRaffle,
            name:"Raffle",
            icon:IconTicket,
            toggle:CaptureController.ToggleRaffle
        }*/
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
                        this.setState({currentControl:pkey});
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