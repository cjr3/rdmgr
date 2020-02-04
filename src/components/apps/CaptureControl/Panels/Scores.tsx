import React from 'react';
import APIScoresController from 'controllers/api/Scores';
import ScoresCaptureController from 'controllers/capture/Scores';
import { Unsubscribe } from 'redux';
import Panel from 'components/Panel';
import { IconButton, IconHidden, IconShown, IconLoop } from 'components/Elements';
import './css/Scores.scss';

export default class ScoresPanel extends React.PureComponent<{
    opened:boolean;
}, {
    Records:Array<any>;
    Shown:boolean;
    Loading:boolean;
    error:string;
}> {
    readonly state = {
        Records:APIScoresController.Get(),
        Shown:ScoresCaptureController.GetState().Shown,
        Loading:false,
        error:''
    }

    protected remoteScores?:Unsubscribe;
    protected remoteCapture?:Unsubscribe;

    constructor(props) {
        super(props);
        this.updateScores = this.updateScores.bind(this);
        this.updateCapture = this.updateCapture.bind(this);
        this.load = this.load.bind(this);
    }

    protected updateScores() {
        this.setState({
            Records:APIScoresController.Get(),
            Loading:false,
            error:''
        });
    }

    protected updateCapture() {
        this.setState({
            Shown:ScoresCaptureController.GetState().Shown
        });
    }

    protected load() {
        this.setState({Loading:true,error:''}, () => {
            APIScoresController.Load();
        });
    }

    componentDidMount() {
        this.remoteCapture = ScoresCaptureController.Subscribe(this.updateCapture);
        this.remoteScores = APIScoresController.Subscribe(this.updateScores);
    }

    componentWillUnmount() {
        if(this.remoteScores)
            this.remoteScores();
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
                title="Show/hide"
                active={this.state.Shown}
                onClick={ScoresCaptureController.Toggle}
                key='btn-toggle'/>,
            <IconButton
                src={IconLoop}
                title="Load Records"
                active={this.state.Loading}
                onClick={this.load}
                key='btn-load'/>
        );

        let max:number = 6;
        this.state.Records.forEach((record, index) => {
            if(index < max) {
                matches.push(
                    <MatchItem record={record} key={`${record.RecordType}-${record.RecordID}`}/>
                );
            }
        });

        return (
            <Panel
                className="scores"
                opened={this.props.opened}
                popup={true}
                title="Latest Scores"
                contentName="matches"
                buttons={buttons}
            >
                {matches}
            </Panel>
        )
    }
}

class MatchItem extends React.PureComponent<{
    record:any;
}> {

    render() {
        let srcA:string = '';
        let srcB:string = '';
        let scoreA:number = 0;
        let scoreB:number = 0;

        //A
        if(this.props.record && this.props.record.TeamA) {
            if(this.props.record.TeamA.Score)
                scoreA = this.props.record.TeamA.Score;

            if(this.props.record.TeamA.Thumbnail)
                srcA = this.props.record.TeamA.Thumbnail;
        }

        //B
        if(this.props.record && this.props.record.TeamB) {
            if(this.props.record.TeamB.Score)
                scoreB = this.props.record.TeamB.Score;

            if(this.props.record.TeamB.Thumbnail)
                srcB = this.props.record.TeamB.Thumbnail;
        }

        return (
            <div className="match-item">
                <div className="team-a">
                    <div className="thumbnail">
                        <img src={srcA} alt=""/>
                    </div>
                    <div className="score">
                        {scoreA}
                    </div>
                </div>
                <div className="team-b">
                    <div className="score">
                        {scoreB}
                    </div>
                    <div className="thumbnail">
                        <img src={srcB} alt=""/>
                    </div>
                </div>
            </div>
        )
    }
}