import React from 'react';
import DataController from 'controllers/DataController';
import Panel from 'components/Panel';
import { IconButton, IconSave, IconNo } from 'components/Elements';
import { SetEndpoint, SetAuthEndpoint, SetValidateEndpoint, SetYouTubeDataAPIKey } from 'controllers/api/functions';

/**
 * Component for configuring endpoints for API access
 */
export default class ConfirgFormAPI extends React.PureComponent<{
    /**
     * True if opened or not
     */
    opened:boolean;
    /**
     * Triggered when the user submits the form
     */
    onSubmit?:Function;
    /**
     * Triggered when the user cancels the form
     */
    onCancel?:Function;
    /**
     * Triggered when the panel is closed
     */
    onClose?:Function;
    /**
     * Triggered when the panel is opened
     */
    onOpen?:Function;
}, {
    /**
     * API Endpoint
     */
    APIEndpoint?:string;
    APIAuthEndpoint?:string;
    APIValidateEndpoint?:string;
    /**
     * YouTube
     */
    YouTubeDataAPIKey:string;
}> {
    readonly state = {
        APIEndpoint:DataController.GetMiscRecord('APIEndpoint'),
        APIAuthEndpoint:DataController.GetMiscRecord('APIAuthEndpoint'),
        APIValidateEndpoint:DataController.GetMiscRecord('APIValidateEndpoint'),
        YouTubeDataAPIKey:DataController.GetMiscRecord('YouTubeDataAPIKey'),
    }

    constructor(props) {
        super(props);
        this.onChangeAPIEndpoint = this.onChangeAPIEndpoint.bind(this);
        this.onChangeAPIAuthEndpoint = this.onChangeAPIAuthEndpoint.bind(this);
        this.onChangeAPIValidateEndpoint = this.onChangeAPIValidateEndpoint.bind(this);
        this.onChangeYouTubeDataAPIKey = this.onChangeYouTubeDataAPIKey.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onCancel = this.onCancel.bind(this);
    }

    protected async onSubmit() {
        await DataController.SaveMiscRecord('APIEndpoint', this.state.APIEndpoint);
        await DataController.SaveMiscRecord('APIAuthEndpoint', this.state.APIAuthEndpoint);
        await DataController.SaveMiscRecord('APIValidateEndpoint', this.state.APIValidateEndpoint);
        await DataController.SaveMiscRecord('YouTubeDataAPIKey', this.state.YouTubeDataAPIKey);
        SetEndpoint(this.state.APIEndpoint);
        SetAuthEndpoint(this.state.APIAuthEndpoint);
        SetValidateEndpoint(this.state.APIValidateEndpoint);
        SetYouTubeDataAPIKey(this.state.YouTubeDataAPIKey);
        if(this.props.onSubmit)
            this.props.onSubmit();
    }

    protected async onCancel() {
        this.setState({
            APIEndpoint:DataController.GetMiscRecord('APIEndpoint'),
            APIAuthEndpoint:DataController.GetMiscRecord('APIAuthEndpoint'),
            APIValidateEndpoint:DataController.GetMiscRecord('APIValidateEndpoint'),
            YouTubeDataAPIKey:DataController.GetMiscRecord('YouTubeDataAPIKey'),
        }, () => {
            if(this.props.onCancel)
                this.props.onCancel();
        });
    }

    protected onChangeAPIEndpoint(ev: React.ChangeEvent<HTMLInputElement>) {
        let value:string = ev.currentTarget.value;
        this.setState({APIEndpoint:value});
    }
    
    protected onChangeAPIAuthEndpoint(ev: React.ChangeEvent<HTMLInputElement>) {
        let value:string = ev.currentTarget.value;
        this.setState({APIAuthEndpoint:value});
    }
    
    protected onChangeAPIValidateEndpoint(ev: React.ChangeEvent<HTMLInputElement>) {
        let value:string = ev.currentTarget.value;
        this.setState({APIValidateEndpoint:value});
    }
    
    protected onChangeYouTubeDataAPIKey(ev: React.ChangeEvent<HTMLInputElement>) {
        let value:string = ev.currentTarget.value;
        this.setState({YouTubeDataAPIKey:value});
    }

    render() {
        let apiEndpoint:string = '';
        let authEndpoint:string = '';
        let validateEndpoint:string = '';
        let youtubeDataApiKey:string = '';

        if(this.state.APIEndpoint)
            apiEndpoint = this.state.APIEndpoint;

        if(this.state.APIAuthEndpoint)
            authEndpoint = this.state.APIAuthEndpoint;
        
        if(this.state.APIValidateEndpoint)
            validateEndpoint = this.state.APIValidateEndpoint;

        if(this.state.YouTubeDataAPIKey)
            youtubeDataApiKey = this.state.YouTubeDataAPIKey;

        const buttons:Array<React.ReactElement> = [
            <IconButton
                key="btn-save"
                src={IconSave}
                onClick={this.onSubmit}
            >{"Save"}</IconButton>,
            <IconButton
                key="btn-cancel"
                src={IconNo}
                onClick={this.onCancel}
            >{"Cancel"}</IconButton>
        ];
        
        return (
            <Panel
                opened={this.props.opened}
                onClose={this.props.onClose}
                buttons={buttons}
                >
                <div className="record-form">
                    <div className="form-section">
                        <h3>API Endpoint</h3>
                        <p>
                            <input 
                                type="text"
                                value={apiEndpoint}
                                onChange={this.onChangeAPIEndpoint}
                                size={50}
                                maxLength={255}
                                />
                        </p>
                    </div>
                    <div className="form-section">
                        <h3>Authentication Endpoint</h3>
                        <p>
                            <input 
                                type="text"
                                value={authEndpoint}
                                onChange={this.onChangeAPIAuthEndpoint}
                                size={50}
                                maxLength={255}
                                />
                        </p>
                    </div>
                    <div className="form-section">
                        <h3>Validation Endpoint</h3>
                        <p>
                            <input 
                                type="text"
                                value={validateEndpoint}
                                onChange={this.onChangeAPIValidateEndpoint}
                                size={50}
                                maxLength={255}
                                />
                        </p>
                    </div>
                    <div className="form-section">
                        <h3>YouTube Keys</h3>
                        <table cellPadding={3}>
                            <tbody>
                                <tr>
                                    <td>Data API</td>
                                    <td>
                                    <input 
                                        type="text"
                                        value={youtubeDataApiKey}
                                        onChange={this.onChangeYouTubeDataAPIKey}
                                        size={50}
                                        maxLength={50}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <p>
                        </p>
                    </div>
                </div>
            </Panel>
        )
    }
}