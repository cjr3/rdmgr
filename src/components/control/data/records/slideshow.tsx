import React from 'react';
import { Slide, Slideshow } from 'tools/vars';
import { BaseRecordForm } from './base';
import {remote} from 'electron';
import { SlideshowEditor } from 'components/common/slideshoweditor';
import { Slideshows } from 'tools/slideshows/functions';

interface Props {
    recordId:number;
    onSave:{():void};
}

interface State {
    slides:Slide[]
}

class Main extends React.PureComponent<Props, State> {
    readonly state:State = {
        slides:[]
    }

    protected load = () => {
        const record = Slideshows.Get(this.props.recordId);
        this.setState({slides:(record?.Slides || [])});
    }

    protected onAddSlide = (record:Slide) => {
        const records = this.state.slides.slice();
        records.push(record);
        this.setState({slides:records});
    }
    
    /**
     * Called before saving the slideshow
     * @param values 
     * @returns 
     */
    protected onBeforeSubmit = (values:Slideshow) : Slideshow => {
        return {...values, Slides:this.state.slides};
    }

    /**
     * Called when values on the slides change
     * @param records 
     * @returns 
     */
    protected onChangeSlides = (records:Slide[]) => this.setState({slides:records});

    /**
     * Called when the user wants to add a new media file
     */
    protected onClickSelectSlide = () => {
        const win = remote.BrowserWindow.getFocusedWindow();
        if(win) {
            remote.dialog.showOpenDialog(win, {
                buttonLabel:'Select',
                filters:[
                    {name:'Image Files', extensions:['jpg','png','jpeg','gif']},
                    {name:'Video Files', extensions:['mp4', 'webm']}
                ],
                properties:[
                    'openFile',
                    'dontAddToRecent',
                    'multiSelections'
                ]
            }).then(result => {
                if(Array.isArray(result.filePaths) && result.filePaths.length > 0) {
                    const records = this.state.slides.slice();
                    result.filePaths.forEach(filename => {
                        records.push({
                            RecordID:0,
                            Filename:filename,
                            Enabled:true
                        });
                    });
                    this.setState({slides:records});
                }
            }).catch()

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
            recordType='SLS'
            showCode={false}
            showDescription={false}
            showNumber={false}
            showMedia={false}
            showShortName={false}
            showURL={false}
            onBeforeSubmit={this.onBeforeSubmit}
            onCancel={this.props.onSave}
            onSave={this.props.onSave}
        >
            <tr>
                <td>Slides</td>
                <td>
                    <button onClick={this.onClickSelectSlide}>
                        Add Slides...
                    </button>
                </td>
            </tr>
            <tr>
                <td colSpan={2} style={{padding:'0px'}}>
                    <SlideshowEditor
                        slides={this.state.slides}
                        onChange={this.onChangeSlides}
                    />
                </td>
            </tr>
        </BaseRecordForm>
    }
}

export {Main as SlideshowForm};