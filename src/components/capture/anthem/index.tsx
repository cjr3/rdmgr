import classNames from 'classnames';
import React from 'react';
import { Unsubscribe } from 'redux';
import { Anthem } from 'tools/anthem/functions';
import { Capture } from 'tools/capture/functions';
import Data from 'tools/data';

interface Props extends React.HTMLProps<HTMLDivElement> {
    stream:boolean;
}

interface State {
    /**
     * Background image value
     */
    background:string;
    /**
     * Background image url for css
     */
    backgroundImage:string;
    bio:string;
    name:string;
    /**
     * Photo file location
     */
    photo:string;
    /**
     * Photo url
     */
    photoImage:string;
    /**
     * Thumbnail file location
     */
    thumbnail:string;
    /**
     * Thumbnail url
     */
    thumbnailImage:string;
    visible:boolean;
}

/**
 * Display national anthem singer.
 */
class AnthemCapture extends React.PureComponent<Props, State> {
    readonly state:State = {
        background:'',
        backgroundImage:'',
        bio:'',
        name:'',
        photo:'',
        photoImage:'',
        thumbnail:'',
        thumbnailImage:'',
        visible:false
    }

    protected remoteCapture?:Unsubscribe;
    protected remoteData?:Unsubscribe;

    /**
     * Update the state
     */
    protected update = () => {
        const cstate = Capture.GetAnthem();
        const singer = Anthem.Get().Singer;
        this.setState({
            background:cstate.backgroundImage || '',
            bio:singer?.Description || '',
            photo:singer?.Photo || '',
            name:singer?.Name || '',
            thumbnail:singer?.Thumbnail || '',
            visible:cstate.visible || false
        });
    }

    componentDidMount() {
        this.update();
        this.remoteCapture = Capture.Subscribe(this.update);
        this.remoteData = Anthem.Subscribe(this.update);
    }

    componentDidUpdate(prevProps:Props, prevState:State) {
        if(this.state.background !== prevState.background && this.state.background) {
            this.setState({backgroundImage:"url('" + Data.GetMediaPath(this.state.background, 'file:///') + "')"});
        } else if(!this.state.background) {
            this.setState({backgroundImage:this.state.background});
        }

        //
        if(this.state.photo !== prevState.photo && this.state.photo) {
            this.setState({photoImage:Data.GetMediaPath(this.state.photo)});
        } else if(!this.state.photo) {
            this.setState({photoImage:this.state.photo});
        }

        //change thumbnailImage only if thumbnail changed
        if(this.state.thumbnail !== prevState.thumbnail && this.state.thumbnail) {
            this.setState({thumbnailImage:Data.GetMediaPath(this.state.thumbnail)});
        } else if(!this.state.thumbnail) {
            this.setState({thumbnailImage:this.state.photo});
        }
    }

    componentWillUnmount() {
        if(this.remoteCapture)
            this.remoteCapture();
        if(this.remoteData)
            this.remoteData();
    }

    render(): React.ReactNode {
        const {stream, ...rprops} = {...this.props}
        const style:React.CSSProperties = {};
        if(this.state.backgroundImage)
            style.backgroundImage = this.state.backgroundImage;
        return <div {...rprops} className={classNames('capture-anthem', rprops.className, {active:this.state.visible})}>
            <div className='flag' style={style}>
                {
                    (!stream && this.state.photoImage && this.state.photoImage.length) &&
                    <div className='photo'>
                        <img src={this.state.photoImage} alt=''/>
                    </div>
                }
                {
                    (stream && this.state.thumbnailImage && this.state.thumbnailImage.length > 0) &&
                    <div className='photo'>
                        <img src={this.state.thumbnailImage} alt=''/>
                    </div>
                }
                <div className='name'>{this.state.name}</div>
                <div className='bio'>{this.state.bio}</div>
            </div>
        </div>
    }
}

export {AnthemCapture};