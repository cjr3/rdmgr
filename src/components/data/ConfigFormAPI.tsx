import React from 'react';
import DataController from 'controllers/DataController';
import Panel from 'components/Panel';
import { IconButton, IconSave, IconNo } from 'components/Elements';

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
}> {
    readonly state = {
        APIEndpoint:DataController.GetMiscRecord('APIEndpoint')
    }

    constructor(props) {
        super(props);
        this.onChangeAPIEndpoint = this.onChangeAPIEndpoint.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onCancel = this.onCancel.bind(this);
    }

    protected async onSubmit() {
        await DataController.SaveMiscRecord('APIEndpoint', this.state.APIEndpoint);
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

    render() {
        let apiEndpoint:string = '';
        if(this.state.APIEndpoint)
            apiEndpoint = this.state.APIEndpoint;

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
                <p>API Endpoint - REST API endpoint configured to RDMGR specs</p>
                <p>
                    <input 
                        type="text"
                        value={apiEndpoint}
                        onChange={this.onChangeAPIEndpoint}
                        size={50}
                        maxLength={255}
                        />
                </p>
            </Panel>
        )
    }
}