import React from 'react';
import DataController from 'controllers/DataController';
import SponsorController, {SSponsorController} from 'controllers/SponsorController';
import cnames from 'classnames';
import './css/CaptureSponsor.scss';

interface SCaptureSponsor extends SSponsorController {
    CurrentSlide?:string
}

/**
 * Slideshow for the sponsor display.
 */
export default class CaptureSponsor extends React.Component<{
    /**
     * true to show, false to hide
     */
    shown:boolean;
}, SCaptureSponsor> {
    readonly state:SCaptureSponsor = SponsorController.getState();

    /**
     * Source of Slide A
     */
    protected SourceA:string = ''
    /**
     * Source of Slide B
     */
    protected SourceB:string = ''
    /**
     * SponsorController remote
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
     * Start listeners
     */
    componentDidMount() {
        this.remoteState = SponsorController.subscribe(this.updateState);
    }

    /**
     * Close listeners
     */
    componentWillUnmount() {
        if(this.remoteState !== null)
            this.remoteState();
    }

    /**
     * Renders the component.
     */
    render() {
        let className:string = cnames('capture-sponsors', {
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

        let classTemp:string = cnames({
            slide:true,
            temp:true,
            shown:(this.state.TemporarySlide !== '')
        });

        if(this.state.Slides && this.state.Slides.length && this.state.Slides[this.state.Index]) {
            if(this.state.CurrentSlide === 'A')
                this.SourceA = DataController.mpath(this.state.Slides[this.state.Index].Filename);
            else {
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
                <div className={classTemp}>
                    <img src={this.state.TemporarySlide} alt=""/>
                </div>
            </div>
        );
    }
}