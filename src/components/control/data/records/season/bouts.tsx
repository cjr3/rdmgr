import { TextInput } from 'components/common/inputs/textinput';
import React from 'react';
import { Bout, Match } from 'tools/vars';
import { BoutMatchesForm } from './matches';

interface Props {
    records:Bout[];
    onChange:{(records:Bout[]):void};
}

const SeasonBoutsForm:React.FunctionComponent<Props> = props => {

    const onChangeBout = React.useCallback((record:Bout, index:number) => {
        const records = props.records.slice();
        records[index] = record;
        props.onChange(records);
    }, [props.records, props.onChange]);

    return <table className='table table-striped'>
        <thead>
            <tr>
                <th style={{width:'150px'}}>Dates</th>
                <th colSpan={7}>Matches</th>
            </tr>
        </thead>
        <tbody>
        {
            props.records.map((record, index) => {
                return <BoutItem
                    record={record}
                    index={index}
                    onChange={onChangeBout}
                    key={`bout-${index}`}
                />
            })
        }
        </tbody>
    </table>
};

const BoutItem:React.FunctionComponent<{record:Bout;index:number;onChange:{(record:Bout, index:number):void}}> = props => {
    const [end, setDateEnd] = React.useState(props.record.DateEnd || '');
    const [start, setDateStart] = React.useState(props.record.DateStart || '');
    const [matches, setMatches] = React.useState(props.record.Matches || []);

    React.useEffect(() => {
        props.onChange({
            ...props.record,
            DateEnd:end,
            DateStart:start,
            Matches:matches
        }, props.index);
    }, [end, start, matches]);

    const onChangeMatches = React.useCallback((records:Match[]):void => {
        setMatches(records);
    }, []);

    return <tr>
        <td width={100}>
            <div>
                <TextInput
                    className='form-control'
                    size={10}
                    value={start}
                    onChangeValue={setDateStart}
                    placeholder='mm/dd/yyyy'
                />
            </div>
            <div>
                <TextInput
                    className='form-control'
                    size={10}
                    value={end}
                    onChangeValue={setDateEnd}
                    placeholder='mm/dd/yyyy'
                />
            </div>
        </td>
        <td style={{padding:'0px'}}>
            <BoutMatchesForm records={matches} onChange={onChangeMatches}/>
        </td>
    </tr>
};

export {SeasonBoutsForm};