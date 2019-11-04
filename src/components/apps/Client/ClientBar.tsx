import React from 'react';
import cnames from 'classnames';
import { 
    IconSkate,
    IconMonitor, 
    IconWhistle, 
    IconClipboard,
    IconTeam,
    IconAV,
    Icon,
    IconOffline,
    IconOnline,
    IconCapture,
    IconChat,
    IconSettings
} from 'components/Elements';
import ScoreboardController from 'controllers/ScoreboardController';
import CaptureController from 'controllers/CaptureController';
import PenaltyController from 'controllers/PenaltyController';
import ScorekeeperController from 'controllers/ScorekeeperController';
import RosterController from 'controllers/RosterController';
import MediaQueueController from 'controllers/MediaQueueController';
import ClientController from 'controllers/ClientController';
import ClientCaptureStatus from './ClientCaptureStatus';
import UIController from 'controllers/UIController';
import ChatController from 'controllers/ChatController';

export default class ClientBar extends React.PureComponent<any, {
    PeerApplications:Array<string>;
    CurrentApplication:string;
    ConnectedPeers:number;
    UnreadMessageCount:number;
}> {
    readonly state = {
        PeerApplications:[],
        CurrentApplication:'',
        ConnectedPeers:0,
        UnreadMessageCount:0
    };

    /**
     * 
     */
    protected Applications:any;

    /**
     * Subscriber for ClientController
     */
    protected remoteClient:Function|null = null;

    /**
     * Constructor
     * @param props 
     */
    constructor(props) {
        super(props);
        
        this.Applications = {
            [ScoreboardController.Key]:{
                name:"Scoreboard",
                icon:IconSkate,
                remote:''
            },
            [CaptureController.Key]:{
                name:"Capture Control",
                icon:IconMonitor,
                remote:''
            },
            [PenaltyController.Key]:{
                name:'Penalty Tracker',
                icon:IconWhistle,
                remote:''
            },
            [ScorekeeperController.Key]:{
                name:'Scorekeeper',
                icon:IconClipboard,
                remote:''
            },
            [RosterController.Key]:{
                name:'Roster',
                icon:IconTeam,
                remote:''
            },
            [MediaQueueController.Key]:{
                name:'Media Queue',
                icon:IconAV,
                remote:''
            }
        };

        this.updateClient = this.updateClient.bind(this);
    }

    /**
     * Updates the state to match the ClientController
     */
    updateClient() {
        let state = ClientController.getState();
        this.setState({
            PeerApplications:state.PeerApplications,
            CurrentApplication:state.CurrentApplication,
            ConnectedPeers:state.ConnectedPeers,
            UnreadMessageCount:state.UnreadMessageCount
        });
    }

    /**
     * Triggered when the component mounts to the DOM
     */
    componentDidMount() {
        this.remoteClient = ClientController.subscribe(this.updateClient);
    }

    /**
     * Triggered when the component will unmount from the DOM
     */
    componentWillUnmount() {
        if(this.remoteClient !== null) {
            this.remoteClient();
        }
    }

    /**
     * Renders the component
     */
    render() {
        const icons:Array<React.ReactElement> = [];
        for(let key in this.Applications) {
            let app = this.Applications[key];
            let remote = '';
            let title:string = app.name;
            if(this.state.PeerApplications && this.state.PeerApplications[key]) {
                remote = this.state.PeerApplications[key];
                title = `${app.name} (${remote})`;
            }
            
            icons.push(
                <Icon
                    src={app.icon}
                    key={`${key}-app`}
                    className={cnames({active:(key === this.state.CurrentApplication)})}
                    title={title}
                    onClick={() => {
                        ClientController.SetApplication(key);
                        ClientController.ToggleConfiguration(false);
                    }}
                    />
            );
        }

        let iconConnection = IconOffline;
        if(this.state.ConnectedPeers > 0)
            iconConnection = IconOnline;

        const recordicons = [
            <Icon
                src={iconConnection}
                key="btn-network"
                title="Connect"
                onClick={ClientController.ConnectPeers}/>,
            <Icon
                src={IconCapture}
                key="btn-display"
                title="Display Options"
                onClick={ClientController.ToggleDisplay}/>,
            <Icon
                src={IconChat}
                key="btn-chat"
                attention={(this.state.UnreadMessageCount >= 1)}
                title={`${this.state.UnreadMessageCount} unread messages.`}
                onClick={UIController.ToggleChat}/>,
            <Icon
                src={IconSettings}
                key="btn-settings"
                title="Configuration"
                onClick={ClientController.ToggleConfiguration}
            />
        ];

        const buttons = [
            <div className="app-buttons" key="app-buttons">{icons}</div>,
            <ClientCaptureStatus key="capture-status"/>,
            <div className="record-buttons" key="record-buttons">{recordicons}</div>
        ];

        return (
            <div className="client-bar">
                {buttons}
            </div>
        );
    }
}