import { Scene, SceneItem } from 'obs-websocket-js';

import { DataConnection, MediaConnection, Peer as PeerJSPeer } from 'peerjs';

/**
 * Collection of PeerJS peers that the user has attempted to connect to.
 */
export const LocalPeers:{[key:string]:PeerJSPeer|undefined} = {};

/**
 * Data connections established from remote peers
 */
export const RemoteDataConnections:{[key:string]:DataConnection|undefined} = {};

/**
 * Media stream connections initiated from remote peers
 */
export const RemoteMediaConnections:{[key:string]:MediaConnection|undefined} = {};

export interface __BaseRecord {
    /**
     * Background image path/url
     */
    Background?:string|null;
    /**
     * Unique code
     */
    Code?:string|null;
    /**
     * Color
     */
    Color?:string|null;
    /**
     * Date and time created
     */
    DateCreated?:string|null;
    /**
     * Date and time record ends
     */
    DateEnd?:string|null;
    /**
     * Date and time record starts
     */
    DateStart?:string|null;
    /**
     * Date and time record was last updated
     */
    DateUpdated?:string|null;
    /**
     * Description
     */
    Description?:string|null;
    /**
     * Display name
     */
    Name?:string|null;
    /**
     * Number
     */
    Number?:string|null;
    /**
     * 
     */
    Photo?:string|null;
    /**
     * Record
     */
    RecordID?:number;
    /**
     * Record Type code
     */
    RecordType?:RecordType;
    /**
     * Thumbnail for scoreboard / banner
     */
    ScoreboardThumbnail?:string|null;
    /**
     * Short name / nickname
     */
    ShortName?:string|null;
    /**
     * Thumbnail
     */
    Thumbnail?:string|null;
    /**
     * Website URL
     */
    URL?:string|null;
    /**
     * Website URL title.
     */
    URLTitle?:string|null;
}

/**
 * Represents a singer for the national anthem...
 */
export interface AnthemSinger extends __BaseRecord {}

/**
 * Collection for anthem singers - faster than arrays.
 */
export type AnthemSingerCollection = {[key:string]:AnthemSinger};

/**
 * Represents a bout (a day of matches)
 */
export interface Bout extends __BaseRecord {
    /**
     * Collection of matchups for this bout
     */
    Matches?:Match[];
};

/**
 * Configuration for camera.
 */
export interface CameraConfig {
    /**
     * 
     */
    className?:string|null;
    /**
     * Camera device ID
     */
    deviceId?:string;
    /**
     * Desired camera width
     */
    width?:number;
    /**
     * Desired camera height
     */
    height?:number;
    /**
     * 
     */
    status?:VideoStatus;
    /**
     * 
     */
    visible?:boolean;
}

/**
 * Actions for capture window.
 */
export interface CaptureAction {
    action:CaptureActions;
    values:any;
}

export type CaptureActions = '' 
| 'announcer1'
| 'announcer2'
| 'anthem'
| 'capture-announcer'
| 'capture-anthem'
| 'capture-autoshow'
| 'capture-camera'
| 'capture-gameclock'
| 'capture-jamclock'
| 'capture-jamcounter'
| 'capture-penalty'
| 'capture-raffle'
| 'capture-roster'
| 'capture-schedule'
| 'capture-scorebanner'
| 'capture-scoreboard'
| 'capture-scorekeeper'
| 'capture-slideshow'
| 'capture-standings'
| 'clocks'
| 'penalty'
| 'raffle'
| 'roster'
| 'scoreboard'
| 'scorekeeper'
| 'slideshow'
| 'ui-config'
| 'video-config'
;

/**
 * Represents an element type on the capture window.
 */
export interface CaptureSection {
    backgroundImage?:string|null;
    className?:string;
    obsSettings?:CaptureSectionOBSItem[];
    updateTime?:number;
    visible?:boolean;
}

/**
 * Capture section obs settings
 */
export interface CaptureSectionOBSItem {
    itemName?:string;
    sceneName?:string;
    visible?:boolean;
}

export interface ClockState {
    /**
     * Hours on the clock
     */
    Hours?:number;
    /**
     * Minutes on the clock
     */
    Minutes?:number;
    /**
     * Seconds on the clock
     */
    Seconds?:number;
    /**
     * Status on the clock
     */
    Status?:ClockStatus;
    /**
     * Tenths on the clock
     */
    Tenths?:number;
}

