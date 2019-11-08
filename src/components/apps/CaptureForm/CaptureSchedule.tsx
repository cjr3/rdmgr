import React from 'react';
import CaptureController from 'controllers/CaptureController';
import cnames from 'classnames';
import { Unsubscribe } from 'redux';
import DataController from 'controllers/DataController';
import './css/CaptureSchedule.scss';

/**
 * Component for displaying the bout schedule
 */
export default class CaptureSchedule extends React.PureComponent<any, {
    /**
     * Determines if this component is shown or not
     */
    shown:boolean;
    /**
     * Class Name of the component
     */
    className?:string;
    /**
     * Schedule records
     */
    records:Array<any>;
}> {
    readonly state = {
        shown:CaptureController.getState().Schedule.Shown,
        className:CaptureController.getState().Schedule.className,
        records:CaptureController.getState().Schedule.Records
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
     * Updates the state to match the capture controller
     */
    protected async updateCapture() {
        let changes:any = {
            shown:CaptureController.getState().Schedule.Shown,
            className:CaptureController.getState().Schedule.className
        };

        let records:Array<any>|undefined = CaptureController.getState().Schedule.Records;
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
     * Close controller listeners
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
            let max:number = 8;
            this.state.records.forEach((record, index) => {
                if(index < max) {
                    let tdate = new Date(Date.parse(record.BoutDate));
                    let sdate:string = tdate.toLocaleDateString('en-us', {
                        month:'2-digit',
                        day:'2-digit'
                    });
                    matches.push(
                        <div className="match" key={`${record.RecordType}-${record.RecordID}`}>
                            <div className="team-logo">
                                <img src={record.TeamA.Thumbnail} alt=""/>
                            </div>
                            <div className="date">
                                {sdate}
                            </div>
                            <div className="team-logo">
                                <img src={record.TeamB.Thumbnail} alt=""/>
                            </div>
                        </div>
                    );
                }
            });
        }

        return (
            <div className={cnames('capture-schedule', {
                shown:(this.state.shown && this.state.records && this.state.records.length)
            })}>
                <h1>Schedule</h1>
                <div className="matches">
                    {matches}
                </div>
            </div>
        );
    }
}