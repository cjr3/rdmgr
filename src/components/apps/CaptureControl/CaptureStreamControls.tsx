import React from 'react';
import CaptureControlScorebanner from './CaptureControlScorebanner';
import {IconSkate} from 'components/Elements';
import { ScorebannerCaptureController } from 'controllers/capture/Scoreboard';

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
                name="Score Banner"
                toggle={ScorebannerCaptureController.Toggle}
            />
        </div>
    )
}