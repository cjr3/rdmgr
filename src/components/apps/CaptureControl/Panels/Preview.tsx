import React from 'react';
import Panel from 'components/Panel';
import cnames from 'classnames';
import { Button, Icon, IconPlay, IconPause } from 'components/Elements';

export default class PreviewPanel extends React.PureComponent<any, {
    paused:boolean;
}> {
    readonly state = {
        paused:true
    }

    protected VideoItem:React.RefObject<HTMLVideoElement> = React.createRef();

    constructor(props) {
        super(props);
        this.load = this.load.bind(this);
        this.pause = this.pause.bind(this);
        this.play = this.play.bind(this);
        this.onClickPause = this.onClickPause.bind(this);
    }

    protected async load() {
        try {
            let DC:any = window.require("electron").desktopCapturer;
            let that = this;
            DC.getSources({
                types:['window'],
                thumbnailSize:{width:320,height:180}
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
                                        minWidth:320,
                                        maxWidth:320,
                                        minHeight:180,
                                        maxHeight:180
                                    }
                                }
                            }).then((stream) => {
                                if(this.VideoItem !== null && this.VideoItem.current !== null) {
                                    this.VideoItem.current.srcObject = stream;
                                    this.VideoItem.current.play();
                                    if(that.props.opened) {

                                    }
                                }
                            }).catch((er) => {
    
                            });
                            break;
                        }
                    }
                }
            });
        } catch(er) {

        }
    }

    protected onClickPause() {
        this.setState({paused:!this.state.paused}, () => {
            if(this.state.paused)
                this.pause();
            else
                this.play();
        });
    }

    protected pause() {
        if(this.VideoItem !== null && this.VideoItem.current !== null
            && this.VideoItem.current.srcObject && this.VideoItem.current.pause) {
            this.VideoItem.current.pause();
        }
    }

    protected play() {
        if(this.VideoItem !== null && this.VideoItem.current !== null
            && this.VideoItem.current.srcObject && this.VideoItem.current.pause) {
            this.VideoItem.current.play();
        }
    }

    componentDidMount() {
        if(window) {
            setTimeout(this.load, 1000);
            if(this.VideoItem && this.VideoItem.current) {
                this.VideoItem.current.onplay = () => {
                    this.setState({paused:false})
                };
                this.VideoItem.current.onpause = () => {
                    this.setState({paused:true});
                }
            }
        }
    }

    componentWillUnmount() {
        this.pause();
        if(this.VideoItem !== null && this.VideoItem.current !== null) {
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
     * Renders the component
     */
    render() {
        let className:string = cnames('preview', {
            playing:(this.state.paused == false),
            paused:(this.state.paused)
        });

        let src:string = IconPlay;
        if(!this.state.paused)
            src = IconPause;

        return (
            <div className={className}>
                <Icon src={src} onClick={this.onClickPause} title="Play/Pause"/>
                <video
                    width="320"
                    height="180"
                    ref={this.VideoItem}
                    onClick={this.onClickPause}
                    />
            </div>
        )
    }
}