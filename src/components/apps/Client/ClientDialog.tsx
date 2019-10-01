import React from 'react';
import Panel from 'components/Panel';
import { IconButton, IconCheck, IconNo } from 'components/Elements';

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
    protected confirm?:Function|null|undefined
    /**
     * Callback holder for when user clicks to cancel
     */
    protected cancel?:Function|null|undefined

    /**
     * Constructor
     * @param props 
     */
    constructor(props) {
        super(props);
        this.state = {
            shown:false,
            message:''
        };
        
        this.onClickClose = this.onClickClose.bind(this);
        this.onClickConfirm = this.onClickConfirm.bind(this);
        this.show = this.show.bind(this);
    }

    /**
     * Shows the
     * @param {Mixed} message 
     * @param {Function} confirm 
     * @param {Function} cancel 
     */
    show(message, confirm:Function|null = null, cancel:Function|null = null) {
        this.confirm = confirm;
        this.cancel = cancel;
        this.setState({message:message, shown:true});
    }

    /**
     * Triggered when the user clicks the close button.
     * @param {Event} ev 
     */
    onClickClose(ev) {
        this.setState(() => {
            return {shown:false};
        },() => {
            if(this.cancel !== null && this.cancel !== undefined)
                this.cancel();
        });
    }

    /**
     * Triggered when the user clicks to confirm.
     * - Only available when 'confirm' is a function
     * @param {Event} ev 
     */
    onClickConfirm(ev) {
        this.setState(() => {
            return {shown:false};
        },() => {
            if(this.confirm !== null && this.confirm !== undefined)
                this.confirm();
        });
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