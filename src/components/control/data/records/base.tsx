import { IconSave, IconX } from 'components/common/icons';
import { TextInput } from 'components/common/inputs/textinput';
import React from 'react';
import { AnthemSingers } from 'tools/anthem/functions';
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
import { RecordMediaTable } from './media';

interface Props {
    buttons?:React.ReactNode;
    recordId:number;
    recordType:RecordType;
    showCode?:boolean;
    showDescription?:boolean;
    showMedia?:boolean;
    showNumber?:boolean;
    showShortName?:boolean;
    showURL?:boolean;
    style?:React.CSSProperties;
    onBeforeSubmit?:{(values:__BaseRecord):__BaseRecord}
    onCancel:{():void};
    onSave:{():void};
}

interface State extends __BaseRecord {

}

const InitState:State = {
    RecordID:0,
    Background:'',
    Code:'',
    Color:'',
    DateCreated:'',
    DateEnd:'',
    DateStart:'',
    DateUpdated:'',
    Description:'',
    Name:'',
    Number:'',
    Photo:'',
    ScoreboardThumbnail:'',
    ShortName:'',
    Thumbnail:'',
    URL:'',
    URLTitle:''
}

/**
 * Base component for editing a record.
 */
class Main extends React.PureComponent<Props, State> {
    readonly state:State = {...InitState}

    /**
     * Load record.
     */
    protected load = () => {
        let record:__BaseRecord|undefined = undefined;
        switch(this.props.recordType) {
            case 'ANT' : record = AnthemSingers.Get(this.props.recordId); break;
            case 'PEN' : record = Penalties.Get(this.props.recordId); break;
            case 'PER' : record = Peers.Get(this.props.recordId); break;
            case 'PHS' : record = Phases.Get(this.props.recordId); break;
            case 'SEA' : record = Seasons.Get(this.props.recordId); break;
            case 'SKR' : record = Skaters.Get(this.props.recordId); break;
            case 'SLS' : record = Slideshows.Get(this.props.recordId); break;
            case 'SPN' : record = Sponsors.Get(this.props.recordId); break;
            case 'TEM' : record = Teams.Get(this.props.recordId); break;
            case 'VID' : record = Videos.Get(this.props.recordId); break;
        }


        // console.log(record);
        if(record) {
            this.setState({
                RecordID:this.props.recordId,
                Background:record.Background || InitState.Background,
                Code:record.Code || InitState.Code,
                Color:record.Color || InitState.Color,
                DateCreated:record.DateCreated || InitState.DateCreated,
                DateEnd:record.DateEnd || InitState.DateEnd,
                DateStart:record.DateStart || InitState.DateStart,
                DateUpdated:record.DateUpdated || InitState.DateUpdated,
                Description:record.Description || InitState.Description,
                Name:record.Name || InitState.Name,
                Number:record.Number || InitState.Number,
                Photo:record.Photo || InitState.Photo,
                ScoreboardThumbnail:record.ScoreboardThumbnail || InitState.ScoreboardThumbnail,
                ShortName:record.ShortName || InitState.ShortName,
                Thumbnail:record.Thumbnail || InitState.Thumbnail,
                URL:record.URL || InitState.URL,
                URLTitle:record.URLTitle || InitState.URLTitle
            });
        } else {
            this.setState({
                ...InitState
            })
        }
    }

    /**
     * Called when the user changes the code
     * @param value 
     * @returns 
     */
    protected onChangeCode = (value:string) => this.setState({Code:value});

    /**
     * Called when the user changes the color
     * @param value 
     * @returns 
     */
    protected onChangeColor = (value:string) => this.setState({Color:value});

    /**
     * Called when the user changes the end date
     * @param value 
     * @returns 
     */
    protected onChangeDateEnd = (value:string) => this.setState({DateEnd:value});

    /**
     * Called when the start date changes
     * @param value 
     * @returns 
     */
    protected onChangeDateStart = (value:string) => this.setState({DateStart:value});

    /**
     * Called when the description changes
     * @param ev 
     */
    protected onChangeDescription = (ev:React.ChangeEvent<HTMLTextAreaElement>) => {
        let value = ev.currentTarget.value;
        this.setState({Description:value});
    }

    /**
     * Called when the name is changed
     * @param value 
     * @returns 
     */
    protected onChangeName = (value:string) => this.setState({Name:value});

    /**
     * Called when the number is changed
     * @param value 
     * @returns 
     */
    protected onChangeNumber = (value:string) => this.setState({Number:value});

    /**
     * Called when the short name changed
     * @param value 
     * @returns 
     */
    protected onChangeShortName = (value:string) => this.setState({ShortName:value});

    /**
     * Called when the URL changed
     * @param value 
     * @returns 
     */
    protected onChangeURL = (value:string) => this.setState({URL:value});

    /**
     * Called when the URL title changed
     * @param value 
     * @returns 
     */
    protected onChangeURLTitle = (value:string) => this.setState({URLTitle:value});

    /**
     * Called when the background changed
     * @param value 
     * @returns 
     */
    protected onSelectBackground = (value:string) => this.setState({Background:value});

    /**
     * Called when the photo changed
     * @param value 
     * @returns 
     */
    protected onSelectPhoto = (value:string) => this.setState({Photo:value});

    /**
     * Called when the scoreboard thumbnail/banner changed
     * @param value 
     * @returns 
     */
    protected onSelectScoreboardThumbnail = (value:string) => this.setState({ScoreboardThumbnail:value});

