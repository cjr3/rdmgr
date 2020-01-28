/**
 * Global variables, on a global object.
 * - This file is meant to be used with 'import' syntax.
 * (Usuall for React components)
 */

const vars = {
    //RecordType codes
    RecordType:{
        /**
         * RecordType code for skaters
         */
        Skater:"SKR",
        /**
         * RecordType code for Teams
         */
        Team:"TEM",
        /**
         * RecordType code for penalties
         */
        Penalty:"PEN",
        /**
         * RecordType code for videos
         */
        Video:"VID",
        /**
         * RecordType code for phases
         */
        Phase:"PHS",
        /**
         * RecordType code for slideshows
         */
        Slideshow:"SLS",
        /**
         * RecordType code for national anthem singers
         */
        Anthem:"ANT",
        /**
         * RecordType code for Sponsors
         */
        Sponsor:"SPN",
        /**
         * RecordType code for peers
         */
        Peer:"PER",
        /**
         * RaffleType code for Raffle Prize
         */
        RafflePrize:"RPZ",
        /**
         * RecordType code for Announcers
         */
        Announcer:"ANC",
        /**
         * RecordType code for Rosters
         */
        Roster:"ROS"
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
    /**
     * Record's internal ID (used for databases)
     */
    ID?:number;
    /**
     * Record's ID relative to its RecordType
     * (ie, a Skater and a Team record can have the same RecordID)
     */
    RecordID:number;
    /**
     * RecordType code (see vars.RecordType)
     */
    RecordType:string;
    /**
     * Name of the record
     */
    Name:string;
    /**
     * Acronym
     */
    Acronym?:string;
    /**
     * Alias for Acronym
     */
    Code?:string;
    /**
     * Represents the record's color, such as a team's primary color
     */
    Color?:string;
    /**
     * Short name
     */
    ShortName?:string;
    /**
     * Photo path, relative to the media directory
     */
    Photo?:string;
    /**
     * Background path, relative the media directory
     */
    Background?:string;
    /**
     * Thumbnail/logo path, relative to the media directory
     */
    Thumbnail?:string;
    /**
     * Thumbnail for the scorebanner, relative to the media directory
     */
    ScoreboardThumbnail?:string;
    /**
     * Record's description, as as skater's bio
     */
    Description?:string;
    /**
     * Associated file path, relative to media directory (video, slide, etc.)
     */
    Filename?:string;
    /**
     * Alias for Filename
     */
    FileName?:string;
    /**
     * Record's assigned number (jersey #, usually)
     */
    Number?:string;
    /**
     * Path to slide image, relative to media directory
     */
    Slide?:string;
    /**
     * Collection of associated records
     */
    Records?:Array<any>;
};

/**
 * Interface for a Team record
 */
export interface TeamRecord extends Record {
    /**
     * Team's tagline
     */
    Tagline?:string;
    /**
     * Collection of skaters assigned to the team
     */
    Skaters?:Array<SkaterRecord>;
    /**
     * Determines the team type
     */
    TeamType?:string;
    /**
     * League's ID number (for future use)
     */
    LeagueID?:number;
    /**
     * Determines if team is a Youth team or not
     */
    YouthTeam?:string;
};

export interface SkaterRecord extends Record {
    /**
     * Collection of teams the skater is assigned to.
     */
    Teams?:Array<SkaterTeamRecord>;
    /**
     * Collection of penalties the skater has received
     */
    Penalties?:Array<PenaltyRecord>;
    /**
     * Derby Birth Date
     */
    BirthDate?:string;
    /**
     * Derby Retire Date
     */
    RetireDate?:string;
    /**
     * Positiion code, such as 'Jammer'
     */
    Position?:string;
    /**
     * Deck the skater is on (Track or Deck)
     */
    Deck?:string;
};

export interface SkaterTeamRecord {
    /**
     * Skater's Record ID
     */
    SkaterID:number;
    /**
     * Skater's Team ID
     */
    TeamID:number;
    /**
     * Skater is a jammer
     */
    Jammer?:boolean;
    /**
     * Skater is a blocker
     */
    Blocker?:boolean;
    /**
     * Skater is a pivot
     */
    Pivot?:boolean;
    /**
     * Skater is captain of the team
     */
    Captain?:boolean;
    /**
     * Skater is cocaptain of the team
     */
    CoCaptain?:boolean;
    /**
     * Skater is coach of the team
     */
    Coach?:boolean;
    /**
     * Skater is manager of the team
     */
    Manager?:boolean;
    /**
     * Skater is penalty tracker of the team
     */
    PenaltyTracker?:boolean;
    /**
     * Skater is regulator of the team
     */
    Regulator?:boolean;
    /**
     * Skater is trainer of the team
     */
    Trainer?:boolean;
};

export interface SlideshowRecord extends Record {
    /**
     * Type of slideshow
     */
    SlideshowType?:string;
    /**
     * An overlay for the slideshow?
     */
    SlideshowOverlay?:string;
};

export interface PenaltyRecord extends Record {
    /**
     * Type of penalty: X = Ejection, P = Normal Penalty
     */
    PenaltyType?:string;
};

export interface PhaseRecord extends Record {
    /**
     * Time-formatted string HH:MM:SS
     */
    PhaseTime?:string;
    /**
     * An array of numbers for hours, minutes, and seconds
     * [0] = hours, [1] = minutes, [2] = seconds
     */
    Duration?:Array<number>;
    /**
     * Quarter the phase is assigned (1, 2, 3, 4)
     */
    PhaseQtr?:number;
}

export interface AnthemRecord extends Record {
    /**
     * Anthem singer's biography
     */
    Biography?:string;
}

export interface VideoRecord extends Record {
}

export interface SponsorRecord extends Record {
    /**
     * Sponsor's website
     */
    Website?:string;
}

export interface PeerRecord extends Record {
    /**
     * Peer's ID
     */
    PeerID?:string;
    /**
     * Port to connect to
     */
    Port?:number;
    /**
     * Port to connect to peer's capture window
     */
    CapturePort?:number;
    /**
     * Host name / IP to connect to
     */
    Host?:string;
    /**
     * Collection of controller codes that the peer sends out to other peers
     */
    ControlledApps?:Array<string>;
    /**
     * Collection of controller codes that the peer receives state updates from other peers
     */
    ReceiveApps?:Array<string>;
}

export enum Controllers {
    CAMERA,
    CAPTURE,
    CHAT,
    DATA,
    MEDIAQUEUE,
    PENALTY,
    RAFFLE,
    ROSTER,
    SCOREBOARD,
    SCOREKEEPER,
    SLIDESHOW,
    SPONSOR,
    VIDEO,
    ANNOUNCER,
    ANTHEM
};



export interface JamRecord {
    ID:number;
    MatchID:number;
    JamNumber:number;
    JamType:string;
    JamDate:string;
    JamClockStart:string;
    JamClockEnd:string;
    JamTimeStart:string;
    JamTimeEnd:string;
    GameClockStart:string;
    GameClockEnd:string;
    TeamAID:number;
    TeamAName:string;
    TeamAScore:number;
    TeamAPoints:number;
    TeamAStatus:number;
    TeamATimeouts:number;
    TeamAChallenges:number;
    TeamBID:number;
    TeamBName:string;
    TeamBScore:number;
    TeamBPoints:number;
    TeamBStatus:number;
    TeamBTimeouts:number;
    TeamBChallenges:number;
    PhaseID:number;
    PhaseName:string;
    LeadJamTeamID:number;
    JamEndReason:string;
    Penalties:Array<JamRecordPenalty>;
    Skaters:Array<JamRecordSkater>;
}

export interface JamRecordSkater {
    ID:number;
    JamID:number;
    SkaterID:number;
    SkaterNumber:string;
    SkaterName:string;
    TeamID:number;
    TeamName:string;
    Jammer:string;
    Blocker:string;
    Pivot:string;
    StarPass:string;
    Points:number;
    Penalties:number;
}

export interface JamRecordPenalty {
    ID:number;
    SkaterJamID:number;
    PenaltyID:number;
    PenaltyName:string;
    PenaltyType:string;
}