export enum ClockStatus {
    /**
     * Clock has been stopped
     */
    STOPPED,
    /**
     * Clock is running.
     */
    RUNNING
}

export type ClockType = 'clock' | 'stopwatch';

/**
 * UI Config
 */
export interface Config {
    Colors?:ConfigColors;
    Misc?:ConfigMisc;
    NetworkEnabled?:boolean;
    Scoreboard?:ConfigScoreboard;
    /**
     * Host/IP for media API
     */
    MediaAPIHost?:string;
    /**
     * Port associated with media host for media API
     */
    MediaAPIPort?:number;
};

/**
 * 
 */
export interface ConfigColors {
    /**
     * Active text color
     */
    Active?:string|null;
    /**
     * Base background color
     */
    Background?:string|null;
    /**
     * Call for calls (timeouts, review)
     */
    Calls?:string|null;
    /**
     * Capture window background color.
     */
    CaptureBackground?:string|null;
    /**
     * Danger text color
     */
    Danger?:string|null;
    /**
     * Background color for elements (buttons)
     */
    Elements?:string|null;
    /**
     * Foreground text color
     */
    Foreground?:string|null;
    /**
     * Neutral color (overturned)
     */
    Neutral?:string|null;
    /**
     * Ready text color
     */
    Ready?:string|null;
    /**
     * Stopped text color
     */
    Stop?:string|null;
    /**
     * Warning text color
     */
    Warning?:string|null;
}

export interface ConfigMisc {
    AppCode?:string;
    /**
     * Application mode (empty string or 'split' for 50/50)
     */
    AppMode?:string;
    /**
     * Capture window settings
     */
    CaptureWindow?:WindowConfig;
    /**
     * League logo image - displayed in various places, such as the scoreboard.
     */
    LeagueLogo?:string|null;
    /**
     * Main window settings.
     */
    MainWindow?:WindowConfig;
    /**
     * Control and Capture mode.
     */
    Mode?:string;
    /**
     * Background for individual raffle tickets.
     */
    RaffleTicketBackground?:string;
}

export interface WindowConfig {
    display?:boolean;
    width?:number;
    height?:number;
    x?:number;
    y?:number;
    monitor?:number;
};

/**
 * Scoreboard configuration
 */
export interface ConfigScoreboard {
    /**
     * Text for challenge call.
     */
    LabelChallenges?:string|null;
    /**
     * Text for injury call.
     */
    LabelInjury?:string|null;
    /**
     * Text for lead jammer
     */
    LabelLeadJammer?:string|null;
    /**
     * Text for official timeout
     */
    LabelOfficialTimeout?:string|null;
    LabelOverturned?:string|null;
    LabelPowerJam?:string|null;
    LabelReview?:string|null;
    LabelTimeouts?:string|null;
    LabelUpheld?:string|null;
    MaxTeamChallenges?:number|null;
    MaxTeamTimeouts?:number|null;
}

/**
 * Represent actions created from the capture window to be sent to the control window.
 */
export interface ControlAction {
    action:ControlActions;
    values?:any;
}

export type ControlActions = 'video';

export interface Deck {
    Blocker1?:Skater|null;
    Blocker2?:Skater|null;
    Blocker3?:Skater|null;
    Jammer?:Skater|null;
    Pivot?:Skater|null;
}

export type DeckChoice = 'Track' | 'Deck';

export interface FileSelectionResult {
    canceled:boolean;
    filePaths:string[];
    bookmarks:string[];    
}

