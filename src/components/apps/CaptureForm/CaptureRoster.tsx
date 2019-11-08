import React, { CSSProperties } from 'react';
import cnames from 'classnames';
import RosterController from 'controllers/RosterController';
import DataController from 'controllers/DataController';
import ScoreboardController from 'controllers/ScoreboardController';
import CameraController from 'controllers/CameraController';
import vars, { SkaterRecord } from 'tools/vars';
import Carousel, { CarouselRecord } from 'components/3d/Carousel';
import './css/CaptureRoster.scss';
import { Unsubscribe } from 'redux';
import CaptureController from 'controllers/CaptureController';

/**
 * Component for displaying roster on the CaptureForm
 */
export default class CaptureRoster extends React.PureComponent<{
    /**
     * true to show, false to hide
     */
    shown:boolean;
    className:string;
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
        ID:number;
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
        Slide?:string;
        Photo?:string;
    },
    TeamB:{
        ID:number;
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
        Slide?:string;
        Photo?:string;
    },
    CurrentSlide:string;
    ShowTeamPhoto:boolean;
    RemoteShown:boolean;
}> {

    readonly state = {
        CurrentTeam:RosterController.getState().CurrentTeam,
        SkaterIndex:RosterController.getState().SkaterIndex,
        SkatersA:RosterController.getState().TeamA.Skaters,
        SkatersB:RosterController.getState().TeamB.Skaters,
        TeamA:{
            ID:ScoreboardController.getState().TeamA.ID,
            Color:ScoreboardController.getState().TeamA.Color,
            Thumbnail:ScoreboardController.getState().TeamA.Thumbnail,
            Name:ScoreboardController.getState().TeamA.Name,
            Slide:ScoreboardController.getState().TeamA.Slide,
            Photo:ScoreboardController.getState().TeamA.Photo
        },
        TeamB:{
            ID:ScoreboardController.getState().TeamB.ID,
            Color:ScoreboardController.getState().TeamB.Color,
            Thumbnail:ScoreboardController.getState().TeamB.Thumbnail,
            Name:ScoreboardController.getState().TeamB.Name,
            Slide:ScoreboardController.getState().TeamB.Slide,
            Photo:ScoreboardController.getState().TeamB.Photo
        },
        CurrentSlide:'A',
        ShowTeamPhoto:false,
        RemoteShown:RosterController.getState().RemoteShown
    }

    /**
     * RosterController remote
     */
    protected remoteRoster:Function|null = null;
    /**
     * ScoreboardController remote
     */
    protected remoteScoreboard:Function|null = null;

    protected SourceA:string = '';
    protected SourceB:string = '';

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
    protected async updateRoster() {
        let cstate = RosterController.getState();
        let changes:any = {
            CurrentTeam:cstate.CurrentTeam,
            SkaterIndex:cstate.SkaterIndex,
            RemoteShown:cstate.RemoteShown
        };

        let skatersA = cstate.TeamA.Skaters;
        let skatersB = cstate.TeamB.Skaters;

        if(!DataController.compare(skatersA, this.state.SkatersA))
            changes.SkatersA = skatersA;

        if(!DataController.compare(skatersB, this.state.SkatersB))
            changes.SkatersB = skatersB;

        if(cstate.SkaterIndex != this.state.SkaterIndex) {
            if(cstate.SkaterIndex === -1)
                changes.CurrentSlide = 'B';
            else if(this.state.CurrentSlide === 'A')
                changes.CurrentSlide = 'B';
            else
                changes.CurrentSlide = 'A';
        }

        this.setState(changes);
    }

    /**
     * Updates the state to match the scoreboard controller.
     * - Update TeamA
     * - Update TeamB
     */
    updateScoreboard() {
        this.setState({
            TeamA:{
                ID:ScoreboardController.getState().TeamA.ID,
                Color:ScoreboardController.getState().TeamA.Color,
                Thumbnail:ScoreboardController.getState().TeamA.Thumbnail,
                Name:ScoreboardController.getState().TeamA.Name,
                Slide:ScoreboardController.getState().TeamA.Slide,
                Photo:ScoreboardController.getState().TeamA.Photo
            },
            TeamB:{
                ID:ScoreboardController.getState().TeamB.ID,
                Color:ScoreboardController.getState().TeamB.Color,
                Thumbnail:ScoreboardController.getState().TeamB.Thumbnail,
                Name:ScoreboardController.getState().TeamB.Name,
                Slide:ScoreboardController.getState().TeamB.Slide,
                Photo:ScoreboardController.getState().TeamB.Photo
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

    protected renderFullscreen() : JSX.Element {
        let classA:string = cnames({
            slide:true,
            shown:(this.state.CurrentSlide === 'A'),
            team:(this.state.SkaterIndex === -1)
        });

        let shown:boolean = this.props.shown;
        if(!shown && window && window.remoteApps && window.remoteApps.ROS)
            shown = this.state.RemoteShown;

        let classB:string = cnames({
            slide:true,
            shown:(this.state.CurrentSlide === 'B'),
            team:(this.state.SkaterIndex === -1)
        });

        let src:string = '';

        let skater:SkaterRecord|null = null;

        if(this.state.SkaterIndex === -1) {
            if(this.state.CurrentTeam === 'A') {
                if(this.state.TeamA.Slide)
                    src = this.state.TeamA.Slide;
                else if(this.state.TeamA.Photo)
                    src = this.state.TeamA.Photo;
                else
                    src = this.state.TeamA.Thumbnail;
            } else {
                if(this.state.TeamB.Slide)
                    src = this.state.TeamB.Slide;
                else if(this.state.TeamA.Photo)
                    src = this.state.TeamA.Photo;
                else
                    src = this.state.TeamB.Thumbnail;
            }
        } else {
            if(this.state.CurrentTeam === 'A') {
                if(this.state.SkatersA[this.state.SkaterIndex]) {
                    skater = this.state.SkatersA[this.state.SkaterIndex];
                    if(skater.Slide)
                        src = skater.Slide;
                    else if(skater.Photo)
                        src = skater.Photo;
                }
            } else {
                if(this.state.SkatersB[this.state.SkaterIndex]) {
                    skater = this.state.SkatersB[this.state.SkaterIndex];
                    if(skater.Slide)
                        src = skater.Slide;
                    else if(skater.Photo)
                        src = skater.Photo;
                }
            }
        }

        this.SourceA = (this.state.CurrentSlide === 'A') ? src : this.SourceA;
        this.SourceB = (this.state.CurrentSlide === 'B') ? src : this.SourceB;

        return (
            <div className={cnames('capture-roster fullscreen',{
                shown:(shown)
            } )}>
                <div className={classA}>
                    <img src={DataController.mpath(this.SourceA)} alt=""/>
                </div>
                <div className={classB}>
                    <img src={DataController.mpath(this.SourceB)} alt=""/>
                </div>
            </div>
        );
    }

    protected renderCamera() : JSX.Element {
        let teamColor:string = this.state.TeamA.Color;
        let teamLogo:string = this.state.TeamA.Thumbnail;
        let teamName:string = this.state.TeamA.Name;
        let teamID:number = this.state.TeamA.ID;
        let teamSkaters:Array<SkaterRecord> = this.state.SkatersA;
        let thumbnails:Array<CarouselRecord> = new Array<CarouselRecord>();
        let twidth:number = 150;
        let carouselClass = "caro";
        if(this.state.SkaterIndex == -1)
            carouselClass = "cube";
        
        if(this.state.CurrentTeam === 'B') {
            teamLogo = this.state.TeamB.Thumbnail;
            teamColor = this.state.TeamB.Color;
            teamName = this.state.TeamB.Name;
            teamSkaters = this.state.SkatersB;
            teamID = this.state.TeamB.ID;
        }

        teamLogo = DataController.mpath(teamLogo);
        if(teamLogo) {
            thumbnails.push({
                src:DataController.mpath(teamLogo),
                key:`${vars.RecordType.Team}-${teamID}`
            });
        }
        
        let tstyle:CSSProperties = {
            borderColor:teamColor
        }

        let nstyle:CSSProperties = {
            backgroundImage:[
                //"radial-gradient(ellipse at top center, rgba(0,0,0,0.7) 20%, transparent 35%)",
                "linear-gradient(to right, transparent, " + teamColor + ", transparent)"
            ].join(', ')
        }
        
        if(teamSkaters && teamSkaters.length >= 1) {
            for(let i=0; i < teamSkaters.length; i++) {
                let skater = teamSkaters[i];
                if(skater === null || skater === undefined)
                    break;
                let src = teamLogo;
                if(this.props.className === 'fullscreen') {
                    if(skater.Slide)
                        src = DataController.mpath(skater.Slide);
                    else if(skater.Photo)
                        src = DataController.mpath(skater.Photo);
                    else if(skater.Thumbnail)
                        src = DataController.mpath(skater.Thumbnail);
                } else if(skater.Thumbnail) {
                    src = DataController.mpath(skater.Thumbnail);
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

                thumbnails.push({
                    src:src,
                    key:`${vars.RecordType.Skater}-${skater.RecordID}`
                });
            }
        }

        let shown:boolean = this.props.shown;
        if(window && window.remoteApps && window.remoteApps.ROS && this.state.RemoteShown)
            shown = true;

        return (
            <div className={cnames('capture-roster banner', {shown:shown})}
            >
                <Carousel 
                    images={thumbnails}
                    index={(this.state.SkaterIndex+1)}
                    width={twidth}
                    height={twidth}
                    style={tstyle}
                    transform="scale(1.1)"
                    className={carouselClass}
                    />
                <div className="team-name" style={nstyle}>
                    {teamName}
                </div>
                <div className="carousel-shadow"></div>
            </div>
        );
    }

    /**
     * Renders the component
     */
    render() {

        if(this.props.className === 'fullscreen')
            return this.renderFullscreen();
        return this.renderCamera();
    }
}

function SkaterFullscreen(props:{skater:SkaterRecord,className?:string}) {
    if(props.skater.Slide) {
        return <SkaterSlide src={props.skater.Slide} className={props.className}/>;
    } else if(props.skater.Photo) {
        return <SkaterPhoto skater={props.skater} className={props.className}/>;
    } else {
        return (
            <div className={cnames("slide skater nopic", props.className)}>
                {props.skater.Name}
            </div>
        );
    }
}

function SkaterSlide(props:{src:string,className?:string}) : JSX.Element {
    return (
        <div className={cnames('slide skater skater-slide', props.className)}>
            <img src={DataController.mpath(props.src)} alt=""/>
        </div>
    );
}

function SkaterPhoto(props:{skater:SkaterRecord,className?:string}) : JSX.Element {
    let name:string = props.skater.Name;
    return (
        <div className={cnames('slide skater photo', props.className)}>
            <img src={DataController.mpath(props.skater.Photo)} alt=""/>
        </div>
    );
}