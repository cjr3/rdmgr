import React, { CSSProperties } from 'react';
import cnames from 'classnames';
import PenaltyController from 'controllers/PenaltyController';
import './css/CapturePenaltyTracker.scss';
import {SkaterRecord, PenaltyRecord} from 'tools/vars';
import PenaltyCaptureController from 'controllers/capture/Penalty';
import { Unsubscribe } from 'redux';
import RosterController from 'controllers/RosterController';
import ScoreboardController from 'controllers/ScoreboardController';
import { AddMediaPath } from 'controllers/functions';

export default class CapturePenaltyTracker extends React.PureComponent {
    render() {
        return (
            <React.Fragment>
                <CapturePenaltyElement className="popup"/>
                <CapturePenaltyElement className="screen"/>
            </React.Fragment>
        );
    }
}

class CapturePenaltyElement extends React.PureComponent<{
    className?:string;
}, {
    Skaters:Array<SkaterRecord>;
    Shown:boolean;
    className:string;
}> {
    readonly state = {
        Skaters:PenaltyController.GetState().Skaters,
        Shown:PenaltyCaptureController.GetState().Shown,
        className:PenaltyCaptureController.GetState().className,
    }

    protected remoteCapture?:Unsubscribe;
    protected remotePenalty?:Unsubscribe;
    protected Timer:any = 0;

    constructor(props) {
        super(props);
        this.updateCapture = this.updateCapture.bind(this);
        this.updatePenalty = this.updatePenalty.bind(this);
    }

    protected updateCapture() {
        this.setState({
            Shown:PenaltyCaptureController.GetState().Shown,
            className:PenaltyCaptureController.GetState().className
        });
    }

    protected updatePenalty() {
        let skaters:Array<SkaterRecord> = PenaltyController.GetState().Skaters;
        try {clearTimeout(this.Timer);} catch(er) {}
        if(skaters && skaters.length <= 0) {
            this.setState({
                Shown:false
            }, () => {
                this.Timer = setTimeout(() => {
                    this.setState({
                        Skaters:PenaltyController.GetState().Skaters,
                        Shown:PenaltyCaptureController.GetState().Shown
                    });
                }, 1000);
            });
        } else {
            this.setState({
                Skaters:skaters,
                Shown:PenaltyCaptureController.GetState().Shown
            });
        }
    }

    componentDidMount() {
        this.remoteCapture = PenaltyCaptureController.Subscribe(this.updateCapture);
        this.remotePenalty = PenaltyController.Subscribe(this.updatePenalty);
    }

    componentWillUnmount() {
        if(this.remoteCapture)
            this.remoteCapture();
        if(this.remotePenalty)
            this.remotePenalty();
    }

    render() {
        let shown:boolean = this.state.Shown;
        if(this.state.Skaters && this.state.Skaters.length <= 0)
            shown = false;
        let className:string = cnames('penalty-tracker', {
            shown:shown
        }, this.state.className, this.props.className);

        let skaters:Array<React.ReactElement> = new Array<React.ReactElement>();
        this.state.Skaters.forEach((skater:SkaterRecord) => {
            skaters.push(<SkaterItem key={`${skater.RecordType}-${skater.RecordID}`} skater={skater}/>);
        });

        return (
            <div className={className}>
                <h1>Penalties</h1>
                <div className="skaters">
                    {skaters}
                </div>
            </div>
        );
    }
}

function SkaterItem(props:{skater:SkaterRecord}) {
    if(props.skater.Penalties && props.skater.Penalties.length && props.skater.Number) {
        let codes:Array<string> = new Array<string>();
        props.skater.Penalties.forEach((penalty:PenaltyRecord) => {
            if(penalty.Acronym)
                codes.push(penalty.Acronym);
            else if(penalty.Code)
                codes.push(penalty.Code);
        });
        if(codes.length) {
            let color:string = 'transparent';
            let src:string = '';
            if(RosterController.GetState().TeamA.Skaters.findIndex(r => r.RecordID == props.skater.RecordID) >= 0)
                color = ScoreboardController.GetState().TeamA.Color;
            else if(RosterController.GetState().TeamB.Skaters.findIndex(r => r.RecordID == props.skater.RecordID) >= 0)
                color = ScoreboardController.GetState().TeamB.Color;

            let style:CSSProperties = {backgroundColor:color};

            if(props.skater.Thumbnail) {
                src = AddMediaPath(props.skater.Thumbnail);
            }

            return (
                <div className="skater" style={style}>
                    <div className="num">{props.skater.Number}</div>
                    <div className="penalties">{codes.join(', ')}</div>
                </div>
            );
        }
    }

    return null;
};