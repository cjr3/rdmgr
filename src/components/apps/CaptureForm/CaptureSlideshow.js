/**
 * CaptureForm component for the Main Slideshow
 * (Not for sponsor slideshow or stream intros)
 */

import React from 'react'
import SlideshowController from 'controllers/SlideshowController'
import cnames from 'classnames'
import './css/CaptureSlideshow.scss'

/**
 * 
 */
class CaptureSlideshow extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = Object.assign({}, SlideshowController.getState());
        this.state.CurrentSlide = 'A';
        this.SrcA = null;
        this.SrcB = null;
        this.updateState = this.updateState.bind(this);
        this.remote = SlideshowController.subscribe(this.updateState);
    }

    updateState() {
        this.setState(() => {
            var cstate = SlideshowController.getState();
            if(cstate.SlideshowID !== this.state.SlideshowID) {
                this.SrcA = null;
                this.SrcB = null;
            }
            return Object.assign({}, cstate,{
                CurrentSlide:(this.state.CurrentSlide === 'A') ? 'B' : 'A'
            });
        });
    }

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
                this.SrcA = this.state.Slides[this.state.Index].Filename;
            else {
                this.SrcB = this.state.Slides[this.state.Index].Filename;
            }
        }

        return (
            <div className={className}>
                <div className={classA}>
                    <img src={this.SrcA} alt=""/>
                </div>
                <div className={classB}>
                    <img src={this.SrcB} alt=""/>
                </div>
            </div>
        );
    }
}

export default CaptureSlideshow;