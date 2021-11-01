import React from 'react';
import { Slide, SlideAnimationType } from 'tools/vars';
import { Panel, PanelContent, PanelFooter, PanelTitle } from '../panel';
// import { SlideItem } from './item';
import { SlideEditor } from './slideeditor';
import { SlideSorter } from './sorter';

interface Props {
    slides:Slide[];
    index?:number;
    onChange:{(slides:Slide[]):void};
}

interface State {
    dragIndex:number;
    dragTargetIndex:number;
    dropIndex:number;
    index:number;
}

/**
 * Component to edit a slideshow
 */
class SlideshowEditor extends React.PureComponent<Props, State> {
    readonly state:State = {
        dragIndex:-1,
        dragTargetIndex:-1,
        dropIndex:-1,
        index:-1
    }

    /**
     * Set the hide animation for the current slide.
     * @param value 
     * @returns 
     */
    protected onChangeHideAnimation = (value:SlideAnimationType) => this.updateSlide(this.state.index, {Hide:{Animation:value}});

    /**
     * Set the hide animation duration for the current slide.
     * @param value 
     * @returns 
     */
    protected onChangeHideDuration = (value:number) => this.updateSlide(this.state.index, {Hide:{Duration:value}});

    /**
     * Set the name for the current slide.
     * @param value 
     * @returns 
     */
    protected onChangeName = (value:string) => this.updateSlide(this.state.index, {Name:value});

    /**
     * Set the show animation for the current slide.
     * @param value 
     * @returns 
     */
    protected onChangeShowAnimation = (value:SlideAnimationType) => this.updateSlide(this.state.index, {Show:{Animation:value}});

    /**
     * Set the show animation duration for the current slide
     * @param value 
     * @returns 
     */
    protected onChangeShowDuration = (value:number) => this.updateSlide(this.state.index, {Show:{Duration:value}});

    /**
     * Set the length of time the slide is displayed when automatic
     * @param value 
     * @returns 
     */
    protected onChangeSlideDuration = (value:number) => this.updateSlide(this.state.index, {Duration:value});

    /**
     * Set the enabled flag for the current slide.
     * If enabled is false, the slide stays in the slideshow, but does not appear in the show.
     * @param value 
     * @returns 
     */
    protected onChangeSlideEnabled = (value:boolean) => this.updateSlide(this.state.index, {Enabled:value});

    /**
     * Called when the user stops dragging a slide.
     */
    protected onDragEnd = async () => {
        this.setState({dragIndex:-1, dropIndex:-1});
    }

    /**
     * Called when the user's mouse leaves the drop zone of another slide
     */
    protected onDragLeave = async () => {
        this.setState({dropIndex:-1});
    }

    /**
     * Called when the current slide is dragged-over another.
     * @param ev 
     */
    protected onDragOver = async (ev:React.DragEvent<HTMLDivElement>) => {
        ev.preventDefault();
        if(ev.currentTarget.dataset.index !== undefined) {
            let value = parseInt(ev.currentTarget.dataset.index);
            this.setState({dropIndex:value});
        }
    }

    /**
     * Called when the user starts dragging a slide.
     * @param ev 
     */
    protected onDragStart = async (ev:React.DragEvent<HTMLDivElement>) => {
        if(ev.currentTarget.dataset.index !== undefined) {
            let value = parseInt(ev.currentTarget.dataset.index);
            this.setState({dragIndex:value});
        }
    }

    /**
     * Called when the user drops a slide
     * @param ev 
     */
    protected onDropSlide = async (ev:React.DragEvent<HTMLDivElement>) => {
        if(this.state.dropIndex > -1 && this.state.dragIndex > -1 && this.state.dragIndex !== this.state.dropIndex) {
            //swap slides
            const slides = this.props.slides.slice();
            if(slides[this.state.dropIndex] && slides[this.state.dragIndex]) {
                const copy = {...slides[this.state.dragIndex]};
                slides.splice(this.state.dragIndex, 1);
                slides.splice(this.state.dropIndex, 0, copy);
                this.props.onChange(slides);
            }
        }
    }

    /**
     * Called when the user clicks a slide.
     * @param index 
     * @returns 
     */
    protected onSelectSlide = (index:number) => this.setState({index:index});

    /**
     * 
     * @param ev 
     */
    protected onSlideContextMenu = (ev:React.MouseEvent<HTMLDivElement>) => {
        ev.preventDefault();
        ev.stopPropagation();
        if(ev.currentTarget.dataset.index !== undefined) {
            let value = parseInt(ev.currentTarget.dataset.index);
            this.removeSlide(value);
        }
    }

    /**
     * 
     * @param index 
     */
    protected removeSlide = (index:number) => {
        if(index >= 0 && this.props.slides[index]) {
            const slides = this.props.slides.slice();
            slides.splice(index, 1);
            this.props.onChange(slides);
        }
    }

    /**
     * Update the current slide
     * @param index 
     * @param values 
     */
    protected updateSlide = (index:number, values:any) => {
        if(index >= 0 && this.props.slides[index]) {
            const slides = this.props.slides.slice();
            const slide = {...slides[index], ...values,
                Show:{
                    ...slides[index].Show,
                    ...values.Show
                },
                Hide:{
                    ...slides[index].Hide,
                    ...values.Hide
                }
            };
            slides[index] = slide;
            this.props.onChange(slides);
        }
    }

    render() {
        const record:Slide|undefined = (this.state.index >= 0 && this.props.slides[this.state.index]) ? this.props.slides[this.state.index] : undefined;
        return <>
            <SlideSorter
                onChange={this.props.onChange}
                slides={this.props.slides}
                onContextMenu={this.onSlideContextMenu}
                onSelect={this.onSelectSlide}
            />
            {
                (record !== undefined) &&
                <Panel active={true} onHide={() => {this.setState({index:-1})}}>
                    <PanelTitle onHide={() => {this.setState({index:-1})}}>{`Slide #${(this.state.index+1)}`}</PanelTitle>
                    <PanelContent>
                        <SlideEditor
                            duration={record.Duration || 0}
                            enabled={typeof(record.Enabled) === 'boolean' ? record.Enabled : true}
                            hideAnimation={record.Hide?.Animation || ''}
                            hideDuration={record.Hide?.Duration || 3}
                            showAnimation={record.Show?.Animation || ''}
                            showDuration={record.Show?.Duration || 3}
                            name={record.Name || ''}
                            onChangeDuration={this.onChangeSlideDuration}
                            onChangeEnabled={this.onChangeSlideEnabled}
                            onChangeHideAnimation={this.onChangeHideAnimation}
                            onChangeHideDuration={this.onChangeHideDuration}
                            onChangeName={this.onChangeName}
                            onChangeShowAnimation={this.onChangeShowAnimation}
                            onChangeShowDuration={this.onChangeShowDuration}
                        />
                    </PanelContent>
                    <PanelFooter>
                        ...
                    </PanelFooter>
                </Panel>
            }
        </>
    }
};

export {SlideshowEditor}