import React from 'react'
import cnames from 'classnames'
import PenaltyController, {SPenaltyController} from 'controllers/PenaltyController';
import './css/CapturePenaltyTracker.scss';
import {SkaterRecord} from 'tools/vars';

interface PCapturePenaltyTracker {
    shown?:boolean,
    className?:string
}

class CapturePenaltyTracker extends React.PureComponent<PCapturePenaltyTracker, SPenaltyController> {

    readonly state:SPenaltyController = PenaltyController.getState();
    remotePenalty:Function

    constructor(props) {
        super(props);
        this.updateState = this.updateState.bind(this);
        this.remotePenalty = PenaltyController.subscribe(this.updateState);
    }

    updateState() {
        this.setState(() => {
            return Object.assign({}, PenaltyController.getState());
        });
    }

    render() {
        var className = cnames('capture-PT', this.props.className, {
            shown:(this.props.shown && this.state.Skaters.length)
        });
        var penalties:Array<React.ReactElement> = [];
        this.state.Skaters.forEach((skater:SkaterRecord) => {
            let style = {
                backgroundColor:skater.Color
            }

            var codes:Array<string> = [];
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

export default CapturePenaltyTracker;