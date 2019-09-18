import React from 'react';
import cnames from 'classnames';
import Panel from 'components/Panel';
import { IconButton, IconCheck, IconNo } from 'components/Elements';

/**
 * Component for showing a modal dialog to the client.
 */
class ClientDialog extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            shown:false,
            message:''
        };

        this.confirm = null;
        this.cancel = null;
        
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
    show(message, confirm, cancel) {
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
        }, this.cancel);
    }

    /**
     * Triggered when the user clicks to confirm.
     * - Only available when 'confirm' is a function
     * @param {Event} ev 
     */
    onClickConfirm(ev) {
        this.setState(() => {
            return {shown:false};
        }, this.confirm);
    }

    /**
     * Renders the component.
     */
    render() {

        let buttons = [];

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

export default ClientDialog;