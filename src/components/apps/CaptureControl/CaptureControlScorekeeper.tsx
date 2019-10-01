import React from 'react';
import ScorekeeperController, { SScorekeeperTeam } from 'controllers/ScorekeeperController';
import CaptureController from 'controllers/CaptureController';
import DataController from 'controllers/DataController';
import CaptureControlPanel, {PCaptureControlPanel} from './CaptureControlPanel';

/**
 * Component for configuring the scorekeeper elements.
 */
export default class CaptureControlScorekeeper extends React.PureComponent<PCaptureControlPanel, {
    /**
     * Left side team
     */
    TeamA:SScorekeeperTeam;
    /**
     * Right side team
     */
    TeamB:SScorekeeperTeam;
    /**
     * Determines if the scorekeeper is displayed on the capture window
     */
    Shown:boolean;
}> {

    readonly state = {
        TeamA:ScorekeeperController.getState().TeamA,
        TeamB:ScorekeeperController.getState().TeamB,
        Shown:CaptureController.getState().Scorekeeper.Shown
    }

    /**
     * Scorekeeper controller listener
     */
    protected remoteState:Function|null = null;
    /**
     * Capture controller listener
     */
    protected remoteCapture:Function|null = null;

    /**
     * Constructor
     * @param props PCaptureControlPanel
     */
    constructor(props:PCaptureControlPanel) {
        super(props);

        this.updateState = this.updateState.bind(this);
        this.updateCapture = this.updateCapture.bind(this);
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
     * Start listeners
     */
    componentDidMount() {
        this.remoteState = ScorekeeperController.subscribe(this.updateState);
        this.remoteCapture = CaptureController.subscribe(this.updateCapture);
    }

    /**
     * Close listeners
     */
    componentWillUnmount() {
        if(this.remoteState !== null)
            this.remoteState();
        if(this.remoteCapture !== null)
            this.remoteCapture();
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