import React from 'react';
import CaptureController from 'controllers/CaptureController';
import CaptureControlScorebanner from './CaptureControlScorebanner';
import {IconSkate} from 'components/Elements';

/**
 * Component for managing stream-related data
 * - Scoreboard
 */
export default function CaptureStreamControls() {
    return (
        <div className="config-panels stream">
            <CaptureControlScorebanner
                icon={IconSkate}
                active={true}
                name="Scorebanner"
                toggle={CaptureController.ToggleScorebanner}
            />
        </div>
    )
}