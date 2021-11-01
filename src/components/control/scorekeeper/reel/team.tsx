import React from 'react';
import { Roster } from 'tools/roster/functions';
import { Scoreboard } from 'tools/scoreboard/functions';
import { UIController } from 'tools/UIController';
import { SkaterRoster, TeamSide } from 'tools/vars';
import { Skater } from './skater';

interface Props extends React.HTMLProps<HTMLDivElement> {
    side:TeamSide;
}

/**
 * 
 * @param props 
 * @returns 
 */
const Team:React.FunctionComponent<Props> = props => {
    const {side, ...rprops} = {...props};
    const scoreboard = Scoreboard.GetState();
    const ui = UIController.GetState().ScorekeeperReel;
    const [color, setColor] = React.useState(side === 'A' ? scoreboard.TeamA?.Color || '' : scoreboard.TeamB?.Color || '');
    const [teamLogo, setTeamLogo] = React.useState((side === 'A' ? scoreboard.TeamA?.Logo : scoreboard.TeamB?.Logo) || '');
    const [records, setRecords] = React.useState(Roster.GetSkaters(side).filter(r => r.Number));
    const [index, setIndex] = React.useState(side === 'A' ? (typeof(ui.indexA) === 'number' ? ui.indexA : -1) : (typeof(ui.indexB) === 'number' ? ui.indexB : -1));
    const [skaterId, setSkaterID] = React.useState(side === 'A' ? (typeof(ui.skaterA) === 'number' ? ui.skaterA : -1) : (typeof(ui.skaterB) === 'number' ? ui.skaterB : -1))

    React.useEffect(() => Scoreboard.Subscribe(() => {
        const state = Scoreboard.GetState();
        setColor(side === 'A' ? state.TeamA?.Color || '' : state.TeamB?.Color || '');
        setTeamLogo((side === 'A' ? scoreboard.TeamA?.Logo : scoreboard.TeamB?.Logo) || '');
    }), [side]);

    React.useEffect(() => Roster.Subscribe(() => {
        setRecords(Roster.GetSkaters(side).filter(r => r.Number));
    }), [side]);

    React.useEffect(() => UIController.Subscribe(() => {
        const ui = UIController.GetState().ScorekeeperReel;
        setIndex(side === 'A' ? (typeof(ui.indexA) === 'number' ? ui.indexA : -1) : (typeof(ui.indexB) === 'number' ? ui.indexB : -1));
        setSkaterID(side === 'A' ? (typeof(ui.skaterA) === 'number' ? ui.skaterA : -1) : (typeof(ui.skaterB) === 'number' ? ui.skaterB : -1));
    }), [side]);

    let name = 'No Jammer';
    if(index >= 0 && index < records.length && records[index]) {
        const record = records[index];
        if(record.Number && record.Name) {
            name = '#' + record.Number + ' ' + record.Name;
        } else if(record.Name) {
            name = record.Name;
        } else if(record.Number) {
            name = '#' + record.Number;
        }
    }

    let subset:SkaterRoster[] = [];
    if(records.length > 3) {
        if(index <= 0) {
            subset.push(records[records.length - 1]);
            subset.push(records[0]);
            subset.push(records[1]);
        } else if((index+1) >= records.length) {
            subset.push(records[records.length-2]);
            subset.push(records[records.length-1]);
            subset.push(records[0]);
        } else {
            subset.push(records[index-1]);
            subset.push(records[index]);
            subset.push(records[index+1]);
        }
    } else {
        subset = records;
    }

    return <div {...rprops} className={'team team-' + side}>
        <div className='name' style={{
            backgroundColor:color
        }}>{name}</div>
        <div className='skaters'>
            <Skater active={index === -1} color={color} num={''} thumbnail={teamLogo}/>
            {
                subset.map((record, rindex) => {
                    return <Skater
                        active={record.RecordID === skaterId}
                        color={color}
                        num={record.Number || ''}
                        thumbnail={record.Thumbnail || ''}
                        key={`record-${record.RecordID}-${rindex}`}
                    />;
                })
            }
        </div>
    </div>
};

export {Team};