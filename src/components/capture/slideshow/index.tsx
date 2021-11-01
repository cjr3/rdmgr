import classNames from 'classnames';
import React from 'react';
import { Slide } from 'tools/vars';
import { SlideItem } from './item';

interface Props extends React.HTMLProps<HTMLDivElement> {
    active:boolean;
    current:number;
    loop:boolean;
    showLastOnFirst?:boolean;
    slides:Slide[];
}

/**
 * Base component for slideshows.
 * @param props 
 * @returns 
 */
const SlideshowCaptureBase:React.FunctionComponent<Props> = props => {
    const {active, current, loop, slides, showLastOnFirst, ...rprops} = {...props};
    const [currentTarget, setTarget] = React.useState<'A'|'B'|'C'>('B');
    const [slideA, setSlideA] = React.useState<Slide|undefined>();
    const [slideB, setSlideB] = React.useState<Slide|undefined>();

    React.useEffect(() => {
        if(current === -1)
            setTarget('C');
        else {
            if(currentTarget === 'A')
                setTarget('B');
            else
                setTarget('A');
        }
    }, [current])

    React.useEffect(() => {
        if(slides && slides.length) {
            if(slides[current]) {
                if(currentTarget === 'A')
                    setSlideA(slides[current]);
                else
                    setSlideB(slides[current]);
            }
        }
    }, [currentTarget, slides, loop, showLastOnFirst]);

    return <div {...rprops} className={classNames('capture-slideshow', rprops.className, {
        active:active
    })}>
        <SlideItem active={currentTarget === 'A'} {...slideA}/>
        <SlideItem active={currentTarget === 'B'} {...slideB}/>
    </div>
}


export {SlideshowCaptureBase};