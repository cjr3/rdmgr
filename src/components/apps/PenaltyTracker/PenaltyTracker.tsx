import React from 'react';
import cnames from 'classnames';
import PenaltyController, {SPenaltyController} from 'controllers/PenaltyController';
import CaptureController, {CaptureStatePenalty} from 'controllers/CaptureController';
import ScoreboardController from 'controllers/ScoreboardController';
import RosterController from 'controllers/RosterController';
import Panel from 'components/Panel';
import {Button, IconButton, Icon, IconDelete, IconSave, IconX} from 'components/Elements'
import DataController from 'controllers/DataController';
import RecordSelection from 'components/data/RecordSelection';
import './css/PenaltyTracker.scss';
import { SkaterRecord } from 'tools/vars';

interface SPenaltyTracker {
    Penalties:any,
    Skaters:any,
    Capture:CaptureStatePenalty,
    State:SPenaltyController,
    Penalized:Array<SkaterRecord>,
    TeamA:{
        ID:number,
        Name:string,
        Color:string
    },
    TeamASkaters:Array<SkaterRecord>,
    TeamB:{
        ID:number,
        Name:string,
        Color:string
    },
    TeamBSkaters:Array<SkaterRecord>,
    Skater:SkaterRecord|null
}

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
class PenaltyTracker extends React.PureComponent<any, SPenaltyTracker> {
    readonly state:SPenaltyTracker = {
        Penalties:Object.assign({}, DataController.getPenalties()),
        Skaters:Object.assign({}, DataController.getSkaters()),
        Capture:Object.assign({}, CaptureController.getState().PenaltyTracker),
        State:Object.assign({}, PenaltyController.getState()),
        Penalized:[],
        TeamA:{
            ID:ScoreboardController.getState().TeamA.ID,
            Name:ScoreboardController.getState().TeamA.Name,
            Color:ScoreboardController.getState().TeamA.Color
        },
        TeamASkaters:RosterController.getState().TeamA.Skaters.slice(),
        TeamB:{
            ID:ScoreboardController.getState().TeamB.ID,
            Name:ScoreboardController.getState().TeamB.Name,
            Color:ScoreboardController.getState().TeamB.Color
        },
        TeamBSkaters:RosterController.getState().TeamB.Skaters.slice(),
        Skater:null
    }

    ShowTimer:number = 0
    TeamA:React.RefObject<React.ReactElement> = React.createRef()
    TeamB:React.RefObject<React.ReactElement> = React.createRef()

    remoteState:Function
    remoteCapture:Function
    remoteScoreboard:Function
    remoteData:Function
    remoteRoster:Function

    constructor(props) {
        super(props);

        this.onClickSubmit = this.onClickSubmit.bind(this);
        this.togglePenalty = this.togglePenalty.bind(this);
        this.onSelectSkater = this.onSelectSkater.bind(this);
        this.removeSkater = this.removeSkater.bind(this);

        this.updateCapture = this.updateCapture.bind(this);
        this.updateState = this.updateState.bind(this);
        this.updateScoreboard = this.updateScoreboard.bind(this);
        this.updateData = this.updateData.bind(this);
        this.updateRoster = this.updateRoster.bind(this);

        this.remoteState = PenaltyController.subscribe(this.updateState);
        this.remoteCapture = CaptureController.subscribe(this.updateCapture);
        this.remoteScoreboard = ScoreboardController.subscribe(this.updateScoreboard);
        this.remoteData = DataController.subscribe(this.updateData);
        this.remoteRoster = RosterController.subscribe(this.updateRoster);
    }

    /**
     * Updates the state to match the controller
     */
    updateState() {
        this.setState({State:PenaltyController.getState()});
    }

    /**
     * Updates the state to match the capture controller.
     */
    updateCapture() {
        this.setState({Capture:CaptureController.getState().PenaltyTracker});
    }

