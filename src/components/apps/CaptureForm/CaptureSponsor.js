/**
 * CaptureForm component for the Main Sponsor slides
 * 
 */

import React from 'react';
import SponsorController from 'controllers/SponsorController';
import cnames from 'classnames';
import './css/CaptureSponsor.scss';

/**
 * Slideshow for the sponsor display.
 */
class CaptureSponsor extends React.Component {
    constructor(props) {
        super(props);
        this.state = Object.assign({}, SponsorController.getState());
        this.state.CurrentSlide = 'A';
        this.SrcA = null;
        this.SrcB = null;
        this.updateState = this.updateState.bind(this);
        this.remote = SponsorController.subscribe(this.updateState);
    }

    /**
     * Updates the state to match the controller.
     */
    updateState() {
        this.setState((state) => {
            return Object.assign({}, SponsorController.getState(), {
                CurrentSlide:(state.CurrentSlide === 'A') ? 'B' : 'A'
            });
        });
    }

    /**
     * Renders the component.
     */
    render() {
        var className = cnames('capture-sponsors', {
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

        var classTemp = cnames({
            slide:true,
            temp:true,
            shown:(this.state.TemporarySlide !== '')
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
                <div className={classTemp}>
                    <img src={this.state.TemporarySlide} alt=""/>
                </div>
            </div>
        );
    }
}

export default CaptureSponsor;