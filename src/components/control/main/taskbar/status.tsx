import classNames from 'classnames';
import React from 'react';
import { VideoStatus } from 'tools/vars';
import { Videos } from 'tools/videos/functions';
import { ScorekeeperStatusbar } from './scorekeeperstatus';
import { VideoStatusBar } from './videostatus';

interface Props extends React.HTMLProps<HTMLDivElement> {

}

/**
 * Display status of items in the taskbar, such as game duration, video play time, slide index, etc.
 * @param props 
 * @returns 
 */
const TaskbarStatus:React.FunctionComponent<Props> = props => {
    return <div {...props} className={classNames('status', props.className)}>
        <ScorekeeperStatusbar/>
        <VideoStatusBar/>
    </div>
};

export {TaskbarStatus};