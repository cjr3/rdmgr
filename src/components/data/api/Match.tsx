import React from 'react';
import cnames from 'classnames';
import Panel, {PPanelProps} from 'components/Panel';
import { TeamRecord, MatchRecord, BoutRecord } from 'controllers/api/vars';
import { Unsubscribe } from 'redux';
import APITeamsController from 'controllers/api/Teams';
import { IconButton, IconLoop, ToggleButton } from 'components/Elements';
import RecordsPanel, { TeamSelect, SeasonSelect, BoutsSelect } from './RecordPanel';
import APIMatchesController from 'controllers/api/Matches';
import RecordList from '../RecordList';
import { Compare } from 'controllers/functions';
import APIBoutsController from 'controllers/api/Bouts';

interface RDMGRMatchProperties extends PPanelProps {
    record?:MatchRecord|null;
    onSave:Function;
    onCancel:Function;
}

export default class RDMGRMatchPanel extends React.PureComponent<RDMGRMatchProperties, {
    BoutID:number;
    TeamAID:number;
    TeamAScore:number;
    TeamBID:number;
    TeamBScore:number;
    StartHour:number;
    StartMinute:number;
    EndHour:number;
    EndMinute:number;
    Bouts:Array<BoutRecord>;
}> {
    readonly state = {
        BoutID:0,
        TeamAID:0,
        TeamAScore:0,
        TeamBID:0,
        TeamBScore:0,
        StartHour:6,
        StartMinute:0,
        EndHour:0,
        EndMinute:0,
        Bouts:APIBoutsController.Get()
    }

    protected remoteBouts?:Unsubscribe;

    constructor(props) {
        super(props);
        this.onLoad = this.onLoad.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onChangeBoutID = this.onChangeBoutID.bind(this);
        this.onChangeEndHour = this.onChangeEndHour.bind(this);
        this.onChangeEndMinute = this.onChangeEndMinute.bind(this);
        this.onChangeStartHour = this.onChangeStartHour.bind(this);
        this.onChangeStartMinute = this.onChangeStartMinute.bind(this);
        this.onChangeTeamA = this.onChangeTeamA.bind(this);
        this.onChangeTeamAScore = this.onChangeTeamAScore.bind(this);
        this.onChangeTeamB = this.onChangeTeamB.bind(this);
        this.onChangeTeamBScore =this.onChangeTeamBScore.bind(this);
        this.updateBouts = this.updateBouts.bind(this);
    }

    protected updateBouts() {
        this.setState({Bouts:APIBoutsController.Get()});
    }

    protected onChangeBoutID(ev: React.ChangeEvent<HTMLSelectElement>) {
        let value:number = parseInt(ev.currentTarget.value);
        this.setState({BoutID:value});
    }

    protected onChangeTeamAScore(ev: React.ChangeEvent<HTMLInputElement>) {
        let value:number = parseInt(ev.currentTarget.value);
        this.setState({TeamAScore:value});
    }

    protected onChangeTeamBScore(ev: React.ChangeEvent<HTMLInputElement>) {
        let value:number = parseInt(ev.currentTarget.value);
        this.setState({TeamBScore:value});
    }

    protected onChangeTeamA(value:string|number) {
        if(typeof(value) === 'string')
            this.setState({TeamAID:parseInt(value)});
        else
            this.setState({TeamAID:value});
    }

    protected onChangeTeamB(value:string|number) {
        if(typeof(value) === 'string')
            this.setState({TeamBID:parseInt(value)});
        else
            this.setState({TeamBID:value});
    }

    protected onChangeStartHour(ev: React.ChangeEvent<HTMLInputElement>) {
        let value:number = parseInt(ev.currentTarget.value);
        this.setState({StartHour:value});
    }

    protected onChangeStartMinute(ev: React.ChangeEvent<HTMLInputElement>) {
        let value:number = parseInt(ev.currentTarget.value);
        this.setState({StartMinute:value});
    }
    
    protected onChangeEndHour(ev: React.ChangeEvent<HTMLInputElement>) {
        let value:number = parseInt(ev.currentTarget.value);
        this.setState({EndHour:value});
    }

    protected onChangeEndMinute(ev: React.ChangeEvent<HTMLInputElement>) {
        let value:number = parseInt(ev.currentTarget.value);
        this.setState({EndMinute:value});
    }

    protected onSubmit() {
        let record:MatchRecord = APIMatchesController.NewRecord();
        if(this.props.record)
            record.RecordID = this.props.record.RecordID;
        record.BoutID = this.state.BoutID;
        record.StartTime = this.getTimeString(this.state.StartHour, this.state.StartMinute);
        record.EndTime = this.getTimeString(this.state.EndHour, this.state.EndMinute);
        record.TeamA.ID = this.state.TeamAID;
        record.TeamA.Score = this.state.TeamAScore;
        record.TeamB.ID = this.state.TeamBID;
        record.TeamB.Score = this.state.TeamBScore;
        return record;
    }

    protected onLoad(record:MatchRecord) {
        if(!record)
            return;

        let startHour:number = 6;
        let startMinute:number = 0;
        let endHour:number = 8;
        let endMinute:number = 0;

        if(record.StartTime) {
            let parts = record.StartTime.split(':');
            if(typeof(parts[0]) == 'string')
                startHour = parseInt(parts[0]);
            if(typeof(parts[1]) == 'string')
                startMinute = parseInt(parts[1]);
        }

        if(record.EndTime) {
            let parts = record.EndTime.split(':');
            if(typeof(parts[0]) == 'string')
                endHour = parseInt(parts[0]);
            if(typeof(parts[1]) == 'string')
                endMinute = parseInt(parts[1]);
        }
        
        this.setState({
            BoutID:record.BoutID,
            TeamAID:record.TeamA.ID,
            TeamAScore:record.TeamA.Score,
            TeamBID:record.TeamB.ID,
            TeamBScore:record.TeamB.Score,
            StartHour:startHour,
            StartMinute:startMinute,
            EndHour:endHour,
            EndMinute:endMinute
        });
    }

    protected getTimeString(hour:number, minute:number) {
        return hour.toString().padStart(2,'0') + ":" + minute.toString().padStart(2,'0') + ":00";
    }

    componentDidUpdate(prevProps) {
        if(!Compare(prevProps.record, this.props.record)) {
            if(this.props.record) {
                this.onLoad(this.props.record);
            } else {
                this.setState(APIMatchesController.NewRecord());
            }
        }
    }

    componentDidMount() {
        this.remoteBouts = APIBoutsController.Subscribe(this.updateBouts);
    }

    componentWillUnmount() {
        if(this.remoteBouts)
            this.remoteBouts();
    }

    render() {
        let id:number = 0;
        let aid:number = (this.state.TeamAID) ? this.state.TeamAID : 0;
        let bid:number = (this.state.TeamBID) ? this.state.TeamBID : 0;
        let ascore:number = (this.state.TeamAScore) ? this.state.TeamAScore : 0;
        let bscore:number = (this.state.TeamBScore) ? this.state.TeamBScore : 0;

        let bouts:Array<React.ReactElement> = new Array<React.ReactElement>(
            <option value={0} key='def'></option>
        );

        this.state.Bouts.forEach((bout:BoutRecord) => {
            let tdate = new Date(bout.BoutDate);
            if(tdate && tdate.getFullYear) {
                let sdate = (tdate.getMonth()+1).toString().padStart(2,'0') + "/" 
                    + tdate.getDate().toString().padStart(2,'0') + "/" + tdate.getFullYear();
                bouts.push(
                    <option value={bout.RecordID} key={`${bout.RecordType}-${bout.RecordID}`}>
                        {sdate}
                    </option>
                );
            }
        });

        if(this.props.record)
            id = this.props.record.RecordID;

        let title:string = 'New Match Record';
        if(id > 0)
            title = `Match (Record #${id})`;

        return (
            <RecordsPanel
                {...this.props}
                controller={APIMatchesController}
                onLoad={this.onLoad}
                RecordID={id}
                className={cnames("rdmgr-match-panel", this.props.className)}
                contentName={cnames('record-form rdmgr-match', this.props.contentName)}
                onCancel={(record) => {
                    this.onLoad(record);
                    this.props.onCancel();
                }}
                onSave={(record) => {
                    this.onLoad(record);
                    this.props.onSave();
                }}
                onSubmit={this.onSubmit}
                >
                <h3>{title}</h3>
                <div className="form-section">
                    <table cellPadding={3}>
                        <tbody>
                            <tr>
                                <td style={{width:"150px"}}>Date</td>
                                <td>
                                    <select size={1}
                                        value={this.state.BoutID}
                                        onChange={this.onChangeBoutID}>{bouts}</select>
                                </td>
                            </tr>
                            <tr>
                                <td>Start Time</td>
                                <td>
                                    <input type="number" min={0} max={23}
                                        value={this.state.StartHour}
                                        onChange={this.onChangeStartHour}/> : 
                                    <input type="number" min={0} max={55} step={5}
                                        value={this.state.StartMinute}
                                        onChange={this.onChangeStartMinute}/>
                                </td>
                            </tr>
                            <tr>
                                <td>End Time</td>
                                <td>
                                    <input type="number" min={0} max={23}
                                        value={this.state.EndHour}
                                        onChange={this.onChangeEndHour}/> : 
                                    <input type="number" min={0} max={55} step={5}
                                        value={this.state.EndMinute}
                                        onChange={this.onChangeEndMinute}/>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="stack-panel s2 form-section">
                    <div className="team">
                        <div className="stack-panel">
                            <div className="form-caption">Score</div>
                            <div className="form-entry">
                                <input type="number" value={ascore} onChange={this.onChangeTeamAScore} min={0} max={999}/>
                            </div>
                        </div>
                        <TeamSelect value={aid} onChange={this.onChangeTeamA}/>
                    </div>
                    <div className="team">
                        <div className="stack-panel">
                            <div className="form-caption">Score</div>
                            <div className="form-entry">
                                <input type="number" value={bscore} onChange={this.onChangeTeamBScore} min={0} max={999}/>
                            </div>
                        </div>
                        <TeamSelect value={bid} onChange={this.onChangeTeamB}/>
                    </div>
                </div>
            </RecordsPanel>
        )
    }
}

export class RDMGRMatchList extends React.PureComponent<{
    shown:boolean;
    record?:MatchRecord|null;
    onSelect:Function;
    keywords?:string;
}, {
    Records:Array<MatchRecord>;
}> {
    readonly state = {
        Records:APIMatchesController.Get()
    }

    protected remoteMatches?:Unsubscribe;

    constructor(props) {
        super(props);
        this.updateMatches = this.updateMatches.bind(this);
    }

    protected updateMatches() {
        this.setState({Records:APIMatchesController.Get()});
    }

    componentDidMount() {
        this.remoteMatches = APIMatchesController.Subscribe(this.updateMatches);
    }

    componentWillUnmount() {
        if(this.remoteMatches)
            this.remoteMatches();
    }

    render() {
        return (
            <RecordList
                keywords={this.props.keywords}
                className={(this.props.shown) ? 'shown match-list' : 'match-list'}
                onSelect={this.props.onSelect}
                recordid={(this.props.record) ? this.props.record.RecordID : 0}
                records={this.state.Records}
                />
        )
    }
}