    /**
     * Called when the thumbnail changed
     * @param value 
     * @returns 
     */
    protected onSelectThumbnail = (value:string) => this.setState({Thumbnail:value});

    /**
     * Called when the user clicks submit
     * @returns 
     */
    protected onClickSubmit = async () => {
        let values:__BaseRecord = {
            RecordID:this.props.recordId,
            Background:this.state.Background,
            Code:this.state.Code,
            Color:this.state.Color,
            DateEnd:this.state.DateEnd,
            DateStart:this.state.DateStart,
            Description:this.state.Description,
            Name:this.state.Name,
            Number:this.state.Number,
            Photo:this.state.Photo,
            RecordType:this.props.recordType,
            ScoreboardThumbnail:this.state.ScoreboardThumbnail,
            ShortName:this.state.ShortName,
            Thumbnail:this.state.Thumbnail,
            URL:this.state.URL,
            URLTitle:this.state.URLTitle
        }

        if(this.props.onBeforeSubmit) {
            values = this.props.onBeforeSubmit(values);
        }

        try {
            switch(this.props.recordType) {
                case 'ANT' : 
                    AnthemSingers.Write([values]);;
                    await AnthemSingers.Save();
                break;
                case 'PEN' : 
                    Penalties.Write([values]);
                    await Penalties.Save();
                break;

                case 'PER' :
                    Peers.Write([values]);
                    await Peers.Save();
                break;

                case 'PHS' :
                    Phases.Write([values]);
                    await Phases.Save();
                break;

                case 'SEA' : 
                    Seasons.Write([values]);
                    await Seasons.Save();
                break;

                case 'SKR' : 
                    Skaters.Write([values]);
                    await Skaters.Save();
                break;

                case 'SLS' : 
                    Slideshows.Write([values]);
                    await Slideshows.Save();
                break;

                case 'SPN' :
                    Sponsors.Write([values]);
                    await Sponsors.Save();
                break;

                case 'TEM' : 
                    Teams.Write([values]);
                    await Teams.Save();
                    break;

                case 'VID' : 
                    Videos.Write([values]);
                    await Videos.Save();
                    break;

                default : return;
            }
        } catch(er) {

        } finally {

            this.props.onSave();
        }
    }

    componentDidMount() {
        this.load();
    }

    componentDidUpdate(prevProps:Props) {
        if(prevProps.recordId !== this.props.recordId || prevProps.recordType !== this.props.recordType)
            this.load();
    }

    render() {
        return <div className='record-form'>
            <div className='title'></div>
            <div className='content' style={this.props.style}>
                <table className='table'>
                    <tbody>
                        <tr>
                            <td width={100}>Name</td>
                            <td>
                                <TextInput value={this.state.Name || ''} onChangeValue={this.onChangeName} placeholder='Full Name'/>
                            </td>
                        </tr>
                        {
                            (this.props.showShortName !== false) &&
                            <tr>
                                <td>Short Name</td>
                                <td>
                                    <TextInput value={this.state.ShortName || ''} onChangeValue={this.onChangeShortName} placeholder='Short Name'/>
                                </td>
                            </tr>
                        }
                        {
                            (this.props.showNumber !== false) &&
                            <tr>
                                <td>Number</td>
                                <td>
                                    <TextInput value={this.state.Number || ''} onChangeValue={this.onChangeNumber} placeholder='Jersey #'/>
                                </td>
                            </tr>
                        }
                        {
                            (this.props.showCode !== false) &&
                            <tr>
                                <td>Code</td>
                                <td>
                                    <TextInput value={this.state.Code || ''} onChangeValue={this.onChangeCode}/>
                                </td>
                            </tr>
                        }
                        {
                            (this.props.showDescription !== false) &&
                            <tr>
                                <td>Description</td>
                                <td>
                                    <textarea value={this.state.Description || ''} onChange={this.onChangeDescription} rows={4} cols={50}></textarea>
                                </td>
                            </tr>
                        }
                        {
                            (this.props.showURL !== false) &&
                            <>
                                <tr>
                                    <td>URL</td>
                                    <td>
                                        <TextInput value={this.state.URL || ''} onChangeValue={this.onChangeURL} placeholder='https://...'/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>URL Title</td>
                                    <td>
                                        <TextInput value={this.state.URLTitle || ''} onChangeValue={this.onChangeURLTitle} placeholder='Website Name'/>
                                    </td>
                                </tr>
                            </>
                        }
                        {
                            (this.props.showMedia !== false) &&
                            <tr>
                                <td>Media</td>
                                <td>
                                    <RecordMediaTable
                                        background={this.state.Background || ''}
                                        photo={this.state.Photo || ''}
                                        recordId={this.props.recordId}
                                        recordType={this.props.recordType}
                                        scoreboardThumbnail={this.state.ScoreboardThumbnail || ''}
                                        thumbnail={this.state.Thumbnail || ''}
                                        onSelectBackground={this.onSelectBackground}
                                        onSelectPhoto={this.onSelectPhoto}
                                        onSelectScoreboardThumbnail={this.onSelectScoreboardThumbnail}
                                        onSelectThumbnail={this.onSelectThumbnail}
                                    />
                                </td>
                            </tr>
                        }
                        {this.props.children}
                    </tbody>
                </table>
            </div>
            <div className='buttons'>
                {this.props.buttons}
                <IconSave asButton={true} onClick={this.onClickSubmit}>Submit</IconSave>
                <IconX asButton={true} onClick={this.props.onCancel}>Cancel</IconX>
            </div>
        </div>
    }
}

export {Main as BaseRecordForm};