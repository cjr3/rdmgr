import React, { CSSProperties } from 'react'
import cnames from 'classnames'
import PenaltyController, {SPenaltyController} from 'controllers/PenaltyController';
import './css/CapturePenaltyTracker.scss';
import {SkaterRecord} from 'tools/vars';

export default class CapturePenaltyTracker extends React.PureComponent<{
    /**
     * true to show, false to hide
     */
    shown:boolean;
    /**
     * Additional class name
     */
    className?:string;
}, SPenaltyController> {
    readonly state:SPenaltyController = PenaltyController.getState();
    /**
     * PenaltyController remote
     */
    protected remotePenalty:Function|null = null;

    /**
     * Constructor
     * @param props 
     */
    constructor(props) {
        super(props);
        this.updateState = this.updateState.bind(this);
    }

    /**
     * Updates the state to match the Penalty Controller
     */
    updateState() {
        this.setState(PenaltyController.getState());
    }

    /**
     * Start listeners
     */
    componentDidMount() {
        this.remotePenalty = PenaltyController.subscribe(this.updateState);
    }

    /**
     * Close listeners
     */
    componentWillUnmount() {
        if(this.remotePenalty !== null)
            this.remotePenalty();
    }

    /**
     * Renders the component
     */
    render() {
        let className:string = cnames('capture-PT', this.props.className, {
            shown:(this.props.shown && this.state.Skaters.length)
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