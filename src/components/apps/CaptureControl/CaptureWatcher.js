import React from 'react'
import cnames from 'classnames'

/**
 * Allows the user to preview the capture window in real-time.
 * A toggle property is provided to stop/start the capturing, to
 * allow for improved performance.
 */
class CaptureWatcher extends React.PureComponent {
    constructor(props) {
        super(props);

        this.Brush = null;
        this.CanvasItem = React.createRef();

        this.paint = this.paint.bind(this);
        this.onWorkerMessage = this.onWorkerMessage.bind(this);

        this.CaptureVideo = document.createElement("video");
        
        this.worker = new Worker('tools/Animator.js');
        this.worker.onmessage = this.onWorkerMessage;
    }

    async paint() {
        if(this.Brush === null)
            return;


        this.Brush.drawImage(this.CaptureVideo, 0, 0, 640, 360);
    }

    /**
     * Triggered when the web worker for animations responds.
     * @param {Object} response 
     */
    onWorkerMessage(response) {
        if(response.data === 'render')
            this.paint();
    }

    componentDidMount() {
        this.Brush = this.CanvasItem.current.getContext('2d');
        //this.paint();

        if(window) {
            this.DC = window.require("electron").desktopCapturer;
            this.DC.getSources({
                types:['window']
            }, async function(err, sources) {
                if(err) { }
                else {
                    for(var key in sources) {
                        if(sources[key].name === 'RDMGR : Capture Window') {
                            navigator.mediaDevices.getUserMedia({
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
                            }).then(function(stream) {
                                this.CaptureVideo.srcObject = stream;
                                //this.CaptureVideo.get(0).play();
                                //window.RDMGR.mainWindow.focus();
                                if(this.props.shown) {
                                    this.worker.postMessage('play');
                                    this.CaptureVideo.play();
                                }
                                //window.requestAnimationFrame(this.handleAnimationFrame.bind(this));
                            }.bind(this)).catch(function(er) {
    
                            });
                            break;
                        }
                    }
                }
            }.bind(this));
        }
    }

    componentDidUpdate(prevProps) {
        if(prevProps.shown !== this.props.shown) {
            if(this.props.shown) {
                this.worker.postMessage('play');
                this.CaptureVideo.play();
            }
            else {
                this.worker.postMessage('pause');
                this.CaptureVideo.pause();
            }
        }
    }

    render() {
        var className = cnames({
            shown:(this.props.shown)
        }, this.props.className);

        return (
            <canvas
                className={className}
                width="640"
                height="360"
                ref={this.CanvasItem}
                onDoubleClick={this.props.onDoubleClick}
                />
        )
    }
}

export default CaptureWatcher;