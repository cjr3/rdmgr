import React from 'react';
import SponsorController, {SSponsorController} from 'controllers/SponsorController';
import cnames from 'classnames';
import './css/CaptureSponsor.scss';

interface SCaptureSponsor extends SSponsorController {
    CurrentSlide?:string
}

interface PCaptureSponsor {
    shown?:boolean
}

/**
 * Slideshow for the sponsor display.
 */
class CaptureSponsor extends React.Component<PCaptureSponsor, SCaptureSponsor> {
    readonly state:SCaptureSponsor = SponsorController.getState();

    SourceA:string = ''
    SourceB:string = ''
    remoteState:Function
    
    constructor(props) {
        super(props);
        this.state.CurrentSlide = 'A';
        this.updateState = this.updateState.bind(this);
        this.remoteState = SponsorController.subscribe(this.updateState);
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
                <div className={classTemp}>
                    <img src={this.state.TemporarySlide} alt=""/>
                </div>
            </div>
        );
    }
}

export default CaptureSponsor;