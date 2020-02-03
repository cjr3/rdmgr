/**
 * This file defines the variables related only to the API
 */

interface API {
    RecordType:{
        Season:'SEA';
        Bout:'BUT';
        Match:'MAT';
        Team:'TEM';
        Skater:'SKR';
        Tournament:'TRN';
        Jam:'JAM';
        Sponsor:'SPN';
    }
};

export type RecordTypeCodes = 'SEA' | 'BUT' | 'MAT' | 'TEM' | 'SKR' | 'TRN' | 'JAM' | 'SPN' | 'PEN' | 'PHS';

export const api:API = {
    RecordType:{
        Season:'SEA',
        Bout:'BUT',
        Match:'MAT',
        Team:'TEM',
        Skater:'SKR',
        Tournament:'TRN',
        Jam:'JAM',
        Sponsor:'SPN'
    }
};

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
    RecordType:RecordTypeCodes;
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

export interface SeasonRecord extends Record {
    RecordType:'SEA',
    DateStart:string;
    DateEnd:string;
    Bouts:Array<BoutRecord>;
    Standings:Array<any>;
}

export interface BoutRecord extends Record {
    RecordType:'BUT',
    BoutDate:string;
    DoorsOpen:string;
    Matches:Array<MatchRecord>;
};

interface MatchTeam {
    ID:number;
    Score:number;
    Thumbnail?:string;
}

export interface MatchRecord {
    RecordID:number;
    RecordType:'MAT';
    SeasonID:number;
    BoutID:number;
    MatchDate:string;
    StartTime:string;
    EndTime:string;
    TeamA:MatchTeam;
    TeamB:MatchTeam;
}

/**
 * Interface for a Team record
 */
export interface TeamRecord extends Record {
    RecordType:'TEM',
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
    RecordType:'SKR',
    /**
     * Collection of teams the skater is assigned to.
     */
    Teams?:Array<SkaterTeamRecord>;
    /**
     * Collection of penalties the skater has received
     */
    Penalties?:Array<any>;
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

export interface PenaltyRecord extends Record {
    RecordType:'PEN',
    /**
     * Type of penalty: X = Ejection, P = Normal Penalty
     */
    PenaltyType?:string;
};

export interface PhaseRecord extends Record {
    RecordType:'PHS',
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

export interface SponsorRecord extends Record {
    RecordType:'SPN';
    Website:string;
}

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

export enum APIActions {
    SET = 'SET',
    UPDATE = 'UPDATE',
    ADD = 'ADD',
    DELETE = 'DELETE',
    PURGE = 'PURGE'
}

export interface IAPIController {
    GetState:Function;
    GetStore:Function;
    EndpointSuffix:string;
    Key:string;
    SetRecords:{(records:Array<any>)};
    AddRecord:{(record:any)};
    UpdateRecord:{(record:any)};
    DeleteRecord:{(id:number)},
    NewRecord:Function;
    LoadRecord:{(id:number)};
    Load:Function;
    Dispatch:Function;
    Get:Function;
    Subscribe:Function;
}

export interface SAPIController {
    Records:Array<any>;
};