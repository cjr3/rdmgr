import React from 'react';
import RecordEditor from './RecordEditor';
import vars, { PeerRecord } from 'tools/vars';
import { 
    ToggleButton, 
    IconButton,
    IconUp, 
    IconDown,
    IconCheck,
    IconNo
} from 'components/Elements';
import CaptureController from 'controllers/CaptureController';
import PenaltyController from 'controllers/PenaltyController';
import RaffleController from 'controllers/RaffleController';
import RosterController from 'controllers/RosterController';
import ScoreboardController from 'controllers/ScoreboardController';
import ScorekeeperController from 'controllers/ScorekeeperController';
import SlideshowController from 'controllers/SlideshowController';
import SponsorController from 'controllers/SponsorController';
import MediaQueueController from 'controllers/MediaQueueController';
import VideoController from 'controllers/VideoController';
import Panel from 'components/Panel';
import DataController from 'controllers/DataController';

type PeerControlRecord = {
    name:string;
    controller:any;
}

/**
 * Component for editing team records.
 */
export default class PeerEditor extends React.PureComponent<{
    /**
     * The record to edit
     */
    record:PeerRecord|null;
    /**
     * true to show, false to hide
     */
    opened:boolean;
}, {
    /**
     * Peer's Host, in IPV4 format
     */
    Host:string;
    /**
     * Peer's ID
     */
    PeerID:string;
    /**
     * Port number of the peer's host
     */
    Port:number;
    /**
     * Port number of the peer's capture window
     * - Needed for video feeds, because MediaStream is not serializable between IPC
     */
    CapturePort:number;
    /**
     * Collection of controller codes that the peer sends out to other peers
     */
    ControlledApps:Array<string>;
    /**
     * Collection of controller codes that the peer receives state updates from other peers
     */
    ReceiveApps:Array<string>;
    /**
     * Determines if the 'get records' from peer panel is shown
     */
    getRecordsShown:boolean;
    /**
     * Determines if the 'send records' to peer panel is shown
     */
    setRecordsShown:boolean;
}> {
    readonly state = {
        Host:'',
        PeerID:'',
        Port:0,
        CapturePort:0,
        ControlledApps:new Array<string>(),
        ReceiveApps:new Array<string>(),
        getRecordsShown:false,
        setRecordsShown:false
    }

    protected Controllers:Array<PeerControlRecord> = [
        {name:"Capture", controller:CaptureController},
        {name:"Media Queue", controller:MediaQueueController},
        {name:"Penalty Tracker", controller:PenaltyController},
        {name:"Scoreboard", controller:ScoreboardController},
        {name:"Scorekeeper", controller:ScorekeeperController},
        {name:"Slideshow", controller:SlideshowController},
        {name:"Raffle", controller:RaffleController},
        {name:"Roster", controller:RosterController},
        {name:"Sponsors", controller:SponsorController},
        {name:"Video", controller:VideoController}
    ]

    /**
     * Constructor
     * @param props 
     */
    constructor(props) {
        super(props);
        this.onChangeHost = this.onChangeHost.bind(this);
        this.onChangePort = this.onChangePort.bind(this);
        this.onChangePeerID = this.onChangePeerID.bind(this);
        this.onChangeCapturePort = this.onChangeCapturePort.bind(this);
        this.onSelect = this.onSelect.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onClickControlledApp = this.onClickControlledApp.bind(this);
        this.onClickReceiveApp = this.onClickReceiveApp.bind(this);
        this.onClickSyncFromPeer = this.onClickSyncFromPeer.bind(this);
        this.onClickSyncToPeer = this.onClickSyncToPeer.bind(this);
    }

    /**
     * Triggered when the user changes the capture port value.
     * @param {Event} ev 
     */
    onChangeCapturePort(ev:React.ChangeEvent<HTMLInputElement>) {
        let port:number = parseInt(ev.currentTarget.value);
        this.setState(() => {return {CapturePort:port};});
    }

    /**
     * Triggered when the user changes the host value.
     * @param {Event} ev 
     */
    onChangeHost(ev:React.ChangeEvent<HTMLInputElement>) {
        let host:string = ev.currentTarget.value;
        this.setState(() => {return {Host:host};});
    }

    /**
     * Triggered when the user changes the peer ID value.
     * @param {Event} ev 
     */
    onChangePeerID(ev:React.ChangeEvent<HTMLInputElement>) {
        let id:string = ev.currentTarget.value;
        this.setState(() => {return {PeerID:id};});
    }

    /**
     * Triggered when the user changes the port.
     * @param {Event} ev 
     */
    onChangePort(ev:React.ChangeEvent<HTMLInputElement>) {
        let port:number = parseInt(ev.currentTarget.value);
        this.setState(() => {return {Port:port};});
    }

    /**
     * Triggered when the user selects a record.
     * @param {Object} record 
     */
    onSelect(record) {
        this.setState(() => {
            let capps = record.ControlledApps || [];
            let rapps = record.ReceiveApps || [];
            return {
                Host:record.Host,
                PeerID:record.PeerID,
                Port:record.Port,
                CapturePort:record.CapturePort,
                ControlledApps:capps.slice(),
                ReceiveApps:rapps.slice()
            };
        });
    }

    /**
     * Triggered when the user clicks the submit button.
     * @param {Object} record 
     */
    onSubmit(record) {
        return Object.assign({}, record, {
            Host:this.state.Host,
            PeerID:this.state.PeerID,
            Port:this.state.Port,
            CapturePort:this.state.CapturePort,
            ControlledApps:this.state.ControlledApps.slice(),
            ReceiveApps:this.state.ReceiveApps.slice()
        });
    }

    /**
     * Triggered when the user clicks on a controlled app button.
     * @param {String} code 
     */
    onClickControlledApp(code) {
        this.setState((state) => {
            let capps = state.ControlledApps.slice();
            let rapps = state.ReceiveApps.slice();
            let index = capps.findIndex((app) => {
                return (app === code);
            });
            let rindex = rapps.findIndex((app) => {
                return (app === code);
            });
            if(index >= 0) {
                capps.splice(index, 1);
            } else {
                capps.push(code);
            }
            if(rindex >= 0) {
                rapps.splice(rindex, 1);
            }
            return {
                ControlledApps:capps,
                ReceiveApps:rapps
            };
        });
    }

    /**
     * Triggered when the user clicks on a receive app button.
     * @param {String} code 
     */
    onClickReceiveApp(code) {
        this.setState((state) => {
            let capps = state.ControlledApps.slice();
            let rapps = state.ReceiveApps.slice();
            let index = rapps.findIndex((app) => {
                return (app === code);
            });
            let cindex = capps.findIndex((app) => {
                return (app === code);
            });
            if(index >= 0) {
                rapps.splice(index, 1);
            } else {
                rapps.push(code);
            }
            if(cindex >= 0) {
                capps.splice(cindex, 1);
            }
            return {
                ControlledApps:capps,
                ReceiveApps:rapps
            };
        });
    }

    /**
     * Triggered when the user wishes to update records from the peer.
     */
    onClickSyncFromPeer() {
        if(window && window.client) {
            window.client.showDialog(
                `Update your files to match ${this.state.PeerID}?`,
                () => {
                    window.LocalServer.SendData(this.state.PeerID, {
                        type:'sync-confirm'
                    });
                }
            )
        }
    }

    /**
     * Triggered when the user wishes to sync their files to the peer.
     * - Require confirmation on the peer side ???
     */
    onClickSyncToPeer() {
        if(window && window.client) {
            window.client.showDialog(
                `Request ${this.state.PeerID} to update their files to match yours?
                The user will have to confirm.
                `,
                () => {
                    if(window && window.LocalServer) {
                        window.LocalServer.SendData(this.state.PeerID, {
                            type:'request-sync'
                        });
                    }
                }
            )
        }
    }

    /**
     * Triggered when the component is updated
     * @param {Object} prevProps 
     */
    componentDidUpdate(prevProps) {
        if(this.props.record) {
            if(prevProps.record) {
                if(prevProps.record.RecordID !== this.props.record.RecordID) {
                    this.onSelect(this.props.record);
                }
            } else {
                this.onSelect(this.props.record);
            }
        }
    }

    /**
     * Renders the component.
     */
    render() {
        let port:number = (Number.isNaN(this.state.Port)) ? 0 : this.state.Port;
        let cport:number = (Number.isNaN(this.state.CapturePort)) ? 0 : this.state.CapturePort;
        let capps:Array<React.ReactElement> = [];
        let rapps:Array<React.ReactElement> = [];
        let name:string = (this.props.record !== null) ? this.props.record.Name : '';
        
        this.Controllers.forEach((item) => {
            let key:string = item.controller.Key;
            let controlled = (this.state.ControlledApps.indexOf(key) >= 0);
            let received = (this.state.ReceiveApps.indexOf(key) >= 0);
            capps.push(
                <ToggleButton
                    key={key}
                    checked={controlled}
                    onClick={() => {
                        this.onClickControlledApp(key)
                    }}
                    label={item.name}/>
            );

            rapps.push(
                <ToggleButton
                    key={key}
                    checked={received}
                    onClick={() => {
                        this.onClickReceiveApp(key)
                    }}
                    label={item.name}/>
            );
        });

        let buttons:Array<React.ReactElement> = [
            <IconButton
                key="btn-get-records"
                src={IconDown}
                title={`Update records from ${this.state.PeerID}`}
                active={this.state.getRecordsShown}
                onClick={() => {
                    this.setState({
                        getRecordsShown:!this.state.getRecordsShown
                    });
                }}
                />,
            <IconButton
                key="btn-set-records"
                src={IconUp}
                title={`Send records to ${this.state.PeerID}`}
                active={this.state.setRecordsShown}
                onClick={() => {
                    this.setState({
                        setRecordsShown:!this.state.setRecordsShown
                    });
                }}
                />
        ];

        return (
            <React.Fragment>
                <RecordEditor 
                    recordType={vars.RecordType.Peer}
                    onSubmit={this.onSubmit}
                    buttons={buttons}
                    opened={this.props.opened}
                    {...this.props}
                    >
                    <tr>
                        <td>ID</td>
                        <td colSpan={3}>
                            <input
                                type="text"
                                size={30}
                                maxLength={20}
                                value={this.state.PeerID}
                                onChange={this.onChangePeerID}
                                />
                        </td>
                    </tr>
                    <tr>
                        <td>Host</td>
                        <td colSpan={3}>
                            <input
                                type="text"
                                size={15}
                                maxLength={20}
                                value={this.state.Host}
                                onChange={this.onChangeHost}
                                /> :
                            <input type="text"
                                size={4}
                                maxLength={5}
                                value={port}
                                onChange={this.onChangePort}
                                />
                        </td>
                    </tr>
                    <tr>
                        <td>Camera Port</td>
                        <td colSpan={3}>
                            <input type="text"
                                size={4}
                                maxLength={5}
                                value={cport}
                                onChange={this.onChangeCapturePort}
                                />
                        </td>
                    </tr>
                    <tr>
                        <td>Receive From Peer</td>
                        <td colSpan={3}>
                            <div className="stack-panel s4">
                                {capps}
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>Send To Peer</td>
                        <td colSpan={3}>
                            <div className="stack-panel s4">
                                {rapps}
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={4}>
                        </td>
                    </tr>
                </RecordEditor>
                <PeerRecordRequest
                        opened={this.state.getRecordsShown}
                        name={name}
                        id={this.state.PeerID}
                        method='get-records'
                        message={`Please select the records to receive from ${this.state.PeerID}`}
                        onClose={() => {
                            this.setState({
                                getRecordsShown:!this.state.getRecordsShown
                            });
                        }}
                        />
                <PeerRecordRequest
                        opened={this.state.setRecordsShown}
                        name={name}
                        id={this.state.PeerID}
                        method='set-record-request'
                        message={`Please select the records to send to ${this.state.PeerID}.
                            They'll be requested to confirm which records to update.`}
                        onClose={() => {
                            this.setState({
                                setRecordsShown:!this.state.setRecordsShown
                            });
                        }}
                        />
            </React.Fragment>
        );
    }
}

