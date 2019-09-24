import React from 'react';
import RosterController, {SRosterController} from 'controllers/RosterController';
import DataController from 'controllers/DataController';
import ScoreboardController from 'controllers/ScoreboardController';
import {IconButton, Icon, IconX, IconRight, IconLeft, IconLoop, IconNo} from 'components/Elements';
import Panel from 'components/Panel';
import SortPanel from 'components/tools/SortPanel';
import cnames from 'classnames';
import keycodes from 'tools/keycodes';

import './css/Roster.scss';
import { SkaterRecord } from 'tools/vars';

interface SRoster {
    State:SRosterController,
    Skaters:Array<SkaterRecord>,
    TeamA:{
        ID:number,
        Color:string,
        Name:string
    },
    TeamB:{
        ID:number,
        Color:string,
        Name:string
    },
    Keywords:string,
    VisibleSkaters:Array<SkaterRecord>
}

/**
 * Component for building the roster of skaters and coaches on the track
 */
class Roster extends React.PureComponent<any, SRoster> {
    readonly state:SRoster = {
        State:Object.assign({}, RosterController.getState()),
        Skaters:DataController.getSkaters(true),
        TeamA:{
            ID:ScoreboardController.getState().TeamA.ID,
            Color:ScoreboardController.getState().TeamA.Color,
            Name:ScoreboardController.getState().TeamA.Name
        },
        TeamB:{
            ID:ScoreboardController.getState().TeamB.ID,
            Color:ScoreboardController.getState().TeamB.Color,
            Name:ScoreboardController.getState().TeamB.Name
        },
        Keywords:'',
        VisibleSkaters:[]
    }

    remoteState:Function
    remoteData:Function
    remoteScore:Function

    constructor(props) {
        super(props);
        this.clearSkaters = this.clearSkaters.bind(this);
        this.loadSkaters = this.loadSkaters.bind(this);
        this.onChangeKeywords = this.onChangeKeywords.bind(this);
        this.onKeyUpKeywords = this.onKeyUpKeywords.bind(this);

        this.updateState = this.updateState.bind(this);
        this.updateData = this.updateData.bind(this);
        this.updateScore = this.updateScore.bind(this);

        this.remoteState = RosterController.subscribe(this.updateState);
        this.remoteData = DataController.subscribe(this.updateData);
        this.remoteScore = ScoreboardController.subscribe(this.updateScore);
    }

    /**
     * Updates the state to match the controller.
     */
    updateState() {
        this.setState(() => {
            return {State:Object.assign({}, RosterController.getState())}
        });
    }

    /**
     * Updates the state to refresh the skaters.
     */
    updateData() {
        if(!DataController.compare(DataController.getSkaters(), this.state.Skaters)) {
            this.setState(() => {
                return {Skaters:DataController.getSkaters(true)};
            });
        }
    }

    /**
     * Updates the state to refresh the scoreboard info.
     */
    updateScore() {
        var sstate = ScoreboardController.getState();
        this.setState(() => {
            return {
                TeamA:{
                    ID:sstate.TeamA.ID,
                    Color:sstate.TeamA.Color,
                    Name:sstate.TeamA.Name
                },
                TeamB:{
                    ID:sstate.TeamB.ID,
                    Color:sstate.TeamB.Color,
                    Name:sstate.TeamB.Name
                }
            }
        });
    }

    /**
     * Clears the skaters.
     */
    clearSkaters() {
        RosterController.SetSkaters('A', []);
        RosterController.SetSkaters('B', []);
    }

    /**
     * Loads skaters based on their assigned team, and ordered by name.
     */
    loadSkaters() {
        RosterController.SetSkaters('A', DataController.getTeamSkaters(this.state.TeamA.ID));
        RosterController.SetSkaters('B', DataController.getTeamSkaters(this.state.TeamB.ID));
    }

    /**
     * Triggered when the value of the keywords text input changes.
     * @param {Event} ev 
     */
    onChangeKeywords(ev) {
        var value = ev.target.value;
        this.setState(() => {
            return {Keywords:value}
        });
    }

    /**
     * Triggered when the user presses a key in the keywords field.
     * @param {KeyEvent} ev 
     */
    onKeyUpKeywords(ev) {
        switch(ev.keyCode) {
            case keycodes.ESCAPE :
                this.setState({Keywords:''});
            break;
            case keycodes.ENTER :
                if(this.state.VisibleSkaters.length === 1) {
                    if(ev.ctrlKey) {
                        RosterController.AddSkater('A', this.state.VisibleSkaters[0])
                    } else if(ev.shiftKey) {
                        RosterController.AddSkater('B', this.state.VisibleSkaters[0])
                    }
                }
            break;

            default :

            break;
        }
    }

