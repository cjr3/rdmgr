import classNames from 'classnames';
import React from 'react';
import { VideoStatus } from 'tools/vars';
import { Videos } from 'tools/videos/functions';
import { Camera } from './camera';

interface Props extends React.HTMLProps<HTMLDivElement> {

}

const defWidth = 1280;
const defHeight = 720;

/**
 * Display main capture camera
 * @param props 
 * @returns 
 */
const MainCaptureCamera:React.FunctionComponent<Props> = props => {
    const state = Videos.GetMainCamera();
    const [className, setClassName] = React.useState(state.className || '');
    const [deviceId, setDeviceID] = React.useState(state.deviceId || '');
    const [width, setDeviceWidth] = React.useState(state.width || defWidth);
    const [height, setDeviceHeight] = React.useState(state.height || defHeight);
    const [status, setStatus] = React.useState(typeof(state.status) === 'number' ? state.status : VideoStatus.PLAYING);
    const [visible, setVisible] = React.useState(state.visible || false);

    React.useEffect(() => Videos.SubscribeUI(() => {
        const state = Videos.GetMainCamera();
        setClassName(state.className || '');
        setDeviceID(state.deviceId || '');
        setDeviceWidth(state.width || defWidth);
        setDeviceHeight(state.height || defHeight);
        setStatus(typeof(state.status) === 'number' ? state.status : VideoStatus.PLAYING);
        setVisible(state.visible || false);
    }), []);

    return <Camera
        {...props}
        className={classNames('main-camera', className, props.className)}
        active={visible}
        audio={false}
        cameraHeight={height}
        cameraWidth={width}
        deviceId={deviceId}
        status={status}
    />
}

export {MainCaptureCamera};