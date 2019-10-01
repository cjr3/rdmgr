import React from 'react'
import cnames from 'classnames'

/**
 * Allows the user to preview the capture window in real-time.
 * A toggle property is provided to stop/start the capturing, to
 * allow for improved performance.
 */
export default class CaptureWatcher extends React.PureComponent<{
    /**
     * Class name for the viewing canvas
     */
    className?:string;
    /**
     * Determines if the watcher is running or not
     */
    shown:boolean;
}> {
    protected VideoItem:React.RefObject<HTMLVideoElement> = React.createRef();

    /**
     * Loads the matching capture window for the desktop capturer
     */
    load() {
        let DC:any = window.require("electron").desktopCapturer;
        let that = this;
        DC.getSources({
            types:['window']
        }, async (err, sources) => {
            if(err) {} else {
                for(let key in sources) {
                    if(sources[key].name === 'RDMGR : Capture Window') {
                        (navigator.mediaDevices as any).getUserMedia({
                            audio:false,
                            video:{
                                mandatory:{
                                    chromeMediaSource:'desktop',
                                    chromeMediaSourceId:sources[key].id,
                                    minWidth:640,
                                    maxWidth:640,
                                    minHeight:360,
                                    maxHeight:360
                                }
                            }
                        }).then((stream) => {
                            if(this.VideoItem !== null && this.VideoItem.current !== null) {
                                this.VideoItem.current.srcObject = stream;
                                if(that.props.shown) {
                                    this.VideoItem.current.play();
                                }
                            }
                        }).catch((er) => {

                        });
                        break;
                    }
                }
            }
        });
    }

    /**
     * Load available windows
     */
    componentDidMount() {
        if(window) {
            this.load();
        }
    }

    /**
     * Stop playing the video
     */
    componentWillUnmount() {
        if(this.VideoItem !== null && this.VideoItem.current !== null) {
            this.VideoItem.current.pause();
            if(this.VideoItem.current.srcObject !== null) {
                if(this.VideoItem.current.srcObject instanceof MediaStream) {
                    let tracks:Array<MediaStreamTrack> = this.VideoItem.current.srcObject.getTracks();
                    for(let key in tracks) {
                        let track:MediaStreamTrack = tracks[key];
                        track.stop();
                    }
                }
            }
        }
    }

    /**
     * 
     * @param prevProps 
     */
    componentDidUpdate(prevProps) {
        if(prevProps.shown !== this.props.shown) {
            if(this.props.shown) {
                this.load();
            } else {
                if(this.VideoItem !== null && this.VideoItem.current !== null)
                    this.VideoItem.current.pause();
            }
        }
    }

    /**
     * Renders the component
     */
    render() {
        var className = cnames({
            shown:(this.props.shown)
        }, this.props.className);

        return (
            <video
                className={className}
                width="640"
                height="360"
                ref={this.VideoItem}
                />
        )
    }
}