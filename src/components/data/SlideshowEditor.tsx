import React from 'react';
import RecordEditor, {PRecordEditor} from './RecordEditor';
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
import ClientController from 'controllers/ClientController';
import {Unsubscribe} from 'redux';
import SlideshowsController from 'controllers/SlideshowsController';
import RecordList from './RecordList';
import { FileExtension, Basename, LoadFolderFiles } from 'controllers/functions.io';
import { MoveElement } from 'controllers/functions';

interface props extends PRecordEditor {
    record:SlideshowRecord|null
};

/**
 * Component for editing slideshow records.
 */
export default class SlideshowEditor extends React.PureComponent<props, {
    Slides:Array<any>
}> {
    readonly state = {
        Slides:new Array<any>()
    }

    constructor(props) {
        super(props);
        this.addSlide = this.addSlide.bind(this);
        this.removeSlide = this.removeSlide.bind(this);
        this.onSelectFolder = this.onSelectFolder.bind(this);
        this.swapSlides = this.swapSlides.bind(this);
        this.updateSlide = this.updateSlide.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onSelect = this.onSelect.bind(this);
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
                Name:Basename(filename),
                Filename:filename
            });
            return {Slides:slides};
        });
    }

    /**
     * Removes a selected slide.
     * @param {Number} index 
     */
    protected removeSlide(index) {
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
                    Name:Basename(filename),
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
        MoveElement(slides, dropIndex, dragIndex, right);
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
        ClientController.ToggleFileBrowser(false);
        LoadFolderFiles(path).then((files) => {
            let slides:Array<any> = [];
            for(let key in files) {
                switch(FileExtension(files[key])) {
                    case 'jpg' :
                    case 'jpeg' :
                    case 'gif' :
                    case 'png' :
                    case 'bmp' :
                        slides.push({
                            RecordType:"IMG",
                            Name:Basename(files[key]),
                            Filename:files[key]
                        });
                    break;
                    default : break;
                }
            }
            console.log(slides);
            this.setState(() => {
                return {Slides:slides};
            });
        }).catch((er) => {

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
                                    ClientController.ToggleFileBrowser(true);
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
                    ClientController.ToggleFileBrowser(true);
                }}
            >Add</IconButton>,
            <IconButton
                src={IconFolder}
                title="Add Folder of Slides"
                key="btn-folder"
                onClick={() => {
                    window.onSelectFolder = this.onSelectFolder;
                    ClientController.ToggleFileBrowser(true);
                }}
            >Set Folder</IconButton>
        ];

        return (
            <RecordEditor 
                recordType={vars.RecordType.Slideshow}
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

export class SlideshowRecordList extends React.PureComponent<{
    shown:boolean;
    record:SlideshowRecord|null;
    onSelect:Function;
    keywords?:string;
}, {
    Records:Array<SlideshowRecord>;
}> {
    readonly state = {
        Records:SlideshowsController.Get()
    }

    protected remoteData?:Unsubscribe;

    constructor(props) {
        super(props);
        this.updateData = this.updateData.bind(this);
    }

    protected updateData() {
        this.setState({Records:SlideshowsController.Get()});
    }

    componentDidMount() {
        this.remoteData = SlideshowsController.Subscribe(this.updateData);
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