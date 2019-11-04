import React from 'react';
import RecordEditor from './RecordEditor';
import DataController from 'controllers/DataController';
import vars, {VideoRecord} from 'tools/vars';
import {IconButton, IconFolder} from 'components/Elements';
import ClientController from 'controllers/ClientController';

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
class VideoEditor extends React.PureComponent<{
    /**
     * Record ti edot
     */
    record:VideoRecord|null|undefined;
    /**
     * true to show, false to hide
     */
    opened:boolean;
}, {
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
            src = DataController.mpath("videos/" + src);
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
                opened={this.props.opened}
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

export default VideoEditor;