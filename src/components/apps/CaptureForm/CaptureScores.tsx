import React from 'react';
import cnames from 'classnames';
import { Unsubscribe } from 'redux';
import './css/CaptureScores.scss';
import ScoresCaptureController from 'controllers/capture/Scores';

/**
 * Displays a list of scores.
 */
class Scores extends React.PureComponent<{
    className:string;
    max:number;
}, {
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
        let shown:boolean = (this.state.Records && this.state.Records.length >= 1) ? this.state.Shown : false;
        return (
            <div className={cnames(this.props.className, {shown:(shown)})}>
                <h1>Scores</h1>
                <Matches matches={this.state.Records} max={this.props.max}/>
            </div>
        );
    }
}

export default function CaptureScores() {
    return <Scores className="capture-scores" max={6}/>;
};

export function ScoresBanner() {
    return <Scores className="scores-banner" max={4}/>;
};

function Matches(props:{matches:Array<any>, max:number}) {
    let matches:Array<React.ReactElement> = new Array<React.ReactElement>();
    props.matches.forEach((record, index) => {
        if(index < props.max) {
            let tdate = new Date(Date.parse(record.BoutDate));
            let sdate:string = tdate.toLocaleDateString('en-us', {
                month:'2-digit',
                day:'2-digit'
            });
            matches.push(
                <div className="match" key={`${record.RecordType}-${record.RecordID}`}>
                    <div className="date">{sdate}</div>
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

    return (<div className="matches">{matches}</div>);
}