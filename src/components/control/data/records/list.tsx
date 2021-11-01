import classNames from 'classnames';
import { TextInput } from 'components/common/inputs/textinput';
import React from 'react';
import { Unsubscribe } from 'redux';
import { AnthemSingers } from 'tools/anthem/functions';
import { compareStrings } from 'tools/functions';
import { MainController } from 'tools/MainController';
import { Peers } from 'tools/peers/functions';
import { Penalties } from 'tools/penalties/functions';
import { Phases } from 'tools/phases/functions';
import { Seasons } from 'tools/seasons/functions';
import { Skaters } from 'tools/skaters/functions';
import { Slideshows } from 'tools/slideshows/functions';
import { Sponsors } from 'tools/sponsors/functions';
import { Teams } from 'tools/teams/functions';
import { RecordType, __BaseRecord } from 'tools/vars';
import { Videos } from 'tools/videos/functions';

interface Props extends React.HTMLProps<HTMLDivElement> {
    /**
     * True to add a 'New Record' button at the top of the list
     */
    allowNewRecord?:boolean;
    /**
     * 
     */
    listType:RecordType;
    /**
     * Current record id
     */
    recordId?:number;
    /**
     * Current record type
     */
    recordType?:RecordType;
    /**
     * Called when the user selects a record
     */
    onSelectRecord:{(recordId:number, recordType:RecordType):void};
}

interface State {
    keywords:string;
    updateTime:number;
}

/**
 * Display a list of records as buttons, with a search filter at the bottom
 */
class Main extends React.PureComponent<Props, State> {
    readonly state:State = {
        keywords:'',
        updateTime:0
    }

    /**
     * 
     */
    // protected KeywordsItem:React.RefObject<HTMLInputElement> = React.createRef<HTMLInputElement>();

    /**
     * 
     */
    protected remote?:Unsubscribe;

    /**
     * 
     */
    protected update = () => {
        const state = MainController.GetState();
        this.setState({
            updateTime:Math.max(
                state.UpdateTimeAnthemSingers,
                state.UpdateTimeSkaters,
                state.UpdateTimeTeams,
                state.UpdateTimePenalties,
                state.UpdateTimePhases,
                state.UpdateTimeSlideshows,
                state.UpdateTimeSponsors,
                state.UpdateTimeVideos
            )
        });
    }

    /**
     * Get current records.
     * @returns 
     */
    protected getRecords = () => {
        let records:__BaseRecord[] = [];
        switch(this.props.listType) {
            case 'ANT' : records = AnthemSingers.GetRecords(); break;
            case 'PEN' : records = Penalties.GetRecords(); break;
            case 'PER' : records = Peers.GetRecords(); break;
            case 'PHS' : records = Phases.GetRecords(); break;
            case 'SEA' : records = Seasons.GetRecords(); break;
            case 'SKR' : records = Skaters.GetRecords(); break;
            case 'SLS' : records = Slideshows.GetRecords(); break;
            case 'SPN' : records = Sponsors.GetRecords(); break;
            case 'TEM' : records = Teams.GetRecords(); break;
            case 'VID' : records = Videos.GetRecords(); break;
        }
        
        if(this.state.keywords && this.state.keywords.length) {
            const rx = new RegExp(this.state.keywords, 'ig');
            records = records.filter(r => {
                return ((r.Name && r.Name.search(rx) >= 0) || (r.ShortName && r.ShortName.search(rx) >= 0) || (r.Number && r.Number.search(rx) >= 0))
            });
        }

        if(this.props.recordType !== 'PHS')
            records.sort((a, b) => compareStrings(a.Name, b.Name, 'ASC'));

        return records;
    }

    /**
     * Update the keywords
     * @param value 
     * @returns 
     */
    protected onChangeKeywords = (value:string) => this.setState({keywords:value});

    componentDidUpdate(prevProps:Props) {
        if(prevProps.recordType !== this.props.recordType) {
            this.setState({keywords:''});
            // if(this.KeywordsItem && this.KeywordsItem.current)
            //     this.KeywordsItem.current.focus();
        }
    }

    render() {
        const {allowNewRecord, recordId, listType, recordType, onSelectRecord, ...rprops} = {...this.props}
        const records = this.getRecords();
        return <div {...rprops} className={classNames('record-list', rprops.className)}>
            <div className='records'>
                {
                    (allowNewRecord !== false) &&
                    <button 
                        className={this.props.recordId === 0 ? 'active' : undefined}
                        onClick={() => { onSelectRecord(0, listType);}}
                        style={{
                            position:'sticky',
                            display:'grid',
                            gridTemplateColumns:'auto 1fr',
                            alignItems:'center',
                            cursor:'pointer',
                            top:0,
                            left:0,
                            right:0
                        }}
                        >
                        <img src='images/plus.png' alt='' style={{height:'24px'}}/>
                        <span>New Record</span>
                    </button>
                }
                {
                    records.map(record => {
                        return <button 
                            className={recordId === record.RecordID && recordType === record.RecordType ? 'active' : ''}
                            onClick={() => {
                                onSelectRecord(record.RecordID || 0, record.RecordType || '')
                            }}
                            key={`${record.RecordType}-${record.RecordID}`}
                            >
                            {record.Name}
                        </button>
                    })
                }
            </div>
            <div className='search'>
                <TextInput
                    placeholder='Search...'
                    value={this.state.keywords}
                    onChangeValue={this.onChangeKeywords}
                />
            </div>
        </div>
    }
}

export {Main as RecordList};