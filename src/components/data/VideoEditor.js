import React from 'react';
import RecordEditor from './RecordEditor';
import DataController from 'controllers/DataController';
import vars from 'tools/vars';
import {IconButton, IconFolder} from 'components/Elements';

/**
 * Component for editing a video record.
 */
class VideoEditor extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            Source:'',
            records:Object.assign({}, DataController.getVideos())
        }
        
        this.updateState = this.updateState.bind(this);

        this.onSelect =this.onSelect.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.onSelectFile = this.onSelectFile.bind(this);
        this.remote = DataController.subscribe(this.updateState);
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
            return {Source:DataController.PATH.basename(filename)};
        });
    }

    /**
     * Triggered when the submits the record.
     * @param {Object} record 
     */
    onSubmit(record) {
        return Object.assign({}, record, {
            Filename:this.state.Source
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
            Source:source
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
        var src = this.state.Source;
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
                {...this.props}
                >
                <h2>Preview</h2>
                <video 
                    src={src}
                    controls={true}
                    volume="0"
                    muted
                    width="640"
                    height="360"
                    onFocus={(ev) => {
                        ev.preventDefault();
                        ev.target.blur();
                    }}
                    />
            </RecordEditor>
        )
    }
}

export default VideoEditor;