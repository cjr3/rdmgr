import React from 'react';
import cnames from 'classnames';
import RosterController from 'controllers/RosterController';
import DataController from 'controllers/DataController';
import ScoreboardController from 'controllers/ScoreboardController';
import { SkaterRecord } from 'tools/vars';
import './css/CaptureRoster.scss';

/**
 * Component for displaying roster on the CaptureForm
 */
export default class CaptureRoster extends React.PureComponent<{
    /**
     * true to show, false to hide
     */
    shown:boolean;
}, {
    /**
     * Currently display team 
     */
    CurrentTeam:string;
    /**
     * Current skater
     */
    SkaterIndex:number;
    /**
     * Skaters on left side team
     */
    SkatersA:Array<SkaterRecord>;
    /**
     * Skaters on right side team
     */
    SkatersB:Array<SkaterRecord>;
    /**
     * Left side team
     */
    TeamA:{
        /**
         * Color
         */
        Color:string;
        /**
         * Logo
         */
        Thumbnail:string;
        /**
         * Name
         */
        Name:string;
    },
    TeamB:{
        /**
         * Color
         */
        Color:string;
        /**
         * Logo
         */
        Thumbnail:string;
        /**
         * Name
         */
        Name:string;
    }
}> {

    readonly state = {
        CurrentTeam:RosterController.getState().CurrentTeam,
        SkaterIndex:RosterController.getState().SkaterIndex,
        SkatersA:RosterController.getState().TeamA.Skaters,
        SkatersB:RosterController.getState().TeamB.Skaters,
        TeamA:{
            Color:ScoreboardController.getState().TeamA.Color,
            Thumbnail:ScoreboardController.getState().TeamA.Thumbnail,
            Name:ScoreboardController.getState().TeamA.Name
        },
        TeamB:{
            Color:ScoreboardController.getState().TeamB.Color,
            Thumbnail:ScoreboardController.getState().TeamB.Thumbnail,
            Name:ScoreboardController.getState().TeamB.Name
        }
    }

    /**
     * RosterController remote
     */
    protected remoteRoster:Function|null = null;
    /**
     * ScoreboardController remote
     */
    protected remoteScoreboard:Function|null = null;

    /**
     * Constructor
     * @param props 
     */
    constructor(props) {
        super(props);
        this.updateRoster = this.updateRoster.bind(this);
        this.updateScoreboard = this.updateScoreboard.bind(this);
    }

    /**
     * Updates the state to match the roster controller.
     */
    updateRoster() {
        this.setState({
            CurrentTeam:RosterController.getState().CurrentTeam,
            SkaterIndex:RosterController.getState().SkaterIndex,
            SkatersA:RosterController.getState().TeamA.Skaters,
            SkatersB:RosterController.getState().TeamB.Skaters,
        });
    }

    /**
     * Updates the state to match the scoreboard controller.
     * - Update TeamA
     * - Update TeamB
     */
    updateScoreboard() {
        this.setState({
            TeamA:{
                Color:ScoreboardController.getState().TeamA.Color,
                Thumbnail:ScoreboardController.getState().TeamA.Thumbnail,
                Name:ScoreboardController.getState().TeamA.Name
            },
            TeamB:{
                Color:ScoreboardController.getState().TeamB.Color,
                Thumbnail:ScoreboardController.getState().TeamB.Thumbnail,
                Name:ScoreboardController.getState().TeamB.Name
            }
        });
    }

    /**
     * Start listeners
     */
    componentDidMount() {
        this.remoteRoster = RosterController.subscribe(this.updateRoster);
        this.remoteScoreboard = ScoreboardController.subscribe(this.updateScoreboard);
    }

    /**
     * Close listeners
     */
    componentWillUnmount() {
        if(this.remoteScoreboard !== null)
            this.remoteScoreboard();
        if(this.remoteRoster !== null)
            this.remoteRoster();
    }

    /**
     * Renders the component
     */
    render() {
        let teamColor:string = this.state.TeamA.Color;
        let teamLogo:string = this.state.TeamA.Thumbnail;
        let teamName:string = this.state.TeamA.Name;
        let teamSkaters:Array<SkaterRecord> = this.state.SkatersA;
        
        if(this.state.CurrentTeam === 'B') {
            teamLogo = this.state.TeamB.Thumbnail;
            teamColor = this.state.TeamB.Color;
            teamName = this.state.TeamB.Name;
            teamSkaters = this.state.SkatersB;
        }

        teamLogo = DataController.mpath(teamLogo);
        let skaters:Array<React.ReactElement> = [];
        
        if(teamSkaters && teamSkaters.length >= 1) {
            for(let i=0; i < teamSkaters.length; i++) {
                let skater = teamSkaters[i];
                if(skater === null || skater === undefined)
                    break;
                let src = DataController.mpath(skater.Thumbnail);
                if(!src) {
                    src = teamLogo;
                }

                if(i === this.state.SkaterIndex) {
                    teamName = (skater.Name !== undefined) ? skater.Name : teamName;
                    if(skater.Teams !== undefined && skater.Teams.length === 1) {
                        if(skater.Teams[0].Coach)
                            teamName = `Coach ${skater.Name}`;
                        else if(skater.Teams[0].Captain)
                            teamName = `Captain #${skater.Number} ${skater.Name}`;
                        else if(skater.Teams[0].CoCaptain)
                            teamName = `Co-Captain #${skater.Number} ${skater.Name}`;
                        else
                            teamName = `#${skater.Number} ${skater.Name}`;
                    } else if(skater.Number) {
                        teamName = `#${skater.Number} ${skater.Name}`;
                    }
                }
                skaters.push(
                    <div
                        key={`${skater.RecordType}-${skater.RecordID}`}
                        className={cnames('skater', {
                            current:(i === this.state.SkaterIndex)
                        })}
                        >
                        <img src={src} alt="" style={{borderColor:teamColor}}/>
                        <div className="num"
                            style={{
                                backgroundImage:`linear-gradient(rgba(0,0,0,0), ${teamColor})`
                            }}
                            >{skater.Number}</div>
                    </div>
                )
            }
        }

        return (
            <div className={cnames('capture-roster', {
                shown:this.props.shown
            })}
            >
                <div className="roster-thumbs">
                    <div className="team-logo">
                        <img src={teamLogo} alt=""/>
                    </div>
                    <div className="skaters">
                        {skaters}
                    </div>
                </div>
                <div className="team-name"
                    style={{
                        backgroundColor:teamColor
                    }}>
                    {teamName}
                </div>
            </div>
        )
    }
}