export interface JamRecord {
    /**
     * Date and time created
     */
    DateCreated?:string|null;
    /**
     * Date and time jam ended.
     */
    DateEnded?:string|null;
    /**
     * Date and time jam started.
     */
    DateStarted?:string|null;
    /**
     * Date and time record was last updated
     */
    DateUpdated?:string|null;
    /**
     * Game clock Hour when jam ended
     */
    GameEndHour?:number;
    /**
     * Game clock minute when jam ended
     */
    GameEndMinute?:number;
    /**
     * Game clock second when jam ended
     */
    GameEndSecond?:number;
    /**
     * Game clock Hour when jam started 
     */
    GameStartHour?:number;
    /**
     * Game clock minute when jam started
     */
    GameStartMinute?:number;
    /**
     * Game clock second when jam started
     */
    GameStartSecond?:number;
    /**
     * Phase name
     */
    PhaseName?:string;
    /**
     * Phase quarter
     */
    PhaseQuarter?:number;
    /**
     * Record ID of jam phase
     */
    PhaseRecordID?:number;
    /**
     * Team side of jammer that was in the lead at the end of the jam.
     */
    LeadTeam?:TeamSide;
    /**
     * Number
     */
    Number?:string|null;
    /**
     * Jam points scored
     */
    TeamAJamPoints?:number;
    /**
     * Team Name
     */
    TeamAName?:string|null;
    /**
     * Team record id
     */
    TeamARecordID?:number;
    /**
     * Team Score
     */
    TeamAScore?:number;
    /**
     * Timeouts
     */
    TeamATimeouts?:number;
    /**
     * Challenges
     */
    TeamAChallenges?:number;
    /**
     * Team Status at end of jam
     */
    TeamAStatus?:ScoreboardTeamStatus;
    /**
     * Jam points scored
     */
    TeamBJamPoints?:number;
    /**
     * Team Name
     */
    TeamBName?:string|null;
    /**
     * Team record id
     */
    TeamBRecordID?:number;
    /**
     * Team Score
     */
    TeamBScore?:number;
    /**
     * Timeouts
     */
    TeamBTimeouts?:number;
    /**
     * Challenges
     */
    TeamBChallenges?:number;
    /**
     * Team Status at end of jam
     */
    TeamBStatus?:ScoreboardTeamStatus;
}

export interface Match {
    TimeStart?:string|null;
    TeamA:MatchTeam;
    TeamB:MatchTeam;
}

export interface MatchTeam {
    Color?:string|null;
    ID?:number;
    Name?:string|null;
    Logo?:string|null;
    Score?:number;
    StartTime?:string;
}

export interface OBSSceneCollection {
    currentScene:string;
    messageId:string;
    status:string;
    scenes:Scene[];
}

export interface Peer extends __BaseRecord {
    Host?:string|null;
    Port?:number|null;
    /**
     * True if peer has established a data connection.
     */
    Connected?:boolean;
    /**
     * If true, then this peer is the media host endpoint.
     * If the peer is connected, then images, such as scoreboard images, will be loaded from this user's API endpoint.
     */
    MediaAPIHost?:boolean;
    /**
     * True if peer is sending streaming data (video/audio)
     */
    Streaming?:boolean;
    /**
     * Application codes to receive data automatically from peer.
     */
    ReceiveApplications?:string[];
    /**
     * Application codes to send data to automatically send to peer.
     */
    SendApplications?:string[];
};
export type PeerCollection = {[key:string]:Peer};

/**
 * Describes data to send and receive between peers
 */
export interface PeerData {
    /**
     * 
     */
    app?:string;
    /**
     * 
     */
    data?:any;
    /**
     * 
     */
    message?:string;
    /**
     * 
     */
    type?:string;
}

export interface Penalty extends __BaseRecord {
    PenaltyType?:'P'|'X'|null;
};

export type PenaltyCollection = {[key:string]:Penalty};

export interface Phase extends __BaseRecord {
    Hours?:number|null;
    Minutes?:number|null;
    Seconds?:number|null;
    Quarter?:number|null;
};

export interface RaffleTicket {
    Number?:string;
    Prize?:string|null;
    Sponsor?:string|null;
}

export interface RafflePrize {
    Description?:string|null;
    Name?:string|null;
    Sponsor?:string|null;
}

export type RecordType = '' 
| 'ANT' //anthem
| 'BUT' //bout
| 'MAT' //match
| 'OBS_SCENE' //OBS Scene
| 'OBS_SOURCE' //OBS Source
| 'PEN' //penalty
| 'PER' //peer
| 'PHS' //phase
| 'SEA' //season
| 'SKR' //skater
| 'SLS' //slideshow
| 'SPN' //sponsor
| 'TEM' //team
| 'VID' //video
; 


export interface SAnthem {
    Singer?:AnthemSinger|null;   
};

