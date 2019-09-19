/**
 * Global variables, on a global object.
 * - This file is meant to be used with 'import' syntax.
 * (Usuall for React components)
 */

const vars = {
    //RecordType codes
    RecordType:{
        Skater:"SKR",
        Team:"TEM",
        Penalty:"PEN",
        Video:"VID",
        Phase:"PHS",
        Slideshow:"SLS",
        Anthem:"ANT",
        Sponsor:"SPN",
        Peer:"PER"
    },

    //Clocks
    Clock:{
        Status:{
            Ready:0,
            Running:1,
            Stopped:2
        },
        Warning:10,
        Danger:5,
        Types:{
            Clock:"C",
            Stopwatch:"W"
        }
    },

    Scoreboard:{
        Status:{
            Normal:0,
            Timeout:1,
            Injury:2,
            Upheld:3,
            Overturned:4,
            Review:5
        },
        StatusText:[
            "",
            "OFFICIAL TIMEOUT",
            "INJURY TIMEOUT",
            "UPHELD",
            "OVERTURNED",
            "OFFICIAL REVIEW"
        ],
        JamSeconds:60
    },

    Team:{
        Status:{
            Normal:0,
            Timeout:1,
            Challenge:2,
            Injury:3,
            LeadJammer:4,
            PowerJam:5
        },
        StatusText:[
            "",
            "TIMEOUT",
            "CHALLENGE",
            "INJURY",
            "LEAD JAMMER",
            "POWER JAM"
        ]
    },

    Video:{
        Status:{
            Ready:0,
            Playing:1,
            Paused:2,
            Stopped:3,
            AutoPlay:4
        }
    }
}

export default vars;

export interface Record {
    ID?:number,
    RecordID:number,
    RecordType:string,
    Acronym?:string,
    Code?:string,
    Color?:string,
    Name:string,
    ShortName?:string,
    Photo?:string,
    Background?:string,
    Thumbnail?:string,
    ScoreboardThumbnail?:string,
    Description?:string,
    Filename?:string,
    FileName?:string,
    Number?:string,
    Slide?:string,
    Records?:Array<any>
};

export interface TeamRecord extends Record {
    Tagline?:string,
    Skaters?:Array<SkaterRecord>,
    TeamType?:string,
    LeagueID?:number,
    YouthTeam?:string
};

export interface SkaterRecord extends Record {
    Teams?:Array<SkaterTeamRecord>,
    Penalties?:Array<PenaltyRecord>,
    BirthDate?:string,
    RetireDate?:string,
    Position?:string
};

export interface SkaterTeamRecord {
    SkaterID:number,
    TeamID:number,
    Jammer?:boolean,
    Blocker?:boolean,
    Pivot?:boolean,
    Captain?:boolean,
    CoCaptain?:boolean,
    Coach?:boolean,
    Manager?:boolean,
    Regulator?:boolean,
    Trainer?:boolean
};

export interface SlideshowRecord extends Record {
    SlideshowType?:string,
    SlideshowOverlay?:string
};

export interface PenaltyRecord extends Record {
    PenaltyType?:string
};

export interface PhaseRecord extends Record {
    PhaseTime?:string,
    Duration:Array<number>,
    PhaseQtr:number
}

export interface AnthemRecord extends Record {
    Biography?:string
}

export interface VideoRecord extends Record {
}

export interface SponsorRecord extends Record {
    Website?:string
}

export interface PeerRecord extends Record {
    PeerID?:string,
    Port?:number,
    CapturePort?:number,
    Host?:string
}