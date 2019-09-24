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
        RafflePrize:"RPZ"
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
    ID?:number,
    /**
     * Record's ID relative to its RecordType
     * (ie, a Skater and a Team record can have the same RecordID)
     */
    RecordID:number,
    /**
     * RecordType code (see vars.RecordType)
     */
    RecordType:string,
    /**
     * Name of the record
     */
    Name:string,
    /**
     * Acronym
     */
    Acronym?:string,
    /**
     * Alias for Acronym
     */
    Code?:string,
    /**
     * Represents the record's color, such as a team's primary color
     */
    Color?:string,
    /**
     * Short name
     */
    ShortName?:string,
    /**
     * Photo path, relative to the media directory
     */
    Photo?:string,
    /**
     * Background path, relative the media directory
     */
    Background?:string,
    /**
     * Thumbnail/logo path, relative to the media directory
     */
    Thumbnail?:string,
    /**
     * Thumbnail for the scorebanner, relative to the media directory
     */
    ScoreboardThumbnail?:string,
    /**
     * Record's description, as as skater's bio
     */
    Description?:string,
    /**
     * Associated file path, relative to media directory (video, slide, etc.)
     */
    Filename?:string,
    /**
     * Alias for Filename
     */
    FileName?:string,
    /**
     * Record's assigned number (jersey #, usually)
     */
    Number?:string,
    /**
     * Path to slide image, relative to media directory
     */
    Slide?:string,
    /**
     * Collection of associated records
     */
    Records?:Array<any>
};

/**
 * Interface for a Team record
 */
export interface TeamRecord extends Record {
    /**
     * Team's tagline
     */
    Tagline?:string,
    /**
     * Collection of skaters assigned to the team
     */
    Skaters?:Array<SkaterRecord>,
    /**
     * Determines the team type
     */
    TeamType?:string,
    /**
     * League's ID number (for future use)
     */
    LeagueID?:number,
    /**
     * Determines if team is a Youth team or not
     */
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
    PenaltyTracker?:boolean,
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