interface SPeerRecordRequest {
    AnthemSingers:boolean;
    Penalties:boolean;
    Phases:boolean;
    Teams:boolean;
    Skaters:boolean;
}

interface PPeerRecordRequest {
    opened:boolean;
    id:string;
    method:string;
    types?:any;
    message?:string;
    onClose?:Function;
    name:string;
}

/**
 * Component for displaying a request to update records from this peer.
 */
export class PeerRecordRequest extends React.PureComponent<PPeerRecordRequest, SPeerRecordRequest> {
    readonly state:SPeerRecordRequest = {
        AnthemSingers:false,
        Penalties:false,
        Phases:false,
        Teams:false,
        Skaters:false
    }
    constructor(props) {
        super(props);
        this.onClickConfirm = this.onClickConfirm.bind(this);
    }

    /**
     * Triggered when the user clicks the confirm button.
     * - Sends a request to the peer to get their records.
     */
    onClickConfirm() {
        let types = {
            [vars.RecordType.Anthem]:this.state.AnthemSingers,
            [vars.RecordType.Penalty]:this.state.Penalties,
            [vars.RecordType.Phase]:this.state.Phases,
            [vars.RecordType.Team]:this.state.Teams,
            [vars.RecordType.Skater]:this.state.Skaters
        };

        if(window && window.LocalServer) {
            window.LocalServer.SendData(this.props.id, {
                type:this.props.method,
                types:types
            });
        }

        if(this.props.onClose)
            this.props.onClose();
    }

