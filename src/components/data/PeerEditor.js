import React from 'react';
import RecordEditor from './RecordEditor';
import vars from 'tools/vars';
import { 
    ToggleButton, 
    IconButton, 
    IconSave, 
    IconLoop, 
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

/**
 * Component for editing team records.
 */
class PeerEditor extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            Host:'',
            PeerID:'',
            Port:0,
            CapturePort:0,
            ControlledApps:[],
            ReceiveApps:[],
            getRecordsShown:false,
            setRecordsShown:false
        };

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

        this.Controllers = [
            {
                name:"Capture",
                controller:CaptureController
            },
            {
                name:"Media Queue",
                controller:MediaQueueController
            },
            {
                name:"Penalty Tracker",
                controller:PenaltyController
            },
            {
                name:"Scoreboard",
                controller:ScoreboardController
            },
            {
                name:"Scorekeeper",
                controller:ScorekeeperController
            },
            {
                name:"Slideshow",
                controller:SlideshowController
            },
            {
                name:"Raffle",
                controller:RaffleController
            },
            {
                name:"Roster",
                controller:RosterController
            },
            {
                name:"Sponsors",
                controller:SponsorController
            },
            {
                name:"Video",
                controller:VideoController
            }
        ]
    }

    /**
     * Triggered when the user changes the capture port value.
     * @param {Event} ev 
     */
    onChangeCapturePort(ev) {
        var port = parseInt(ev.target.value);
        this.setState(() => {return {CapturePort:port};});
    }

    /**
     * Triggered when the user changes the host value.
     * @param {Event} ev 
     */
    onChangeHost(ev) {
        var host = ev.target.value;
        this.setState(() => {return {Host:host};});
    }

    /**
     * Triggered when the user changes the peer ID value.
     * @param {Event} ev 
     */
    onChangePeerID(ev) {
        var id = ev.target.value;
        this.setState(() => {return {PeerID:id};});
    }

    /**
     * Triggered when the user changes the port.
     * @param {Event} ev 
     */
    onChangePort(ev) {
        var port = parseInt(ev.target.value);
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
        var port = (Number.isNaN(this.state.Port)) ? 0 : this.state.Port;
        var cport = (Number.isNaN(this.state.CapturePort)) ? 0 : this.state.CapturePort;
        var capps = [];
        var rapps = [];
        this.Controllers.forEach((item) => {
            let key = item.controller.Key;
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

        let buttons = [
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

        let name = (this.props.record) ? this.props.record.Name : '';

        return (
            <RecordEditor 
                recordType={vars.RecordType.Peer}
                onSubmit={this.onSubmit}
                buttons={buttons}
                {...this.props}
                >
                <table cellPadding="2">
                    <tbody>
                        <tr>
                            <td width="150">ID</td>
                            <td colSpan="2">
                                <input
                                    type="text"
                                    size="30"
                                    maxLength="20"
                                    value={this.state.PeerID}
                                    onChange={this.onChangePeerID}
                                    />
                            </td>
                        </tr>
                        <tr>
                            <td>Host</td>
                            <td colSpan="2">
                                <input
                                    type="text"
                                    size="15"
                                    maxLength="20"
                                    value={this.state.Host}
                                    onChange={this.onChangeHost}
                                    /> :
                                <input type="text"
                                    size="4"
                                    maxLength="5"
                                    value={port}
                                    onChange={this.onChangePort}
                                    />
                            </td>
                        </tr>
                        <tr>
                            <td>Camera Port</td>
                            <td colSpan="2">
                                <input type="text"
                                    size="4"
                                    maxLength="5"
                                    value={cport}
                                    onChange={this.onChangeCapturePort}
                                    />
                            </td>
                        </tr>
                        <tr>
                            <td>Receive From Peer</td>
                            <td className="stack-panel s4">{capps}</td>
                        </tr>
                        <tr>
                            <td>Send To Peer</td>
                            <td className="stack-panel s4">{rapps}</td>
                        </tr>
                    </tbody>
                </table>
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
            </RecordEditor>
        );
    }
}

/**
 * Component for displaying a request to update records from this peer.
 */
class PeerRecordRequest extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            [vars.RecordType.Anthem]:false,
            [vars.RecordType.Penalty]:false,
            [vars.RecordType.Phase]:false,
            [vars.RecordType.Team]:false,
            [vars.RecordType.Skater]:false
        };

        if(this.props.types) {
            if(this.props.types[vars.RecordType.Anthem])
                this.state[vars.RecordType.Anthem] = true;

            if(this.props.types[vars.RecordType.Penalty])
                this.state[vars.RecordType.Penalty] = true;

            if(this.props.types[vars.RecordType.Phase])
                this.state[vars.RecordType.Phase] = true;
                
            if(this.props.types[vars.RecordType.Team])
                this.state[vars.RecordType.Team] = true;

            if(this.props.types[vars.RecordType.Skater])
                this.state[vars.RecordType.Skater] = true;
        }

        this.onClickConfirm = this.onClickConfirm.bind(this);
    }

    /**
     * Triggered when the user clicks the confirm button.
     * - Sends a request to the peer to get their records.
     */
    onClickConfirm() {
        let types = {
            [vars.RecordType.Anthem]:this.state[vars.RecordType.Anthem],
            [vars.RecordType.Penalty]:this.state[vars.RecordType.Penalty],
            [vars.RecordType.Phase]:this.state[vars.RecordType.Phase],
            [vars.RecordType.Team]:this.state[vars.RecordType.Team],
            [vars.RecordType.Skater]:this.state[vars.RecordType.Skater]
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
        if(prevProps.types != this.props.types && this.props.types) {
            let changes = {
                [vars.RecordType.Anthem]:false,
                [vars.RecordType.Penalty]:false,
                [vars.RecordType.Phase]:false,
                [vars.RecordType.Team]:false,
                [vars.RecordType.Skater]:false,
            };
            
            if(this.props.types[vars.RecordType.Anthem])
                changes[vars.RecordType.Anthem] = true;

            if(this.props.types[vars.RecordType.Penalty])
                changes[vars.RecordType.Penalty] = true;

            if(this.props.types[vars.RecordType.Phase])
                changes[vars.RecordType.Phase] = true;

            if(this.props.types[vars.RecordType.Team])
                changes[vars.RecordType.Team] = true;

            if(this.props.types[vars.RecordType.Skater])
                changes[vars.RecordType.Skater] = true;

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
                        checked={this.state[vars.RecordType.Anthem]}
                        label="Anthem Singers"
                        onClick={() => {
                            this.setState((state) => {
                                return {[vars.RecordType.Anthem]:!state[vars.RecordType.Anthem]}
                            })
                        }}
                    />
                    <ToggleButton
                        checked={this.state[vars.RecordType.Penalty]}
                        label="Penalties"
                        onClick={() => {
                            this.setState((state) => {
                                return {[vars.RecordType.Penalty]:!state[vars.RecordType.Penalty]}
                            })
                        }}
                    />
                    <ToggleButton
                        checked={this.state[vars.RecordType.Phase]}
                        label="Quarters"
                        onClick={() => {
                            this.setState((state) => {
                                return {[vars.RecordType.Phase]:!state[vars.RecordType.Phase]}
                            })
                        }}
                    />
                    <ToggleButton
                        checked={this.state[vars.RecordType.Team]}
                        label="Teams"
                        onClick={() => {
                            this.setState((state) => {
                                return {[vars.RecordType.Team]:!state[vars.RecordType.Team]}
                            })
                        }}
                    />
                    <ToggleButton
                        checked={this.state[vars.RecordType.Skater]}
                        label="Skaters"
                        onClick={() => {
                            this.setState((state) => {
                                return {[vars.RecordType.Skater]:!state[vars.RecordType.Skater]}
                            })
                        }}
                    />
                </div>
            </Panel>
        );
    }
}

export default PeerEditor;

export {
    PeerRecordRequest
};