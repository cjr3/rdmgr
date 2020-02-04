import React from 'react';
import APIScheduleController from 'controllers/api/Schedule';
import { Unsubscribe } from 'redux';
import APIMatchesController from 'controllers/api/Matches';
import Panel from 'components/Panel';
import { IconButton, IconLoop, IconHidden, IconShown } from 'components/Elements';
import './css/Schedule.scss';
import ScheduleCaptureController from 'controllers/capture/Schedule';

export default class SchedulePanel extends React.PureComponent<{
    opened:boolean;
}, {
    Records:Array<any>;
    Loading:boolean;
    Shown:boolean;
    error:string;
}> {
    readonly state = {
        Records:APIScheduleController.Get(),
        Loading:false,
        Shown:ScheduleCaptureController.GetState().Shown,
        error:''
    }

    protected remoteSchedule?:Unsubscribe;
    protected remoteCapture?:Unsubscribe;

    constructor(props) {
        super(props);
        this.updateSchedule = this.updateSchedule.bind(this);
        this.updateCapture = this.updateCapture.bind(this);
        this.load = this.load.bind(this);
    }

    protected updateSchedule() {
        this.setState({
            Records:APIScheduleController.Get(),
            Loading:false,
            error:''
        });
    }

    protected updateCapture() {
        this.setState({
            Shown:ScheduleCaptureController.GetState().Shown
        });
    }

    protected load() {
        this.setState({Loading:true,error:''}, () => {
            APIMatchesController.Load();
        });
    }

    componentDidMount() {
        this.remoteSchedule = APIMatchesController.Subscribe(this.updateSchedule);
        this.remoteCapture = ScheduleCaptureController.Subscribe(this.updateCapture);
    }

    componentWillUnmount() {
        if(this.remoteSchedule)
            this.remoteSchedule();
        if(this.remoteCapture)
            this.remoteCapture();
    }

    render() {
        let iconShown:string = IconHidden;
        if(this.state.Shown)
            iconShown = IconShown;

        let matches:Array<React.ReactElement> = new Array<React.ReactElement>();
        let buttons:Array<React.ReactElement> = new Array<React.ReactElement>(
            <IconButton
                src={iconShown}
                title="Show/Hide"
                onClick={ScheduleCaptureController.Toggle}
                active={this.state.Shown}
                key='btn-toggle'
                />,
            <IconButton
                src={IconLoop}
                title="Load"
                onClick={this.load}
                active={this.state.Loading}
                key='btn-load'
                />
        );

        this.state.Records.forEach(record => {
            matches.push(
                <MatchItem record={record} key={`${record.RecordType}-${record.RecordID}`}/>
            );
        });

        return (
            <Panel
                popup={true}
                title="Schedule"
                opened={this.props.opened}
                buttons={buttons}
                className="schedule"
                >
                <div className="matches">{matches}</div>
            </Panel>
        )
    }
}

class MatchItem extends React.PureComponent<{
    record:any;
}> {
    constructor(props) {
        super(props);
    }

    render() {
        let title:string = '';
        let teamALogo:string = '';
        let teamBLogo:string = '';
        let mdate:string = '';

        if(this.props.record) {
            if(this.props.record.Name)
                title = this.props.record.Name;
            if(this.props.record.TeamA && this.props.record.TeamA.Thumbnail)
                teamALogo = this.props.record.TeamA.Thumbnail;
            if(this.props.record.TeamB && this.props.record.TeamB.Thumbnail)
                teamBLogo = this.props.record.TeamB.Thumbnail;

            let tdate = new Date(Date.parse(this.props.record.BoutDate));
            mdate = tdate.toLocaleDateString('en-us', {
                month:'2-digit',
                day:'2-digit'
            });
        }

        return (
            <div className="match-item">
                <div className="team-a">
                    <img src={teamALogo} alt=""/>
                </div>
                <div className="date">{mdate}</div>
                <div className="team-b">
                    <img src={teamBLogo} alt=""/>
                </div>
            </div>
        )
    }
}