    /**
     * Renders the component.
     * - Left: Left side team, with name, color, and list of skaters.
     * - Center: Right side team, with name, color, and list of skaters.
     * - Right: List of all available skaters.
     * 
     * Buttons:
     * - Clear: Remove all skaters from both teams.
     * - Load Skaters: Set skaters based on scoreboard teams.
     * - Close: To close the panel.
     */
    render() {
        var skaters:Array<React.ReactElement> = [];
        var rx:RegExp|null = null;
        if(this.state.Keywords.length) {
            rx = new RegExp(this.state.Keywords, 'ig');
        }

        for(var key in this.state.Skaters) {
            let skater = this.state.Skaters[key];
            if(skater.Name === undefined)
                continue;
            
            if(rx !== null) {
                if(skater.Name.search(rx) < 0 && skater.Number !== undefined && skater.Number.toString().search(rx) < 0)
                    continue;
            }
            
            let aindex = this.state.State.TeamA.Skaters.findIndex((s) => {
                return (s.RecordID === skater.RecordID);
            });
            let bindex = this.state.State.TeamB.Skaters.findIndex((s) => {
                return (s.RecordID === skater.RecordID);
            });
            
            skaters.push(
                <div 
                    className="skater-item" 
                    key={`${skater.RecordType}-${skater.RecordID}`}>
                    <Icon
                        src={(aindex >= 0) ? IconX : IconLeft}
                        active={(aindex >= 0)}
                        onClick={() => {
                            if(aindex < 0)
                                RosterController.AddSkater('A', skater);
                            else
                                RosterController.RemoveSkater('A', skater);
                            RosterController.RemoveSkater('B', skater);
                        }}
                    />
                    <div className="number">{`#${skater.Number}`}</div>
                    <div className="name">{skater.Name}</div>
                    <Icon
                        src={(bindex >= 0) ? IconX : IconRight}
                        active={(bindex >= 0)}
                        onClick={() => {
                            if(bindex < 0)
                                RosterController.AddSkater('B', skater);
                            else
                                RosterController.RemoveSkater('B', skater);
                            RosterController.RemoveSkater('A', skater);
                        }}
                    />
                </div>
            );
        }
        

        var buttons = [
            <input type="text" key="txt-keywords"
                value={this.state.Keywords}
                onChange={this.onChangeKeywords}
                size={20}
                maxLength={40}
                />,
            <IconButton
                src={IconLoop}
                onClick={this.loadSkaters}
                key="btn-load"
                >Load</IconButton>,
            <IconButton
                src={IconNo}
                onClick={this.clearSkaters}
                key="btn-clear"
                >Clear</IconButton>
        ];

        return (
            <Panel
                opened={this.props.opened}
                onClose={this.props.onClose}
                contentName="ROS-app"
                buttons={buttons}
                >
                <RosterTeam 
                    team={this.state.State.TeamA} 
                    color={this.state.TeamA.Color}
                    name={this.state.TeamA.Name}
                    />
                <RosterTeam 
                    team={this.state.State.TeamB} 
                    color={this.state.TeamB.Color}
                    name={this.state.TeamB.Name}
                    />
                <div className="skater-list-holder">
                    <div className="name">Skaters</div>
                    <div className="skater-list">
                        {skaters}
                    </div>
                </div>
            </Panel>
        )
    }
}

interface SRosterTeam {
    team:any,
    color:string,
    name:string
}

function RosterTeam(props:SRosterTeam) {
    let skaters:Array<any> = []
    let style = {
        backgroundColor:props.color
    }

    if(props.team.Skaters) {
        props.team.Skaters.forEach((skater) => {
            var src = skater.Thumbnail;
            if(src === null || src === '')
                src = skater.Slide;
            if(src === null || src === '')
                src = skater.Photo;

            if(src !==  null && src !== '')
                src = DataController.mpath(src);
            skaters.push({
                label:<React.Fragment key={`${skater.RecordType}-${skater.RecordID}`}>
                    <div className="number">{`${skater.Number}`}</div>
                    <div className="name">{`${skater.Name}`}</div>
                    <Icon
                        src={IconX}
                        onClick={() => {
                            RosterController.RemoveSkater(props.team.Side, skater);
                        }}
                    />
                </React.Fragment>
            });
        })
    }

    var className = cnames('team', 'team-' + props.team.Side);

    return (
        <div className={className}>
            <div className="name" style={style}>
                {props.name}
            </div>
            <SortPanel
                className="skaters"
                items={skaters}
                onDrop={(a, b, right) => {
                    RosterController.SwapSkaters(props.team.Side, a, b, right);
                }}
                />
        </div>
    );
}

export default Roster;