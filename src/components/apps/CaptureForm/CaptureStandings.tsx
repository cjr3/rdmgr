import React from 'react';
import cnames from 'classnames';
import { Unsubscribe } from 'redux';
import './css/CaptureStandings.scss';
import { IconLeague } from 'components/Elements';
import StandingsCaptureController from 'controllers/capture/Standings';

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
}> {
    readonly state = {
        Shown:StandingsCaptureController.GetState().Shown,
        className:StandingsCaptureController.GetState().className,
        Records:StandingsCaptureController.Get()
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
    protected updateCapture() {
        this.setState({
            Shown:StandingsCaptureController.GetState().Shown,
            className:StandingsCaptureController.GetState().className,
            Records:StandingsCaptureController.Get()
        });
    }

    /**
     * Listen to controllers
     */
    componentDidMount() {
        this.remoteCapture = StandingsCaptureController.Subscribe(this.updateCapture);
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
        let shown:boolean = false;
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