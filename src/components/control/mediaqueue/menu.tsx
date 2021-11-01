import React from 'react';
import { Anthem, AnthemSingers } from 'tools/anthem/functions';
import { Capture } from 'tools/capture/functions';
import { Slideshow, Slideshows } from 'tools/slideshows/functions';
import { RecordType, VideoStatus } from 'tools/vars';
import { Videos } from 'tools/videos/functions';
import { RecordList } from '../data/records/list';
import { AnnouncerControl } from '../sections/announcers';
import { AutoSlideshowControl } from './autoslideshow';
import { AnnouncerSection, MediaQueueSections } from './sections';

interface Props {
    recordId:number;
    recordType:RecordType;
    listType:RecordType;
    onSelectRecord:{(id:number, type:RecordType):void};
}

const MediaQueueMenu:React.FunctionComponent<Props> = props => {


    const onSelectRecord = React.useCallback((id:number, type:RecordType) => {
        props.onSelectRecord(id, type);

        //hide whatever is on the capture screen
        Capture.UpdateSlideshow({visible:false});
        Capture.UpdateAnthem({visible:false});
        Videos.UpdateMainVideo({Status:VideoStatus.STOPPED}, true);

        switch(type) {
            case 'ANT' : {
                const record = AnthemSingers.Get(id);
                // console.log(record);
                Anthem.Update({
                    Singer:{
                        Name:record?.Name || '',
                        Thumbnail:record?.Thumbnail || '',
                        Photo:record?.Photo || '',
                        Description:record?.Description || ''
                    }
                });
            }
            break;

            case 'SLS' : {
                const record = Slideshows.Get(id);
                if(record) {
                    Slideshow.SetIndex(-1);
                    Slideshow.SetSlides(record.Slides || []);
                }
            }
            break;

            case 'VID' : {
                const record = Videos.Get(id);
                if(record) {
                    Videos.UpdateMainVideo({Source:record.Filename || ''}, true);
                }
            }
            break;
        }
    }, [props.onSelectRecord]);

    return <div className='menu'>
        <AutoSlideshowControl/>
        {
            (props.listType === 'ANT') &&
            <AnnouncerSection active={true} onToggle={() => {}}/>
        }
        <RecordList
            allowNewRecord={false}
            listType={props.listType}
            recordId={props.recordId}
            recordType={props.recordType}
            onSelectRecord={onSelectRecord}
        />
    </div>
}

export {MediaQueueMenu};