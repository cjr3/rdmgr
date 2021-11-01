import { IconCheck, IconNo } from 'components/common/icons';
import { TeamSelector } from 'components/common/inputs/selectors';
import { Panel, PanelContent, PanelFooter, PanelTitle } from 'components/common/panel';
import React from 'react';
import Data from 'tools/data';
import { MainController } from 'tools/MainController';
import { Scoreboard } from 'tools/scoreboard/functions';
import { Teams } from 'tools/teams/functions';
import { Team } from 'tools/vars';

interface Props {
    active:boolean;
    onHide:{():void};
}

const TeamsPanel:React.FunctionComponent<Props> = props => {
    const [teamA, setTeamAID] = React.useState(Scoreboard.GetState().TeamA?.ID || 0);
    const [teamB, setTeamBID] = React.useState(Scoreboard.GetState().TeamB?.ID || 0);
    const [reset, setReset] = React.useState(false);
    const onClickSubmit = React.useCallback(() => {
        const a = Teams.Get(teamA);
        const b = Teams.Get(teamB);
        const config = Scoreboard.GetConfig();
        const timeouts = typeof(config.MaxTeamTimeouts) === 'number' ? config.MaxTeamTimeouts : 2;
        const challenges = typeof(config.MaxTeamChallenges) === 'number' ? config.MaxTeamChallenges : 1
        if(a && b) {
            Scoreboard.SetTeam('A', a, reset ? {
                Score:0,
                Timeouts:timeouts,
                Challenges:challenges,
                JamPoints:0
            } : undefined);
            Scoreboard.SetTeam('B', b, reset ? {
                Score:0,
                Timeouts:timeouts,
                Challenges:challenges,
                JamPoints:0
            } : undefined);

            if(reset) {
                Scoreboard.Reset()
            }

            props.onHide();
        }
    }, [props.onHide, teamA, teamB, reset]);

    return <Panel
        active={props.active}
        onHide={props.onHide}
    >
        <PanelTitle onHide={props.onHide}>Set Teams</PanelTitle>
        <PanelContent>
            <div className='grid-5050'>
                <TeamItem id={teamA} onChange={setTeamAID}/>
                <TeamItem id={teamB} onChange={setTeamBID}/>
            </div>
        </PanelContent>
        <PanelFooter>
            {
                (reset) &&
                <IconCheck onClick={() => {setReset(false)}} active={true}>Reset</IconCheck>
            }
            {
                (!reset) &&
                <IconNo onClick={() => {setReset(true)}}>Reset</IconNo>
            }
            <button onClick={onClickSubmit}>Submit</button>
            <button onClick={props.onHide}>Cancel</button>
        </PanelFooter>
    </Panel>
};

const TeamItem:React.FunctionComponent<{
    id:number;
    onChange:{(id:number):void};
}> = props => {
    const [logo, setLogo] = React.useState('');
    const onSelectTeam = (record?:Team) => {
        props.onChange(record?.RecordID || 0);
    };

    const next = (ev:React.MouseEvent<HTMLDivElement>) => {
        ev.stopPropagation();
        ev.preventDefault();
        const teams = Object.values(MainController.GetState().Teams);
        let index = teams.findIndex(r => r.RecordID === props.id);
        index++;
        if(index >= teams.length)
            index = 0;
        if(teams[index])
            props.onChange(teams[index].RecordID || 0);
    };

    const prev = (ev:React.MouseEvent<HTMLDivElement>) => {
        ev.stopPropagation();
        ev.preventDefault();
        const teams = Object.values(MainController.GetState().Teams);
        let index = teams.findIndex(r => r.RecordID === props.id);
        index--;
        if(index < 0)
            index = teams.length - 1;
        if(teams[index])
            props.onChange(teams[index].RecordID || 0);
    }

    React.useEffect(() => {
        const team = Teams.Get(props.id);
        setLogo(team?.Thumbnail || '');
    }, [props.id]);

    return <div style={{userSelect:'none'}}>
        <div>
            <TeamSelector value={props.id} onSelectValue={onSelectTeam}/>
        </div>
        <div className='thumbnail text-center' onClick={next} onContextMenu={prev} style={{width:'100%',cursor:'pointer'}}>
            {
                (logo && logo.length > 0) &&
                <img src={Data.GetMediaPath(logo)} alt=''/>
            }
        </div>
    </div>
}

export {TeamsPanel};