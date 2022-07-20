import { IconHidden, IconPause, IconPlay, IconVisible } from 'components/common/icons';
import { SlideshowSelector } from 'components/common/inputs/selectors';
import React from 'react';
import { Capture } from 'tools/capture/functions';
import { Slideshow } from 'tools/vars';

interface Props extends React.HTMLProps<HTMLDivElement> {

}

const duration = 11500; //1.5s transition
// const duration = 1000;

let timer:any = 0;

/**
 * Auto-slideshow component for media queue.
 * @param props 
 * @returns 
 */
const AutoSlideshowControl:React.FunctionComponent<Props> = props => {
    const [recordId, setRecordId] = React.useState(0);
    const [visible, setVisible] = React.useState(false);
    const [status, setStatus] = React.useState(false);
    const reset = () => {
        try {
            clearTimeout(timer);
        } catch(er) {

        }
    }

    const next = React.useCallback(() => {
        const state = Capture.GetAutoSlideshow();
        let index = (state.index || 0) + 1;
        let slides = state.slides || [];
        if(index >= slides.length || slides.length === 1)
            index = 0;
        Capture.UpdateAutoSlideshow({index:index});
        if(Capture.GetAutoSlideshow().status && slides.length > 1) {
            timer = setTimeout(next, duration);
        }
    }, [status]);

    const onSelect = (record?:Slideshow) => {
        reset();
        Capture.UpdateAutoSlideshow({
            index:0,
            recordId:record?.RecordID || 0,
            slides:record?.Slides || [],
            status:false
        });
    };

    const onTogglePlay = () => {
        reset();
        const flag = !status;
        Capture.UpdateAutoSlideshow({status:flag});
        if(flag) {
            timer = setTimeout(next, duration);
        }
    };

    React.useEffect(() => {
        return Capture.Subscribe(() => {
            const state = Capture.GetAutoSlideshow();
            // console.log(state.status);
            setVisible(state.visible || false);
            setStatus(state.status || false);
            setRecordId(state.recordId || 0);
        });
    }, []);

    return <div style={{
            display:'grid',
            gridTemplateColumns:'auto 1fr auto'
        }}
        title='Auto-Slideshow'
        {...props}
    >
        <IconVisible title='Hide' active={true} onClick={Capture.ToggleAutoSlideshow} style={{display:(visible) ? 'inline-flex' : 'none'}}/>
        <IconHidden title='Show' onClick={Capture.ToggleAutoSlideshow} disabled={recordId <= 0} style={{display:(!visible) ? 'inline-flex' : 'none'}}/>
        <div style={{padding:'6px'}}>
            <SlideshowSelector onSelectValue={onSelect} value={recordId}/>
        </div>
        <IconPause title='Pause' onClick={onTogglePlay} style={{display:(status) ? 'inline-flex' : 'none'}}/>
        <IconPlay title='Play' onClick={onTogglePlay} disabled={recordId <= 0} style={{display:(!status) ? 'inline-flex' : 'none'}}/>
    </div>
};

export {AutoSlideshowControl};