import React from 'react'
import Panel from 'components/Panel'
import {CaptureDisplayButtons} from 'components/apps/CaptureControl/CaptureControl'

class DisplayPanel extends React.PureComponent {
    /**
     * Renders the component.
     */
    render() {
        return (
            <Panel
                opened={this.props.opened}
                popup={true}
                buttons={[<CaptureDisplayButtons key="btn-display"/>]}
                className="display-options">
            </Panel>
        )
    }
}

export default DisplayPanel;