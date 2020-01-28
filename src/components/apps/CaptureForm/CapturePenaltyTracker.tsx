import React, { CSSProperties } from 'react'
import cnames from 'classnames'
import PenaltyController from 'controllers/PenaltyController';
import './css/CapturePenaltyTracker.scss';
import {SkaterRecord} from 'tools/vars';
import PenaltyCaptureController from 'controllers/capture/Penalty';
import { Unsubscribe } from 'redux';

export default class CapturePenaltyTracker extends React.PureComponent<any, {
    Skaters:Array<SkaterRecord>;
    Shown:boolean;
    className:string;
    Duration:number;
}> {
    readonly state = {
        Skaters:PenaltyController.GetState().Skaters,
        Shown:PenaltyCaptureController.GetState().Shown,
        className:PenaltyCaptureController.GetState().className,
        Duration:PenaltyCaptureController.GetState().Duration
    }
    /**
     * PenaltyController remote
     */
    protected remotePenalty?:Unsubscribe;
    protected remoteCapture?:Unsubscribe;
    protected Timer:any = 0;

    /**
     * Constructor
     * @param props 
     */
    constructor(props) {
        super(props);
        this.updateState = this.updateState.bind(this);
        this.updateCapture = this.updateCapture.bind(this);
    }

    /**
     * Updates the state to match the Penalty Controller
     */
    protected updateState() {
        try {clearTimeout(this.Timer);} catch(er) {}
        let skaters:Array<SkaterRecord> = PenaltyController.GetState().Skaters;
        if(skaters.length > 0) {
            this.setState({Skaters:skaters, Shown:PenaltyCaptureController.GetState().Shown});
            this.Timer = setTimeout(() => {this.setState({Shown:false});}, this.state.Duration);
        } else {
            this.setState({
                Shown:false
            }, () => {
                this.Timer = setTimeout(() => {this.setState({Skaters:skaters})}, 1000);
            });
        }
    }

    protected updateCapture() {
        try {clearTimeout(this.Timer);} catch(er) {}
        this.setState({
            Shown:PenaltyCaptureController.GetState().Shown,
            className:PenaltyCaptureController.GetState().className,
            Duration:PenaltyCaptureController.GetState().Duration
        }, () => {
            this.Timer = setTimeout(() => {this.setState({Shown:false});}, this.state.Duration);
        });
    }

    /**
     * Start listeners
     */
    componentDidMount() {
        this.remotePenalty = PenaltyController.Subscribe(this.updateState);
        this.remoteCapture = PenaltyCaptureController.Subscribe(this.updateCapture);
    }

    /**
     * Close listeners
     */
    componentWillUnmount() {
        if(this.remotePenalty)
            this.remotePenalty();
        if(this.remoteCapture)
            this.remoteCapture();
    }

    /**
     * Renders the component
     */
    render() {
        let className:string = cnames('capture-PT', this.state.className, {
            shown:(this.state.Shown && this.state.Skaters.length)
        });
        let penalties:Array<React.ReactElement> = [];
        this.state.Skaters.forEach((skater:SkaterRecord) => {
            let style:CSSProperties = {
                backgroundColor:skater.Color
            }

            let codes:Array<string> = [];
            if(skater.Penalties !== undefined) {
                skater.Penalties.forEach((pen) => {
                    if(pen.Acronym)
                        codes.push(pen.Acronym);
                    else if(pen.Code)
                        codes.push(pen.Code);
                });
            }

            penalties.push(
                <div className="penalty-item" key={`${skater.RecordType}-${skater.RecordID}`} style={style}>
                    <div className="skater-number">{`#${skater.Number}`}</div>
                    <div className="skater-penalties">{codes.join(', ')}</div>
                </div>
            );
        });

        return (
            <div className={className}>
                <h1>Penalties</h1>
                <div className="penalty-items">
                    {penalties}
                </div>
            </div>
        );
    }
}