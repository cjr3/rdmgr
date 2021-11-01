import React from 'react';
import { RecordType } from 'tools/vars';
import { SlideshowSelectionList } from './slideshows';
import { VideoSelectionList } from './videos';

interface Props {
    listType:RecordType;
    recordId:number;
    recordType:RecordType;
    onSelect:{(recordId:number, recordType:RecordType):void};
}

const QueueRecords:React.FunctionComponent<Props> = props => {

    const onClickSlideshows = React.useCallback(() => props.onSelect(-1, 'SLS'), [props.recordId]);
    const onClickVideos = React.useCallback(() => props.onSelect(-1, 'VID'), [props.recordId]);

    return <>
        <SlideshowSelectionList
            active={props.listType === 'SLS'}
            recordId={props.recordId}
            recordType={props.recordType}
            onToggle={onClickSlideshows}
            onSelect={props.onSelect}
        />
        <VideoSelectionList
            active={props.listType === 'VID'}
            recordId={props.recordId}
            recordType={props.recordType}
            onToggle={onClickVideos}
            onSelect={props.onSelect}
        />
    </>
};

export {QueueRecords};