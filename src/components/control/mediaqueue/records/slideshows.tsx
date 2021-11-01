import classNames from 'classnames';
import { Collapsable } from 'components/common/collapsable';
import React from 'react';
import { Capture } from 'tools/capture/functions';
import { Slideshow, Slideshows } from 'tools/slideshows/functions';
import { RecordType } from 'tools/vars';

interface Props {
    active:boolean;
    recordId:number;
    recordType:RecordType;
    onSelect:{(recordId:number, recordType:RecordType):void};
    onToggle:{():void};
}

const SlideshowSelectionList:React.FunctionComponent<Props> = props => {
    const [records, setRecords] = React.useState(Slideshows.GetRecords());
    const [updateTime, setUpdateTime] = React.useState(Slideshows.GetUpdateTime());

    React.useEffect(() => Slideshows.Subscribe(() => {
        const time = Slideshows.GetUpdateTime();
        if(time !== updateTime) {
            setRecords(Slideshows.GetRecords());
            setUpdateTime(time);
        }
    }), []);

    return <Collapsable
        active={props.active}
        label='Slideshows'
        onToggle={props.onToggle}
        >
        {
            records.map(record => {
                const slidecount = (record.Slides) ? record.Slides.length : 0;
                return <div
                    className={classNames('button', {active:props.recordId === record.RecordID && props.recordType === 'SLS'})}
                    style={{
                        display:'grid',
                        gridTemplateColumns:'1fr auto',
                        cursor:'pointer',
                        textAlign:'left'
                    }}
                    onDoubleClick={ev => {
                        ev.preventDefault();
                        ev.stopPropagation();
                        Capture.UpdateSlideshow({visible:false});
                        Slideshow.SetIndex(-1);
                        Slideshow.SetSlides(record.Slides || []);
                        props.onSelect(record.RecordID || 0, 'SLS')
                    }}
                    key={`record-${record.RecordID}`}
                >
                    <span>{record.Name}</span>
                    <span>{slidecount}</span>
                </div>
            })
        }
    </Collapsable>
};

export {SlideshowSelectionList};