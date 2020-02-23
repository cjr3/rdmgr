import React, { CSSProperties } from 'react';
import cnames from 'classnames';
import RosterController, { Sides, SRosterController, SRosterTeam } from 'controllers/RosterController';
import ScoreboardController, { SScoreboardTeam } from 'controllers/ScoreboardController';
import vars, { SkaterRecord } from 'tools/vars';
import Carousel, { CarouselRecord } from 'components/3d/Carousel';
import './css/CaptureRoster.scss';
import { Unsubscribe } from 'redux';
import RosterCaptureController from 'controllers/capture/Roster';
import { Compare, AddMediaPath } from 'controllers/functions';

/**
 * Component for displaying roster on the CaptureForm
 */
export default class CaptureRoster extends React.PureComponent<any, {
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
    Shown:boolean;
    className:string;
}> {

    readonly state = {
        CurrentTeam:RosterController.GetState().CurrentTeam,
        SkaterIndex:RosterController.GetState().SkaterIndex,
        SkatersA:RosterController.GetState().TeamA.Skaters,
        SkatersB:RosterController.GetState().TeamB.Skaters,
        TeamA:{
            ID:ScoreboardController.GetState().TeamA.ID,
            Color:ScoreboardController.GetState().TeamA.Color,
            Thumbnail:ScoreboardController.GetState().TeamA.Thumbnail,
            Name:ScoreboardController.GetState().TeamA.Name,
            Slide:ScoreboardController.GetState().TeamA.Slide,
            Photo:ScoreboardController.GetState().TeamA.Photo
        },
        TeamB:{
            ID:ScoreboardController.GetState().TeamB.ID,
            Color:ScoreboardController.GetState().TeamB.Color,
            Thumbnail:ScoreboardController.GetState().TeamB.Thumbnail,
            Name:ScoreboardController.GetState().TeamB.Name,
            Slide:ScoreboardController.GetState().TeamB.Slide,
            Photo:ScoreboardController.GetState().TeamB.Photo
        },
        CurrentSlide:'A',
        ShowTeamPhoto:false,
        RemoteShown:RosterController.GetState().RemoteShown,
        Shown:RosterCaptureController.GetState().Shown,
        className:RosterCaptureController.GetState().className
    }

    protected remoteRoster?:Unsubscribe;
    protected remoteScoreboard?:Unsubscribe;
    protected remoteCapture?:Unsubscribe;

    protected SourceA:string = '';
    protected SourceB:string = '';

    /**
     * Constructor
     * @param props 
     */
    constructor(props) {
        super(props);
        this.updateRoster = this.updateRoster.bind(this);
        this.updateCapture = this.updateCapture.bind(this);
        this.updateScoreboard = this.updateScoreboard.bind(this);
    }

    /**
     * Updates the state to match the roster controller.
     */
    protected updateRoster() {
        let cstate = RosterController.GetState();
        let changes:any = {
            CurrentTeam:cstate.CurrentTeam,
            SkaterIndex:cstate.SkaterIndex,
            RemoteShown:cstate.RemoteShown
        };

        let skatersA = cstate.TeamA.Skaters;
        let skatersB = cstate.TeamB.Skaters;

        if(!Compare(skatersA, this.state.SkatersA))
            changes.SkatersA = skatersA;

        if(!Compare(skatersB, this.state.SkatersB))
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
    protected updateScoreboard() {
        this.setState({
            TeamA:{
                ID:ScoreboardController.GetState().TeamA.ID,
                Color:ScoreboardController.GetState().TeamA.Color,
                Thumbnail:ScoreboardController.GetState().TeamA.Thumbnail,
                Name:ScoreboardController.GetState().TeamA.Name,
                Slide:ScoreboardController.GetState().TeamA.Slide,
                Photo:ScoreboardController.GetState().TeamA.Photo
            },
            TeamB:{
                ID:ScoreboardController.GetState().TeamB.ID,
                Color:ScoreboardController.GetState().TeamB.Color,
                Thumbnail:ScoreboardController.GetState().TeamB.Thumbnail,
                Name:ScoreboardController.GetState().TeamB.Name,
                Slide:ScoreboardController.GetState().TeamB.Slide,
                Photo:ScoreboardController.GetState().TeamB.Photo
            }
        });
    }

    protected updateCapture() {
        this.setState({
            Shown:RosterCaptureController.GetState().Shown,
            className:RosterCaptureController.GetState().className
        })
    }

    /**
     * Start listeners
     */
    componentDidMount() {
        this.remoteRoster = RosterController.Subscribe(this.updateRoster);
        this.remoteScoreboard = ScoreboardController.Subscribe(this.updateScoreboard);
        this.remoteCapture = RosterCaptureController.Subscribe(this.updateCapture);
    }

    /**
     * Close listeners
     */
    componentWillUnmount() {
        if(this.remoteScoreboard)
            this.remoteScoreboard();
        if(this.remoteRoster)
            this.remoteRoster();
        if(this.remoteCapture)
            this.remoteCapture();
    }

    protected renderFullscreen() : JSX.Element {
        let classA:string = cnames({
            slide:true,
            shown:(this.state.CurrentSlide === 'A'),
            team:(this.state.SkaterIndex === -1)
        });

        let shown:boolean = this.state.Shown;
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
                    if(skater != null) {
                        if(skater.Slide)
                            src = skater.Slide;
                        else if(skater.Photo)
                            src = skater.Photo;
                    }
                }
            } else {
                if(this.state.SkatersB[this.state.SkaterIndex]) {
                    skater = this.state.SkatersB[this.state.SkaterIndex];
                    if(skater != null) {
                        if(skater.Slide)
                            src = skater.Slide;
                        else if(skater.Photo)
                            src = skater.Photo;
                    }
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
                    <img src={AddMediaPath(this.SourceA)} alt=""/>
                </div>
                <div className={classB}>
                    <img src={AddMediaPath(this.SourceB)} alt=""/>
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

        teamLogo = AddMediaPath(teamLogo);
        if(teamLogo) {
            thumbnails.push({
                src:AddMediaPath(teamLogo),
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
                if(this.state.className === 'fullscreen') {
                    if(skater.Slide)
                        src = AddMediaPath(skater.Slide);
                    else if(skater.Photo)
                        src = AddMediaPath(skater.Photo);
                    else if(skater.Thumbnail)
                        src = AddMediaPath(skater.Thumbnail);
                } else if(skater.Thumbnail) {
                    src = AddMediaPath(skater.Thumbnail);
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

        let shown:boolean = this.state.Shown;
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
        if(this.state.className === 'fullscreen')
            return this.renderFullscreen();
        return this.renderCamera();
    }
}

export class CaptureRosterBanner extends React.PureComponent<any, {
    LogoA:string;
    LogoB:string;
    SrcA:string;
    SrcB:string;
    NameA:string;
    NameB:string;
    ColorA:string;
    ColorB:string;
    CurrentItem:string;
    CurrentTeam:string;
    TeamColorA:string;
    TeamColorB:string;
    TeamLogoA:string;
    TeamLogoB:string;
    Index:number;
    Shown:boolean;
    className:string;
}> {
    
    readonly state = {
        LogoA:ScoreboardController.GetState().TeamA.Thumbnail,
        LogoB:ScoreboardController.GetState().TeamA.Thumbnail,
        SrcA:'',
        SrcB:'',
        NameA:'',
        NameB:'',
        ColorA:'#000000',
        ColorB:'#000000',
        CurrentItem:'B',
        CurrentTeam:RosterController.GetState().CurrenTeam,
        TeamColorA:ScoreboardController.GetState().TeamA.Color,
        TeamColorB:ScoreboardController.GetState().TeamB.Color,
        TeamLogoA:ScoreboardController.GetState().TeamA.Thumbnail,
        TeamLogoB:ScoreboardController.GetState().TeamB.Thumbnail,
        Index:0,
        Shown:RosterCaptureController.GetState().Shown,
        className:RosterCaptureController.GetState().className
    }
    
    protected remoteRoster?:Unsubscribe;
    protected remoteCapture?:Unsubscribe;
    protected remoteScoreboard?:Unsubscribe;

    constructor(props) {
        super(props);
        this.updateRoster = this.updateRoster.bind(this);
        this.updateCapture = this.updateCapture.bind(this);
        this.updateScoreboard = this.updateScoreboard.bind(this);
    }

    protected updateScoreboard() {
        this.setState({
            TeamColorA:ScoreboardController.GetState().TeamA.Color,
            TeamColorB:ScoreboardController.GetState().TeamB.Color,
            TeamLogoA:ScoreboardController.GetState().TeamA.Thumbnail,
            TeamLogoB:ScoreboardController.GetState().TeamB.Thumbnail,
        });
    }

    protected updateRoster() {
        let state:SRosterController = RosterController.GetState();
        let team:SRosterTeam = state.TeamA;
        let steam:SScoreboardTeam = ScoreboardController.GetState().TeamA;

        if(state.CurrentTeam == 'B') {
            steam = ScoreboardController.GetState().TeamB;
            team = state.TeamB;
        }

        let src:string = steam.Thumbnail;
        let name:string = steam.Name;
        let logo:string = steam.Thumbnail;
        let num:string = '';
        let color:string = steam.Color;
        let coach:boolean = false;
        let penalty:boolean = false;
        let captain:boolean = false;
        let cocaptain:boolean = false;
        let skater:SkaterRecord|undefined;
        
        if(state.SkaterIndex >= 0) {
            skater = team.Skaters[state.SkaterIndex];
            if(skater) {
                name = skater.Name;
                if(skater.Thumbnail)
                    src = skater.Thumbnail;
                if(skater.Number)
                    num = skater.Number;
                coach = (team.Roles.Coach == skater.RecordID) ? true : false;
                penalty = (team.Roles.Penalty == skater.RecordID) ? true : false;
                captain = (team.Roles.Captain == skater.RecordID) ? true : false;
                cocaptain = (team.Roles.CoCaptain == skater.RecordID) ? true : false;
            }
        }

        if(skater) {
            if(num && !coach && !penalty) {
                name = "#" + num + " " + name;
            }

            if(!coach && !penalty) {
                if(captain)
                    name = "Captain " + name;
                else if(cocaptain)
                    name = "Co-Captain " + name;
            } else {
                if(coach)
                    name = 'Coach ' + name;
                else if(penalty)
                    name = 'Penalties ' + name;
            }
        }

        if(this.state.CurrentItem == 'A')
        {
            this.setState({
                LogoB:logo,
                SrcB:src,
                NameB:name,
                ColorB:color,
                CurrentItem:'B',
                CurrentTeam:state.CurrentTeam,
                Index:state.SkaterIndex
            });
        }
        else
        {
            this.setState({
                LogoA:logo,
                SrcA:src,
                NameA:name,
                ColorA:color,
                CurrentItem:'A',
                CurrentTeam:state.CurrentTeam,
                Index:state.SkaterIndex
            });
        }
    }

    protected updateCapture() {
        this.setState({
            Shown:RosterCaptureController.GetState().Shown,
            className:RosterCaptureController.GetState().className
        });
    }

    componentDidMount() {
        this.remoteCapture = RosterCaptureController.Subscribe(this.updateCapture);
        this.remoteRoster = RosterController.Subscribe(this.updateRoster);
        this.updateScoreboard = ScoreboardController.Subscribe(this.updateScoreboard);
        this.forceUpdate();
    }

    componentWillUnmount() {
        if(this.remoteCapture)
            this.remoteCapture();
        if(this.remoteRoster)
            this.remoteRoster();
        if(this.remoteScoreboard)
            this.updateScoreboard();
    }
    
    render() {
        let className:string = cnames('capture-roster-banner', this.state.className, {
            shown:this.state.Shown
        });

        let classA:string = cnames('item A', {
            shown:(this.state.Shown && this.state.CurrentItem == 'A')
        });

        let classB:string = cnames('item B', {
            shown:(this.state.Shown && this.state.CurrentItem == 'B')
        });
        
        let srcA:string = '';
        let nameA:string = '';
        let colorA:string = '#000000';

        let srcB:string = '';
        let nameB:string = '';
        let colorB:string = '#000000';

        if(this.state.SrcA)
            srcA = AddMediaPath(this.state.SrcA);
        if(this.state.NameA)
            nameA = this.state.NameA;
        if(this.state.ColorA)
            colorA = this.state.ColorA;

        if(this.state.SrcB)
            srcB = AddMediaPath(this.state.SrcB);
        if(this.state.NameB)
            nameB = this.state.NameB;
        if(this.state.ColorB)
            colorB = this.state.ColorB;

        
        let color:string = this.state.TeamColorA;
        let logo:string = AddMediaPath(this.state.TeamLogoA);
        if(this.state.CurrentTeam == 'B') {
            color = this.state.TeamColorB;
            logo = AddMediaPath(this.state.TeamLogoB);
        }

        return (
            <div className={className} style={{backgroundColor:color}}>
                <div className="spacer"></div>
                <div className={classA}>
                    <img src={srcA} alt="" className={cnames({shown:(srcA)?true:false})}/>
                    <span>{nameA}</span>
                </div>
                <div className={classB}>
                    <img src={srcB} alt="" className={cnames({shown:(srcB)?true:false})}/>
                    <span>{nameB}</span>
                </div>
                <img src={logo} alt="" className={cnames('logo',{shown:(this.state.Index >= 0)?true:false})}/>
            </div>
        );
    }
}