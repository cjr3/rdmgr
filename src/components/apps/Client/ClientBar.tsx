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
import PenaltyController from 'controllers/PenaltyController';
import ScorekeeperController from 'controllers/ScorekeeperController';
import RosterController from 'controllers/RosterController';
import MediaQueueController from 'controllers/MediaQueueController';
import ClientController from 'controllers/ClientController';
import ClientCaptureStatus from './ClientCaptureStatus';
import UIController from 'controllers/UIController';
import { Unsubscribe } from 'redux';

interface ClientBarApplication {
    Key:string;
    Name:string;
    Icon:string;
}

export default class ClientBar extends React.PureComponent<any, {
    PeerApplications:Array<string>;
    CurrentApplication:string;
    ConnectedPeers:number;
    UnreadMessageCount:number;
    Applications:{
        Scoreboard:ClientBarApplication;
        CaptureControl:ClientBarApplication;
        PenaltyTracker:ClientBarApplication;
        Scorekeeper:ClientBarApplication;
        Roster:ClientBarApplication;
        MediaQueue:ClientBarApplication;
    }
}> {
    readonly state = {
        PeerApplications:[],
        CurrentApplication:ClientController.GetState().CurrentApplication,
        ConnectedPeers:0,
        UnreadMessageCount:0,
        Applications:{
            Scoreboard:{
                Key:ScoreboardController.Key,
                Name:"Scoreboard",
                Icon:IconSkate
            },
            CaptureControl:{
                Key:'CC',
                Name:"Capture Control",
                Icon:IconMonitor
            },
            PenaltyTracker:{
                Key:PenaltyController.Key,
                Name:"Penalty Tracker",
                Icon:IconWhistle
            },
            Scorekeeper:{
                Key:ScorekeeperController.Key,
                Name:"Scorekeeper",
                Icon:IconClipboard
            },
            Roster:{
                Key:RosterController.Key,
                Name:"Roster",
                Icon:IconTeam
            },
            MediaQueue:{
                Key:MediaQueueController.Key,
                Name:"Media Queue",
                Icon:IconAV
            }
        }
    };

    /**
     * Subscriber for ClientController
     */
    protected remoteClient?:Unsubscribe;
    protected remoteUI?:Unsubscribe;

    /**
     * Constructor
     * @param props 
     */
    constructor(props) {
        super(props);
        this.updateClient = this.updateClient.bind(this);
    }

    /**
     * Updates the state to match the ClientController
     */
    protected async updateClient() {
        let state = ClientController.GetState();
        this.setState({
            PeerApplications:state.PeerApplications,
            CurrentApplication:state.CurrentApplication,
            ConnectedPeers:state.ConnectedPeers,
            UnreadMessageCount:state.UnreadMessageCount
        });
    }

    protected async updateUI() {
        let state = UIController.GetState();
        
    }

    /**
     * Triggered when the component mounts to the DOM
     */
    componentDidMount() {
        this.remoteClient = ClientController.Subscribe(this.updateClient);
    }

    /**
     * Triggered when the component will unmount from the DOM
     */
    componentWillUnmount() {
        if(this.remoteClient) {
            this.remoteClient();
        }
    }

    /**
     * Renders the component
     */
    render() {
        const icons:Array<React.ReactElement> = [];
        Object.keys(this.state.Applications).forEach((key:string, index) => {
            let app = this.state.Applications[key];
            let title:string = app.Name;
            
            if(this.state.PeerApplications && this.state.PeerApplications[app.Key]) {
                title = `${app.Name} (${this.state.PeerApplications[app.Key]})`;
            }
            
            icons.push(
                <Icon
                    src={app.Icon}
                    key={`${app.Key}-app`}
                    className={cnames({active:(app.Key === this.state.CurrentApplication)})}
                    title={title}
                    onClick={() => {
                        ClientController.SetApplication(app.Key);
                        ClientController.HidePanels();
                    }}
                    />
            );
        });

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