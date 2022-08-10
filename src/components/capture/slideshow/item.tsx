import classNames from 'classnames';
import React from 'react';
import Data from 'tools/data';
import { Slide, VideoStatus } from 'tools/vars';
import { VideoView } from '../media/videoview';

interface Props extends Slide, React.HTMLProps<HTMLDivElement> {
    active:boolean;
    total:number;
}

const getExt = (filename:string) : string => {
    return ((filename && filename.length && filename.lastIndexOf('.') >= 0) ? filename.substring(filename.lastIndexOf('.')+1) : '').toLowerCase();
}

const isImage = (filename:string) : boolean => {
    switch(getExt(filename)) {
        case 'png' :
        case 'gif' :
        case 'jpeg' :
        case 'bmp' :
        case 'jpg' :
            return true;
    }

    return false;
}

const isVideo = (filename:string) : boolean => {
    switch(getExt(filename)) {
        case 'mp4' :

        return true;
    }

    return false;
}

/**
 * Display a slide image / video.
 * @param props 
 * @returns 
 */
const SlideItem:React.FunctionComponent<Props> = props => {
    const {
        active,
        Background,
        Code,
        Color,
        DateCreated,
        DateEnd,
        DateStart,
        DateUpdated,
        Description,
        Duration,
        Enabled,
        Filename,
        Hide,
        Name,
        Number,
        Photo,
        RecordType,
        RecordID,
        ScoreboardThumbnail,
        ShortName,
        Show,
        Thumbnail,
        URL,
        URLTitle,
        total,
        ...rprops} = {...props};

    const fname = Filename || '';

    // console.log(fname);

    return <div {...rprops} className={classNames('slide-item', rprops.className, {
        active:active
    })}>
        <div className='overlay'></div>
        {
            isImage(fname) &&
            <img src={Data.GetMediaPath(fname)} alt=''/>
        }
        {/* {
            isVideo(fname) &&
            <VideoView
                status={fname && fname.length > 0 ? VideoStatus.PLAYING : VideoStatus.STOPPED}
                src={fname}
                autoPlay={true}
                loop={(total === 1)}
                volume={0}
                muted={true}
            />
        } */}
    </div>
};

export {SlideItem};