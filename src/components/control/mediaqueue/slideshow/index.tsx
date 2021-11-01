import classNames from 'classnames';
import { SlideSorter } from 'components/common/slideshoweditor/sorter';
import React from 'react';
import { Capture } from 'tools/capture/functions';
import { Slideshow } from 'tools/slideshows/functions';
import { Slide } from 'tools/vars';

interface Props extends React.HTMLProps<HTMLDivElement> {
    active:boolean;
}

/**
 * Manual slideshow control
 * @param props 
 * @returns 
 */
const SlideshowControl:React.FunctionComponent<Props> = props => {
    const {active, ...rprops} = {...props};
    const [index, setIndex] = React.useState(Slideshow.Get().Index);
    const [slides, setSlides] = React.useState(Slideshow.Get().Records || []);

    React.useEffect(() => Slideshow.Subscribe(() => {
        const state = Slideshow.Get();
        // console.log(state.Index);
        setIndex(state.Index);
        setSlides(state.Records || []);
    }), []);

    const onChangeSlides = React.useCallback((records:Slide[]) => {
        Slideshow.SetSlides(records);
    }, []);

    const onSelect = React.useCallback((index:number) => {
        Slideshow.SetIndex(index);
        Capture.UpdateSlideshow({visible:true});
    }, []);

    return <div {...rprops} className={classNames('slideshow-control mq-control', rprops.className, {active:active})}>
        <div className='slideshow'>
            <SlideSorter 
                onChange={onChangeSlides}
                onSelect={onSelect}
                slides={slides}
                index={index}
                />
        </div>
    </div>
};

export {SlideshowControl};