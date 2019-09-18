import React from 'react';
import MediaPreview from 'components/tools/MediaPreview'
import DataController from 'controllers/DataController'
import Panel from 'components/Panel';
import cnames from 'classnames';
import {
    Textbox, 
    IconButton, 
    IconSave,
    IconNo,
} from 'components/Elements';

import ColorPicker from 'material-ui-color-picker';
import AnthemEditor from './AnthemEditor';
import PeerEditor from './PeerEditor';
import PenaltyEditor from './PenaltyEditor';
import PhaseEditor from './PhaseEditor';
import SkaterEditor from './SkaterEditor';
import SlideshowEditor from './SlideshowEditor';
import TeamEditor from './TeamEditor';
import VideoEditor from './VideoEditor';

import './css/RecordEditor.scss';

/**
 * Base component for editing most records.
 */
class RecordEditor extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            record:null,
            keywords:''
        };

        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeShortName = this.onChangeShortName.bind(this);
        this.onChangeNumber = this.onChangeNumber.bind(this);
        this.onChangeColor = this.onChangeColor.bind(this);
        this.onChangeAcronym = this.onChangeAcronym.bind(this);
        
        this.onSelect = this.onSelect.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onNew = this.onNew.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.onChangeKeywords = this.onChangeKeywords.bind(this);

        this.onSelectThumbnail = this.onSelectThumbnail.bind(this);
        this.onSelectPhoto = this.onSelectPhoto.bind(this);
        this.onSelectBackground = this.onSelectBackground.bind(this);
        this.onSelectScoreboardThumbnail = this.onSelectScoreboardThumbnail.bind(this);
        this.onSelectSlide = this.onSelectSlide.bind(this);
    }

    /**
     * Triggered when the user changes the keywords value.
     * @param {Event} ev 
     */
    onChangeKeywords(ev) {
        var value = ev.target.value;
        this.setState(() => {
            return {keywords:value};
        });
    }

    /**
     * Triggered when the value of the Name changes.
     */
    onChangeName(value) {
        this.setState((state) => {
            return {record:Object.assign({}, state.record, {
                Name:value
            })};
        });
    }

    /**
     * Triggered when the acronym field changes.
     */
    onChangeAcronym(value) {
        this.setState((state) => {
            return {record:Object.assign({}, state.record, {
                Acronym:value
            })};
        });
    }

    /**
     * Triggered when the color field changes.
     * @param {string} value
     */
    onChangeColor(value) {
        this.setState((state) => {
            return {record:Object.assign({}, state.record, {
                Color:value
            })};
        });
    }

    /**
     * Triggered when the number field changes
     * @param {string} value
     */
    onChangeNumber(value) {
        this.setState((state) => {
            return {record:Object.assign({}, state.record, {
                Number:value
            })};
        });
    }

    /**
     * Triggered when the short-name field changes
     * @param {string} value
     */
    onChangeShortName(value) {
        this.setState((state) => {
            return {record:Object.assign({}, state.record, {
                ShortName:value
            })};
        });
    }

    /**
     * Triggered when the user changes the record's thumbnail.
     * @param {string} src 
     */
    onSelectThumbnail(src) {
        this.setState((state) => {
            return {record:Object.assign({}, state.record, {
                Thumbnail:src
            })};
        })
    }

    /**
     * Triggered when the user changes the record's photo.
     * @param {String} src 
     */
    onSelectPhoto(src) {
        this.setState((state) => {
            return {record:Object.assign({}, state.record, {
                Photo:src
            })};
        });
    }

    /**
     * Triggered when the user changes the record's background.
     * @param {String} src 
     */
    onSelectBackground(src) {
        this.setState((state) => {
            return {record:Object.assign({}, state.record, {
                Background:src
            })};
        })
    }

    /**
     * Triggered when the user changes the record's scoreboard thumbnail.
     * @param {String} src 
     */
    onSelectScoreboardThumbnail(src) {
        this.setState((state) => {
            return {record:Object.assign({}, state.record, {
                ScoreboardThumbnail:src
            })};
        })
    }

    /**
     * Triggered when the user changes the record's scoreboard thumbnail.
     * @param {String} src 
     */
    onSelectSlide(src) {
        this.setState((state) => {
            return {record:Object.assign({}, state.record, {
                Slide:src
            })};
        })
    }

    /**
     * Triggered when the user selects a record.
     * @param {Object} record 
     */
    onSelect(record) {
        this.setState(() => {
            return {record:Object.assign({}, record)}
        }, () => {
            if(this.props.onSelect)
                this.props.onSelect(this.state.record);
        });
    }

    /**
     * Triggered when the user clicks the cancel button.
     */
    onCancel() {
        this.setState({record:null});
        if(this.props.onCancel)
            this.props.onCancel();
    }

    /**
     * Triggered when the user clicks the 'new' button.
     */
    onNew() {
        this.setState((state) => {
            var record = DataController.getNewRecord(this.props.recordType);
            if(this.props.onSelect)
                this.props.onSelect( record );
            return {record:record};
        });
    }

    /**
     * Triggered when the user clicks the submit button.
     */
    onSubmit() {
        let record = Object.assign({}, this.state.record);
        if(this.props.onSubmit)
            record = this.props.onSubmit(record);
        DataController.SaveRecord(record);
        this.setState({record:null}, this.props.onCancel);
    }

    /**
     * Triggered when the component is updated
     * - Check if assigning a new record.
     * @param {Object} prevProps 
     */
    componentDidUpdate(prevProps) {
        if(this.props.record) {
            if(prevProps.record) {
                if(prevProps.record.RecordID !== this.props.record.RecordID) {
                    this.setState(() => {
                        return {record:Object.assign({}, this.props.record)};
                    });
                }
            } else {
                this.setState(() => {
                    return {record:Object.assign({}, this.props.record)};
                });
            }
        } else if(this.state.record) {
            this.setState(() => {return {record:null}});
        } else {
            
        }
    }

    /**
     * Renders the component.
     */
    render() {

        var className = cnames('record-form', {shown:(this.state.record)});

        const Name = (this.state.record && this.state.record.Name) ? this.state.record.Name : '';
        const ShortName = (this.state.record && this.state.record.ShortName) ? this.state.record.ShortName : '';
        const Color = (this.state.record && this.state.record.Color) ? this.state.record.Color : '';
        const RecordNumber = (this.state.record && this.state.record.Number) ? this.state.record.Number : '';
        var Acronym = (this.state.record && this.state.record.Acronym) ? this.state.record.Acronym : '';
        const Thumbnail = (this.state.record && this.state.record.Thumbnail) ? this.state.record.Thumbnail : '';
        const Photo = (this.state.record && this.state.record.Photo) ? this.state.record.Photo : '';
        const ScoreboardThumbnail = (this.state.record && this.state.record.ScoreboardThumbnail) ? this.state.record.ScoreboardThumbnail : '';
        const Background = (this.state.record && this.state.record.Background) ? this.state.record.Background : '';
        const Slide = (this.state.record && this.state.record.Slide) ? this.state.record.Slide : '';

        if(Acronym === '' && this.state.record) {
            if(this.state.record.Code)
                Acronym = this.state.record.Code;
        }

        var buttons = [];
        if(this.state.record) {
            buttons.push(
                <IconButton
                    key="btn-save"
                    src={IconSave}
                    onClick={this.onSubmit}
                    >Submit</IconButton>
            );

            buttons.push(
                <IconButton
                    key="btn-cancel"
                    src={IconNo}
                    onClick={this.onCancel}
                    >Cancel</IconButton>
            );

            if(this.props.buttons) {
                buttons.unshift(this.props.buttons);
            }

        }

        //console.log(this.props.records)
        return (
            <Panel
                opened={this.props.opened}
                contentName="record-editor"
                className="record-editor-panel"
                buttons={buttons}
                onClose={this.props.onClose}
                onOpen={this.props.onOpen}
            >
                <div className="record-editor-base">
                    <div className={className}>
                        <table width="100%" cellPadding="10" cellSpacing="0">
                            <tbody>
                                <tr>
                                    <td width="150">Name</td>
                                    <td>
                                        <Textbox type="text" 
                                            value={Name}
                                            onChange={this.onChangeName}
                                            />
                                    </td>
                                    <td>Short Name</td>
                                    <td>
                                        <Textbox type="text" 
                                            value={ShortName}
                                            onChange={this.onChangeShortName}
                                            />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Number</td>
                                    <td>
                                        <Textbox type="text" 
                                            value={RecordNumber}
                                            onChange={this.onChangeNumber}
                                            />
                                    </td>
                                    <td>Acronym</td>
                                    <td>
                                        <Textbox type="text" 
                                            value={Acronym}
                                            onChange={this.onChangeAcronym}
                                            />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Media
                                        <hr/>
                                        Color
                                        <ColorPicker
                                            name='color'
                                            value={Color}
                                            onChange={this.onChangeColor}
                                            />
                                    </td>
                                    <td colSpan="3">
                                        <div className="stack-panel">
                                            <MediaPreview
                                                src={Thumbnail}
                                                title="Thumbnail"
                                                onChange={this.onSelectThumbnail}
                                            />
                                            <MediaPreview
                                                src={Photo}
                                                title="Photo"
                                                onChange={this.onSelectPhoto}
                                            />
                                            <MediaPreview
                                                src={ScoreboardThumbnail}
                                                title="Scoreboard"
                                                onChange={this.onSelectScoreboardThumbnail}
                                            />
                                            <MediaPreview
                                                src={Background}
                                                title="Background"
                                                onChange={this.onSelectBackground}
                                            />
                                            <MediaPreview
                                                src={Slide}
                                                title="Slide"
                                                onChange={this.onSelectSlide}
                                            />
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan="4">
                                        {this.props.children}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </Panel>
        )
    }
}

export default RecordEditor;
export {
    VideoEditor,
    PhaseEditor,
    PenaltyEditor,
    SkaterEditor,
    TeamEditor,
    SlideshowEditor,
    AnthemEditor,
    PeerEditor
};