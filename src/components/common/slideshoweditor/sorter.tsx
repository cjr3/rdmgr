import React from 'react';
import { Slide } from 'tools/vars';
import { SlideItem } from './item';

interface Props {
    slides:Slide[];
    index?:number;
    onChange:{(slides:Slide[]):void};
    onContextMenu?:{(ev:React.MouseEvent<HTMLDivElement>):void};
    onSelect?:{(index:number):void};
}

interface State {
    dragIndex:number;
    dragTargetIndex:number;
    dropIndex:number;
    index:number;
    internalIndex:number;
}


/**
 * Component to edit a slideshow
 */
class SlideSorter extends React.PureComponent<Props, State> {
    readonly state:State = {
        dragIndex:-1,
        dragTargetIndex:-1,
        dropIndex:-1,
        index:-1,
        internalIndex:-1
    }

    protected SelectedSlide:React.RefObject<any> = React.createRef<any>();

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
    protected onDropSlide = async () => {
        if(this.state.dropIndex > -1 && this.state.dragIndex > -1 && this.state.dragIndex !== this.state.dropIndex) {
            //swap slides
            // console.log(`put ${this.state.dragIndex} before ${this.state.dropIndex}`);
            const slides = this.props.slides.slice();
            if(slides[this.state.dropIndex] && slides[this.state.dragIndex]) {
                const copy = {...slides[this.state.dragIndex]};
                slides.splice(this.state.dragIndex, 1);
                slides.splice(this.state.dropIndex, 0, copy);
                this.props.onChange(slides);
                this.setState({
                    dragIndex:-1,
                    dragTargetIndex:-1,
                    dropIndex:-1,
                    index:-1
                })
            }
        }
    }

    protected showSlide = () => {
        const item:React.RefObject<HTMLDivElement> = this.SelectedSlide;
        // console.log(item);
        if(item && item.current && item.current.scrollIntoView) {
            item.current.scrollIntoView({behavior:'smooth', block:'nearest', inline:'start'});
        }
    }

    protected onSelectSlide = (index:number) => {
        if(this.props.onSelect)
            this.props.onSelect(index);
        else
            this.setState({internalIndex:index}, this.showSlide);
    }

    componentDidUpdate(prevProps:Props) {
        if(prevProps.index !== this.props.index && typeof(this.props.index) === 'number') {
            this.showSlide();
        }
    }

    render() {
        return <div className='slide-sorter'>
                {
                    this.props.slides.map((record, index) => {
                        return <SlideItem 
                            active={index === this.props.index}
                            filename={record.Filename || ''}
                            index={index}
                            name={record.Name || ''}
                            onContextMenu={this.props.onContextMenu}
                            onDragEnd={this.onDragEnd}
                            onDragLeave={this.onDragLeave}
                            onDragOver={this.onDragOver}
                            onDragStart={this.onDragStart}
                            onDrop={this.onDropSlide}
                            onSelectSlide={this.props.onSelect}
                            className={(index === this.state.dropIndex) ? 'active' : ''}
                            ref={(index === this.props.index) ? this.SelectedSlide : undefined}
                            key={`slide-${index}-${record.Filename}`}
                            />
                    })
                }
            </div>
    }
};

export {SlideSorter};