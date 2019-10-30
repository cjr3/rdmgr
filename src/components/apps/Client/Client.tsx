/**
 * Client/control form.
 */

import React from 'react'
import Panel from 'components/Panel'
import {
    Icon, 
    IconSkate,
    IconAV,
    IconWhistle,
    IconClipboard,
    IconTeam,
    IconChat,
    IconMonitor,
    IconSettings,
    IconShown,
    IconCapture,
    IconController,
    IconOffline,
    IconOnline
} from 'components/Elements';
import ClientScorebanner from './ClientScorebanner';
import cnames from 'classnames'

//controllers
import ClientController from 'controllers/ClientController';
import CameraController from 'controllers/CameraController';
import CaptureController from 'controllers/CaptureController';
import ChatController from 'controllers/ChatController';
import DataController from 'controllers/DataController';
import MediaQueueController from 'controllers/MediaQueueController';
import PenaltyController from 'controllers/PenaltyController';
import RaffleController from 'controllers/RaffleController';
import RosterController from 'controllers/RosterController';
import ScoreboardController from 'controllers/ScoreboardController';
import ScorekeeperController from 'controllers/ScorekeeperController';
import SlideshowController from 'controllers/SlideshowController';
import SponsorController from 'controllers/SponsorController';
import VideoController from 'controllers/VideoController';

import GameController from 'controllers/GameController';

//inter-process communication
import IPCX from 'controllers/IPCX';

//components
import CaptureControl from 'components/apps/CaptureControl/CaptureControl';
import ChatForm from 'components/apps/ChatForm/ChatForm';
import ConfigForm from 'components/data/ConfigForm';
import MediaQueue from 'components/apps/MediaQueue/MediaQueue';
import PenaltyTracker from 'components/apps/PenaltyTracker/PenaltyTracker';
import Roster from 'components/apps/Roster/Roster';
import Scoreboard from 'components/apps/Scoreboard/Scoreboard';
import Scorekeeper from 'components/apps/Scorekeeper/Scorekeeper';
import ClientCaptureStatus from './ClientCaptureStatus';
import ClientDialog from './ClientDialog';
import CaptureDisplayButtons from 'components/apps/CaptureControl/CaptureDisplayButtons';
import ClientBar from './ClientBar';

//style
import './css/Client.scss';

//utilities
import FileBrowser from 'components/tools/FileBrowser';
import {PeerRecordRequest} from 'components/data/PeerEditor';
import vars from 'tools/vars';
import keycodes from 'tools/keycodes';


/**
 * Component for the client control form.
 */
export default class Client extends React.PureComponent<any, {
    shown:boolean;
}> {
    readonly state = {
        shown:false
    }

    protected FileBrowserItem:React.RefObject<FileBrowser> = React.createRef();

    /**
     * Constructor
     * @param props any
     */
    constructor(props) {
        super(props);

        //bindings
        this.showFileBrowser = this.showFileBrowser.bind(this);
        this.hideFileBrowser = this.hideFileBrowser.bind(this);
        this.onSelectFile = this.onSelectFile.bind(this);
    }

    /**
     * Triggered when a user selects a file from the file browser.
     * @param {String} filename 
     */
    onSelectFile(filename) {
        this.hideFileBrowser();
        if(window.onSelectFile && typeof(window.onSelectFile) === "function") {
            window.onSelectFile(filename);
        }
    }

    /**
     * Shows the file browser.
     */
    showFileBrowser() {
        //this.setState(() => {return {FileBrowserShown:true}});
    }

    /**
     * Hides the file browser.
     */
    hideFileBrowser() {
        //this.setState(() => {return {FileBrowserShown:false}});
    }

    /**
     * Triggered when the component mounts to the DOM
     * - Load the data files.
     * - Add global event listeners for keyup, gamepad
     */
    componentDidMount() {
        if(ClientController.Init !== undefined) {
            ClientController.Init();
        }

        //Show the component
        this.setState({shown:true}, () => {
            CaptureController.Init();
            GameController.Init();
        });
    }

    /**
     * Renders the component.
     */
    render() {
        return (
            <React.Fragment>
                <ClientApplications/>
                <ClientBar/>
                <ClientChatPanel/>
                <ClientConfigPanel/>
                <ClientDisplayPanel/>
            </React.Fragment>
        );
    }
}

/*


                <FileBrowser
                    //opened={this.state.FileBrowserShown}
                    opened={false}
                    ref={this.FileBrowserItem}
                    onSelect={this.onSelectFile}
                    onClose={() => {
                        //this.setState({FileBrowserShown:false});
                    }}
                    />


                <PeerRecordRequest
                    name={this.state.RecordUpdatePeerName}
                    opened={this.state.RecordUpdateShown}
                    id={this.state.RecordUpdatePeerID}
                    message={`${this.state.RecordUpdatePeerID} wants to update your records. 
                        Choose which records to update, or click Cancel to ignore the request.`}
                    types={this.state.RecordUpdateTypes}
                    method='get-records'
                    onClose={() => {
                        this.setState({RecordUpdateShown:false});
                    }}
                />
*/

