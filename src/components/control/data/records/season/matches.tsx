import { Match, Team } from 'tools/vars';
import React from 'react';
import { TeamSelector } from 'components/common/inputs/selectors';
import { NumberInput } from 'components/common/inputs/numberinput';
import { TextInput } from 'components/common/inputs/textinput';
import { IconPlus } from 'components/common/icons';

interface Props {
    records:Match[];
    onChange:{(records:Match[]):void};
}

const BoutMatchesForm:React.FunctionComponent<Props> = props => {
    const onChangeMatch = React.useCallback((record:Match, index:number) => {
        const records = props.records.slice();
        records[index] = record;
        props.onChange(records);
    }, [props.records, props.onChange]);

    const onClickAddMatch = React.useCallback(() => {
        const records = props.records.slice();
        records.push({
            TeamA:{},
            TeamB:{},
        });
        props.onChange(records);
    }, [props.records, props.onChange]);

    return <table className='table'>
        <tbody>
            {
                props.records.map((record, index) => {
                    return <MatchItem
                        record={record}
                        index={index}
                        onChange={onChangeMatch}
                        key={`match-${index}`}
                    />
                })
            }
            <tr>
                <td colSpan={7} style={{textAlign:'right'}}>
                    <IconPlus
                        asButton={true}
                        title='Add Match'
                        onClick={onClickAddMatch}
                    />
                </td>
            </tr>
        </tbody>
    </table>
};

const MatchItem:React.FunctionComponent<{
    index:number;
    record:Match;
    onChange:{(record:Match, index:number):void};
}> = props => {
    const [teamAID, setTeamA] = React.useState(props.record.TeamA.ID || 0);
    const [teamAScore, setTeamAScore] = React.useState(props.record.TeamA.Score || 0);

    const [teamBID, setTeamB] = React.useState(props.record.TeamB.ID || 0);
    const [teamBScore, setTeamBScore] = React.useState(props.record.TeamB.Score || 0);

    const [time, setTime] = React.useState(props.record.TimeStart || '');

    const onSelectTeamA = React.useCallback((record?:Team) => {
        setTeamA(record?.RecordID || 0)
    }, []);

    const onSelectTeamB = React.useCallback((record?:Team) => {
        setTeamB(record?.RecordID || 0);
    }, []);

    React.useEffect(() => {
        const result = {...props.record};
        result.TeamA = {...result.TeamA, ID:teamAID, Score:teamAScore};
        result.TeamB = {...result.TeamB, ID:teamBID, Score:teamBScore};
        result.TimeStart = time;
        props.onChange(result, props.index);
    }, [teamAScore, teamAID, teamBScore, teamBID, time]);

    return <tr>
        <td>
            <TeamSelector onSelectValue={onSelectTeamA} value={teamAID}/>
        </td>
        <td>
            <NumberInput value={teamAScore} onChangeValue={setTeamAScore} size={5} min={0} max={999}/>
        </td>
        <td>vs</td>
        <td>
            <TeamSelector onSelectValue={onSelectTeamB} value={teamBID}/>
        </td>
        <td>
            <NumberInput value={teamBScore} onChangeValue={setTeamBScore} size={5} min={0} max={999}/>
        </td>
        <td>Time</td>
        <td>
            <TextInput value={time} onChangeValue={setTime} size={6} placeholder={'00:00'} maxLength={5}/>
        </td>
    </tr>
}

export {BoutMatchesForm};