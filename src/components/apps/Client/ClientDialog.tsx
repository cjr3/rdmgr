import React from 'react';
import Panel from 'components/Panel';
import { IconButton, IconCheck, IconNo } from 'components/Elements';
import { Unsubscribe } from 'redux';
import ClientController from 'controllers/ClientController';

/**
 * Component for showing a modal dialog to the client.
 */
export default class ClientDialog extends React.PureComponent<any, {
    /**
     * true to show, false to hide
     */
    shown:boolean;
    /**
     * Message to display to the user
     */
    message:string;
}> {
    readonly state = {
        shown:false,
        message:''
    }

    /**
     * Callback holder for when user clicks to confirm
     */
    protected confirm?:Function|null|undefined;
    /**
     * Callback holder for when user clicks to cancel
     */
    protected cancel?:Function|null|undefined;

    protected remoteClient:Unsubscribe|null = null;

    /**
     * Constructor
     * @param props 
     */
    constructor(props) {
        super(props);
        this.onClickClose = this.onClickClose.bind(this);
        this.onClickConfirm = this.onClickConfirm.bind(this);
    }

    protected async updateClient() {
        this.setState({
            shown:ClientController.GetState().DialogShown,
            message:ClientController.GetState().DialogMessage
        });
    }

    /**
     * Triggered when the user clicks the close button.
     */
    protected async onClickClose() {
        ClientController.HideDialog();
        if(window && window.onDialogClose)
            window.onDialogClose();
    }

    /**
     * Triggered when the user clicks to confirm.
     * - Only available when 'confirm' is a function
     * @param {Event} ev 
     */
    protected onClickConfirm(ev) {
        ClientController.HideDialog();
        if(window && window.onDialogAccept)
            window.onDialogAccept();
    }

    /**
     * Renders the component.
     */
    render() {

        let buttons:Array<React.ReactElement> = [];

        if(typeof(this.onClickConfirm) === 'function') {
            buttons.push(
                <IconButton
                    key="btn-accept"
                    src={IconCheck}
                    onClick={this.onClickConfirm}
                    >Confirm</IconButton>,
                <IconButton
                    key="btn-close"
                    src={IconNo}
                    onClick={this.onClickClose}
                    >Cancel</IconButton>
            );
        } else {
            buttons.push(
                <IconButton
                    key="btn-close"
                    src={IconCheck}
                    onClick={this.onClickClose}
                    >OK</IconButton>
            );
        }

        return (
            <Panel
                opened={this.state.shown}
                buttons={buttons}
                className="client-dialog"
            >{this.state.message}</Panel>
        )
    }
}