import React from 'react';
import cnames from 'classnames';
import PenaltyController, {SPenaltyController, Sides} from 'controllers/PenaltyController';
import ScoreboardController from 'controllers/ScoreboardController';
import RosterController from 'controllers/RosterController';
import Panel from 'components/Panel';
import {Button, IconButton, Icon, IconDelete, IconX, IconHidden, IconShown, IconCheck} from 'components/Elements'
import './css/PenaltyTracker.scss';
import { SkaterRecord, PenaltyRecord } from 'tools/vars';
import UIController from 'controllers/UIController';
import { Unsubscribe } from 'redux';
import PenaltiesController from 'controllers/PenaltiesController';
import SkatersController from 'controllers/SkatersController';
import PenaltyCaptureController from 'controllers/capture/Penalty';

/**
 * Component for the penalty tracker
 * 
 * The component is split into two sides, and a bottom panel
 * that lists the penalized skaters.
 * 
 * Left Side: Skaters
 * Right Side: Penalty Assignment
 * 
 */
export default class PenaltyTracker extends React.PureComponent<any, {
    /**
     * Penalties the user can select from
     */
    Penalties:Array<PenaltyRecord>;
    /**
     * Penalized Skaters
     */
    Penalized:Array<SkaterRecord>;
    Skater:SkaterRecord|null;
    opened:boolean;
    Shown:boolean;
}> {
    readonly state = {
        Penalties:PenaltiesController.Get(),
        Shown:PenaltyCaptureController.GetState().Shown,
        Penalized:PenaltyController.GetState().Skaters,
        Skater:PenaltyController.GetState().Skater,
        opened:UIController.GetState().PenaltyTracker.Shown
    }

    /**
     * PenaltyController listener
     */
    protected remotePenalty?:Unsubscribe;
    /**
     * CaptureController listener
     */
    protected remoteCapture?:Unsubscribe;
    /**
     * PenaltiesController listener
     */
    protected remotePenalties?:Unsubscribe;

    /**
     * UIController listener
     */
    protected remoteUI?:Unsubscribe;

    /**
     * Constructor
     * @param props 
     */
    constructor(props) {
        super(props);
        this.togglePenalty = this.togglePenalty.bind(this);
        this.updateCapture = this.updateCapture.bind(this);
        this.updatePenalty = this.updatePenalty.bind(this);
        this.updatePenalties = this.updatePenalties.bind(this);
        this.updateUI = this.updateUI.bind(this);
    }

    protected async updateUI() {
        this.setState({
            opened:UIController.GetState().PenaltyTracker.Shown
        });
    }

    /**
     * Updates the state to match the controller
     */
    protected updatePenalty() {
        this.setState({
            Penalized:PenaltyController.GetState().Skaters,
            Skater:PenaltyController.GetState().Skater
        });
    }

    /**
     * Updates the state to match the capture controller.
     */
    protected updateCapture() {
        this.setState({Shown:PenaltyCaptureController.GetState().Shown});
    }

    /**
     * Updates the state to match the penalty and skater records.
     */
    protected updatePenalties() {
        this.setState({Penalties:PenaltiesController.Get()});
    }

    /**
     * Adds/removes the penalty from the current skater,
     * and adds/removes the current skater to the list of penalized skaters.
     * @param {PenaltyRecord} penalty 
     */
    protected togglePenalty(penalty:PenaltyRecord) {
        if(!this.state.Skater)
            return;

        let current:Array<PenaltyRecord> = this.state.Skater.Penalties;
        let penalties:Array<PenaltyRecord> = new Array<PenaltyRecord>();
        if(!current) {
            penalties.push(penalty);
        }
        else {
            let index:number = current.findIndex((r) => r.RecordID == penalty.RecordID);
            if(index < 0) {
                penalties = current.slice();
                penalties.push(penalty);
            } else {
                penalties = current.filter((r) => (r.RecordID != penalty.RecordID));
            }
        }

        PenaltyController.Update(this.state.Skater, penalties);
    }

    /**
     * Start listeners
     */
    componentDidMount() {
        this.remotePenalty = PenaltyController.Subscribe(this.updatePenalty);
        this.remoteCapture = PenaltyCaptureController.Subscribe(this.updateCapture);
        this.remotePenalties = PenaltiesController.Subscribe(this.updatePenalties);
        this.remoteUI = UIController.Subscribe(this.updateUI);
    }

    /**
     * Close listener
     */
    componentWillUnmount() {
        if(this.remoteCapture)
            this.remoteCapture();
        if(this.remotePenalty)
            this.remotePenalty();
        if(this.remotePenalties)
            this.remotePenalties();
        if(this.remoteUI)
            this.remoteUI();
    }

    /**
     * Renders the component.
     */
    render() {
        var penalties:Array<React.ReactElement> = [];
        var penalized:Array<React.ReactElement> = [];
        var viewIcon = IconHidden;
        if(this.state.Shown)
            viewIcon = IconShown;

        var buttons = [
            <IconButton
                key="btn-hide"
                src={viewIcon}
                title="Show/hide"
                active={this.state.Shown}
                onClick={PenaltyCaptureController.Toggle}
            >{(this.state.Shown) ? 'Hide' : 'Show'}</IconButton>,
            <IconButton
                key="btn-clear"
                src={IconDelete}
                onClick={PenaltyController.Clear}>Clear</IconButton>
        ];

        for(var key in this.state.Penalties) {
            let penalty = this.state.Penalties[key];
            let active = false;
            if(this.state.Skater) {
                let skater:SkaterRecord = this.state.Skater;
                if(skater.Penalties) {
                    let pindex = skater.Penalties.findIndex((p) => p.RecordID === penalty.RecordID);
                    if(pindex >= 0)
                        active = true;
                }
            }

            let code = penalty.Acronym;
            if(code === null || code === '' || code === undefined)
                code = penalty.Code;

            penalties.push(
                <Button
                    key={`${penalty.RecordType}-${penalty.RecordID}`}
                    active={active}
                    onClick={() => {
                        this.togglePenalty(penalty);
                    }}
                >{code}</Button>
            )
        };

        this.state.Penalized.forEach((pskater:SkaterRecord) => {
            let codes:Array<string> = new Array<string>();
            if(pskater.Penalties && pskater.Penalties.length) {
                pskater.Penalties.forEach((p) => {
                    if(p.Acronym)
                        codes.push(p.Acronym);
                    else if(p.Code)
                        codes.push(p.Code);
                });
            }

            penalized.push(
                <div
                    className="skater-penalized"
                    key={`${pskater.RecordType}-${pskater.RecordID}`}>
                    <Button
                        active={(this.state.Skater && this.state.Skater.RecordID === pskater.RecordID)}
                        onClick={() => {
                            PenaltyController.SetCurrentSkater(pskater);
                        }}
                        title={pskater.Name}
                        >{`#${pskater.Number}: ${codes.join(', ')}`}</Button>
                    <Icon
                        src={IconX}
                        onClick={() => {
                            PenaltyController.Remove(pskater.RecordID);
                        }}
                        />
                </div>
            );
        });

        return (
            <Panel
                opened={this.state.opened}
                buttons={buttons}
                contentName="PT-app"
                >
                <PenaltyTrackerTeam side='A'/>
                <PenaltyTrackerTeam side='B'/>
                <div className="penalty-list">
                    <h3>Penalty Codes</h3>
                    {penalties}
                </div>
                <div className="penalized-skaters">
                    {penalized}
                </div>
            </Panel>
        )
    }
}

