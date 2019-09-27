import React from 'react';
import ScorekeeperController from 'controllers/ScorekeeperController';
import CaptureController from 'controllers/CaptureController';
import DataController from 'controllers/DataController';
import CaptureControlPanel, {PCaptureControlPanel} from './CaptureControlPanel';

interface SCaptureControlScorekeeper {
    TeamA:any,
    TeamB:any,
    Shown:boolean
}

/**
 * Component for configuring the scorekeeper elements.
 */
class CaptureControlScorekeeper extends React.PureComponent<PCaptureControlPanel, SCaptureControlScorekeeper> {

    readonly state:SCaptureControlScorekeeper = {
        TeamA:ScorekeeperController.getState().TeamA,
        TeamB:ScorekeeperController.getState().TeamB,
        Shown:CaptureController.getState().Scorekeeper.Shown
    }

    remoteState:Function
    remoteCapture:Function

    constructor(props) {
        super(props);

        this.updateState = this.updateState.bind(this);
        this.updateCapture = this.updateCapture.bind(this);

        this.remoteState = ScorekeeperController.subscribe(this.updateState);
        this.remoteCapture = CaptureController.subscribe(this.updateCapture);
    }

    /**
     * Updates the state to match the camera controller.
     */
    updateState() {
        this.setState(() => {
            return {
                TeamA:ScorekeeperController.getState().TeamA,
                TeamB:ScorekeeperController.getState().TeamB
            }
        });
    }

    /**
     * Updates the state to match the capture controller.
     */
    updateCapture() {
        this.setState(() => {
            return {Shown:CaptureController.getState().Scorekeeper.Shown};
        });
    }

    /**
     * Renders the component.
     */
    render() {
        var jammerA = this.state.TeamA.Track.Jammer || {Name:'', Thumbnail:'', Number:''};
        var jammerB = this.state.TeamB.Track.Jammer || {Name:'', Thumbnail:'', Number:''};

        return (
            <CaptureControlPanel
                active={this.props.active}
                name={this.props.name}
                icon={this.props.icon}
                toggle={this.props.toggle}
                shown={this.state.Shown}
                onClickControl={this.props.onClickControl}
                controlled={this.props.controlled}
                onClick={this.props.onClick}>
                    <div className="stack-panel s2">
                        <div className="skater-preview">
                            <img src={DataController.mpath(jammerA.Thumbnail, false)} alt=""/>
                            <div className="name">{jammerA.Name}</div>
                        </div>
                        <div className="skater-preview">
                            <img src={DataController.mpath(jammerB.Thumbnail, false)} alt=""/>
                            <div className="name">{jammerB.Name}</div>
                        </div>
                    </div>
                </CaptureControlPanel>
        );
    }
}

export default CaptureControlScorekeeper;