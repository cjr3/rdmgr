import React from 'react';
import StandingsCaptureController from 'controllers/capture/Standings';
import APIStandingsController from 'controllers/api/Standings';
import { Unsubscribe } from 'redux';
import Panel from 'components/Panel';
import { IconHidden, IconShown, IconButton, IconLoop } from 'components/Elements';
import './css/Standings.scss';

export default class StandingsPanel extends React.PureComponent<{
    opened:boolean;
    onClose:Function;
}, {
    Shown:boolean;
    Records:Array<any>;
    Loading:boolean;
}> {
    readonly state = {
        Shown:StandingsCaptureController.GetState().Shown,
        Records:APIStandingsController.Get(),
        Loading:false
    }

    protected remoteStandings?:Unsubscribe;
    protected remoteCapture?:Unsubscribe;

    constructor(props) {
        super(props);
        this.updateCapture = this.updateCapture.bind(this);
        this.updateStandings = this.updateStandings.bind(this);
        this.onClickLoad = this.onClickLoad.bind(this);
    }

    protected updateStandings() {
        this.setState({
            Records:APIStandingsController.Get()
        });
    }

    protected updateCapture() {
        this.setState({
            Shown:StandingsCaptureController.GetState().Shown
        });
    }

    protected onClickLoad() {
        this.setState({
            Loading:true
        }, () => {
            APIStandingsController.Load().then(() => {
                this.setState({Loading:false});
            }).catch(() => {
                this.setState({Loading:false});
            });
        });
    }

    componentDidMount() {
        this.remoteCapture = StandingsCaptureController.Subscribe(this.updateCapture);
        this.remoteStandings = APIStandingsController.Subscribe(this.updateStandings);
    }

    componentWillUnmount() {
        if(this.remoteCapture)
            this.remoteCapture();
        if(this.remoteStandings)
            this.remoteStandings();
    }
    
    render() {
        let iconShown:string = IconHidden;
        if(this.state.Shown)
            iconShown = IconShown;
        const teams:Array<React.ReactElement> = new Array<React.ReactElement>();
        const records:Array<any> = this.state.Records;
        const buttons:Array<React.ReactElement> = new Array<React.ReactElement>(
            <IconButton
                key="btn-toggle"
                src={iconShown}
                active={this.state.Shown}
                onClick={StandingsCaptureController.Toggle}
                />,
            <IconButton
                key="btn-load"
                src={IconLoop}
                active={this.state.Loading}
                onClick={this.onClickLoad}
            />
        );

        if(records && Array.isArray(records)) {
            records.forEach((team) => {
                teams.push(<TeamItem team={team} key={`${team.RecordType}-${team.RecordID}`}/>);
            });
        }

        return (
            <Panel
                popup={true}
                title="Standings"
                opened={this.props.opened}
                className="standings"
                onClose={this.props.onClose}
                buttons={buttons}
                >
                <div className="records">{teams}</div>
            </Panel>
        )
    }
}

function TeamItem(props:{team:any}) {
    let logo:string = '';
    let winloss:string = '';
    let place:string = '';
    let points:string = '';

    if(props.team && props.team.Position && props.team.RecordType && props.team.RecordID) {
        place = props.team.Position;
        winloss = `${props.team.Wins}-${props.team.Losses}`;
        points = props.team.Points;
        if(props.team.Thumbnail)
            logo = props.team.Thumbnail;

        return (
            <div className="record">
                <div className="logo">
                    <img src={logo} alt=""/>
                </div>
                <div className="place">{place}</div>
                <div className="winloss">{winloss}</div>
                <div className="pts">{points}</div>
            </div>
        );
        
    } else {
        return null;
    }
}