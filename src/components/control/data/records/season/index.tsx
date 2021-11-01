import React from 'react';
import { BaseRecordForm } from '../base';
import { Bout, Season, Standing } from 'tools/vars';
import { TextInput } from 'components/common/inputs/textinput';
import { Seasons } from 'tools/seasons/functions';
import { SeasonBoutsForm } from './bouts';
import { SeasonStandingsForm } from './standings';
import { IconPlus } from 'components/common/icons';

interface Props {
    recordId:number;
    onSave:{():void};
}

interface State {
    bouts:Bout[];
    dateEnd:string;
    dateStart:string;
    standings:Standing[];
}

/**
 * Form for adding/editing a phase record.
 */
class SeasonForm extends React.PureComponent<Props, State> {
    readonly state:State = {
        bouts:[],
        dateEnd:'',
        dateStart:'',
        standings:[]
    }

    /**
     * 
     */
    protected load = () => {
        const record = Seasons.Get(this.props.recordId);
        this.setState({
            bouts:record?.Bouts || [],
            dateEnd:record?.DateEnd || '',
            dateStart:record?.DateStart || '',
            standings:record?.Standings || []
        });
    }

    /**
     * Apply changes from this form to the base record submission.
     * @param record 
     * @returns 
     */
    protected onBeforeSubmit = (record:Season) : Season => {
        return {...record, 
            Bouts:this.state.bouts.slice(),
            DateEnd:this.state.dateEnd,
            DateStart:this.state.dateStart,
            Standings:this.state.standings.slice()
        };
    };

    /**
     * Set bouts
     * @param records 
     * @returns 
     */
    protected onChangeBouts = (records:Bout[]) => this.setState({bouts:records});

    /**
     * Set date end
     * @param value 
     * @returns 
     */
    protected onChangeDateEnd = (value:string) => this.setState({dateEnd:value});

    /**
     * Set date start
     * @param value 
     * @returns 
     */
    protected onChangeDateStart = (value:string) => this.setState({dateStart:value});

    /**
     * Set standings records
     * @param records 
     * @returns 
     */
    protected onChangeStandings = (records:Standing[]) => this.setState({standings:records});

    protected onClickAddBout = () => {
        const records = this.state.bouts.slice();
        records.push({});
        this.setState({bouts:records});
    };

    protected onClickAddStanding = () => {
        const records = this.state.standings.slice();
        records.push({});
        this.setState({standings:records});
    }

    componentDidMount() {
        this.load();
    }

    componentDidUpdate(prevProps:Props) {
        if(prevProps.recordId !== this.props.recordId)
            this.load();
    }

    render() {
        return <BaseRecordForm
            recordId={this.props.recordId}
            recordType='SEA'
            showCode={false}
            showShortName={false}
            showDescription={false}
            showMedia={false}
            showURL={false}
            showNumber={true}
            onBeforeSubmit={this.onBeforeSubmit}
            onCancel={this.props.onSave}
            onSave={this.props.onSave}
        >
            <tr>
                <td>Start</td>
                <td>
                    <TextInput
                        value={this.state.dateStart}
                        onChangeValue={this.onChangeDateStart}
                        placeholder='mm/dd/yyyy'
                        size={10}
                        maxLength={10}
                    />
                </td>
            </tr>
            <tr>
                <td>End</td>
                <td>
                    <TextInput
                        value={this.state.dateEnd}
                        onChangeValue={this.onChangeDateEnd}
                        placeholder='mm/dd/yyyy'
                        size={10}
                        maxLength={10}
                    />
                </td>
            </tr>
            <tr>
                <td style={{position:'relative'}}>
                    <div style={{position:'sticky', top:0}}>
                        <div style={{paddingBottom:'6px'}}>Standings</div>
                        <IconPlus title='Add Standing' onClick={this.onClickAddStanding} asButton={true}/>
                    </div>
                </td>
                <td style={{padding:'0px'}}>
                    <SeasonStandingsForm onChange={this.onChangeStandings} records={this.state.standings}/>
                </td>
            </tr>
            <tr>
                <td style={{position:'relative'}}>
                    <div style={{position:'sticky', top:0}}>
                        <div style={{paddingBottom:'6px'}}>Bouts</div>
                        <IconPlus title='Add Bout' onClick={this.onClickAddBout} asButton={true}/>
                    </div>
                </td>
                <td style={{padding:'0px'}}>
                    <SeasonBoutsForm onChange={this.onChangeBouts} records={this.state.bouts}/>
                </td>
            </tr>
        </BaseRecordForm>
    }
}

export {SeasonForm};