import React from 'react';
import cnames from 'classnames';

/**
 * Component for playing a connected web camera
 */
export default class Camera extends React.PureComponent<{
    /**
     * Width of the video element
     * - can be changed with CSS
     */
    width:number;
    /**
     * Height of the video element
     */
    height:number;
    /**
     * true to play audio from camera
     */
    audio?:boolean;
    /**
     * Selected device ID
     */
    deviceId?:string;
    /**
     * Selected source - for peer cameras?
     */
    source?:MediaStream;
    /**
     * Additional class names
     */
    className?:string;
    /**
     * Triggered when the camera starts playing
     */
    onStream?:Function;
}> {
    /**
     * MediaStream element retrieved from camera
     */
    protected StreamSource:MediaStream|null = null;

    /**
     * Reference video element
     */
    protected VideoElement:React.RefObject<HTMLVideoElement> = React.createRef();

    /**
     * Constructor
     * @param props 
     */
    constructor(props) {
        super(props);
        this.destroy = this.destroy.bind(this);
    }

    /**
     * Loads the camera to the canvas.
     * @param {String} id Camera Device ID
     */
    loadCamera(id) {
        try {
            if(id === '') {
                this.destroy();
                return this;
            }

            let options = {
                video:{
                    width:{min:this.props.width, max:this.props.width, ideal:this.props.width},
                    height:{min:this.props.height, max:this.props.height, ideal:this.props.height},
                    echoCancellation:{exact:true},
                    deviceId:id,
                    frameRate:{ideal:30,max:60,min:25}
                },
                audio:this.props.audio
            };
            let pe = navigator.mediaDevices.getUserMedia(options);
            pe.then((stream) => {
                this.StreamSource = stream;
                if(this.VideoElement !== null && this.VideoElement.current !== null)
                    this.VideoElement.current.srcObject = stream;
                if(this.props.onStream)
                    this.props.onStream(stream);
                this.start();
            }).catch((er) => {

            });
        } catch(er) {
            alert(er.message);
        }
    }

    /**
     * Starts the camera
     */
    start() {
        if(this.VideoElement !== null && this.VideoElement.current !== null)
            this.VideoElement.current.play();
    }

    /**
     * Alias of start()
     */
    play() {
        this.start();
    }

    /**
     * Disconnects the camera and stops all tracks.
     */
    destroy() {
        if(this.StreamSource !== null && this.StreamSource !== undefined) {
            let tracks:Array<MediaStreamTrack> = this.StreamSource.getTracks();
            if(tracks && tracks.forEach) {
                tracks.forEach((track) => {
                    track.stop();
                });
            }
            this.StreamSource = null;
            if(this.VideoElement !== null && this.VideoElement.current !== null)
                this.VideoElement.current.srcObject = null;
        }
    }

    /**
     * Called when the component is attached to the DOM
     */
    componentDidMount() {
        if(typeof(this.props.deviceId) === 'string' && this.props.deviceId !== '') {
            this.loadCamera(this.props.deviceId);
        } else if(this.props.source !== null && typeof(this.props.source) === "object") {
            if(this.VideoElement !== null && this.VideoElement.current !== null) {
                this.VideoElement.current.srcObject = this.props.source;
                this.start();
            }
        }
    }

    /**
     * Triggered when the component is updated.
     * @param prevProps 
     */
    componentDidUpdate(prevProps) {
        if(prevProps.deviceId !== this.props.deviceId) {
            this.loadCamera(this.props.deviceId);
        }

        //manually set stream
        if(prevProps.source !== this.props.source) {
            if(typeof(this.props.source) === "object" && this.props.source !== null) {
                if(this.VideoElement.current) {
                    this.VideoElement.current.srcObject = this.props.source;
                    this.play();
                }
                if(this.props.onStream)
                    this.props.onStream(this.props.source);
            } else {
                this.destroy();
            }
        }
    }

    /**
     * Renders the component
     */
    render() {
        return (
            <video
                className={cnames('camera', this.props.className)}
                width={this.props.width}
                height={this.props.height}
                ref={this.VideoElement}
            />
        )
    }
}