/**
 * Capture sections state
 */
export interface SCapture {
    /**
     * Announcer banner
     */
    Announcers:CaptureSection;
    /**
     * Anthem singer
     */
    Anthem:CaptureSection;
    /**
     * Auto slideshow
     */
    AutoSlideshow:SCaptureAutoSlideshow;
    /**
     * Large game clock
     */
    GameClock:CaptureSection;
    /**
     * Large jam clock
     */
    JamClock:CaptureSection;
    /**
     * Large jam counter
     */
    JamCounter:CaptureSection;
    /**
     * Penalties
     */
    PenaltyTracker:CaptureSection;
    /**
     * Raffle Tickets
     */
    Raffle:CaptureSection;
    /**
     * Roster
     */
    Roster:SCaptureRoster;
    /**
     * Schedule of selected season
     */
    Schedule:SCaptureSchedule;
    /**
     * Scoreboard
     */
    Scoreboard:CaptureSection;
    /**
     * Scorebanner (in particular for live-stream window capture)
     */
    Scorebanner:CaptureSection;
    /**
     * Jammers / positions
     */
    Scorekeeper:CaptureSection;
    /**
     * Manual slideshow
     */
    Slideshow:CaptureSection;
    /**
     * Standings of the selected season
     */
    Standings:SCaptureStandings;
};

/**
 * Auto slideshow state
 */
export interface SCaptureAutoSlideshow extends CaptureSection {
    /**
     * Current slide
     */
    index?:number;
    /**
     * Record id
     */
    recordId?:number;
    /**
     * 
     */
    recordType?:RecordType;
    /**
     * True = running, false = paused
     */
    status?:boolean;
    /**
     * Slides to show
     */
    slides?:Slide[];
}

export interface SCaptureRoster extends CaptureSection {
    index?:number;
    side?:string;
}

/**
 * Schedule related data for capture window.
 */
export interface SCaptureSchedule extends CaptureSection {
    /**
     * Season record
     */
    seasonId?:number;
    /**
     * Bouts from season record.
     */
    bouts?:Bout[];
}

/**
 * Stadnings related data for capture window.
 */
export interface SCaptureStandings extends CaptureSection {
    /**
     * Season record
     */
    seasonId?:number;
    /**
     * Standings from season record.
     */
    standings?:Standing[]
}

export interface SClock {
    BreakHour?:number;
    BreakMinute?:number;
    BreakSecond?:number;
    BreakStatus?:ClockStatus;
    GameHour?:number;
    GameMinute?:number;
    GameSecond?:number;
    GameStatus?:ClockStatus;
    JamHour?:number;
    JamMinute?:number;
    JamSecond?:number;
    JamStatus?:ClockStatus;
};

export enum ScoreboardStatus {
    NORMAL,
    TIMEOUT,
    REVIEW,
    OVERTURNED,
    UPHELD,
    INJURY
};

/**
 * Represents a team on the scoreboard.
 * We don't just keep the team id; this allows us to edit logos, names, and colors, for mashup matches and temporary teams.
 */
export interface ScoreboardTeam {
    Challenges?:number;
    Color?:string;
    ID?:number;
    JamPoints?:number;
    Logo?:string;
    Name?:string;
    Score?:number;
    ScoreboardThumbnail?:string;
    Status?:ScoreboardTeamStatus;
    Timeouts?:number;
}

export enum ScoreboardTeamStatus {
    NORMAL,
    TIMEOUT,
    CHALLENGE,
    LEADJAM,
    POWERJAM,
    INJURY
};

export type ScorekeeperPosition = 'Blocker1' | 'Blocker2' | 'Blocker3' | 'Jammer' | 'Pivot';

/**
 * Represents a collection of bouts, including standings for the season.
 */
export interface Season extends __BaseRecord {
    /**
     * Bouts scheduled for the season
     */
    Bouts?:Bout[];
    /**
     * Current standings
     */
    Standings?:Standing[];
};

/**
 * Collection of seasons.
 */
export type SeasonCollection = {[key:string]:Season};

/**
 * Represents a skater, which can also be a coach, referee, manager, etc.
 */
export interface Skater extends __BaseRecord {
    Teams?:SkaterTeam[];
}

