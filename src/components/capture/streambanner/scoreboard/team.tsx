import classNames from 'classnames';
import React from 'react';
import { Unsubscribe } from 'redux';
import { Capture } from 'tools/capture/functions';
import Data from 'tools/data';
import { Scoreboard } from 'tools/scoreboard/functions';
import { Scorekeeper } from 'tools/scorekeeper/functions';
import { Skaters } from 'tools/skaters/functions';
import { ScoreboardTeamStatus, TeamSide } from 'tools/vars';

interface Props extends React.HTMLProps<HTMLDivElement> {
    side:TeamSide;
}

interface State {
    color:string;
    logo:string;
    score:number;
    status:ScoreboardTeamStatus;
    statusColor:string;
    timeouts:number;
}

class Main extends React.PureComponent<Props, State> {
    readonly state:State = {
        color:'',
        logo:'',
        score:0,
        status:ScoreboardTeamStatus.NORMAL,
        statusColor:'',
        timeouts:0
    }

    protected remote?:Unsubscribe;

    protected update = () => {
        const state = Scoreboard.GetState();
        let scolor = this.state.statusColor;
        if(this.props.side === 'A') {
            if(state.TeamA?.Status !== ScoreboardTeamStatus.NORMAL)
                scolor = Scoreboard.GetTeamStatusColor(this.props.side)
        } else {
            if(state.TeamB?.Status !== ScoreboardTeamStatus.NORMAL)
                scolor = Scoreboard.GetTeamStatusColor(this.props.side)
        }
        this.setState({
            color:((this.props.side === 'A') ? state.TeamA?.Color : state.TeamB?.Color) || '',
            logo:((this.props.side === 'A') ? state.TeamA?.ScoreboardThumbnail : state.TeamB?.ScoreboardThumbnail) || '',
            score:((this.props.side === 'A') ? state.TeamA?.Score : state.TeamB?.Score) || 0,
            status:((this.props.side === 'A') ? state.TeamA?.Status : state.TeamB?.Status) || ScoreboardTeamStatus.NORMAL,
            statusColor:scolor,
            timeouts:((this.props.side === 'A') ? state.TeamA?.Timeouts : state.TeamB?.Timeouts) || 0,
        });
    }

    componentDidMount() {
        this.update();
        this.remote = Scoreboard.Subscribe(this.update);
    }

    componentWillUnmount() {
        if(this.remote)
            this.remote();
    }

    render() {
        const style:React.CSSProperties = {};
        const statusStyle:React.CSSProperties = {
            backgroundColor:this.state.statusColor
        };

        const timeouts:number[] = [];
        for(let i=0; i < this.state.timeouts; i++)
            timeouts.push(i);

        if(!this.state.logo) {
            style.backgroundImage = 'linear-gradient(' + this.state.color + ', rgba(0,0,0,0))';
        }
        return <div className={classNames('team', 'team-' + this.props.side)} style={style}>
            {
                (this.state.logo && this.state.logo.length > 0) &&
                <div className='logo'>
                    <img src={Data.GetMediaPath(this.state.logo)} alt=''/>
                </div>
            }
            <div className='score'>
                <span className='value'>{this.state.score}</span>
            </div>
            <div className={classNames('status', {active:this.state.status !== ScoreboardTeamStatus.NORMAL})} style={statusStyle}></div>
            <div className='timeouts'>
                {
                    timeouts.map((t, i) => {
                        return <div className='timeout' key={`timeout-${t}-${i}`}></div>
                    })
                }
            </div>
            <JammerIcon side={this.props.side}/>
        </div>
    }
}

const JammerIcon:React.FunctionComponent<{side:TeamSide}> = props => {
    const [active, setActive] = React.useState(false);
    const [thumbnail, setThumbnail] = React.useState('');
    const [num, setNumber] = React.useState('');

    React.useEffect(() => {
        return Scorekeeper.Subscribe(() => {
            const record = Scorekeeper.GetSkater(props.side, 'Track', 'Jammer');
            const skater = Skaters.Get(record?.RecordID);
            const team = (props.side === 'A') ? Scoreboard.GetState().TeamA : Scoreboard.GetState().TeamB;
            if(record && record.RecordID) {
                setThumbnail(skater?.Thumbnail || record?.Thumbnail || team?.Logo || '');
                setNumber(skater?.Number || record.Number || '');
                setActive(Capture.GetScorekeeper().visible || false);
            } else {
                setActive(false);
            }
        });
    }, []);

    React.useEffect(() => {
        return Capture.Subscribe(() => {
            setActive(Capture.GetScorekeeper().visible || false);
        });
    }, []);

    return <div className={classNames('jammer', {active:active})}>
        {
            (thumbnail && thumbnail.length > 0) &&
            <img src={Data.GetMediaPath(thumbnail)} alt=''/>
        }
        <span className='num'>{num}</span>
    </div>
}

export {Main as Team};