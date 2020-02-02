import React from 'react';
import cnames from 'classnames';
import { Unsubscribe } from 'redux';
import './css/CaptureStandings.scss';
import StandingsCaptureController from 'controllers/capture/Standings';
import DataController from 'controllers/DataController';
import { AddMediaPath } from 'controllers/functions';

/**
 * Displays the standings
 */
export default class CaptureStandings extends React.PureComponent<any, {
    /**
     * Determines if the component is shown or not
     */
    Shown:boolean;
    /**
     * className of component
     */
    className?:string;
    /**
     * Standing records
     */
    Records:Array<any>;
    LeagueLogo:string;
}> {
    readonly state = {
        Shown:StandingsCaptureController.GetState().Shown,
        className:StandingsCaptureController.GetState().className,
        Records:StandingsCaptureController.Get(),
        LeagueLogo:DataController.GetMiscRecord('LeagueLogo')
    }

    protected remoteCapture?:Unsubscribe;
    protected remoteData?:Unsubscribe;

    /**
     * Constructor
     * @param props 
     */
    constructor(props) {
        super(props);
        this.updateCapture = this.updateCapture.bind(this);
        this.updateData = this.updateData.bind(this);
    }

    /**
     * Updates the state to match the CaptureController
     */
    protected updateCapture() {
        this.setState({
            Shown:StandingsCaptureController.GetState().Shown,
            className:StandingsCaptureController.GetState().className,
            Records:StandingsCaptureController.Get()
        });
    }

    protected updateData() {
        this.setState({
            LeagueLogo:DataController.GetMiscRecord('LeagueLogo')
        });
    }

    /**
     * Listen to controllers
     */
    componentDidMount() {
        this.remoteCapture = StandingsCaptureController.Subscribe(this.updateCapture);
        this.remoteData = DataController.Subscribe(this.updateData);
    }

    /**
     * Close listeners
     */
    componentWillUnmount() {
        if(this.remoteCapture)
            this.remoteCapture();
        if(this.remoteData)
            this.remoteData();
    }

    /**
     * Renders the component
     */
    render() {
        let teams:Array<React.ReactElement> = new Array<React.ReactElement>();
        let shown:boolean = false;
        let logo:string = '';
        if(this.state.LeagueLogo)
            logo = AddMediaPath(this.state.LeagueLogo);
        if(this.state.Records && this.state.Records.length >= 1) {
            shown = this.state.Shown;
            let max:number = 8;
            this.state.Records.forEach((record, index) => {
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
            <div className={cnames('capture-standings', {shown:(shown)})}>
                <h1>Standings</h1>
                <div className="standings">
                    <div className="team" key="standings-header">
                        <div className="logo">
                            <img src={logo} alt=""/>
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