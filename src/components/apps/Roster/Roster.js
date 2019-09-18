import React from 'react';
import RosterController from 'controllers/RosterController';
import DataController from 'controllers/DataController';
import ScoreboardController from 'controllers/ScoreboardController';
import {IconButton, Icon, IconX, IconRight, IconLeft, IconLoop, IconNo} from 'components/Elements';
import Panel from 'components/Panel';
import SortPanel from 'components/tools/SortPanel';
import cnames from 'classnames';
import keycodes from 'tools/keycodes';

import './css/Roster.scss';

/**
 * Component for building the roster of skaters and coaches on the track
 */
class Roster extends React.PureComponent {
    constructor(props) {
        super(props);
        var sstate = ScoreboardController.getState();
        this.state = {
            State:Object.assign({}, RosterController.getState()),
            Skaters:DataController.getSkaters(true),
            TeamA:{
                ID:sstate.TeamA.ID,
                Color:sstate.TeamA.Color,
                Name:sstate.TeamA.Name
            },
            TeamB:{
                ID:sstate.TeamB.ID,
                Color:sstate.TeamB.Color,
                Name:sstate.TeamB.Name
            },
            Keywords:''
        };

        this.VisibleSkaters = [];

        this.clearSkaters = this.clearSkaters.bind(this);
        this.loadSkaters = this.loadSkaters.bind(this);
        this.onChangeKeywords = this.onChangeKeywords.bind(this);
        this.onKeyUpKeywords = this.onKeyUpKeywords.bind(this);

        this.updateState = this.updateState.bind(this);
        this.updateData = this.updateData.bind(this);
        this.updateScore = this.updateScore.bind(this);

        this.remote = RosterController.subscribe(this.updateState);
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
                if(this.VisibleSkaters.length === 1) {
                    if(ev.ctrlKey) {
                        RosterController.AddSkater('A')
                    }
                }
            break;

            default :

            break;
        }
    }

    componentDidMount() {
        var timer = setInterval(() => {
            if(window && window.LocalServer) {
                //this.loadSkaters();
                clearInterval(timer);
            }
        }, 500);
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
        var skaters = [];
        var rx = null;
        this.VisibleSkaters.length = 0;
        if(this.state.Keywords.length) {
            rx = new RegExp(this.state.Keywords, 'ig');
            this.SkaterLength = 0;
        }

        for(var key in this.state.Skaters) {
            let skater = this.state.Skaters[key];
            if(rx !== null) {
                if(skater.Name.search(rx) < 0 && skater.Number.toString().search(rx) < 0)
                    continue;
            }
            
            let aindex = this.state.State.TeamA.Skaters.findIndex((s) => {
                return (s.RecordID == skater.RecordID);
            });
            let bindex = this.state.State.TeamB.Skaters.findIndex((s) => {
                return (s.RecordID == skater.RecordID);
            });

            this.VisibleSkaters.push(skater);
            
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
                size="20"
                maxLength="40"
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
                <RosterTeam team={this.state.State.TeamA} boardteam={this.state.TeamA}/>
                <RosterTeam team={this.state.State.TeamB} boardteam={this.state.TeamB}/>
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

/**
 * Component for a team on the roster.
 * - Three Groups: Skaters, Coaches, Not-Skating / Injured
 * - User can drag-n-drop to sort skaters, as well as click up/down buttons.
 */
class RosterTeam extends React.PureComponent {
    /**
     * Renders the component
     */
    render() {
        var skaters = [];
        var style = {
            backgroundColor:this.props.boardteam.Color
        };

        if(this.props.team.Skaters) {

            for(let i=0; i < this.props.team.Skaters.length; i++) {
                let skater = this.props.team.Skaters[i];
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
                                RosterController.RemoveSkater(this.props.team.Side, skater);
                            }}
                        />
                    </React.Fragment>
                });
            }
        }

        var className = cnames('team', 'team-' + this.props.team.Side);

        return (
            <div className={className}>
                <div className="name" style={style}>
                    {this.props.boardteam.Name}
                </div>
                <SortPanel
                    className="skaters"
                    items={skaters}
                    onDrop={(a, b, right) => {
                        RosterController.SwapSkaters(this.props.team.Side, a, b, right);
                    }}
                    />
            </div>
        );
    }
}

export default Roster;