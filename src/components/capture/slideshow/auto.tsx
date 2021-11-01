import React from 'react';
import { Capture } from 'tools/capture/functions';
import { SlideshowCaptureBase } from '.';

interface Props extends React.HTMLProps<HTMLDivElement> {

}

/**
 * Display the auto-slideshow
 * @param props 
 * @returns 
 */
const AutoSlideshowCapture:React.FunctionComponent<Props> = props => {
    const [visible, setVisible] = React.useState(Capture.GetAutoSlideshow().visible || false);
    const [slides, setSlides] = React.useState(Capture.GetAutoSlideshow().slides || []);
    const [index, setIndex] = React.useState((typeof(Capture.GetAutoSlideshow().index) === 'number') ? Capture.GetAutoSlideshow().index : -1);

    React.useEffect(() => {
        return Capture.Subscribe(() => {
            const state = Capture.GetAutoSlideshow();
            setIndex(typeof(state.index) === 'number' ? state.index : -1);
            setSlides(state.slides || []);
            setVisible(state.visible || false);
        });
    }, []);

    return <SlideshowCaptureBase
        active={visible && slides.length > 0}
        current={typeof(index) === 'number' ? index : -1}
        loop={true}
        slides={slides}
        {...props}
    />
}

export {AutoSlideshowCapture};