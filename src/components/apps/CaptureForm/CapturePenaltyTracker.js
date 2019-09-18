import React from 'react'
import cnames from 'classnames'
import PenaltyController from 'controllers/PenaltyController';
import './css/CapturePenaltyTracker.scss'

class CapturePenaltyTracker extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = Object.assign({}, PenaltyController.getState());
        this.updateState = this.updateState.bind(this);
        this.remote = PenaltyController.subscribe(this.updateState);
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
        var penalties = [];
        this.state.Skaters.forEach((skater) => {
            let style = {
                backgroundColor:skater.Color
            }

            var codes = [];
            skater.Penalties.forEach((pen) => {
                if(pen.Acronym)
                    codes.push(pen.Acronym);
                else if(pen.Code)
                    codes.push(pen.Code);
            });

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