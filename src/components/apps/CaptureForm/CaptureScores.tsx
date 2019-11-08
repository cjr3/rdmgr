import React from 'react';
import CaptureController from 'controllers/CaptureController';
import cnames from 'classnames';
import { Unsubscribe } from 'redux';
import DataController from 'controllers/DataController';
import './css/CaptureScores.scss';

/**
 * Displays a list of scores.
 */
export default class CaptureScores extends React.PureComponent<any, {
    /**
     * Determines if the component is shown or not
     */
    shown:boolean;
    /**
     * The className of the component
     */
    className?:string;
    /**
     * Score records
     */
    records:Array<any>;
}> {
    readonly state = {
        shown:CaptureController.getState().Scores.Shown,
        className:CaptureController.getState().Scores.className,
        records:CaptureController.getState().Scores.Records
    }

    /**
     * CaptureController listener
     */
    protected remoteCapture?:Unsubscribe;

    /**
     * Constructor
     * @param props 
     */
    constructor(props) {
        super(props);
        this.updateCapture = this.updateCapture.bind(this);
    }

    /**
     * Updates the state to match the controller
     */
    protected async updateCapture() {
        let changes:any = {
            shown:CaptureController.getState().Scores.Shown,
            className:CaptureController.getState().Scores.className
        };

        let records:Array<any>|undefined = CaptureController.getState().Scores.Records;
        if(records && !DataController.compare(records, this.state.records))
            changes.records = records;
        this.setState(changes);
    }

    /**
     * Listen to controllers
     */
    componentDidMount() {
        this.remoteCapture = CaptureController.subscribe(this.updateCapture);
    }

    /**
     * Close listeners
     */
    componentWillUnmount() {
        if(this.remoteCapture)
            this.remoteCapture();
    }

    /**
     * Renders the component
     */
    render() {
        let matches:Array<React.ReactElement> = new Array<React.ReactElement>();
        if(this.state.records) {
            let max:number = 4;
            this.state.records.forEach((record, index) => {
                if(index < max) {
                    matches.push(
                        <div className="match" key={`${record.RecordType}-${record.RecordID}`}>
                            <div className="team">
                                <div className="logo">
                                    <img src={record.TeamA.Thumbnail} alt=""/>
                                </div>
                                <div className="score">{record.TeamA.Score}</div>
                            </div>
                            <div className="team">
                                <div className="score">{record.TeamB.Score}</div>
                                <div className="logo">
                                    <img src={record.TeamB.Thumbnail} alt=""/>
                                </div>
                            </div>
                        </div>
                    );
                }
            });
        }

        return (
            <div className={cnames('capture-scores', {
                shown:(this.state.shown && this.state.records && this.state.records.length)
            })}>
                <h1>Latest Scores</h1>
                <div className="matches">
                    {matches}
                </div>
            </div>
        );
    }
}