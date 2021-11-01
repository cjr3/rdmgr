import { Panel, PanelContent, PanelTitle } from 'components/common/panel';
import React from 'react';
import { Videos } from 'tools/videos/functions';

interface Props {
    active:boolean;
    onHide:{():void};
}

interface Dimension {
    width:number;
    label:string;
}

const dimensions:Dimension[] = [
    {width:1280,label:'1280x720'},
    {width:1920,label:'1920x1080'},
    {width:1024,label:'1024x576'},
];

const CameraPanel:React.FunctionComponent<Props> = props => {
    const state = Videos.GetMainCamera();
    const [devices, setDevices] = React.useState<MediaDeviceInfo[]>([]);
    const [deviceId, setDeviceID] = React.useState(state.deviceId || '');
    const [width, setDeviceWidth] = React.useState(state.width || 1280);
    const [height, setDeviceHeight] = React.useState(state.height || 720);
    const onHide = React.useCallback(() => {
        
        props.onHide();
    }, [props.onHide]);

    const onSelectCamera = React.useCallback((ev:React.ChangeEvent<HTMLSelectElement>) => {
        const value = ev.currentTarget.value;
        Videos.UpdateMainCamera({deviceId:value, visible:true});
    }, []);

    const onSelectCameraSize = React.useCallback((ev:React.ChangeEvent<HTMLSelectElement>) => {
        const value = parseInt(ev.currentTarget.value);
        let height = 720;
        if(value ===  1920)
            height = 1080;
        else if(value === 1024)
            height = 576;
        Videos.UpdateMainCamera({
            width:value,
            height:height
        });
    }, []);

    React.useEffect(() => {
        try {
            navigator.mediaDevices.enumerateDevices().then((devices) => {
                const records:MediaDeviceInfo[] = devices.filter(dev => {
                    return dev.kind === 'videoinput' && dev.label && dev.label.toLowerCase().search('elgato helper') < 0;
                });
                setDevices(records);
            }).catch(() => {

            })
        } catch(er) {

        }
    }, []);

    React.useEffect(() => Videos.SubscribeUI(() => {
        const state = Videos.GetMainCamera();
        setDeviceID(state.deviceId || '');
        setDeviceWidth(state.width || 1280);
        setDeviceHeight(state.height || 720);
    }), []);

    let nolabel = 'No Cameras';
    if(devices.length) {
        nolabel = (deviceId) ? 'Hide...' : 'Select...';
    }

    return <Panel active={props.active} onHide={onHide} style={{maxWidth:'300px'}}>
        <PanelTitle onHide={onHide}>Camera</PanelTitle>
        <PanelContent>
            <div>
                <select size={1} onChange={onSelectCamera} value={deviceId}>
                    <option value=''>{nolabel}</option>
                    {
                        devices.map((device, index) => {
                            return <option value={device.deviceId} key={`dev-${device.deviceId}-${index}`}>{device.label}</option>
                        })
                    }
                </select>
            </div>
            <div>
                <select size={1} onChange={onSelectCameraSize} value={width}>
                    {
                        dimensions.map((dim) => {
                            return <option value={dim.width} key={`dim-${dim.width}`}>{dim.label}</option>
                        })
                    }
                </select>
            </div>
        </PanelContent>
    </Panel>
};

export {CameraPanel};