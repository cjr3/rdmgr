import { NumberInput } from 'components/common/inputs/numberinput';
import { TeamSelector } from 'components/common/inputs/selectors';
import React from 'react';
import { Standing, Team } from 'tools/vars';

interface Props {
    records:Standing[];
    onChange:{(records:Standing[]):void};
}

const SeasonStandingsForm:React.FunctionComponent<Props> = props => {

    const onChangeStanding = React.useCallback((record:Standing, index:number) => {
        const records = props.records.slice();
        records[index] = record;
        props.onChange(records);
    }, [props.records, props.onChange]);

    return <table className='table table-striped'>
        <thead>
            <tr>
                <th>Team</th>
                <th>Position</th>
                <th>Wins</th>
                <th>Losses</th>
                <th>Points</th>
            </tr>
        </thead>
        <tbody>
            {
                props.records.map((record, index) => {
                    return <StandingItem
                        record={record}
                        index={index}
                        onChange={onChangeStanding}
                        key={`standing-${index}`}
                    />
                })
            }
        </tbody>
    </table>
}

const StandingItem:React.FunctionComponent<{
    record:Standing;
    index:number;
    onChange:{(record:Standing, index:number):void};
}> = props => {
    const [teamId, setTeamId] = React.useState(props.record.TeamID || 0);
    const [wins, setWins] = React.useState(props.record.Wins || 0);
    const [losses, setLosses] = React.useState(props.record.Losses || 0);
    const [points, setPoints] = React.useState(props.record.Points || 0);
    const [position, setPosition] = React.useState(props.record.Position || 0);

    const onSelectTeam = React.useCallback((record?:Team) => {
        setTeamId(record?.RecordID || 0);
    }, []);

    React.useEffect(() => {
        props.onChange({
            ...props.record,
            TeamID:teamId,
            Wins:wins,
            Losses:losses,
            Points:points,
            Position:position
        }, props.index)
    }, [teamId, wins, losses, points, position]);

    return <tr>
        <td>
            <TeamSelector value={teamId} onSelectValue={onSelectTeam}/>
        </td>
        <td>
            <NumberInput value={position} onChangeValue={setPosition} size={5} min={0} max={999}/>
        </td>
        <td>
            <NumberInput value={wins} onChangeValue={setWins} size={5} min={0} max={999}/>
        </td>
        <td>
            <NumberInput value={losses} onChangeValue={setLosses} size={5} min={0} max={999}/>
        </td>
        <td>
            <NumberInput value={points} onChangeValue={setPoints} size={5} min={0} max={9999}/>
        </td>
    </tr>
};

export {SeasonStandingsForm};