class ClientApplications extends React.PureComponent<any, {
    /**
     * Key code for current application
     */
    CurrentApplication:string;
    /**
     * Collection of applications controlled by peers
     */
    PeerApplications:any;
}> {

    readonly state = {
        CurrentApplication:ClientController.getState().CurrentApplication,
        PeerApplications:{}
    }

    /**
     * ClientController listener
     */
    protected remoteClient:Function|null = null;

    /**
     * Constructor
     * @param props any
     */
    constructor(props) {
        super(props);
        this.updateClient = this.updateClient.bind(this);
    }

    /**
     * Update the state to match the ClientController
     */
    updateClient() {
        let state = ClientController.getState();
        if(state.CurrentApplication !== this.state.CurrentApplication
            || !DataController.compare(state.PeerApplications, this.state.PeerApplications)) {
            this.setState({
                CurrentApplication:state.CurrentApplication,
                PeerApplications:state.PeerApplications
            });
        }
    }

    /**
     * Subscribe to ClientController
     */
    componentDidMount() {
        this.remoteClient = ClientController.subscribe(this.updateClient);
    }

    /**
     * Close ClientController subscriber
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
        return (
            <Panel
                className="client"
                contentName="control-app"
                title={<ClientScorebanner/>}
                opened={true}
                onClose={ClientController.Exit}
                >
                <Scoreboard opened={(this.state.CurrentApplication === ScoreboardController.Key)}/>
                <CaptureControl opened={(this.state.CurrentApplication === CaptureController.Key)}/>
                <PenaltyTracker opened={(this.state.CurrentApplication === PenaltyController.Key)}/>
                <Scorekeeper opened={(this.state.CurrentApplication === ScorekeeperController.Key)}/>
                <Roster opened={(this.state.CurrentApplication === RosterController.Key)}/>
                <MediaQueue opened={(this.state.CurrentApplication === MediaQueueController.Key)}/>
            </Panel>
        );
    }
}

class ClientChatPanel extends React.PureComponent<any, {
    shown:boolean;
}> {
    readonly state = {
        shown:false
    };

    protected remoteClient:Function|null = null;

    constructor(props) {
        super(props);
        this.updateClient = this.updateClient.bind(this);
    }

    updateClient() {
        let shown = ClientController.getState().ChatShown;
        if(shown !== this.state.shown) {
            this.setState({shown:shown});
        }
    }

    componentDidMount() {
        this.remoteClient = ClientController.subscribe(this.updateClient);
    }

    componentWillUnmount() {
        if(this.remoteClient !== null)
            this.remoteClient();
    }

    render() {
        return (
            <ChatForm
                opened={this.state.shown}
                onClose={() => {ClientController.ToggleChat(false);}}
            />
        );
    }
    
}

class ClientConfigPanel extends React.PureComponent<any, {
    shown:boolean;
}> {
    readonly state = {
        shown:false
    };

    protected remoteClient:Function|null = null;

    constructor(props) {
        super(props);
        this.updateClient = this.updateClient.bind(this);
    }

    updateClient() {
        let shown = ClientController.getState().ConfigShown;
        if(shown !== this.state.shown) {
            this.setState({shown:shown});
        }
    }

    componentDidMount() {
        this.remoteClient = ClientController.subscribe(this.updateClient);
    }

    componentWillUnmount() {
        if(this.remoteClient !== null)
            this.remoteClient();
    }

    render() {
        return (
            <ConfigForm 
                opened={this.state.shown}
                onClose={() => {ClientController.ToggleConfiguration(false);}}
            />
        );
    }
}

class ClientDisplayPanel extends React.PureComponent<any, {
    shown:boolean;
}> {
    readonly state = {
        shown:false
    };

    protected remoteClient:Function|null = null;

    constructor(props) {
        super(props);
        this.updateClient = this.updateClient.bind(this);
    }

    updateClient() {
        let shown = ClientController.getState().DisplayShown;
        if(shown !== this.state.shown) {
            this.setState({shown:shown});
        }
    }

    componentDidMount() {
        this.remoteClient = ClientController.subscribe(this.updateClient);
    }

    componentWillUnmount() {
        if(this.remoteClient !== null)
            this.remoteClient();
    }

    render() {
        return (
            <Panel 
                popup={true} 
                opened={this.state.shown}
                title="Display Options"
                className="display-options"
                onClose={() => {ClientController.ToggleDisplay(false);}}
                >
                <div className="record-list">
                    <CaptureDisplayButtons/>
                </div>
            </Panel>
        );
    }
}