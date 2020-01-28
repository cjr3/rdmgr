import React from 'react';
import RecordEditor, {PRecordEditor} from './RecordEditor';
import vars, {VideoRecord} from 'tools/vars';
import {IconButton, IconFolder} from 'components/Elements';
import ClientController from 'controllers/ClientController';
import {Unsubscribe} from 'redux';
import VideosController from 'controllers/VideosController';
import RecordList from './RecordList';
import { Basename } from 'controllers/functions.io';
import { AddMediaPath } from 'controllers/functions';

interface PVideoEditor extends PRecordEditor {
    record:VideoRecord|null
};

/**
 * Component for editing a video record.
 */
export default class VideoEditor extends React.PureComponent<PVideoEditor, {
    /**
     * Selected video source (url/file location)
     */
    source:string;
}> {
    readonly state = {
        source:''
    }
    
    constructor(props) {
        super(props);
        this.onSelect =this.onSelect.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onSelectFile = this.onSelectFile.bind(this);
    }

    /**
     * Triggered when the user selects a file from the file browser.
     * @param {String} filename Full path to the video file
     */
    onSelectFile(filename) {
        this.setState(() => {
            return {source:Basename(filename)};
        });
    }

    /**
     * Triggered when the submits the record.
     * @param {Object} record 
     */
    onSubmit(record) {
        return Object.assign({}, record, {
            Filename:this.state.source
        });
    }

    /**
     * Triggered when the user selects a record.
     * @param {Object} record 
     */
    onSelect(record) {
        var source = '';
        if(record && record.Filename && record.Filename.length)
            source = record.Filename;

        this.setState({
            source:source
        });
    }

    /**
     * Triggered when the component is updated
     * @param {Object} prevProps 
     */
    componentDidUpdate(prevProps) {
        if(this.props.record !== null && this.props.record !== undefined) {
            if(prevProps.record !== null && prevProps.record !== null) {
                if(prevProps.record.RecordID !== this.props.record.RecordID) {
                    this.onSelect(this.props.record);
                }
            } else {
                this.onSelect(this.props.record);
            }
        }
    }

    /**
     * Renders the component.
     */
    render() {
        let src:string = this.state.source;
        if(src && src.length) {
            src = AddMediaPath("videos/" + src);
        }
        
        let buttons:Array<React.ReactElement> = [
            <IconButton
                key="btn-select"
                src={IconFolder}
                onClick={() => {
                    window.onSelectFile = this.onSelectFile;
                    ClientController.ToggleFileBrowser(true);
                }}
            >Select</IconButton>
        ];

        return (
            <RecordEditor 
                recordType={vars.RecordType.Video}
                buttons={buttons}
                onSubmit={this.onSubmit}
                {...this.props}
                >
                <tr>
                    <td>Preview</td>
                    <td colSpan={3}>
                        <video 
                            src={src}
                            controls={true}
                            muted
                            width="640"
                            height="360"
                            onFocus={(ev) => {
                                ev.preventDefault();
                                ev.target.blur();
                            }}
                            />

                    </td>
                </tr>
            </RecordEditor>
        )
    }
}


export class VideoRecordList extends React.PureComponent<{
    shown:boolean;
    record:VideoRecord|null;
    onSelect:Function;
    keywords?:string;
}, {
    Records:Array<VideoRecord>;
}> {
    readonly state = {
        Records:VideosController.Get()
    }

    protected remoteData?:Unsubscribe;

    constructor(props) {
        super(props);
        this.updateData = this.updateData.bind(this);
    }

    protected updateData() {
        this.setState({Records:VideosController.Get()});
    }

    componentDidMount() {
        this.remoteData = VideosController.Subscribe(this.updateData);
    }

    componentWillUnmount() {
        if(this.remoteData)
            this.remoteData();
    }

    render() {
        return (
            <RecordList
                keywords={this.props.keywords}
                className={(this.props.shown) ? 'shown' : ''}
                onSelect={this.props.onSelect}
                recordid={(this.props.record) ? this.props.record.RecordID : 0}
                records={this.state.Records}
                />
        )
    }
}