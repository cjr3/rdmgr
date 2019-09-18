import React from 'react'
import cnames from 'classnames'

class Camera extends React.PureComponent {
    constructor(props) {
        super(props);
        
        this.DeviceID = null;

        this.CanvasElement = React.createRef();
        this.Brush = null;
        this.StreamSource = null;
        this.CanvasStream = null;
        this.Paused = false;
        this.PaintTimer = null;

        //need hidden video element to load media stream
        this.VideoElement = React.createRef();

        //bindings
        this.paint = this.paint.bind(this);
        this.destroy = this.destroy.bind(this);

        this.onWorkerMessage = this.onWorkerMessage.bind(this);
        //this.worker = new Worker('tools/Animator.js');
        //this.worker.onmessage = this.onWorkerMessage;

        this.VideoCapture = null;
    }

    /**
     * Paints the canvas element
     */
    paint() {
        if(this.Brush === null || this.StreamSource === null)
            return;

        if(!this.Paused) {
            //this.Brush.drawImage(this.VideoElement, 0, 0, this.props.width, this.props.height);
        }
    }

    /**
     * Triggered when the web worker for animations responds.
     * @param {Object} response 
     */
    onWorkerMessage(response) {
        if(response.data === 'render')
            this.paint();
    }

    /**
     * Loads the camera to the canvas.
     * @param {String} id Camera Device ID
     */
    async loadCamera(id) {
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
                this.stop();
                this.StreamSource = stream;
                this.VideoElement.current.srcObject = stream;
                if(this.props.onStream)
                    this.props.onStream(stream);
                this.start();
            }).catch((er) => {
                //this.StreamSource = null;
                this.stop();
            });
        } catch(er) {
            alert(er.message);
        }
    }

    start() {
        this._clear();
        this.Paused = false;
        this.VideoElement.current.play();
        //this.worker.postMessage('play');
    }

    stop() {
        this._clear();
        if(this.Brush !== null) {
            this.Brush.clearRect(0, 0, this.props.width, this.props.height);
        }
    }

    play() {
        this.start();
    }

    pause() {
        this._clear();
    }

    _clear() {
        //this.worker.postMessage('pause');
    }

    /**
     * Disconnects the camera and stops all tracks.
     */
    destroy() {
        this.stop();
        if(this.StreamSource !== null) {
            var tracks = this.StreamSource.getTracks();
            if(tracks && tracks.forEach) {
                tracks.forEach((track) => {
                    track.stop();
                });
            }
            this.StreamSource = null;
            if(this.VideoElement.current)
                this.VideoElement.current.srcObject = null;
        }
    }

    /**
     * Called when the component is attached to the DOM
     */
    componentDidMount() {
        //this.Brush = this.CanvasElement.current.getContext('2d');
        //this.CanvasStream = this.CanvasElement.current.captureStream();
        if(typeof(this.props.deviceId) === 'string' && this.props.deviceId !== '') {
            this.loadCamera(this.props.deviceId);
        } else if(this.props.source !== null && typeof(this.props.source) === "object") {
            if(this.VideoElement.current) {
                this.VideoElement.current.srcObject = this.props.source;
                this.start();
            }
        }
    }

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
                    this.props.onStream(this.VideoElement.current.srcObject);
            } else {
                if(this.VideoElement.current !== null && this.VideoElement.current.srcObject !== null) {
                    this.stop();
                    var tracks = this.VideoElement.current.srcObject.getTracks();
                    tracks.forEach((track) => {
                        track.stop();
                    });
                    this.VideoElement.current.srcObject = null;
                }
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
                //ref={this.CanvasElement}
                ref={this.VideoElement}
            />
        )
    }
}

/**
 * Helper component to select a camera
 */
class CameraSelection extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            cameras:[],
            deviceId:null
        }
    }

    setCamera(deviceId) {
        this.setState((state) => {
            return {deviceId:deviceId}
        }, () => {
            if(this.props.onSelect)
                this.props.onSelect(this.state.deviceId);
        });
    }

    async loadCameras() {
        try {
            navigator.mediaDevices.enumerateDevices().then((devices) => {
                if(devices && devices.length) {
                    let cameras = [];
                    for(var key in devices) {
                        if(devices[key].kind !== "videoinput")
                            continue;

                        //ignore the elgato helper device
                        if(devices[key].label.search('Elgato Helper') >= 0)
                            continue;

                        cameras.push(devices[key]);
                    }

                    this.setState((state) => {
                        return {cameras:cameras};
                    });
                }
            });
        } catch(er) {

        }
    }

    componentDidMount() {
        this.loadCameras();
    }

    render() {
        var cameras = [];
        for(var i=0; i < this.state.cameras.length; i++) {
            let camera = this.state.cameras[i];
            let className = "";
            if(camera.deviceId === this.state.deviceId)
                className = "active";
            cameras.push(
                <button
                    key={camera.deviceId}
                    className={className}
                    onClick={() => {
                        this.setCamera(camera.deviceId);
                    }}
                >Camera #{i+1}</button>
            );
        }

        if(cameras.length >= 1) {
            return (
                <div className="camera-selection">
                    {cameras}
                </div>
            );
        } else {
            return (
                <div className="camera-selection">
                    <p>No cameras available.</p>
                </div>
            )
        }
    }
}

export default Camera;
export {Camera, CameraSelection};