    /**
     * Triggered when the component updates.
     */
    componentDidUpdate(prevProps, prevState) {
        if(!DataController.compare(prevProps.types, this.props.types)) {
            let changes:SPeerRecordRequest = {
                AnthemSingers:this.state.AnthemSingers,
                Penalties:this.state.Penalties,
                Phases:this.state.Phases,
                Skaters:this.state.Skaters,
                Teams:this.state.Teams
            }
            
            if(this.props.types[vars.RecordType.Anthem])
                changes.AnthemSingers = true;

            if(this.props.types[vars.RecordType.Penalty])
                changes.Penalties = true;

            if(this.props.types[vars.RecordType.Phase])
                changes.Phases = true;

            if(this.props.types[vars.RecordType.Team])
                changes.Teams = true;

            if(this.props.types[vars.RecordType.Skater])
                changes.Skaters = true;

            if(!DataController.compare(prevState, changes)) {
                this.setState(() => {return changes;});
            }
        }
    }

    /**
     * Renders the component.
     */
    render() {
        let buttons = [
            <IconButton
                key="btn-confirm"
                src={IconCheck}
                onClick={this.onClickConfirm}
                title="Confirm"
                >Confirm</IconButton>,
            <IconButton
                key="btn-close"
                src={IconNo}
                onClick={this.props.onClose}
                title="Cancel"
                >Cancel</IconButton>
        ];

        return (
            <Panel
                opened={this.props.opened}
                buttons={buttons}
                className="peer-record-request"
                popup={true}
                >
                <p>{this.props.message}</p>
                <div className="stack-panel s3">
                    <ToggleButton
                        checked={this.state.AnthemSingers}
                        label="Anthem Singers"
                        onClick={() => {
                            this.setState({AnthemSingers:!this.state.AnthemSingers});
                        }}
                    />
                    <ToggleButton
                        checked={this.state.Penalties}
                        label="Penalties"
                        onClick={() => {
                            this.setState({Penalties:!this.state.Penalties});
                        }}
                    />
                    <ToggleButton
                        checked={this.state.Phases}
                        label="Quarters"
                        onClick={() => {
                            this.setState({Phases:!this.state.Phases});
                        }}
                    />
                    <ToggleButton
                        checked={this.state.Teams}
                        label="Teams"
                        onClick={() => {
                            this.setState({Teams:!this.state.Teams});
                        }}
                    />
                    <ToggleButton
                        checked={this.state.Skaters}
                        label="Skaters"
                        onClick={() => {
                            this.setState({Skaters:!this.state.Skaters});
                        }}
                    />
                </div>
            </Panel>
        );
    }
}