import React from 'react';
import SponsorController, {SSponsorController} from 'controllers/SponsorController';
import cnames from 'classnames';
import './css/CaptureSponsor.scss';
import SponsorCaptureController from 'controllers/capture/Sponsor';
import { AddMediaPath } from 'controllers/functions';

interface SCaptureSponsor extends SSponsorController {
    CurrentSlide?:string
}

/**
 * Slideshow for the sponsor display.
 */
export default class CaptureSponsor extends React.Component<any, {
    Index:number;
    Slides:Array<any>;
    Shown:boolean;
    className:string;
    CurrentSlide:string;
    RecordID:number;
}> {
    
    readonly state = {
        Index:SponsorController.GetState().Index,
        Slides:SponsorController.GetState().Slides,
        RecordID:SponsorController.GetState().RecordID,
        Shown:SponsorCaptureController.GetState().Shown,
        className:SponsorCaptureController.GetState().className,
        CurrentSlide:'A'
    };

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
     * Updates the state to match the controller.
     */
    protected updateState() {
        
        let changes:any = {
            Index:SponsorController.GetState().Index,
            Slides:SponsorController.GetState().Slides,
            RecordID:SponsorController.GetState().RecordID
        };

        if(changes.RecordID != this.state.RecordID) {
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
            Shown:SponsorCaptureController.GetState().Shown,
            className:SponsorCaptureController.GetState().className,
        });
    }

    /**
     * Start listeners
     */
    componentDidMount() {
        this.remoteState = SponsorController.Subscribe(this.updateState);
        this.remoteCapture = SponsorCaptureController.Subscribe(this.updateCapture);
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
     * Renders the component.
     */
    render() {
        let className:string = cnames('capture-sponsors', {
            shown:this.state.Shown
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
            if(this.state.CurrentSlide === 'A')
                this.SourceA = AddMediaPath(this.state.Slides[this.state.Index].Filename);
            else {
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