import React from 'react';
import RecordEditor from './RecordEditor';
import DataController from 'controllers/DataController';
import vars, {VideoRecord} from 'tools/vars';
import {IconButton, IconFolder} from 'components/Elements';

interface SVideoEditor {
    source:string,
    records:Array<VideoRecord>
}

interface PVideoEditor {
    record:VideoRecord|null|undefined;
    opened:boolean;
}

/**
 * Component for editing a video record.
 */
class VideoEditor extends React.PureComponent<PVideoEditor, SVideoEditor> {
    readonly state:SVideoEditor = {
        source:'',
        records:DataController.getVideos(true)
    }
    remoteData:Function
    constructor(props) {
        super(props);
        
        this.updateState = this.updateState.bind(this);

        this.onSelect =this.onSelect.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.onSelectFile = this.onSelectFile.bind(this);
        this.remoteData = DataController.subscribe(this.updateState);
    }

    /**
     * Updates the state to match the controller.
     * - Video records.
     */
    updateState() {
        if(!DataController.compare(DataController.getVideos(), this.state.records)) {
            this.setState(() => {
                return {records:Object.assign({}, DataController.getVideos())}
            });
        }
    }

    /**
     * Triggered when the user selects a file from the file browser.
     * @param {String} filename Full path to the video file
     */
    onSelectFile(filename) {
        this.setState(() => {
            return {source:DataController.basename(filename)};
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
        if(this.props.record) {
            if(prevProps.record) {
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
        var src = this.state.source;
        if(src && src.length) {
            src = DataController.mpath("videos/" + src);
        }
        
        var buttons = [
            <IconButton
                key="btn-select"
                src={IconFolder}
                onClick={() => {
                    window.onSelectFile = this.onSelectFile;
                    window.client.showFileBrowser();
                }}
            >Select</IconButton>
        ];

        return (
            <RecordEditor 
                recordType={vars.RecordType.Video}
                records={this.state.records}
                buttons={buttons}
                onSubmit={this.onSubmit}
                opened={this.props.opened}
                {...this.props}
                >
                <tr>
                    <td>Preview</td>
                    <td colSpan={3}>
                        <video 
                            src={src}
                            controls={true}
                            //volume="0"
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

export default VideoEditor;