    /**
     * Updates the state to match the scoreboard.
     */
    updateScoreboard() {
        this.setState(() => {
            var cstate = ScoreboardController.getState();
            return {
                TeamA:{
                    ID:cstate.TeamA.ID,
                    Name:cstate.TeamA.Name,
                    Color:cstate.TeamA.Color
                },
                TeamB:{
                    ID:cstate.TeamB.ID,
                    Name:cstate.TeamB.Name,
                    Color:cstate.TeamB.Color
                }
            };
        });
    }

    /**
     * Updates the state to match the penalty and skater records.
     */
    updateData() {
        this.setState({
            Penalties:DataController.getPenalties(),
            Skaters:DataController.getSkaters()
        });
    }

    /**
     * Updates the state to match the roster controller
     */
    updateRoster() {
        this.setState({
            TeamASkaters:RosterController.getState().TeamA.Skaters,
            TeamBSkaters:RosterController.getState().TeamB.Skaters
        });
    }

    /**
     * Adds/removes the penalty from the current skater,
     * and adds/removes the current skater to the list of penalized skaters.
     * @param {Object} penalty 
     */
    togglePenalty(penalty) {
        if(this.state.Skater === null)
            return;

        this.setState((state) => {
            var cstate = Object.assign({}, state);
            var penalized = cstate.Penalized;
            var skater = cstate.Skater;
            var index = -1;
            var pindex = -1;
            if(skater !== null && skater.Penalties !== undefined) {
                index = skater.Penalties.findIndex((pen) => {
                    return (pen.RecordID == penalty.RecordID);
                });
                pindex = penalized.findIndex((ps) => {
                    if(skater !==  null)
                        return (ps.RecordID == skater.RecordID);
                    return false;
                });

                if(index < 0) {
                    skater.Penalties.push(penalty);
                } else {
                    skater.Penalties.splice(index, 1);
                }

                if(skater.Penalties.length >= 1) {
                    if(pindex < 0) {
                        penalized.push(skater);
                    } else {
                        penalized[pindex].Penalties = skater.Penalties;
                    }
                } else if(pindex >= 0) {
                    //remove skater from penalized skaters
                    penalized.splice(pindex, 1);
                }
            }
            
            return {
                Penalized:[...penalized]
            };
        });
    }

    /**
     * Triggered when the user clicks 'submit'
     * - Shows the penalized skaters if there are any,
     *   and then hides them after 10 seconds.
     */
    onClickSubmit() {
        this.setState({Skater:null});
        PenaltyController.SetSkaters(this.state.Penalized);
        CaptureController.SetPenaltyTrackerVisibility(true);
    }

    /**
     * Triggered when the user selects a skater.
     * @param {Object} skater 
     */
    onSelectSkater(skater) {
        this.setState((state) => {
            if(state.Skater && state.Skater.RecordID == skater.RecordID) {
                return {Skater:null};
            }
            return {Skater:skater};
        });
    }

    /**
     * Gets the skater object from the penalized skaters
     * @param {Number} id 
     */
    getSkater(id) {
        var index = this.getSkaterIndex(id);
        if(index < 0)
            return null;
        return this.state.Penalized[index];
    }

    /**
     * Gets the penalty box index for the skater with the given ID
     * @param {Number} id 
     */
    getSkaterIndex(id) {
        return this.state.Penalized.findIndex((s) => {return (s.RecordID == id)});
    }

    /**
     * Removes the skater from the penalty box.
     * @param {Object} skater 
     */
    removeSkater(skater) {
        var index = this.getSkaterIndex(skater.RecordID);
        if(index >= 0) {
            this.setState((state) => {
                var cstate = Object.assign({}, state);
                cstate.Penalized[index].Penalties = [];
                cstate.Penalized.splice(index, 1);
                return {Penalized:[...cstate.Penalized], Skater:null};
            });
        }
    }

