import React from 'react';
import CameraController from 'controllers/CameraController';
import CaptureStatus from 'tools/CaptureStatus';
import CaptureController from 'controllers/CaptureController';
import CaptureControlPanel, {PCaptureControlPanel} from './CaptureControlPanel';
import {
    IconButton,
    IconCheck,
    IconLoop,
    IconStreamOff,
    IconStreamOn
} from 'components/Elements';

/**
 * Component for configuring the main camera.
 */
export default class CaptureControlCameraPeer extends React.PureComponent<PCaptureControlPanel,{
    /**
     * Selected PeerID
     */
    PeerID:string;
    /**
     * Determines if the camera is visible or not.
     */
    Shown:boolean;
    /**
     * True if peer is connected and streaming
     */
    Connected:boolean;
    /**
     * Collection of peers
     */
    Peers:any;
}> {
    readonly state = {
        PeerID:CaptureStatus.getState().PeerCamera.PeerID,
        Shown:CaptureController.getState().PeerCamera.Shown,
        Connected:CaptureStatus.getState().PeerCamera.Connected,
        Peers:{}
    }

    /**
     * Listener for camera controller
     */
    protected remoteState:Function|null = null;
    /**
     * Listener for capture controller
     */
    protected remoteCapture:Function|null = null;

    /**
     * Constructor
     */
    constructor(props) {
        super(props);
        this.onClickSubmit = this.onClickSubmit.bind(this);
        this.updateState = this.updateState.bind(this);
        this.updateCapture = this.updateCapture.bind(this);
        this.updateLocalServer = this.updateLocalServer.bind(this);
    }

    /**
     * Updates the state to match the camera controller.
     */
    updateState() {
        this.setState(() => {
            return {
                PeerID:CaptureStatus.getState().PeerCamera.PeerID,
                Connected:CaptureStatus.getState().PeerCamera.Connected
            }
        });
    }

    /**
     * Updates the state to match the capture controller.
     */
    updateCapture() {
        this.setState(() => {
            return {Shown:CaptureController.getState().PeerCamera.Shown};
        })
    }

    /**
     * Updates the state to match the server controller.
     */
    updateLocalServer() {
        this.setState({
            Peers:Object.assign({}, window.LocalServer.getState().Peers)
        });
    }

    /**
     * Triggered when the user clicks the submit button.
     */
    onClickSubmit(id) {
        if(this.state.PeerID === id && this.state.Connected == true)
            return;
        if(window && window.IPC) {
            window.IPC.send({
                type:'peer-media-request',
                id:id + "-CAP"
            });
        }
    }

    /**
     * Triggered when the component mounts to the DOM.
     * - Load cameras
     * - Start listeners
     */
    componentDidMount() {
        this.remoteState = CaptureStatus.subscribe(this.updateState);
        this.remoteCapture = CaptureController.subscribe(this.updateCapture);

        let timer:number = window.setInterval(() => {
            if(window && window.LocalServer) {
                window.LocalServer.subscribe(this.updateLocalServer);
                this.updateLocalServer();
                try {clearInterval(timer);} catch(er) {}
            }
        }, 100);
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
     * Renders the component
     */
    render() {
        let peers:Array<React.ReactElement> = [];
        for(let key in this.state.Peers) {
            peers.push(
                <CaptureCameraPeerItem
                    key={key}
                    Connected={(key === this.state.PeerID && this.state.Connected)}
                    active={(this.state.PeerID === key)}
                    PeerID={key}
                    onClick={this.onClickSubmit}
                />
            );
        }
        return (
            <CaptureControlPanel
                active={this.props.active}
                name={this.props.name}
                icon={this.props.icon}
                toggle={this.props.toggle}
                shown={this.state.Shown}
                onClick={this.props.onClick}>
                    <div className="record-list">
                        {peers}
                    </div>
            </CaptureControlPanel>
        );
    }
}

interface PCaptureCameraPeer {
    PeerID:string;
    Connected:boolean;
    onClick:Function;
    active:boolean;
}

function CaptureCameraPeerItem(props:PCaptureCameraPeer) {
    let icon = IconStreamOff;
    if(props.Connected)
        icon = IconStreamOn;
    return (
        <IconButton 
            onClick={() => {
                props.onClick(props.PeerID)
            }}
            src={icon}
            active={props.active}
        >{props.PeerID}</IconButton>
    );
}