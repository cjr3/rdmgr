import React from 'react';
import DataController from 'controllers/DataController';
import Panel from 'components/Panel';
import { IconButton, IconSave, IconNo } from 'components/Elements';
import { SetEndpoint, SetAuthEndpoint, SetValidateEndpoint } from 'controllers/api/functions';

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
}> {
    readonly state = {
        APIEndpoint:DataController.GetMiscRecord('APIEndpoint'),
        APIAuthEndpoint:DataController.GetMiscRecord('APIAuthEndpoint'),
        APIValidateEndpoint:DataController.GetMiscRecord('APIValidateEndpoint')
    }

    constructor(props) {
        super(props);
        this.onChangeAPIEndpoint = this.onChangeAPIEndpoint.bind(this);
        this.onChangeAPIAuthEndpoint = this.onChangeAPIAuthEndpoint.bind(this);
        this.onChangeAPIValidateEndpoint = this.onChangeAPIValidateEndpoint.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onCancel = this.onCancel.bind(this);
    }

    protected async onSubmit() {
        await DataController.SaveMiscRecord('APIEndpoint', this.state.APIEndpoint);
        await DataController.SaveMiscRecord('APIAuthEndpoint', this.state.APIAuthEndpoint);
        await DataController.SaveMiscRecord('APIValidateEndpoint', this.state.APIValidateEndpoint);
        SetEndpoint(this.state.APIEndpoint);
        SetAuthEndpoint(this.state.APIAuthEndpoint);
        SetValidateEndpoint(this.state.APIValidateEndpoint);
        if(this.props.onSubmit)
            this.props.onSubmit();
    }

    protected async onCancel() {
        this.setState({
            APIEndpoint:DataController.GetMiscRecord('APIEndpoint')
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

    render() {
        let apiEndpoint:string = '';
        let authEndpoint:string = '';
        let validateEndpoint:string = '';

        if(this.state.APIEndpoint)
            apiEndpoint = this.state.APIEndpoint;

        if(this.state.APIAuthEndpoint)
            authEndpoint = this.state.APIAuthEndpoint;
        
        if(this.state.APIValidateEndpoint)
            validateEndpoint = this.state.APIValidateEndpoint;

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
                <p>API Endpoint - REST endpoint configured to RDMGR specs</p>
                <p>
                    <input 
                        type="text"
                        value={apiEndpoint}
                        onChange={this.onChangeAPIEndpoint}
                        size={50}
                        maxLength={255}
                        />
                </p>
                <p>Authorization Endpoint - REST endpoint to authorize your login credentials. Leave blank if not used.</p>
                <p>
                    <input 
                        type="text"
                        value={authEndpoint}
                        onChange={this.onChangeAPIAuthEndpoint}
                        size={50}
                        maxLength={255}
                        />
                </p>
                <p>Validation Endpoint - REST endpoint to authorize your access token. Leave blank if not used.</p>
                <p>
                    <input 
                        type="text"
                        value={validateEndpoint}
                        onChange={this.onChangeAPIValidateEndpoint}
                        size={50}
                        maxLength={255}
                        />
                </p>
            </Panel>
        )
    }
}