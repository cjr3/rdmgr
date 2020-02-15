import React from 'react';
import './css/Dialogs.scss';
import Panel from 'components/Panel';
import UIController, {DeleteCallback} from 'controllers/UIController';
import { Basename, DeleteFile } from 'controllers/functions.io';
import { IconButton, IconCheck, IconDelete, IconNo } from 'components/Elements';
import { Unsubscribe } from 'redux';

export default class DeleteFileDialog extends React.PureComponent<any, {
    Shown:boolean;
    Filename:string;
    ErrorMessage:string;
}> {

    readonly state = {
        Shown:UIController.GetState().DeleteFileDialog.Shown,
        Filename:UIController.GetState().DeleteFileDialog.Filename,
        ErrorMessage:''
    }

    protected remoteUI?:Unsubscribe;

    constructor(props) {
        super(props);
        this.updateUI = this.updateUI.bind(this);
    }

    protected updateUI(){
        this.setState({
            Shown:UIController.GetState().DeleteFileDialog.Shown,
            Filename:UIController.GetState().DeleteFileDialog.Filename,
            ErrorMessage:''
        });
    }

    componentDidMount() {
        this.remoteUI = UIController.Subscribe(this.updateUI);
    }

    componentWillUnmount() {
        if(this.remoteUI)
            this.remoteUI();
    }

    render() {
        let name:string = '';
        if(this.state.Filename)
            name = Basename(this.state.Filename);

        let buttons:Array<React.ReactElement> = new Array<React.ReactElement>(
            <IconButton
                key="btn-delete"
                src={IconDelete}
                title="Delete this file"
                onClick={() => {
                    if(DeleteCallback) {
                        DeleteFile(this.state.Filename).then(() => {
                            DeleteCallback();
                            UIController.HideDeleteFileDialog();
                        }).catch((err) => {
                            if(typeof(err) === 'string')
                                this.setState({ErrorMessage:err});
                            else if(err && err.message)
                                this.setState({ErrorMessage:err.message});
                        });
                    } else {
                        UIController.HideDeleteFileDialog();
                    }
                }}
                >Delete</IconButton>,
            <IconButton
                key="btn-cancel"
                src={IconNo}
                title="Cancel"
                onClick={() => {
                    UIController.HideDeleteFileDialog();
                }}
            >Cancel</IconButton>
        );

        return (
            <Panel
                opened={this.state.Shown}
                title="Delete file?"
                className="dialog"
                buttons={buttons}
                >
                <p>Are you sure you wish to delete this file?</p>
                <p><b>{name}</b></p>
            </Panel>
        )
    }
}