export type SkaterCollection = {[key:string]:Skater};

/**
 * Represents a record of a skater's penalty.
 */
export interface SkaterPenalty extends Skater {
    JamNumber?:number|null;
    Penalties?:number[]|null;
    Codes?:string[]|null;
}

export type SkaterPosition = 'Jammer' | 'Blocker' | 'Pivot' | 'Captain' | 'Coach' | 'CoCaptain' | 'Penalty';

/**
 * Represents a skater on the roster of the teams on the scoreboard.
 */
export interface SkaterRoster extends Skater {
    Captain?:boolean;
    Coach?:boolean;
    CoCaptain?:boolean;
    PenaltyManager?:boolean;
}

/**
 * Represents a skater's team membership.
 */
export interface SkaterTeam {
    Blocker?:boolean;
    Captain?:boolean;
    Coach?:boolean;
    CoCaptain?:boolean;
    Jammer?:boolean;
    Name?:string|null;
    Number?:string|null;
    Pivot?:boolean;
    SkaterID?:number|null;
    TeamID?:number|null;
};

/**
 * Represents a slideshow, a collection of images / videos to be displayed on the capture window.
 */
export interface Slideshow extends __BaseRecord {
    Slides?:Slide[];
}

export type SlideshowCollection = {[key:string]:Slideshow};

export interface Slide extends __BaseRecord {
    /**
     * How long to show the slide after its show transition is complete
     */
    Duration?:number;
    /**
     * If false, the slide is not included in the slideshow
     */
    Enabled?:boolean;
    /**
     * Full path to file to display: image or video.
     */
    Filename?:string|null;
    /**
     * How to hide the slide
     */
    Hide?:SlideTransition;
    /**
     * How to show the slide
     */
    Show?:SlideTransition;
};

export interface SlideTransition {
    /**
     * How to show/hide the slide
     */
    Animation?:SlideAnimationType;
    /**
     * How long to play the transition
     */
    Duration?:number;
}

export type SlideAnimationType = '' 
    | 'fade' 
    | 'cut' 
    | 'move-north' 
    | 'move-west'
    | 'move-east'
    | 'move-south'
    ;

/**
 * Represents the main controller.
 */
export interface SMainController {
    /**
     * Announcer #1
     */
    Announcer1:__BaseRecord;
    /**
     * Announcer #2
     */
    Announcer2:__BaseRecord;
    /**
     * Anthem Singer
     */
    Anthem:SAnthem;
    /**
     * Collection of anthem singers
     */
    AnthemSingers:AnthemSingerCollection;
    /**
     * Local IP Address for remote connections from peers
     */
    LocalIPAddress:string;
    /**
     * Media Queue - Videos, slideshows, etc., queued up for a planned presentation.
     */
    MediaQueue:SMediaQueue;
    /**
     * Computers to connect to.
     */
    Peers:PeerCollection;
    /**
     * Timestamp when data/media connections were last established.
     */
    PeerConnectionTime:number;
    /**
     * Penalty definitions.
     */
    Penalties:PenaltyCollection;
    /**
     * Penalty tracker state.
     */
    PenaltyTracker:SPenaltyTracker;
    /**
     * Quarters / phases.
     */
    Phases:Phase[];
    /**
     * Raffle state.
     */
    Raffle:SRaffle;
    /**
     * Roster
     */
    Roster:SRoster;
    /**
     * Season records
     */
    Seasons:SeasonCollection;
    /**
     * Manual slideshow state
     */
    Slideshow:SSlideshow;
    /**
     * Slideshow records
     */
    Slideshows:SlideshowCollection;
    /**
     * Scoreboard state
     * - Moved to it's own state since it changes more often.
     */
    // Scoreboard:SScoreboard;
    /**
     * Scorekeeper state
     */
    Scorekeeper:SScorekeeper;
    /**
     * Skater records
     */
    Skaters:SkaterCollection;
    /**
     * Sponsor records
     */
    Sponsors:SponsorCollection;
    /**
     * Team records
     */
    Teams:TeamCollection;
    UpdateTimeAnnouncer:number;
    UpdateTimeAnthem:number;
    UpdateTimeAnthemSingers:number;
    UpdateTimeMediaQueue:number;
    UpdateTimePeers:number;
    UpdateTimePenalties:number;
    UpdateTimePenaltyTracker:number;
    UpdateTimePhases:number;
    UpdateTimeRaffle:number;
    UpdateTimeRoster:number;
    UpdateTimeSeasons:number;
    UpdateTimeSlideshow:number;
    UpdateTimeSlideshows:number;
    UpdateTimeScoreboard:number;
    UpdateTimeScorekeeper:number;
    UpdateTimeSkaters:number;
    UpdateTimeSponsors:number;
    UpdateTimeTeams:number;
    UpdateTimeVideos:number;
    /**
     * Video records
     */
    Videos:VideoCollection;
}

