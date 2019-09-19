import React from 'react'
import Panel from 'components/Panel'
import {CaptureDisplayButtons} from 'components/apps/CaptureControl/CaptureControl'

interface PDisplayPanel {
    opened:boolean
}

export default function DisplayPanel(props:PDisplayPanel) {
    return (
        <Panel
            opened={props.opened}
            popup={true}
            buttons={[<CaptureDisplayButtons key="btn-display"/>]}
            className="display-options">
        </Panel>
    )
}