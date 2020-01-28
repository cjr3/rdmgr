import React from 'react';
import ScorekeeperController, { SScorekeeperTeam } from 'controllers/ScorekeeperController';
import CaptureControlPanel, {PCaptureControlPanel} from './CaptureControlPanel';
import ScorekeeperCaptureController from 'controllers/capture/Scorekeeper';
import { Unsubscribe } from 'redux';
import { AddMediaPath } from 'controllers/functions';

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
        TeamA:ScorekeeperController.GetState().TeamA,
        TeamB:ScorekeeperController.GetState().TeamB,
        Shown:ScorekeeperCaptureController.GetState().Shown
    }

    /**
     * Scorekeeper controller listener
     */
    protected remoteState?:Unsubscribe;
    /**
     * Capture controller listener
     */
    protected remoteCapture?:Unsubscribe;

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
    protected updateState() {
        this.setState(() => {
            return {
                TeamA:ScorekeeperController.GetState().TeamA,
                TeamB:ScorekeeperController.GetState().TeamB
            }
        });
    }

    /**
     * Updates the state to match the capture controller.
     */
    protected updateCapture() {
        this.setState(() => {
            return {Shown:ScorekeeperCaptureController.GetState().Shown};
        });
    }

    /**
     * Start listeners
     */
    componentDidMount() {
        this.remoteState = ScorekeeperController.Subscribe(this.updateState);
        this.remoteCapture = ScorekeeperCaptureController.Subscribe(this.updateCapture);
    }

    /**
     * Close listeners
     */
    componentWillUnmount() {
        if(this.remoteState)
            this.remoteState();
        if(this.remoteCapture)
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
                            <img src={AddMediaPath(jammerA.Thumbnail)} alt=""/>
                            <div className="name">{jammerA.Name}</div>
                        </div>
                        <div className="skater-preview">
                            <img src={AddMediaPath(jammerB.Thumbnail)} alt=""/>
                            <div className="name">{jammerB.Name}</div>
                        </div>
                    </div>
                </CaptureControlPanel>
        );
    }
}