    /**
     * Renders the component.
     */
    render() {
        var penalties:Array<React.ReactElement> = [];
        var penalized:Array<React.ReactElement> = [];
        var skater = this.state.Skater;
        var viewIcon = require('images/icons/eye-closed.png');
        if(this.state.Capture.Shown)
            viewIcon = require('images/icons/eye-open.png');

        var buttons = [
            <IconButton
                key="btn-hide"
                src={viewIcon}
                title="Show/hide"
                active={this.state.Capture.Shown}
                onClick={CaptureController.TogglePenaltyTracker}
            >{(this.state.Capture.Shown) ? 'Hide' : 'Show'}</IconButton>,
            <IconButton
                key="btn-clear"
                src={IconDelete}
                onClick={() => {
                    this.setState((state) => {
                        var cstate = Object.assign({}, state);
                        cstate.Penalized.forEach((s) => {
                            s.Penalties = [];
                        });
                        cstate.Penalized.length = 0;
                        return {Penalized:[...cstate.Penalized], Skater:null}
                    },PenaltyController.Clear);
                }}>Clear</IconButton>,
            <IconButton
                key="btn-submit"
                src={IconSave}
                onClick={this.onClickSubmit}>Send</IconButton>,
        ];

        for(var key in this.state.Penalties) {
            let penalty = this.state.Penalties[key];
            let active = false;
            if(skater !== null && skater.Penalties !== undefined) {
                var pindex = skater.Penalties.findIndex((p) => {
                    return (p.RecordID == penalty.RecordID);
                });
                if(pindex >= 0)
                    active = true;
            }

            var code = penalty.Acronym;
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

        this.state.Penalized.forEach((pskater) => {
            penalized.push(
                <div
                    className="skater-penalized"
                    key={`${pskater.RecordType}-${pskater.RecordID}`}>
                    <Button
                        active={(skater && skater.RecordID == pskater.RecordID)}
                        onClick={() => {
                            this.onSelectSkater(pskater);
                        }}
                        >{`#${pskater.Number}-${pskater.Name}`}</Button>
                    <Icon
                        src={IconX}
                        onClick={() => {
                            this.removeSkater(pskater);
                        }}
                        />
                </div>
            );
        });

        return (
            <Panel
                opened={this.props.opened}
                buttons={buttons}
                contentName="PT-app"
                >
                <PenaltyTrackerTeam
                    side='A'
                    teamid={this.state.TeamA.ID}
                    skaters={this.state.TeamASkaters}
                    name={this.state.TeamA.Name}
                    color={this.state.TeamA.Color}
                    onSelectSkater={this.onSelectSkater}
                    skater={this.state.Skater}
                    ref={this.TeamA}
                />
                <PenaltyTrackerTeam
                    side='B'
                    teamid={this.state.TeamB.ID}
                    name={this.state.TeamB.Name}
                    skaters={this.state.TeamBSkaters}
                    color={this.state.TeamB.Color}
                    onSelectSkater={this.onSelectSkater}
                    skater={this.state.Skater}
                    ref={this.TeamB}
                />
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

interface PPenaltyTrackerTeam {
    side:string,
    teamid:number,
    color?:string,
    onLoadSkaters?:Function,
    onSelectSkater?:Function
    skaters?:Array<SkaterRecord>,
    skater?:SkaterRecord|undefined|null,
    name?:string,
    ref?:React.RefObject<React.ReactElement>
}

/**
 * Component to hold skater selection on the penalty tracker.
 */
function PenaltyTrackerTeam(props:PPenaltyTrackerTeam) : React.ReactElement {
    var skaters:Array<React.ReactElement> = [];
    var style = {backgroundColor:props.color};
    var className = cnames('team', `team-${props.side}`);

    if(props.skaters) {
        props.skaters.forEach((skater) => {
            if(skater.Number !== '' && skater.Number !== null) {
                var active = (props.skater && props.skater.RecordID == skater.RecordID);
                skaters.push(
                    <Button
                        key={`${skater.RecordType}-${skater.RecordID}`}
                        active={active}
                        title={skater.Name}
                        onClick={() => {
                            if(props.onSelectSkater !== undefined)
                                props.onSelectSkater(skater);
                        }}
                    >{skater.Number}</Button>
                );
            }
        });
    }

    return (
        <div className={className}>
            <div className="name" style={style}>{props.name}</div>
            <div className="skaters">{skaters}</div>
        </div>
    );
}

export default PenaltyTracker;