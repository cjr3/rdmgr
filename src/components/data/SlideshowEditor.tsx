import React from 'react';
import RecordEditor from './RecordEditor';
import DataController from 'controllers/DataController';
import vars, { SlideshowRecord } from 'tools/vars';
import SortPanel from 'components/tools/SortPanel';
import {
    MediaThumbnail,
    Icon,
    IconButton,
    IconPlus,
    IconDelete,
    IconFolder
} from 'components/Elements';

interface SSlideshowEditor {
    Slides:Array<any>;
    records:Array<SlideshowRecord>;
}

interface PSlideshowEditor {
    record:SlideshowRecord;
    opened:boolean;
}

/**
 * Component for editing slideshow records.
 */
class SlideshowEditor extends React.PureComponent<PSlideshowEditor, SSlideshowEditor> {
    readonly state:SSlideshowEditor = {
        Slides:[],
        records:DataController.getSlideshows(true)
    }

    remoteData:Function

    constructor(props) {
        super(props);
        this.addSlide = this.addSlide.bind(this);
        this.removeSlide = this.removeSlide.bind(this);
        this.onSelectFolder = this.onSelectFolder.bind(this);
        this.swapSlides = this.swapSlides.bind(this);
        this.updateSlide = this.updateSlide.bind(this);

        this.onSubmit = this.onSubmit.bind(this);
        this.onSelect = this.onSelect.bind(this);
        
        this.updateState = this.updateState.bind(this);
        this.remoteData = DataController.subscribe(this.updateState);
    }

    /**
     * Updates the state to match the controller
     */
    updateState() {
        var records = DataController.getSlideshows();
        if(!DataController.compare(records, this.state.records)) {
            this.setState(() => {
                return {records:Object.assign({}, records)};
            });
        }
    }

    /**
     * 
     * @param {String} filename 
     */
    addSlide(filename) {
        this.setState((state) => {
            var slides = state.Slides.slice();
            slides.push({
                RecordType:"IMG",
                Name:DataController.basename(filename),
                Filename:filename
            });
            return {Slides:slides};
        });
    }

    /**
     * Removes a selected slide.
     * @param {Number} index 
     */
    removeSlide(index) {
        if(this.state.Slides[index]) {
            this.setState((state) => {
                var slides = state.Slides.slice();
                slides.splice(index, 1);
                return {Slides:slides};
            });
        }
    }

    /**
     * Updates the slide for the record at the given index.
     * @param {Number} index 
     * @param {String} filename 
     */
    updateSlide(index, filename) {
        if(this.state.Slides[index]) {
            this.setState((state) => {
                var slides = state.Slides.slice();
                slides[index] = Object.assign({}, slides[index], {
                    Name:DataController.basename(filename),
                    Filename:filename
                });
                return {Slides:slides};
            });
        }
    }

    /**
     * Swaps the position of two slides.
     * @param {Number} dropIndex 
     * @param {Number} dragIndex 
     * @param {Number} right
     */
    swapSlides(dropIndex, dragIndex, right) {
        var slides = this.state.Slides.slice();
        DataController.MoveElement(slides, dropIndex, dragIndex, right);
        this.setState(() => {
            return {Slides:slides};
        });
    }

    /**
     * Triggered when the user clicks the submit button.
     * @param {Object} record 
     */
    onSubmit(record) {
        return Object.assign({}, record, {
            Records:this.state.Slides.slice()
        });
    }

    /**
     * Triggered when the user selects a record.
     * @param {Object} record 
     */
    onSelect(record) {
        var slides = [];
        if(record && record.Records && record.Records.length)
            slides = record.Records.slice();
        this.setState({Slides:slides});
    }

    /**
     * Triggered when the user selects a folder of slides.
     * - Only include images at this point.
     * @param {String} path 
     */
    onSelectFolder(path) {
        window.onSelectFolder = null;
        window.client.hideFileBrowser();
        let fs:any = DataController.FS;
        if(fs !== null) {
            fs.readdir(path, "utf8", (eer, files) => {
                var slides:Array<any> = [];
                for(var key in files) {
                    switch(DataController.ext(files[key])) {
                        case 'jpg' :
                        case 'jpeg' :
                        case 'gif' :
                        case 'png' :
                        case 'bmp' :
                            slides.push({
                                RecordType:"IMG",
                                Name:DataController.basename(files[key]),
                                Filename:path + "/" + files[key]
                            });
                        break;
                        default : break;
                    }
                }
                this.setState(() => {
                    return {Slides:slides};
                });
            });
        }
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
     * Renders the component
     */
    render() {
        var slides:Array<any> = [];
        if(this.state.Slides.length) {
            for(let i=0, len = this.state.Slides.length; i < len; i++) {
                let slide = this.state.Slides[i];
                slides.push({
                    label:<React.Fragment key={i}>
                        <MediaThumbnail src={slide.Filename}/>
                        <div className="slide-buttons">
                            <Icon
                                src={IconFolder}
                                onClick={() => {
                                    window.onSelectFile = (filename) => {
                                        this.updateSlide(i, filename);
                                    };
                                    window.client.showFileBrowser();
                                }}
                                title="Remove"
                            />
                            <Icon
                                src={IconDelete}
                                onClick={() => {
                                    this.removeSlide(i);
                                }}
                                title="Remove"
                            />
                        </div>
                    </React.Fragment>
                });
            }
        }

        var buttons = [
            <IconButton
                src={IconPlus}
                title="Add Image"
                key="btn-add-image"
                onClick={() => {
                    window.onSelectFile = this.addSlide;
                    window.client.showFileBrowser();
                }}
            >Add</IconButton>,
            <IconButton
                src={IconFolder}
                title="Add Folder of Slides"
                key="btn-folder"
                onClick={() => {
                    window.onSelectFolder = this.onSelectFolder;
                    window.client.showFileBrowser();
                }}
            >Set Folder</IconButton>
        ];

        return (
            <RecordEditor 
                recordType={vars.RecordType.Slideshow}
                records={this.state.records}
                buttons={buttons}
                onSubmit={this.onSubmit}
                opened={this.props.opened}
                {...this.props}
                >
                <tr>
                    <td colSpan={4}>
                        <SortPanel
                            className="slides"
                            items={slides}
                            onDrop={this.swapSlides}
                        />
                    </td>
                </tr>
            </RecordEditor>
        )
    }
}

export default SlideshowEditor;