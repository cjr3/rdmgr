import React from 'react';
import Panel, { PPanelProps } from 'components/Panel';
import cnames from 'classnames';
import { IconButton, IconLoop, IconSave, IconNo } from 'components/Elements';
import { IAPIController, TeamRecord, Record } from 'controllers/api/vars';
import { Compare } from 'controllers/functions';
import APITeamsController from 'controllers/api/Teams';
import { Unsubscribe } from 'redux';
import UIController from 'controllers/UIController';
import APISeasonsController from 'controllers/api/Seasons';
import APIBoutsController from 'controllers/api/Bouts';

interface RDMGRRecordProps extends PPanelProps {
    RecordID:number;
    onSave:Function;
    onLoad:{(record:any)};
    controller:IAPIController;
    onCancel:{(record:any)};
    onSubmit:Function;
}

export default class RDMGRRecordPanel extends React.PureComponent<RDMGRRecordProps, {
    CurrentRecord:any;
    Loading:boolean;
    Saving:boolean;
    ErrorMessage:string;
}> {

    readonly state = {
        CurrentRecord:null,
        Loading:false,
        Saving:false,
        ErrorMessage:''
    }

    constructor(props) {
        super(props);
        this.load = this.load.bind(this);
        this.save = this.save.bind(this);
        this.cancel = this.cancel.bind(this);
    }

    protected load() {
        this.props.controller.LoadRecord(this.props.RecordID).then((record:any) => {
            this.setState({CurrentRecord:record, Loading:false,ErrorMessage:''}, () => {
                this.props.onLoad(record);
            });
        }).catch((er) => {
            if(this.props.RecordID <= 0) {
                this.setState({Loading:false,ErrorMessage:''});
            } else {
                this.setState({Loading:false, ErrorMessage:'Failed to load record!'});
            }
        });
    }

    protected save() {
        this.setState({
            Saving:true
        }, () => {
            let record:Record = this.props.onSubmit();
            if(!record) {
                this.setState({Saving:false, ErrorMessage:'Failed to update record!'});
            } else {
                this.props.controller.UpdateRecord(record).then((record) => {
                    if(record) {
                        this.setState({CurrentRecord:record, Saving:false,ErrorMessage:''}, () => {
                            this.props.onSave(this.state.CurrentRecord);
                        });
                    }
                }).catch((er) => {
                    if(er === false) {
                        UIController.ShowLogin(() => {
                            this.save();
                        });
                    } else {
                        this.setState({
                            Saving:false,
                            ErrorMessage:er.message
                        });
                    }
                });
            }
        })
    }

    protected cancel() {
        this.props.onCancel(this.state.CurrentRecord);
    }

    componentDidMount() {
        if(this.props.RecordID > 0)
            this.load();
    }

    componentDidUpdate(prevProps) {
        if(prevProps.RecordID != this.props.RecordID) {
            this.load();
        }
    }

    render() {

        let buttons:Array<React.ReactElement> = new Array<React.ReactElement>(
            <IconButton 
                src={IconLoop}
                onClick={this.load}
                key='btn-load'
                >Reset</IconButton>,
            <IconButton
                src={IconSave}
                onClick={this.save}
                key='btn-save'
                >Submit</IconButton>,
            <IconButton
                src={IconNo}
                onClick={this.cancel}
                key='btn-cancel'
                >Cancel</IconButton>
        );

        if(this.props.buttons && this.props.buttons.length >= 1) {
            this.props.buttons.forEach((button) => {
                buttons.unshift(button);
            });
        }

        return (
            <Panel 
                {...this.props} 
                buttons={buttons}
                className={cnames("rdmgr-match-panel", this.props.className)}
                contentName={cnames('rdmgr-match', this.props.contentName)}
                error={this.state.ErrorMessage}
                >
                {this.props.children}
            </Panel>
        )
    }
}

export function TitleEntry(props:{value:string,onChange:any}) {
    return (
        <input type="text"
            size={30}
            maxLength={100}
            value={(props.value) ? props.value : ''}
            onChange={props.onChange}
            />
    )
}

class RecordSelect extends React.PureComponent<{
    value:string|number;
    onChange:{(value:string|number)};
    controller:IAPIController;
    className?:string;
}, {
    Records:Array<any>;
}> {
    readonly state = {
        Records:new Array<any>()
    }

    protected remoteController?:Unsubscribe;

    constructor(props) {
        super(props);
        this.updateController = this.updateController.bind(this);
        this.onChange = this.onChange.bind(this);
        let records = this.props.controller.Get();
        if(records && Array.isArray(records)) {
            this.state.Records = records;
        }
    }

    protected updateController() {
        this.setState({Records:this.props.controller.Get()});
    }

    protected onChange(ev: React.ChangeEvent<HTMLSelectElement>) {
        this.props.onChange(ev.currentTarget.value);
    }

    componentDidMount() {
        this.remoteController = this.props.controller.Subscribe(this.updateController);
    }

    componentWillUnmount() {
        if(this.remoteController)
            this.remoteController();
    }

    render() {
        let value:number|string = this.props.value;
        let records:Array<TeamRecord> = this.state.Records;
        let options:Array<React.ReactElement> = new Array<React.ReactElement>(
            <option value="0" key="def"></option>
        );
        let src:string = '';
        let alt:string = '';
        if(!value)
            value = '';

        if(records && Array.isArray(records)) {
            records.forEach((record:Record) => {
                options.push(
                    <option value={record.RecordID} key={`${record.RecordType}-${record.RecordID}`}>
                        {record.Name}
                    </option>
                );

                if(record.RecordID == value && record.Thumbnail) {
                    src = record.Thumbnail;
                    alt = record.Name;
                }
            });
        }

        return (
            <div className={cnames('rdmgr-select', this.props.className)}>
                <select size={1} 
                    value={value}
                    onChange={this.onChange}>
                    {options}
                </select>
                <div className="thumbnail">
                    <img src={src} alt={alt}/>
                </div>
            </div>
        )
    }
}

export function SeasonSelect(props:{value:string|number,onChange:{(value:string|number)}}) {
    return (
        <RecordSelect
            value={props.value}
            onChange={props.onChange}
            controller={APISeasonsController}
        />
    )
}

export function BoutsSelect(props:{value:string|number,onChange:{(value:string|number)}}) {
    return (
        <RecordSelect
            value={props.value}
            onChange={props.onChange}
            controller={APIBoutsController}
        />
    )
}

export function TeamSelect(props:{value:string|number,onChange:{(value:string|number)}}) {
    return (
        <RecordSelect
            value={props.value}
            onChange={props.onChange}
            controller={APITeamsController}
        />
    )
}