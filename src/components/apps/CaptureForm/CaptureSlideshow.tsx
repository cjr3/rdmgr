import React from 'react'
import SlideshowController, {SSlideshowController} from 'controllers/SlideshowController'
import cnames from 'classnames'
import './css/CaptureSlideshow.scss';

interface SCaptureSlideshow extends SSlideshowController {
    CurrentSlide?:string
}

interface PCaptureSlideshow {
    shown?:boolean
}

/**
 * Component for displaying the current slideshow on the capture window
 */
class CaptureSlideshow extends React.PureComponent<PCaptureSlideshow, SCaptureSlideshow> {
    readonly state:SCaptureSlideshow = SlideshowController.getState()

    SourceA:string = ''
    SourceB:string = ''
    remoteState

    constructor(props) {
        super(props);
        this.state.CurrentSlide = 'A';
        this.updateState = this.updateState.bind(this);
        this.remoteState = SlideshowController.subscribe(this.updateState);
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
     * Renders the component
     */
    render() {
        var className = cnames('main-slideshow', {
            shown:this.props.shown
        });

        var classA = cnames({
            slide:true,
            shown:(this.state.CurrentSlide === 'A')
        });

        var classB = cnames({
            slide:true,
            shown:(this.state.CurrentSlide === 'B')
        });

        if(this.state.Slides && this.state.Slides.length && this.state.Slides[this.state.Index]) {
            if(this.state.CurrentSlide === 'A')
                this.SourceA = this.state.Slides[this.state.Index].Filename;
            else {
                this.SourceB = this.state.Slides[this.state.Index].Filename;
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

export default CaptureSlideshow;