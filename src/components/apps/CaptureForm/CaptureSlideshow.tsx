import React from 'react'
import SlideshowController, {SSlideshowController} from 'controllers/SlideshowController'
import DataController from 'controllers/DataController';
import cnames from 'classnames'
import './css/CaptureSlideshow.scss';

interface SCaptureSlideshow extends SSlideshowController {
    CurrentSlide?:string
}

/**
 * Component for displaying the current slideshow on the capture window
 */
export default class CaptureSlideshow extends React.PureComponent<{
    /**
     * True to show, false to hide
     */
    shown:boolean;
}, SCaptureSlideshow> {
    readonly state:SCaptureSlideshow = SlideshowController.getState()
    /**
     * Source of Slide A
     */
    protected SourceA:string = ''
    /**
     * Source of slide B
     */
    protected SourceB:string = ''
    /**
     * SlideshowController remote
     */
    protected remoteState:Function|null = null;

    /**
     * Constructor
     * @param props 
     */
    constructor(props) {
        super(props);
        this.state.CurrentSlide = 'A';
        this.updateState = this.updateState.bind(this);
    }

    /**
     * Updates the state to match the slideshow controller
     */
    updateState() {
        this.setState((state:SCaptureSlideshow) => {
            var cstate = SlideshowController.getState();
            if(cstate.SlideshowID !== state.SlideshowID) {
                this.SourceA = '';
                this.SourceB = '';
            }
            return Object.assign({}, cstate,{
                CurrentSlide:(state.CurrentSlide === 'A') ? 'B' : 'A'
            });
        });
    }

    /**
     * Start listeners
     */
    componentDidMount() {
        this.remoteState = SlideshowController.subscribe(this.updateState);
    }

    /**
     * Close listeners
     */
    componentWillUnmount() {
        if(this.remoteState !== null)
            this.remoteState();
    }

    /**
     * Renders the component
     */
    render() {
        let className:string = cnames('main-slideshow', {
            shown:this.props.shown
        });

        let classA:string = cnames({
            slide:true,
            shown:(this.state.CurrentSlide === 'A')
        });

        let classB:string = cnames({
            slide:true,
            shown:(this.state.CurrentSlide === 'B')
        });

        if(this.state.Slides && this.state.Slides.length && this.state.Slides[this.state.Index]) {
            if(this.state.CurrentSlide === 'A') {
                this.SourceA = DataController.mpath(this.state.Slides[this.state.Index].Filename);
            } else {
                this.SourceB = DataController.mpath(this.state.Slides[this.state.Index].Filename);
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