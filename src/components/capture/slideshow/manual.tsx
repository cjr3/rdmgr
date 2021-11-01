import classNames from 'classnames';
import React from 'react';
import { Capture } from 'tools/capture/functions';
import { Slideshow } from 'tools/slideshows/functions';
import { SlideshowCaptureBase } from '.';

interface Props extends React.HTMLProps<HTMLDivElement> {

}

/**
 * 
 * @param props 
 * @returns 
 */
const ManualSlidehowCapture:React.FunctionComponent<Props> = props => {
    const [visible, setVisible] = React.useState(Capture.GetSlideshow().visible || false);
    const [index, setIndex] = React.useState(Slideshow.Get().Index);
    const [slides, setSlides] = React.useState(Slideshow.Get().Records || []);

    React.useEffect(() => Capture.Subscribe(() => {
        setVisible(Capture.GetSlideshow().visible || false);
    }), []);

    React.useEffect(() => Slideshow.Subscribe(() => {
        const state = Slideshow.Get();
        setIndex(typeof(state.Index) === 'number' ? state.Index : -1);
        setSlides(state.Records || []);
    }), []);

    return <SlideshowCaptureBase
        active={visible && slides.length > 0}
        current={typeof(index) === 'number' ? index : -1}
        loop={true}
        showLastOnFirst={false}
        slides={slides}
        {...props}
        className={classNames('manual', props.className)}
    />
};

export {ManualSlidehowCapture};