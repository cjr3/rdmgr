import React from 'react';
import cnames from 'classnames';
import { Unsubscribe } from 'redux';
import './css/CaptureScores.scss';
import ScoresCaptureController from 'controllers/capture/Scores';

/**
 * Displays a list of scores.
 */
export default class CaptureScores extends React.PureComponent<any, {
    /**
     * Determines if the component is shown or not
     */
    Shown:boolean;
    /**
     * The className of the component
     */
    className?:string;
    /**
     * Score records
     */
    Records:Array<any>;
}> {
    readonly state = {
        Shown:ScoresCaptureController.GetState().Shown,
        className:ScoresCaptureController.GetState().className,
        Records:ScoresCaptureController.Get()
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
    protected updateCapture() {
        this.setState({
            Shown:ScoresCaptureController.GetState().Shown,
            className:ScoresCaptureController.GetState().className,
            Records:ScoresCaptureController.Get()
        });
    }

    /**
     * Listen to controllers
     */
    componentDidMount() {
        this.remoteCapture = ScoresCaptureController.Subscribe(this.updateCapture);
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
        let shown:boolean = false;
        if(this.state.Records && this.state.Records.length >= 1) {
            let max:number = 4;
            shown = this.state.Shown;
            this.state.Records.forEach((record, index) => {
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
            <div className={cnames('capture-scores', {shown:(shown)})}>
                <h1>Latest Scores</h1>
                <div className="matches">
                    {matches}
                </div>
            </div>
        );
    }
}