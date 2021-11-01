import classNames from 'classnames';
import { IconMicrophone, IconMovie, IconOBS, IconSlideshow } from 'components/common/icons';
import React from 'react';
import { RecordType } from 'tools/vars';
import { AnthemControl } from '../sections/anthem';
import { MediaQueueButtons } from './buttons';
import { MediaQueueMenu } from './menu';
import { OBSMediaControl } from './obs';
import { SlideshowControl } from './slideshow';
import { VideoControl } from './video';

interface Props {
    active:boolean;
}

/**
 * Main control component to show videos, slideshows, and other media, on the capture window.
 * @param props 
 * @returns 
 */
const MediaQueueControl:React.FunctionComponent<Props> = props => {
    const [listType, setRecordListType] = React.useState<RecordType>('');
    const [recordType, setRecordType] = React.useState<RecordType>('');
    const [slideshowId, setSlideshowId] = React.useState(0);
    const [singerId, setSingerId] = React.useState(0);
    const [videoId, setVideoId] = React.useState(0);
    
    const onClickAnthem = React.useCallback(() => {
        setRecordListType('ANT');
        setRecordType('ANT');
    }, []);
    
    const onClickSlideshows = React.useCallback(() => {
        setRecordListType('SLS');
        setRecordType('SLS');
    }, []);

    const onClickVideos = React.useCallback(() => {
        setRecordListType('VID');
        setRecordType('VID');
    }, []);

    const onClickOBS = React.useCallback(() => { 
        setRecordListType('OBS_SCENE');
        setRecordType('OBS_SCENE');
    }, []);

    const onSelectRecord = React.useCallback((id:number, type:RecordType) => {
        switch(type) {
            case 'VID' : setVideoId(id); break;
            case 'ANT' : setSingerId(id); break;
            case 'SLS' : setSlideshowId(id); break;
        }
        setRecordType(type);
        setRecordListType(type);
    }, []);

    let recordId = 0;
    switch(listType) {
        case 'VID' : recordId = videoId; break;
        case 'ANT' : recordId = singerId; break;
        case 'SLS' : recordId = slideshowId; break;
    }

    return <div className={classNames('mediaqueue-control app', {active:props.active})}>
        <MediaQueueMenu
            listType={listType}
            recordId={recordId}
            recordType={recordType}
            onSelectRecord={onSelectRecord}
        />
        <div className='content'>
            <SlideshowControl active={(slideshowId >= 1 && recordType === 'SLS')}/>
            <VideoControl active={(videoId >= 1 && recordType === 'VID')}/>
            <AnthemControl active={(singerId >= 1 && recordType === 'ANT')}/>
            <OBSMediaControl active={(listType === 'OBS_SCENE')}/>
        </div>
        <div className='icons'>
            <IconMicrophone onClick={onClickAnthem} title='Anthem Singer' active={listType == 'ANT'}/>
            <IconSlideshow onClick={onClickSlideshows} title='Slideshows' active={listType === 'SLS'}/>
            <IconMovie onClick={onClickVideos} title='Videos' active={listType === 'VID'}/>
            <IconOBS onClick={onClickOBS} title='OBS' active={listType === 'OBS_SCENE'}/>
        </div>
        <div className='buttons'>
            <MediaQueueButtons recordType={recordType}/>
        </div>
    </div>
};

export {MediaQueueControl};