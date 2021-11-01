import classNames from 'classnames';
import React from 'react';
import { VideoStatus } from 'tools/vars';

interface Props extends React.HTMLProps<HTMLDivElement> {
    active:boolean;
    audio:boolean;
    cameraHeight:number;
    cameraWidth:number;
    deviceId:string;
    status:VideoStatus;
}

/**
 * Component to display a connected camera.
 * @param props 
 * @returns 
 */
const Camera:React.FunctionComponent<Props> = props => {
    const {active, audio, cameraHeight, cameraWidth, deviceId, status, ...rprops} = {...props};
    const videoItem = React.useRef<HTMLVideoElement>(null);
    React.useEffect(() => {
        try {
            if(videoItem && videoItem.current && videoItem.current.srcObject) {
                if(videoItem.current.srcObject instanceof MediaStream) {
                    const tracks:MediaStreamTrack[] = videoItem.current.srcObject.getTracks();
                    for(let key in tracks) {
                        tracks[key].stop();
                    }
                    
                    videoItem.current.srcObject = null;
                }
            }
        } catch(er) {
            
        }

        if(deviceId) {
            setTimeout(() => {
                if(deviceId) {
                    try {
                        navigator.mediaDevices.getUserMedia({
                            audio:audio,
                            video:{
                                width:{min:640,max:1920,ideal:props.cameraWidth},
                                height:{min:360,max:1080,ideal:props.cameraHeight},
                                echoCancellation:{exact:true},
                                deviceId:deviceId,
                                frameRate:{ideal:30,max:60,min:25}
                            }
                        }).then((stream) => {
                            // setSource(stream);
                            if(videoItem && videoItem.current) {
                                videoItem.current.srcObject = stream;
                                if(status === VideoStatus.PLAYING && videoItem.current.paused) {
                                    videoItem.current.play().then(() => {

                                    }).catch(() => {
                                        
                                    })
                                }
                            }
                        }).catch(() => {
            
                        })
                    } catch(er) {
                        
                    }
                }
            }, 1000);
        }
        
    }, [deviceId, status, cameraWidth, cameraHeight]);

    // React.useEffect(() => {
    //     try {
    //         if(videoItem && videoItem.current && videoItem.current.srcObject) {
    //             if(status === VideoStatus.PLAYING) {
    //                 if(!videoItem.current.paused)
    //                     videoItem.current.play();
    //             } else if(status === VideoStatus.PAUSED) {
    //                 if(videoItem.current.paused)
    //                     videoItem.current.pause();
    //             } else if(status === VideoStatus.STOPPED) {
    //                 if(videoItem.current.srcObject && videoItem.current.srcObject instanceof MediaStream) {
    //                     const tracks:MediaStreamTrack[] = videoItem.current.srcObject.getTracks();
    //                     if(tracks && tracks.forEach) {
    //                         tracks.forEach((t) => {
    //                             try {
    //                                 t.stop();
    //                             } catch(er) {
    
    //                             }
    //                         })
    //                     }
    //                     videoItem.current.srcObject = null;
    //                 }
    //             }
    //         }
    //     } catch(er) {

    //     }
    // }, [status]);

    return <div {...rprops} className={classNames('capture-camera', rprops.className, {
        active:active,
        paused:status === VideoStatus.PAUSED,
        playing:status === VideoStatus.PLAYING,
        stopped:status === VideoStatus.STOPPED
        })}>
        <video width={cameraWidth} height={cameraHeight} muted={true} autoPlay={false} ref={videoItem}></video>
    </div>
};

export {Camera};