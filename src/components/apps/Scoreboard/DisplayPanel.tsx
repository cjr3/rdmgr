import React from 'react'
import Panel from 'components/Panel'
import CaptureDisplayButtons from 'components/apps/CaptureControl/CaptureDisplayButtons'

export interface PDisplayPanel {
    /**
     * true if visible, false if not
     */
    opened:boolean
}

/**
 * Component for the scoreboard to easily show/hide capture components
 * @param props PDisplayPanel
 */
export default function DisplayPanel(props:PDisplayPanel) {
    return (
        <Panel
            opened={props.opened}
            popup={true}>
            <div className="record-list">
                <CaptureDisplayButtons/>
            </div>
        </Panel>
    )
}