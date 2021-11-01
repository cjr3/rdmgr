import React from 'react';
import { Videos } from 'tools/videos/functions';
import { BaseRecordForm } from './base';
import {remote} from 'electron';
import { Video } from 'tools/vars';
import { TextInput } from 'components/common/inputs/textinput';

interface Props {
    recordId:number;
    onSave:{():void};
}

interface State {
    filename:string;
}

/**
 * Form for adding/editing a phase record.
 */
class Main extends React.PureComponent<Props, State> {
    readonly state:State = {
        filename:''
    }

    /**
     * 
     */
    protected load = () => {
        const record = Videos.Get(this.props.recordId);
        this.setState({
            filename:record?.Filename || ''
        });
    }

    protected onBeforeSubmit = (record:Video) : Video => {
        return {...record, Filename:this.state.filename};
    };

    protected onChangeFilename = (value:string) => this.setState({filename:value});

    protected onClickBrowse = (ev:React.MouseEvent<HTMLButtonElement>) => {
        ev.preventDefault();
        ev.stopPropagation();
        const win = remote.BrowserWindow.getFocusedWindow();
        if(win) {
            remote.dialog.showOpenDialog(win, {
                buttonLabel:'Select',
                filters:[
                    {name:'Movie Files', extensions:['mp4']}
                ],
                properties:[
                    'openFile',
                    'dontAddToRecent'
                ]
            }).then(result => {
                if(Array.isArray(result.filePaths) && result.filePaths.length > 0) {
                    // props.onSelect(result.filePaths[0]);
                    this.setState({filename:result.filePaths[0]})
                }
            }).catch((er:any) => {

            })

        }
    }

    componentDidMount() {
        this.load();
    }

    componentDidUpdate(prevProps:Props) {
        if(prevProps.recordId !== this.props.recordId)
            this.load();
    }

    render() {
        return <BaseRecordForm
            recordId={this.props.recordId}
            recordType='VID'
            showCode={false}
            showShortName={false}
            showDescription={false}
            showMedia={true}
            showURL={true}
            showNumber={false}
            onBeforeSubmit={this.onBeforeSubmit}
            onCancel={this.props.onSave}
            onSave={this.props.onSave}
        >
            <tr>
                <td>File</td>
                <td>
                    <TextInput
                        value={this.state.filename}
                        onChangeValue={this.onChangeFilename}
                    />
                    <button onClick={this.onClickBrowse}>Browse...</button>
                </td>
            </tr>
        </BaseRecordForm>
    }
}

export {Main as VideoForm};