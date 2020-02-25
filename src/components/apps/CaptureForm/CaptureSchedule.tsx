import React from 'react';
import cnames from 'classnames';
import { Unsubscribe } from 'redux';
import './css/CaptureSchedule.scss';
import ScheduleCaptureController from 'controllers/capture/Schedule';

/**
 * Component for displaying the bout schedule
 */
class Schedule extends React.PureComponent<{
    className:string;
}, {
    /**
     * Determines if this component is shown or not
     */
    Shown:boolean;
    /**
     * Class Name of the component
     */
    className?:string;
    /**
     * Schedule records
     */
    Records:Array<any>;
}> {
    readonly state = {
        Shown:ScheduleCaptureController.GetState().Shown,
        className:ScheduleCaptureController.GetState().className,
        Records:ScheduleCaptureController.Get()
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
    protected updateCapture() {
        this.setState({
            Shown:ScheduleCaptureController.GetState().Shown,
            className:ScheduleCaptureController.GetState().className,
            Records:ScheduleCaptureController.Get()
        });
    }

    /**
     * Listen to controllers
     */
    componentDidMount() {
        this.remoteCapture = ScheduleCaptureController.Subscribe(this.updateCapture);
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
        let shown:boolean = (this.state.Records && this.state.Records.length) ? this.state.Shown : false;
        return (
            <div className={cnames(this.props.className, {shown:(shown)})}>
                <h1>Schedule</h1>
                <Matches matches={this.state.Records} max={8}/>
            </div>
        );
    }
}

export default function CaptureSchedule() {
    return <Schedule className="capture-schedule"/>;
};

export function ScheduleBanner() {
    return <Schedule className="schedule-banner"/>
};

function Matches(props:{matches:Array<any>, max:number}) {
    let matches:Array<React.ReactElement> = new Array<React.ReactElement>();
    props.matches.forEach((record:any, index) => {
        if(index < props.max) {
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

    return (<div className="matches">{matches}</div>);
}