/**
 * Media queue state.
 */
export interface SMediaQueue {
    /**
     * Queued records
     */
    Records:__BaseRecord[];
}

/**
 * Penalty tracker state
 */
export interface SPenaltyTracker {
    /**
     * Skaters in the penalty box
     */
    Skaters:SkaterPenalty[];
}

/**
 * Sponsor record.
 */
export interface Sponsor extends __BaseRecord {

}

export type SponsorCollection = {[key:string]:Sponsor};

export interface SRaffle {
    Tickets?:RaffleTicket[];
    Prizes?:RafflePrize[];
    CurrentTickets?:RaffleTicket[];
}

/**
 * Roster state
 */
export interface SRoster {
    /**
     * Left-side team skaters
     */
    SkatersA?:SkaterRoster[];
    /**
     * Right-side team skaters
     */
    SkatersB?:SkaterRoster[];
    /**
     * Left-side team role assignment.
     */
    TeamA?:{
        BenchCoach?:number;
        Captain?:number;
        Coach?:number;
        CoCaptain?:number;
        Manager?:number;
        Penalties?:number;
    };
    /**
     * Right-side team role assignment.
     */
    TeamB?:{
        BenchCoach?:number;
        Captain?:number;
        Coach?:number;
        CoCaptain?:number;
        Manager?:number;
        Penalties?:number;
    }
}

/**
 * Scoreboard state
 */
export interface SScoreboard {
    /**
     * Board status, such as official timeout, upheld call, etc. 
     */
    BoardStatus?:ScoreboardStatus;
    /**
     * Break clock.
     */
    // BreakClock?:ClockState;
    /**
     * True = confirming with in-field call / jam points.
     */
    ConfirmStatus?:boolean;
    /**
     * Date and time the current match started
     */
    DateStart?:string;
    /**
     * Date and time the last match ended.
     */
    DateEnd?:string;
    /**
     * Game clock
     */
    // GameClock?:ClockState;
    /**
     * Jam Clock
     */
    // JamClock?:ClockState;
    /**
     * Hour of the jam clock when the last jam started.
     */
    JamHour?:number;
    /**
     * Minute of the jam clock when the last jam started.
     */
    JamMinute?:number;
    /**
     * Second of the jam clock when the last jam started.
     */
    JamSecond?:number;
    /**
     * Jam Counter
     */
    JamNumber?:number;
    /**
     * Current phase's default hour
     */
    PhaseHour?:number;
    /**
     * Current phase ID
     */
    PhaseID?:number;
    /**
     * Current phase index (for next/previous phase functionality)
     */
    PhaseIndex?:number;
    /**
     * Current phase's default minute.
     */
    PhaseMinute?:number;
    /**
     * Phase Name
     */
    PhaseName?:string;
    /**
     * Current phase's default second.
     */
    PhaseSecond?:number;
    /**
     * Left-side team
     */
    TeamA?:ScoreboardTeam;
    /**
     * Right-side team.
     */
    TeamB?:ScoreboardTeam;
    /**
     * Timestamp when last updated.
     */
    UpdateTime?:number;
}

/**
 * Scorekeeper state
 */
export interface SScorekeeper {
    /**
     * Left-side on-track skaters
     */
    TrackA?:Deck;
    /**
     * Right-side on-track skaters
     */
    TrackB?:Deck;
    /**
     * Left-side on-deck skaters (for next jam)
     */
    DeckA?:Deck;
    /**
     * Right-side on-deck skaters (for next jam)
     */
    DeckB?:Deck;
}

/**
 * 
 */
