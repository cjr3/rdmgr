import React from 'react';
import cnames from 'classnames';
import PenaltyController from 'controllers/PenaltyController';
import CaptureController from 'controllers/CaptureController';
import ScoreboardController from 'controllers/ScoreboardController';
import RosterController from 'controllers/RosterController';
import Panel from 'components/Panel';
import {Button, IconButton, Icon, IconDelete, IconSave, IconX} from 'components/Elements'
import DataController from 'controllers/DataController';
import RecordSelection from 'components/data/RecordSelection';
import './css/PenaltyTracker.scss';

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
class PenaltyTracker extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
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
            Skater:null,
            LockTeams:false,
            TeamAShown:false,
            TeamBShown:false
        };

        this.ShowTimer = null;

        this.TeamA = React.createRef();
        this.TeamB = React.createRef();

        this.onClickSubmit = this.onClickSubmit.bind(this);
        this.togglePenalty = this.togglePenalty.bind(this);
        this.onSelectSkater = this.onSelectSkater.bind(this);
        this.removeSkater = this.removeSkater.bind(this);
        this.loadSkaters = this.loadSkaters.bind(this);

        this.updateCapture = this.updateCapture.bind(this);
        this.updateState = this.updateState.bind(this);
        this.updateScoreboard = this.updateScoreboard.bind(this);
        this.updateData = this.updateData.bind(this);
        this.updateRoster = this.updateRoster.bind(this);

        this.remote = PenaltyController.subscribe(this.updateState);
        this.remoteCapture = CaptureController.subscribe(this.updateCapture);
        this.remoteScoreboard = ScoreboardController.subscribe(this.updateScoreboard);
        this.remoteData = DataController.subscribe(this.updateData);
        this.remoteRoster = RosterController.subscribe(this.updateRoster);
    }

    /**
     * Updates the state to match the controller
     */
    updateState() {
        this.setState(() => {
            return {State:Object.assign({}, PenaltyController.getState())};
        });
    }

    /**
     * Updates the state to match the capture controller.
     */
    updateCapture() {
        this.setState(() => {
            return {Capture:Object.assign({}, CaptureController.getState().PenaltyTracker)};
        });
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
     * Updates the state to match the penalty records.
     */
    updateData() {
        if(!DataController.compare(DataController.getPenalties(), this.state.Penalties)) {
            this.setState(() => {
                return {
                    Penalties:Object.assign({}, DataController.getPenalties())
                };
            });
        }
        
        if(!DataController.compare(DataController.getSkaters(), this.state.Skaters)) {
            this.setState(() => {
                return {
                    Skaters:Object.assign({}, DataController.getSkaters())
                };
            });
        }
    }

    updateRoster() {
        if(!DataController.compare(RosterController.getState().TeamA.Skaters, this.state.TeamASkaters)) {
            this.setState(() => {
                return {TeamASkaters:RosterController.getState().TeamA.Skaters.slice()};
            });
        }
        
        if(!DataController.compare(RosterController.getState().TeamB.Skaters, this.state.TeamBSkaters)) {
            this.setState(() => {
                return {TeamBSkaters:RosterController.getState().TeamB.Skaters.slice()};
            });
        }
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
            var index = skater.Penalties.findIndex((pen) => {
                return (pen.RecordID == penalty.RecordID);
            });
            var pindex = penalized.findIndex((ps) => {
                return (ps.RecordID == skater.RecordID);
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
     * Load the skaters for each team.
     */
    loadSkaters() {
        if(this.TeamA.current)
            this.TeamA.current.loadSkaters();
        if(this.TeamB.current)
            this.TeamB.current.loadSkaters();
    }

    /**
     * Renders the component.
     */
    render() {
        var penalties = [];
        var penalized = [];
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
            if(skater !== null) {
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
                    locked={this.state.LockTeams}
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
                    locked={this.state.LockTeams}
                    ref={this.TeamB}
                />
                <div className="penalty-list">
                    <h3>Penalty Codes</h3>
                    {penalties}
                </div>
                <div className="penalized-skaters">
                    {penalized}
                </div>
                <RecordSelection
                    opened={this.state.TeamAShown}
                    className="skater-selection"
                    title={`${this.state.TeamA.Name}`}
                    records={this.state.Skaters}
                    selected={this.state.TeamA.Skaters}
                    onSubmit={(skaters) => {
                        this.setState((state) => {
                            return {TeamA:Object.assign({}, state.TeamA, {
                                Skaters:skaters
                            })};
                        });
                    }}
                    onClose={() => {
                        this.setState({TeamAShown:false})
                    }}
                    onLoadSkaters={(skaters) => {
                        this.setState((state) => {
                            return {TeamA:Object.assign({}, state.TeamA, {
                                Skaters:skaters
                            })};
                        });
                    }}
                    />
                <RecordSelection
                    opened={this.state.TeamBShown}
                    className="skater-selection"
                    title={`${this.state.TeamB.Name}`}
                    records={this.state.Skaters}
                    selected={this.state.TeamB.Skaters}
                    onSubmit={(skaters) => {
                        this.setState((state) => {
                            return {TeamB:Object.assign({}, state.TeamB, {
                                Skaters:skaters
                            })};
                        });
                    }}
                    onClose={() => {
                        this.setState({TeamBShown:false})
                    }}
                    onLoadSkaters={(skaters) => {
                        this.setState((state) => {
                            return {TeamB:Object.assign({}, state.TeamB, {
                                Skaters:skaters
                            })};
                        });
                    }}
                    />
            </Panel>
        )
    }
}

/**
 * Component to hold skater selection on the penalty tracker.
 */
class PenaltyTrackerTeam extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            Skaters:[]
        };

        this.loadSkaters = this.loadSkaters.bind(this);
    }

    /**
     * Loads the skaters for the user to select from.
     */
    loadSkaters() {
        this.setState(() => {
            var skaters = DataController.getTeamSkaters(this.props.teamid);
            skaters.forEach((skater) => {
                skater.Penalties = [];
                skater.Color = this.props.color;
            });
            return {Skaters:skaters};
        }, () => {
            if(this.props.onLoadSkaters)
                this.props.onLoadSkaters(this.state.Skaters);
        });
    }

    /**
     * Triggered when the component is updated.
     * @param {Object} prevProps 
     */
    componentDidUpdate(prevProps) {
        if(prevProps.teamid !== this.props.teamid && !this.props.locked) {
            //this.loadSkaters();
        }
    }

    /**
     * Triggered when the component is added to the DOM.
     */
    componentDidMount() {
        //this.loadSkaters();
    }

    /**
     * Renders the component.
     */
    render() {
        var skaters = [];
        var style = {backgroundColor:this.props.color};
        var className = cnames('team', `team-${this.props.side}`);

        if(this.props.skaters) {
            this.props.skaters.forEach((skater) => {
                if(skater.Number !== '' && skater.Number !== null) {
                    var active = (this.props.skater && this.props.skater.RecordID == skater.RecordID);
                    skaters.push(
                        <Button
                            key={`${skater.RecordType}-${skater.RecordID}`}
                            active={active}
                            title={skater.Name}
                            onClick={() => {
                                this.props.onSelectSkater(skater);
                            }}
                        >{skater.Number}</Button>
                    );
                }
            });
        }

        return (
            <div className={className}>
                <div className="name" style={style}>{this.props.name}</div>
                <div className="skaters">{skaters}</div>
            </div>
        );
    }
}

export default PenaltyTracker;