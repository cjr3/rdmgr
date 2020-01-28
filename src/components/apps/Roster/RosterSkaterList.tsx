import React from 'react';
import { SkaterRecord } from 'tools/vars';
import { Unsubscribe } from 'redux';
import keycodes from 'tools/keycodes';
import { Icon, IconLeft, IconRight, IconX } from 'components/Elements';
import RosterController, { Sides } from 'controllers/RosterController';
import SkatersController from 'controllers/SkatersController';
import { CompareAsync } from 'controllers/functions';

type TRosterPosition = {
    value:string;
    name:string;
}

/**
 * Component for listing and modifying the current match roster
 */
export default class RosterSkaterList extends React.PureComponent<any, {
    JerseyNumber:string;
    SkaterName:string;
    SkaterPosition:string;
    Skaters:Array<SkaterRecord>;
    TeamASkaters:Array<SkaterRecord>;
    TeamBSkaters:Array<SkaterRecord>;
}> {
    readonly state = {
        JerseyNumber:'',
        SkaterName:'',
        SkaterPosition:'',
        Skaters:SkatersController.Get(),
        TeamASkaters:RosterController.GetState().TeamA.Skaters,
        TeamBSkaters:RosterController.GetState().TeamB.Skaters
    }

    /**
     * Listener for DataController
     */
    protected remoteData?:Unsubscribe;

    /**
     * Listener for RosterController
     */
    protected remoteRoster:Unsubscribe|null = null;

    protected Positions:Array<TRosterPosition> = new Array<TRosterPosition>(
        {value:'',name:''},
        {value:'C',name:'Captain'},
        {value:'CC',name:'CoCaptain'},
        {value:'CO',name:'Coach'},
        {value:'PT',name:'Penalty Tracker'},
        {value:'NS',name:'Not Skating'}
    );

    /**
     * Constructor
     * @param props 
     */
    constructor(props) {
        super(props);
        this.updateData = this.updateData.bind(this);
        this.updateRoster = this.updateRoster.bind(this);

        this.onChangeJerseyNumber = this.onChangeJerseyNumber.bind(this);
        this.onChangeSkaterName = this.onChangeSkaterName.bind(this);
        this.onChangeSkaterPosition = this.onChangeSkaterPosition.bind(this);
        this.onKeyUpJerseyNumber = this.onKeyUpJerseyNumber.bind(this);
        this.onKeyUpSkaterName = this.onKeyUpSkaterName.bind(this);

        this.addSkater = this.addSkater.bind(this);
    }

    /**
     * Triggered when the value of the skater name changes
     * @param ev 
     */
    protected onChangeSkaterName(ev: React.ChangeEvent<HTMLInputElement>) {
        let value:string = ev.currentTarget.value;
        this.setState({SkaterName:value});
    }

    /**
     * Triggered when the value of jersey # changes
     * @param ev 
     */
    protected onChangeJerseyNumber(ev: React.ChangeEvent<HTMLInputElement>) {
        let value:string = ev.currentTarget.value;
        this.setState({JerseyNumber:value});
    }
    
    /**
     * Triggered when the user presses a key in the name or jserey #
     * @param ev 
     */
    protected onKeyUpSkaterName(ev: React.KeyboardEvent<HTMLInputElement>) {
        switch(ev.keyCode) {
            case keycodes.ESCAPE :
                this.setState({SkaterName:''});
            break;
            case keycodes.ENTER :
                if(ev.shiftKey) {
                    this.addSkater('B');
                } else {
                    this.addSkater('A');
                }
            break;
            default : break;
        }
    }

    /**
     * Triggered when the user presses a key in the name or jserey #
     * @param ev 
     */
    protected onKeyUpJerseyNumber(ev: React.KeyboardEvent<HTMLInputElement>) {
        switch(ev.keyCode) {
            case keycodes.ESCAPE :
                this.setState({JerseyNumber:''});
            break;
            case keycodes.ENTER :
                if(ev.shiftKey) {
                    this.addSkater('B');
                } else {
                    this.addSkater('A');
                }
            break;
            default : break;
        }
    }

    /**
     * Triggered when the user changes the skater entry position
     * - Not used in search
     * @param ev 
     */
    protected onChangeSkaterPosition(ev: React.ChangeEvent<HTMLSelectElement>) {
        let value = ev.currentTarget.value;
        this.setState({SkaterPosition:value});
    }

    /**
     * Updates the state to match the DataController
     */
    protected async updateData() {
        this.setState({Skaters:SkatersController.Get()});
    }

    /**
     * Updates the state to match the RosterController
     */
    protected async updateRoster() {
        let skatersA = RosterController.GetState().TeamA.Skaters;
        let skatersB = RosterController.GetState().TeamB.Skaters;
        let same:boolean = await CompareAsync(skatersA, this.state.TeamASkaters);
        if(!same) {
            this.setState({TeamASkaters:skatersA});
        }

        same = await CompareAsync(skatersB, this.state.TeamBSkaters);
        if(!same) {
            this.setState({TeamBSkaters:skatersB});
        }
    }

    protected async addSkaterToTeam(side:string, skater) {
        let aindex:number = this.state.TeamASkaters.findIndex((s) => {
            return (s.RecordID === skater.RecordID);
        });
        let bindex:number = this.state.TeamBSkaters.findIndex((s) => {
            return (s.RecordID === skater.RecordID);
        });

        if(side === 'A') {
            if(aindex < 0)
                RosterController.AddSkater('A', skater);
            else
                RosterController.RemoveSkater('A', skater);
            RosterController.RemoveSkater('B', skater);
        } else {
            if(bindex < 0)
                RosterController.AddSkater('B', skater);
            else
                RosterController.RemoveSkater('B', skater);
            RosterController.RemoveSkater('A', skater);
        }
    }

    /**
     * Triggered when the user clicks one of the arrow buttons to 
     * assign the manual-entry skater to a team
     * - Ignores if no team name is chosen
     * @param side 
     */
    protected async addSkater(side:Sides) {
        let num:string = this.state.JerseyNumber;
        let name:string = this.state.SkaterName;
        let pos:string = this.state.SkaterPosition;

        let found:boolean = this.state.Skaters.some((skater) => {
            let add:boolean = false;
            if(name && skater.Name.toLowerCase() == name.toLowerCase()) {
                if(!num) {
                    add = true;
                } else {
                    if(!skater.Number && !num) {
                        add = true;
                    } else if(skater.Number && num && skater.Number.toLowerCase() === num.toLowerCase()) {
                        add = true;
                    }
                }
            } else if(!name && skater.Number && num && skater.Number.toLowerCase() === num.toLowerCase()) {
                add =  true;
            }

            if(add) {
                this.addSkaterToTeam(side, skater);
            }

            return add;
        });

        if(!found) {
            if(!name || name.length <= 0)
                return;
            let record:SkaterRecord = SkatersController.NewRecord();
            record.Name = name;
            record.Number = num;
            //position ???
            RosterController.AddSkater(side, record);
        }

        this.setState({
            JerseyNumber:'',
            SkaterName:'',
            SkaterPosition:''
        });
    }

    /**
     * Subscribe to the DataController
     */
    componentDidMount() {
        this.remoteData = SkatersController.Subscribe(this.updateData);
        this.remoteRoster = RosterController.Subscribe(this.updateRoster);
    }

    /**
     * Close listeners
     */
    componentWillUnmount() {
        if(this.remoteData)
            this.remoteData();
        if(this.remoteRoster !== null)
            this.remoteRoster();
    }
    
    /**
     * Renders the component
     */
    render() {
        const skaters:Array<React.ReactElement> = [];
        const positions:Array<React.ReactElement> = [];
        var rxjn:RegExp|null = null;
        var rxsn:RegExp|null = null;
        if(this.state.JerseyNumber.length) {
            rxjn = new RegExp(this.state.JerseyNumber, 'ig');
        }

        if(this.state.SkaterName.length) {
            rxsn = new RegExp(this.state.SkaterName, 'ig');
        }

        this.state.Skaters.forEach((skater, index) => {
            let add:boolean = true;
            if(skater !== undefined && ((rxjn !== null) || (rxsn !== null))) {
                add = false;
                if(rxjn && skater.Number && skater.Number.search(rxjn) >= 0) {
                    add = true;
                }
                if(rxsn && skater.Name && skater.Name.search(rxsn) >= 0) {
                    add = true;
                }
            }

            if(add) {
                let aindex:number = this.state.TeamASkaters.findIndex((s) => {
                    return (s.RecordID === skater.RecordID);
                });
                let bindex:number = this.state.TeamBSkaters.findIndex((s) => {
                    return (s.RecordID === skater.RecordID);
                });
                let num = skater.Number;
                if(!num)
                    num = '';
                else
                    num = '#' + num;
                skaters.push(
                    <div 
                        className="skater-item" 
                        key={`${skater.RecordType}-${index}`}>
                        <Icon
                            src={(aindex >= 0) ? IconX : IconLeft}
                            active={(aindex >= 0)}
                            onClick={() => {
                                this.addSkaterToTeam('A', skater);
                            }}
                        />
                        <div className="number">{num}</div>
                        <div className="name">{skater.Name}</div>
                        <Icon
                            src={(bindex >= 0) ? IconX : IconRight}
                            active={(bindex >= 0)}
                            onClick={() => {
                                this.addSkaterToTeam('B', skater);
                            }}
                        />
                    </div>
                );
            }
        });

        this.Positions.forEach((pos, index) => {
            positions.push(
                <option 
                    value={pos.value}
                    key={`${pos.value}-${index}`}
                >{pos.name}</option>
            );
        });

        return (
            <div className="skater-list-holder">
                <div className="name">Skaters</div>
                <div className="skater-list">
                    {skaters}
                </div>
                <div className="skater-entry">
                    <Icon
                        src={IconLeft}
                        title="Add to left-side team"
                        onClick={() => {
                            this.addSkater('A');
                        }}
                        />
                    <input 
                        type="text"
                        size={10}
                        maxLength={6}
                        value={this.state.JerseyNumber}
                        onChange={this.onChangeJerseyNumber}
                        onKeyUp={this.onKeyUpJerseyNumber}
                        placeholder="###"
                        />
                    <input 
                        type="text"
                        size={30}
                        maxLength={40}
                        value={this.state.SkaterName}
                        onChange={this.onChangeSkaterName}
                        onKeyUp={this.onKeyUpSkaterName}
                        placeholder="Name"
                        />
                    <select 
                        value={this.state.SkaterPosition}
                        onChange={this.onChangeSkaterPosition}
                        size={1}
                        >{positions}</select>
                    <Icon
                        src={IconRight}
                        title="Add to right-side team"
                        onClick={() => {
                            this.addSkater('B');
                        }}
                        />
                </div>
            </div>
        )
    }
}