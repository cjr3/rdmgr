import { TextInput } from 'components/common/inputs/textinput';
import React from 'react';
import { Unsubscribe } from 'redux';
import { compareStrings } from 'tools/functions';
import { MainController } from 'tools/MainController';
import { Roster } from 'tools/roster/functions';
import { Scoreboard } from 'tools/scoreboard/functions';
import { Skaters } from 'tools/skaters/functions';
import { Skater } from 'tools/vars';
import { RosterSkaterItem } from './skater';

interface Props extends React.HTMLProps<HTMLDivElement> {

}

interface State {
    colorA:string;
    colorB:string;
    keywords:string;
    updateTime:number;
}

class Main extends React.PureComponent<Props, State> {
    readonly state:State = {
        colorA:'',
        colorB:'',
        keywords:'',
        updateTime:0
    }

    protected remote?:Unsubscribe;

    protected update = () => {
        const scoreboard = Scoreboard.GetState();
        this.setState({
            colorA:scoreboard.TeamA?.Color || 'transparent',
            colorB:scoreboard.TeamB?.Color || 'transparent',
            updateTime:Roster.GetUpdateTime()
        });
    }

    /**
     * 
     * @param value 
     * @returns 
     */
    protected onChangeKeywords = (value:string) => this.setState({keywords:value});

    /**
     * 
     * @returns 
     */
    protected getRecords = () : Skater[] => {
        let records = Skaters.GetRecords();

        if(this.state.keywords) {
            const rx = new RegExp(this.state.keywords, 'ig');
            records = records.filter(r => {
                if(r.Name && r.Name.search(rx) >= 0)
                    return true;
                if(r.Number && r.Number.search(rx) >= 0)
                    return true;
                return false;
            })
        }

        records.sort((a, b) => compareStrings(a.Name, b.Name, 'ASC'));

        return records;
    }

    componentDidMount() {
        this.remote = Roster.Subscribe(this.update);
    }

    componentWillUnmount() {
        if(this.remote)
            this.remote();
    }

    render() {
        const records = this.getRecords();
        const a = MainController.GetState().Roster.SkatersA || [];
        const b = MainController.GetState().Roster.SkatersB || [];
        return <div className='skater-list'>
            <div className='title'>Skaters</div>
            <div className='skaters'>
                {
                    records.map((record) => {
                        const inA = (a.findIndex(r => r.RecordID === record.RecordID) >= 0);
                        const inB = (b.findIndex(r => r.RecordID === record.RecordID) >= 0);
                        let side = '';
                        let color = 'transparent';
                        if(inA) {
                            side = 'A';
                            color = this.state.colorA;
                        }
                        else if(inB) {
                            side = 'B';
                            color = this.state.colorB;
                        }
                        return <RosterSkaterItem
                            active={true}
                            index={-1}
                            name={record.Name || ''}
                            number={record.Number || ''}
                            recordId={record.RecordID || 0}
                            rosterIndex={-1}
                            rosterSide={''}
                            side={side}
                            style={{backgroundColor:color}}
                            key={`record-${record.RecordID}`}
                        />
                    })
                }
            </div>
            <div className='entry'>
                <TextInput
                    placeholder='Keywords'
                    size={20}
                    maxLength={50}
                    value={this.state.keywords}
                    onChangeValue={this.onChangeKeywords}
                />
            </div>
        </div>
    }
};

export {Main as RosterSkaterList};