export interface SScorekeeperReel {
    /**
     * Highlighted skater index - left side team.
     */
    indexA?:number;
    /**
     * Highlighted skater index - right side team.
     */
    indexB?:number;
    /**
     * Record id of highlighted skater
     */
    skaterA?:number;
    /**
     * Record id of highlighted skater
     */
    skaterB?:number;
    /**
     * True if reel is displayed or not.
     */
    visible?:boolean;
}

/**
 * Manual slideshow state
 */
export interface SSlideshow {
    /**
     * Current slide index
     */
    Index?:number;
    /**
     * Slides
     */
    Records?:__BaseRecord[];
}

/**
 * Represents a team standing.
 */
export interface Standing {
    /**
     * Number of losses
     */
    Losses?:number;
    /**
     * Total points for the season.
     */
    Points?:number;
    /**
     * Position in standings.
     * Needs manual setting because points, wins/losses, don't always determine who is in a position.
     * For example, champions who tied throughout the season for win/loss, but have less points than the runner-up team.
     */
    Position?:number;
    /**
     * Team
     */
    TeamID?:number;
    /**
     * 
     */
    TeamLogo?:string|null;
    /**
     * Wins for the season.
     */
    Wins?:number;
}

/**
 * UI Controller
 */
export interface SUIController {
    /**
     * User configuration, including colors, labels, and scoreboard functionality.
     */
    Config:Config;
    /**
     * Capture configuration, to determine what and how is displayed on the capture window.
     */
    Capture:SCapture;
    /**
     * Timestamp configuration was last updated
     */
    UpdateTimeConfig:number;
    /**
     * Main camera configuration
     */
    MainCamera:CameraConfig;
    /**
     * Main video control.
     * Slideshow videos are muted and auto-played.
     */
    MainVideo:VideoConfig;
    OBSSettings:{
        Connected:boolean;
        CurrentSceneId:number;
        CurrentSceneName:string;
        CurrentSourceId:number;
        CurrentSourceName:string;
    };
    /**
     * Collection of scenes from OBS
     */
    OBSScenes:OBSSceneCollection;
    /**
     * Items associated with a given scene.
     */
    OBSSceneItems:{[key:string]:SceneItem[]};
    /**
     * If true, the scorekeeper reel is displayed.
     * Left arrow (keyboard and gamepad) cycles through the skaters on the left team.
     * Right arrow (keyboard and gamepad) cycles through the skaters on the right team.
     * Enter/Space (keyboard) Y (gamepad) sets the jammers.
     * Any other key (keyboard) and Y (gamepad) hides the reel.
     */
    ScorekeeperReel:SScorekeeperReel;
    /**
     * 
     */
    UpdateTimeOBS:number;
    /**
     * 
     */
    UpdateTimeOBSScenes:number;
}

/**
 * Team record
 */
export interface Team extends __BaseRecord {
    /**
     * Skaters assigned to the team.
     */
    Skaters?:Skater[]|null;
}

/**
 * Team collection - because it's faster
 */
export type TeamCollection = {[key:string]:Team};

/**
 * Determines the team's side on the scoreboard: A = left, B = right
 */
export type TeamSide = 'A'|'B';

/**
 * Video record.
 */
export interface Video extends __BaseRecord {
    Filename?:string|null;
}

/**
 * Collection of videos
 */
export type VideoCollection = {[key:string]:Video};

/**
 * Configuration for a video.
 */
export interface VideoConfig {
    /**
     * True to auto-play
     */
    AutoPlay?:boolean;
    /**
     * Additional CSS class name
     */
    className?:string;
    /**
     * True to show controls
     */
    Controls?:boolean;
    /**
     * Current time in the video
     */
    CurrentTime?:number;
    /**
     * Length of the video
     */
    Duration?:number;
    /**
     * True to loop
     */
    Loop?:boolean;
    /**
     * True to mute
     */
    Muted?:boolean;
    /**
     * Source. Can be a file, or a YouTube URL
     */
    Source?:string;
    /**
     * Current status
     */
    Status?:VideoStatus;
    /**
     * Current volume (0.00 - 1.00)
     */
    Volume?:number;
}

export enum VideoStatus {
    PAUSED,
    PLAYING,
    STOPPED
}