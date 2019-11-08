import React from 'react';
import CaptureController from 'controllers/CaptureController';
import cnames from 'classnames';
import { Unsubscribe } from 'redux';
import DataController from 'controllers/DataController';
import './css/CaptureStandings.scss';
import { IconLeague } from 'components/Elements';

/**
 * Displays the standings
 */
export default class CaptureStandings extends React.PureComponent<any, {
    /**
     * Determines if the component is shown or not
     */
    shown:boolean;
    /**
     * className of component
     */
    className?:string;
    /**
     * Standing records
     */
    records:Array<any>;
}> {
    readonly state = {
        shown:CaptureController.getState().Standings.Shown,
        className:CaptureController.getState().Standings.className,
        records:CaptureController.getState().Standings.Records
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
     * Updates the state to match the CaptureController
     */
    protected async updateCapture() {
        let changes:any = {
            shown:CaptureController.getState().Standings.Shown,
            className:CaptureController.getState().Standings.className
        };

        let records:Array<any>|undefined = CaptureController.getState().Standings.Records;
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
        let teams:Array<React.ReactElement> = new Array<React.ReactElement>();
        if(this.state.records) {
            let max:number = 8;
            this.state.records.forEach((record, index) => {
                if(index < max) {
                    teams.push(
                        <div className="team" key={`${record.RecordType}-${record.RecordID}`}>
                            <div className="logo">
                                <img src={record.Thumbnail} alt=""/>
                            </div>
                            <div className="standing">{record.Position}</div>
                            <div className="win-loss">{record.Wins} - {record.Losses}</div>
                            <div className="points">{record.Points}</div>
                        </div>
                    );
                }
            });
        }

        return (
            <div className={cnames('capture-standings', {
                shown:(this.state.shown && this.state.records && this.state.records.length)
            })}>
                <h1>Standings</h1>
                <div className="standings">
                    <div className="team" key="standings-header">
                        <div className="logo">
                            <img src={IconLeague} alt=""/>
                        </div>
                        <div className="standing">#</div>
                        <div className="win-loss">W-L</div>
                        <div className="points">Pts</div>
                    </div>
                    {teams}
                </div>
            </div>
        );
    }
}