class PenaltyTrackerTeam extends React.PureComponent<{
    side:Sides;
}, {
    Skaters:Array<SkaterRecord>;
    Name:string;
    Color:string;
    Skater:SkaterRecord|null;
}> {
    readonly state = {
        Skaters:new Array<SkaterRecord>(),
        Name:'',
        Color:'#000',
        Skater:PenaltyController.GetState().Skater,
    }

    protected remotePenalty?:Unsubscribe;
    protected remoteRoster?:Unsubscribe;
    protected remoteScoreboard?:Unsubscribe;

    constructor(props) {
        super(props);
        this.updatePenalty = this.updatePenalty.bind(this);
        this.updateRoster = this.updateRoster.bind(this);
        this.updateScoreboard = this.updateScoreboard.bind(this);
        if(this.props.side === 'A') {
            this.state.Skaters = RosterController.GetState().TeamA.Skaters;
            this.state.Name = ScoreboardController.GetState().TeamA.Name;
            this.state.Color = ScoreboardController.GetState().TeamA.Color;
        } else {
            this.state.Skaters = RosterController.GetState().TeamB.Skaters;
            this.state.Name = ScoreboardController.GetState().TeamB.Name;
            this.state.Color = ScoreboardController.GetState().TeamB.Color;
        }
    }

    protected updatePenalty() {
        this.setState({Skater:PenaltyController.GetState().Skater});
    }

    protected updateRoster() {
        if(this.props.side === 'A') {
            this.setState({Skaters:RosterController.GetState().TeamA.Skaters});
        } else {
            this.setState({Skaters:RosterController.GetState().TeamB.Skaters});
        }
    }

    protected updateScoreboard() {
        if(this.props.side === 'A') {
            this.setState({
                Name:ScoreboardController.GetState().TeamA.Name,
                Color:ScoreboardController.GetState().TeamA.Color
            });
        } else {
            this.setState({
                Name:ScoreboardController.GetState().TeamB.Name,
                Color:ScoreboardController.GetState().TeamB.Color
            });
        }
    }

    componentDidMount() {
        this.remotePenalty = PenaltyController.Subscribe(this.updatePenalty);
        this.remoteRoster = RosterController.Subscribe(this.updateRoster);
        this.remoteScoreboard = ScoreboardController.Subscribe(this.updateScoreboard);
    }

    componentWillUnmount() {
        if(this.remotePenalty)
            this.remotePenalty();
        if(this.remoteRoster)
            this.remoteRoster();
        if(this.updateScoreboard)
            this.updateScoreboard();
    }

    render() {
        let className:string = cnames('team', `team-${this.props.side}`);
        let skaters:Array<React.ReactElement> = new Array<React.ReactElement>();
        this.state.Skaters.forEach((skater) => {
            if(skater.Number) {
                let className = cnames({
                    active:(this.state.Skater && this.state.Skater.RecordID == skater.RecordID),
                    jammer:(skater.Position && skater.Position === 'Jammer'),
                    pivot:(skater.Position && skater.Position === 'Pivot'),
                    penalized:(skater.Penalties && skater.Penalties.length >= 1)
                });
                skaters.push(
                    <Button
                        key={`${skater.RecordType}-${skater.RecordID}`}
                        className={className}
                        title={skater.Name}
                        onClick={() => {
                            PenaltyController.SetCurrentSkater(skater);
                        }}
                    >{skater.Number}</Button>
                );
            }
        });

        return (
            <div className={className}>
                <div className="name" style={{backgroundColor:this.state.Color}}>{this.state.Name}</div>
                <div className="skaters">{skaters}</div>
            </div>
        )
    }
}