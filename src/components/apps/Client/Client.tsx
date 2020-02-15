/**
 * Client/control form.
 */

import React from 'react'
import Panel from 'components/Panel'
import ClientScorebanner from './ClientScorebanner';

//controllers
import ClientController from 'controllers/ClientController';
//import CaptureController from 'controllers/CaptureController';
import GameController from 'controllers/GameController';

//components
import CaptureControl from 'components/apps/CaptureControl/CaptureControl';
import ChatForm from 'components/apps/ChatForm/ChatForm';
import ConfigForm from 'components/data/ConfigForm';
import MediaQueue from 'components/apps/MediaQueue/MediaQueue';
import PenaltyTracker from 'components/apps/PenaltyTracker/PenaltyTracker';
import Roster from 'components/apps/Roster/Roster';
import Scoreboard from 'components/apps/Scoreboard/Scoreboard';
import Scorekeeper from 'components/apps/Scorekeeper/Scorekeeper';
import CaptureDisplayButtons from 'components/apps/CaptureControl/CaptureDisplayButtons';
import ClientBar from './ClientBar';

//style
import './css/Client.scss';

//utilities
import FileBrowser from 'components/tools/FileBrowser';
import {PeerRecordRequest} from 'components/data/PeerEditor';
import { Unsubscribe } from 'redux';
import Login from 'components/data/api/Login';
import UIController from 'controllers/UIController';
import DeleteFileDialog from 'components/data/DeleteFileDialog';

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
            //CaptureController.Init();
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
                <ClientFileBrowser/>
                <ClientBar/>
                <ChatForm/>
                <ClientConfigPanel/>
                <ClientDisplayPanel/>
                <ClientRecordRequest/>
                <ClientLogin/>
                <DeleteFileDialog/>
            </React.Fragment>
        );
    }
}

function ClientApplications() {
    return (
        <Panel
            className="client"
            contentName="control-app"
            title={<ClientScorebanner/>}
            opened={true}
            onClose={ClientController.Exit}
            >
            <Scoreboard/>
            <CaptureControl/>
            <PenaltyTracker/>
            <Scorekeeper/>
            <Roster/>
            <MediaQueue/>
        </Panel>
    );
}

class ClientRecordRequest extends React.PureComponent<any, {
    RecordUpdatePeerID:string;
    shown:boolean;
    RecordUpdateTypes:any;
}> {

    readonly state = {
        RecordUpdatePeerID:'',
        shown:false,
        RecordUpdateTypes:{}
    };

    protected remoteClient:Unsubscribe|null = null;

    constructor(props) {
        super(props);
        this.updateClient = this.updateClient.bind(this);
    }

    protected async updateClient() {
        this.setState({
            RecordUpdatePeerID:ClientController.GetState().RecordUpdatePeerID,
            RecordUpdateTypes:ClientController.GetState().RecordUpdateTypes,
            shown:ClientController.GetState().RecordUpdateShown
        });
    }

    componentDidMount() {
        this.remoteClient = ClientController.Subscribe(this.updateClient);
    }

    componentWillUnmount() {
        if(this.remoteClient !== null)
            this.remoteClient();
    }

    render() {
        return (
            <PeerRecordRequest
                name={this.state.RecordUpdatePeerID}
                opened={this.state.shown}
                id={this.state.RecordUpdatePeerID}
                message={`${this.state.RecordUpdatePeerID} wants to update your records. 
                    Choose which records to update, or click Cancel to ignore the request.`}
                types={this.state.RecordUpdateTypes}
                method='get-records'
                onClose={() => {
                    ClientController.HidePeerRequest();
                }}
            />
        )
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
        let shown = ClientController.GetState().ConfigShown;
        if(shown !== this.state.shown) {
            this.setState({shown:shown});
        }
    }

    componentDidMount() {
        this.remoteClient = ClientController.Subscribe(this.updateClient);
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
        let shown = ClientController.GetState().DisplayShown;
        if(shown !== this.state.shown) {
            this.setState({shown:shown});
        }
    }

    componentDidMount() {
        this.remoteClient = ClientController.Subscribe(this.updateClient);
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

/**
 * Component to display a FileBrowser
 * Set the global window.onSelectFile to a listener to receive the selected filename
 */
class ClientFileBrowser extends React.PureComponent<any, {
    /**
     * Determines if the FileBrowser is visible or not
     */
    opened:boolean;
}> {
    readonly state = {
        opened:false
    };

    /**
     * Subscriber for ClientController
     */
    protected remoteClient:Unsubscribe|null = null;

    /**
     * Constructor
     * @param props 
     */
    constructor(props) {
        super(props);
        this.updateClient = this.updateClient.bind(this);
        this.onSelectFile = this.onSelectFile.bind(this);
    }

    /**
     * Update state to match the ClientController
     */
    updateClient() {
        this.setState({
            opened:ClientController.GetState().FileBrowserShown
        });
    }

    /**
     * Subscribe to ClientController
     */
    componentDidMount() {
        this.remoteClient = ClientController.Subscribe(this.updateClient);
    }

    /**
     * Unsubscribe from ClientController
     */
    componentWillUnmount() {
        if(this.remoteClient !== null)
            this.remoteClient();
    }

    /**
     * Triggered when the user selects a file from the FileBrowser
     * - Set a listener on window.onSelectFile
     * @param filename 
     */
    onSelectFile(filename?:string) {
        if(window.onSelectFile)
            window.onSelectFile(filename);
    }
    
    /**
     * Renders the component
     * - A FileBrowser component
     */
    render() {
        return (
            <FileBrowser
                opened={this.state.opened}
                onSelect={this.onSelectFile}
                onClose={() => {
                    //this.setState({FileBrowserShown:false});
                }}
            />
        )
    }
}

class ClientLogin extends React.PureComponent<any, {
    opened:boolean;
}> {
    readonly state = {
        opened:UIController.GetState().APILogin.Shown
    };

    protected remoteUI:Unsubscribe|undefined;

    constructor(props) {
        super(props);
        this.updateUI = this.updateUI.bind(this);
        this.onLoginClose = this.onLoginClose.bind(this);
        this.onLoginError = this.onLoginError.bind(this);
        this.onLoginSuccess = this.onLoginSuccess.bind(this);
    }

    protected updateUI() {
        this.setState({opened:UIController.GetState().APILogin.Shown});
    }

    protected onLoginClose() {
        UIController.SetDisplay('APILogin', false);
    }

    protected onLoginSuccess() {
        UIController.SetDisplay('APILogin', false);
    }

    protected onLoginError(error:any) {
        UIController.SetDisplay('APILogin', true);
    }

    componentDidMount() {
        this.remoteUI = UIController.Subscribe(this.updateUI);
    }

    componentWillUnmount() {
        if(this.remoteUI)
            this.remoteUI();
    }

    render() {
        return (
            <Login
                opened={this.state.opened}
                onClose={this.onLoginClose}
                onError={this.onLoginError}
                onSuccess={this.onLoginSuccess}
                />
        )
    }
}