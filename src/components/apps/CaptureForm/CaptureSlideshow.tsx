import React from 'react'
import SlideshowController from 'controllers/SlideshowController'
import cnames from 'classnames'
import './css/CaptureSlideshow.scss';
import SlideshowCaptureController from 'controllers/capture/Slideshow';
import { AddMediaPath } from 'controllers/functions';

/**
 * Component for displaying the current slideshow on the capture window
 */
export default class CaptureSlideshow extends React.PureComponent<any, {
    Index:number;
    Slides:Array<any>;
    Shown:boolean;
    className:string;
    CurrentSlide:string;
    SlideshowID:number;
}> {
    readonly state = {
        Index:SlideshowController.GetState().Index,
        Slides:SlideshowController.GetState().Slides,
        SlideshowID:SlideshowController.GetState().SlideshowID,
        Shown:SlideshowCaptureController.GetState().Shown,
        className:SlideshowCaptureController.GetState().className,
        CurrentSlide:'A'
    };

    /**
     * Source of Slide A
     */
    protected SourceA:string = '';
    /**
     * Source of slide B
     */
    protected SourceB:string = '';
    
    protected remoteState?:Function;
    protected remoteCapture?:Function;

    /**
     * Constructor
     * @param props 
     */
    constructor(props) {
        super(props);
        this.state.CurrentSlide = 'A';
        this.updateState = this.updateState.bind(this);
        this.updateCapture = this.updateCapture.bind(this);
    }

    /**
     * Updates the state to match the slideshow controller
     */
    protected updateState() {
        let changes:any = {
            Index:SlideshowController.GetState().Index,
            Slides:SlideshowController.GetState().Slides,
            SlideshowID:SlideshowController.GetState().SlideshowID
        };

        if(changes.SlideshowID != this.state.SlideshowID) {
            this.SourceA = '';
            this.SourceB = '';
            changes.CurrentSlide = 'A';
        } else if(changes.Index != this.state.Index) {
            changes.CurrentSlide = (this.state.CurrentSlide == 'A') ? 'B' : 'A';
        }

        this.setState(changes);
    }

    protected updateCapture() {
        this.setState({
            Shown:SlideshowCaptureController.GetState().Shown,
            className:SlideshowCaptureController.GetState().className,
        });
    }

    /**
     * Start listeners
     */
    componentDidMount() {
        this.remoteState = SlideshowController.Subscribe(this.updateState);
        this.remoteCapture = SlideshowCaptureController.Subscribe(this.updateCapture);
    }

    /**
     * Close listeners
     */
    componentWillUnmount() {
        if(this.remoteState)
            this.remoteState();
        if(this.remoteCapture)
            this.remoteCapture();
    }

    /**
     * Renders the component
     */
    render() {
        let className:string = cnames('main-slideshow', {
            shown:this.state.Shown
        });

        let classA:string = cnames('slide', {
            shown:(this.state.CurrentSlide === 'A')
        });

        let classB:string = cnames('slide', {
            shown:(this.state.CurrentSlide === 'B')
        });

        if(this.state.Slides && this.state.Slides.length && this.state.Slides[this.state.Index]) {
            if(this.state.CurrentSlide === 'A') {
                this.SourceA = AddMediaPath(this.state.Slides[this.state.Index].Filename);
            } else {
                this.SourceB = AddMediaPath(this.state.Slides[this.state.Index].Filename);
            }
        }

        return (
            <div className={className}>
                <div className={classA}>
                    <img src={this.SourceA} alt=""/>
                </div>
                <div className={classB}>
                    <img src={this.SourceB} alt=""/>
                </div>
            </div>
        );
    }
}