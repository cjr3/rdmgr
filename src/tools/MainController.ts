import { AnthemSinger, ClockState, ClockStatus, DeckChoice, Peer, Penalty, Phase, RaffleTicket, RecordType, SAnthem, SClock, ScoreboardStatus, ScoreboardTeam, ScorekeeperPosition, Season, Skater, SkaterRoster, Slideshow, SMainController, SMediaQueue, SPenaltyTracker, Sponsor, SRaffle, SRoster, SScoreboard, SScorekeeper, SSlideshow, Team, TeamSide, Video, __BaseRecord } from "./vars";
import { createStore, Unsubscribe } from "redux";
import * as AnnouncerRecords from './announcers';
import * as Anthem from "./anthem";
import * as Clocks from './clocks/store';
import * as Penalties from './penalties'
import * as PenaltyTracker from './penaltytracker';
import * as Phases from './phases';
import * as Roster from './roster'
import * as Scoreboard from './scoreboard';
import * as Scorekeeper from './scorekeeper'
import { SkaterRecords } from './skaters';
import { SlideshowRecords, SlideshowState } from './slideshows';
import { TeamRecords } from './teams';
import { VideoRecords } from "./videos";
import * as Peers from "./peers";
import { SponsorRecords } from "./sponsors";
import * as Raffle from "./raffle";
import * as Seasons from "./seasons";

enum Actions {
    ADD_RAFFLE_TICKET,
    ADD_ROSTER_SKATERS,
    REMOVE_ANTHEM_SINGERS,
    REMOVE_PEERS,
    REMOVE_PENALTIES,
    REMOVE_PHASES,
    REMOVE_RAFFLE_TICKET,
    REMOVE_ROSTER_SKATERS,
    REMOVE_SEASONS,
    REMOVE_SKATERS,
    REMOVE_SLIDESHOWS,
    REMOVE_SPONSORS,
    REMOVE_TEAMS,
    REMOVE_VIDEOS,
    RESET_PENALTY_TRACKER,
    SET_ANNOUNCER,
    SET_ANTHEM_RECORDS,
    SET_ANTHEM_STATE,
    SET_CONFIG_STATE,
    SET_LOCAL_IP,
    SET_MEDIAQUEUE_STATE,
    SET_PEERS,
    SET_PEER_CONNECTION_TIME,
    SET_PENALTIES,
    SET_PENALTY_STATE,
    SET_PHASES,
    SET_RAFFLE_STATE,
    SET_ROSTER_ROLE,
    SET_ROSTER_STATE,
    SET_ROSTER_SKATERS,
    SET_SEASONS,
    SET_SCOREBOARD_BREAK_CLOCK,
    SET_SCOREBOARD_GAME_CLOCK,
    SET_SCOREBOARD_JAM_CLOCK,
    SET_SCOREBOARD_STATE,
    SET_SCOREBOARD_TEAM,
    SET_SCOREKEEPER_POSITION,
    SET_SCOREKEEPER_STATE,
    SET_SKATERS,
    SET_SLIDESHOW_STATE,
    SET_SLIDESHOWS,
    SET_SPONSORS,
    SET_TEAMS,
    SET_VIDEOS,
    TOGGLE_PENALTY_SKATER,
    TOGGLE_SKATER_PENALTY,
    UPDATE_ROSTER_SKATER,
    WRITE_ANTHEM_SINGERS,
    WRITE_CLOCKS,
    WRITE_PEERS,
    WRITE_PENALTIES,
    WRITE_PHASES,
    WRITE_SEASONS,
    WRITE_SKATERS,
    WRITE_SLIDESHOWS,
    WRITE_SPONSORS,
    WRITE_TEAMS,
    WRITE_VIDEOS
}

const InitClocks:SClock = {
    BreakHour:0,
    BreakMinute:0,
    BreakSecond:0,
    BreakStatus:ClockStatus.STOPPED,
    GameHour:0,
    GameMinute:0,
    GameSecond:0,
    GameStatus:ClockStatus.STOPPED,
    JamHour:0,
    JamMinute:0,
    JamSecond:0,
    JamStatus:0
};

const InitScoreboard:SScoreboard = {
    BoardStatus:ScoreboardStatus.NORMAL,
    // BreakClock:{
    //     Hours:0,
    //     Minutes:0,
    //     Seconds:30,
    //     Status:ClockStatus.STOPPED,
    //     Tenths:0
    // },
    ConfirmStatus:false,
    DateEnd:'',
    DateStart:'',
    // GameClock:{
    //     Hours:2,
    //     Minutes:0,
    //     Seconds:0,
    //     Status:ClockStatus.STOPPED,
    //     Tenths:0
    // },
    // JamClock:{
    //     Hours:0,
    //     Minutes:0,
    //     Seconds:60,
    //     Status:ClockStatus.STOPPED,
    //     Tenths:0
    // },
    JamHour:0,
    JamMinute:0,
    JamNumber:0,
    JamSecond:0,
    PhaseIndex:0,
    PhaseID:1,
    PhaseHour:2,
    PhaseMinute:0,
    PhaseSecond:0,
    PhaseName:'Setup',
    TeamA:{
        Name:'Team A',
        Color:'#990000'
    },
    TeamB:{
        Name:'Team B',
        Color:'#000099'
    },
    UpdateTime:0
};

const InitState:SMainController = {
    Announcer1:{
        RecordID:0,
        Name:''
    },
    Announcer2:{
        RecordID:0,
        Name:''
    },
    Anthem:{
        Singer:{
            RecordID:0,
            Name:'National Anthem'
        }
    },
    AnthemSingers:{},
    LocalIPAddress:'',
    MediaQueue:{
        Records:[]
    },
    Peers:{},
    PeerConnectionTime:0,
    Penalties:{},
    PenaltyTracker:{
        Skaters:[]
    },
    Phases:[
        {
            RecordID:1,
            RecordType:'PHS',
            Name:'SETUP',
            Hours:2,
            Minutes:0,
            Seconds:0
        },
        {
            RecordID:2,
            RecordType:'PHS',
            Name:'INTROS',
            Hours:0,
            Minutes:10,
            Seconds:0
        },
        {
            RecordID:3,
            RecordType:'PHS',
            Name:'1ST QTR',
            Hours:0,
            Minutes:15,
            Seconds:0
        },
        {
            RecordID:4,
            RecordType:'PHS',
            Name:'BREAK',
            Hours:0,
            Minutes:5,
            Seconds:0
        },
        {
            RecordID:5,
            RecordType:'PHS',
            Name:'2ND QTR',
            Hours:0,
            Minutes:15,
            Seconds:0
        },
        {
            RecordID:6,
            RecordType:'PHS',
            Name:'HALFTIME',
            Hours:0,
            Minutes:10,
            Seconds:0
        },
        {
            RecordID:7,
            RecordType:'PHS',
            Name:'3RD QTR',
            Hours:0,
            Minutes:15,
            Seconds:0
        },
        {
            RecordID:8,
            RecordType:'PHS',
            Name:'BREAK',
            Hours:0,
            Minutes:5,
            Seconds:0
        },
        {
            RecordID:9,
            RecordType:'PHS',
            Name:'4TH QTR',
            Hours:0,
            Minutes:15,
            Seconds:0
        },
        {
            RecordID:10,
            RecordType:'PHS',
            Name:'FINAL',
            Hours:0,
            Minutes:0,
            Seconds:0
        },
    ],
    Raffle:{
        CurrentTickets:[],
        Prizes:[],
        Tickets:[]
    },
    Roster:{
        SkatersA:[],
        SkatersB:[],
        TeamA:{
            BenchCoach:0,
            Captain:0,
            CoCaptain:0,
            Coach:0,
            Manager:0,
            Penalties:0
        },
        TeamB:{
            BenchCoach:0,
            Captain:0,
            CoCaptain:0,
            Coach:0,
            Manager:0,
            Penalties:0
        }
    },
    Seasons:{},
    Scorekeeper:{
        DeckA:{},
        DeckB:{},
        TrackA:{},
        TrackB:{}
    },
    Skaters:{},
    Slideshow:{
        Index:0,
        Records:[]
    },
    Slideshows:{},
    Sponsors:{},
    Teams:{
        'R-1':{
            RecordID:1,
            Name:'Red',
            Color:'#990000',
            RecordType:'TEM'
        },
        'R-2':{
            RecordID:2,
            Name:'Blue',
            Color:'#000099',
            RecordType:'TEM'
        }
    },
    UpdateTimeAnnouncer:0,
    UpdateTimeAnthem:0,
    UpdateTimeAnthemSingers:0,
    UpdateTimeMediaQueue:0,
    UpdateTimePeers:0,
    UpdateTimePenalties:0,
    UpdateTimePenaltyTracker:0,
    UpdateTimePhases:0,
    UpdateTimeRaffle:0,
    UpdateTimeRoster:0,
    UpdateTimeSeasons:0,
    UpdateTimeScoreboard:0,
    UpdateTimeScorekeeper:0,
    UpdateTimeSkaters:0,
    UpdateTimeSlideshow:0,
    UpdateTimeSlideshows:0,
    UpdateTimeSponsors:0,
    UpdateTimeTeams:0,
    UpdateTimeVideos:0,
    Videos:{}
};

/**
 * Clock reducer
 * @param state 
 * @param action 
 * @returns 
 */
const ClockReducer = (state:SClock = InitClocks, action:any) : SClock => {
    try {
        switch(action.type) {
            case Actions.WRITE_CLOCKS : return Clocks.UpdateClocks(state, action.values);
            default : return state;
        }
    } catch(er) {

    }

    return state;
}

/**
 * 
 * @param state 
 * @param action 
 * @returns 
 */
const MainReducer = (state:SMainController = InitState, action:any) : SMainController => {
    try {
        switch(action.type) {
            case Actions.ADD_RAFFLE_TICKET : return Raffle.Add(state, action.record);
            case Actions.ADD_ROSTER_SKATERS : return Roster.AddRecords(state, action.side, action.records);

            //remove records
            case Actions.REMOVE_ANTHEM_SINGERS : return Anthem.Remove(state, action.records);
            case Actions.REMOVE_PEERS : return Peers.Remove(state, action.records);
            case Actions.REMOVE_PENALTIES : return Penalties.Remove(state, action.records);
            case Actions.REMOVE_PHASES : return Phases.Remove(state, action.records);
            case Actions.REMOVE_RAFFLE_TICKET : return Raffle.Remove(state, action.index);
            case Actions.REMOVE_SPONSORS : return SponsorRecords.Remove(state, action.records);
            case Actions.REMOVE_ROSTER_SKATERS : return Roster.RemoveRecords(state, action.side, action.records);
            case Actions.REMOVE_SEASONS : return Seasons.Remove(state, action.records);
            case Actions.REMOVE_SKATERS : return SkaterRecords.Remove(state, action.records);
            case Actions.REMOVE_SLIDESHOWS : return SlideshowRecords.Remove(state, action.records);
            case Actions.REMOVE_TEAMS : return TeamRecords.Remove(state, action.records);
            case Actions.REMOVE_VIDEOS : return VideoRecords.Remove(state, action.records);

            //reset actions
            case Actions.RESET_PENALTY_TRACKER : return PenaltyTracker.Reset(state);

            case Actions.SET_ANNOUNCER : return AnnouncerRecords.SetAnnouncer(state, action.name, action.index);

            case Actions.SET_ANTHEM_RECORDS : return Anthem.Set(state, action.records);
            case Actions.SET_ANTHEM_STATE : return Anthem.SetState(state, action.values);

            //set local ip address
            case Actions.SET_LOCAL_IP : return Peers.SetLocalIP(state, action.ip);

            //case Actions.SET_MEDIAQUEUE_STATE : return 
            case Actions.SET_PEERS : return Peers.Set(state, action.records);
            case Actions.SET_PEER_CONNECTION_TIME : return Peers.SetConnectionTime(state);
            case Actions.SET_PENALTIES : return Penalties.Set(state, action.records);
            case Actions.SET_PENALTY_STATE : return PenaltyTracker.UpdateState(state, action.values);
            case Actions.SET_PHASES : return Phases.Set(state, action.records);

            case Actions.SET_RAFFLE_STATE : return Raffle.Update(state, action.values);

            case Actions.SET_ROSTER_ROLE : return Roster.SetRole(state, action.side, action.role, action.recordId);
            case Actions.SET_ROSTER_SKATERS : return Roster.SetRecords(state, action.side, action.records);
            case Actions.SET_ROSTER_STATE : return Roster.Update(state, action.values);

            case Actions.SET_SEASONS : return Seasons.Set(state, action.records);

            // 09/06/2022: Moved scoreboard to its own store.
            // case Actions.SET_SCOREBOARD_BREAK_CLOCK : return Scoreboard.UpdateBreakClock(state, action.values);
            // case Actions.SET_SCOREBOARD_GAME_CLOCK : return Scoreboard.UpdateGameClock(state, action.values);
            // case Actions.SET_SCOREBOARD_JAM_CLOCK : return Scoreboard.UpdateJamClock(state, action.values);
            // case Actions.SET_SCOREBOARD_STATE : return Scoreboard.UpdateState(state, action.values);
            // case Actions.SET_SCOREBOARD_TEAM : return Scoreboard.UpdateTeam(state, action.side, action.values);
            case Actions.SET_SCOREKEEPER_POSITION : return Scorekeeper.SetPosition(state, action.side, action.record, action.deck, action.position);
            case Actions.SET_SCOREKEEPER_STATE : return Scorekeeper.Update(state, action.values);
            case Actions.SET_SKATERS : return SkaterRecords.Set(state, action.records);

            case Actions.SET_SLIDESHOWS : return SlideshowRecords.Set(state, action.records);
            case Actions.SET_SLIDESHOW_STATE : return SlideshowState.Update(state, action.values);
            case Actions.SET_SPONSORS : return SponsorRecords.Set(state, action.records);

            case Actions.SET_TEAMS : return TeamRecords.Set(state, action.records);

            case Actions.SET_VIDEOS : return VideoRecords.Set(state, action.records);

            case Actions.TOGGLE_PENALTY_SKATER : return PenaltyTracker.ToggleSkater(state, action.jamNumber, action.skaterId);
            case Actions.TOGGLE_SKATER_PENALTY : return PenaltyTracker.TogglePenalty(state, action.jamNumber, action.skaterId, action.penaltyId);

            case Actions.UPDATE_ROSTER_SKATER : return Roster.UpdateRecord(state, action.values);

            //create / update records
            case Actions.WRITE_ANTHEM_SINGERS : return Anthem.Write(state, action.records);
            case Actions.WRITE_PEERS : return Peers.Write(state, action.records);
            case Actions.WRITE_PENALTIES : return Penalties.Write(state, action.records);
            case Actions.WRITE_PHASES : return Phases.Write(state, action.records);
            case Actions.WRITE_SEASONS : return Seasons.Write(state, action.records);
            case Actions.WRITE_SPONSORS : return SponsorRecords.Write(state, action.records);
            case Actions.WRITE_SKATERS : return SkaterRecords.Write(state, action.records);
            case Actions.WRITE_SLIDESHOWS : return SlideshowRecords.Write(state, action.records);
            case Actions.WRITE_TEAMS : return TeamRecords.Write(state, action.records);
            case Actions.WRITE_VIDEOS : return VideoRecords.Write(state, action.records);

            default : return state;
        }
    } catch(er) {

    }

    return state;
};

/**
 * Reducer for scoreboard, since it changes often.
 * @param state 
 * @param action 
 * @returns 
 */
const ScoreboardReducer = (state:SScoreboard = InitScoreboard, action:any) : SScoreboard => {
    try {
        switch(action.type) {
            case Actions.SET_SCOREBOARD_STATE : return Scoreboard.UpdateState(state, action.values);
            default : return state;
        }
    } catch(er) {

    }

    return state;
};

const ClockStore = createStore(ClockReducer);
const MainStore = createStore(MainReducer);
const ScoreStore = createStore(ScoreboardReducer);

class Controller {

    /**
     * Assign id to new records
     * @param recordType 
     * @param records 
     */
    private __AssignRecordID = (recordType:RecordType, records:__BaseRecord[]) => {
        let maxId = 0;
        let current:__BaseRecord[] = [];
        const state = this.GetState();
        switch(recordType) {
            case 'ANT' : current = Object.values(state.AnthemSingers); break;
            case 'PER' : current = Object.values(state.Peers); break;
            case 'PEN' : current = Object.values(state.Penalties); break;
            case 'PHS' : current = state.Phases; break;
            case 'SEA' : current = Object.values(state.Seasons); break;
            case 'SKR' : current = Object.values(state.Skaters); break;
            case 'SLS' : current = Object.values(state.Slideshows); break;
            case 'SPN' : current = Object.values(state.Sponsors); break;
            case 'TEM' : current = Object.values(state.Teams); break;
            case 'VID' : current = Object.values(state.Videos); break;
        }

        current.forEach(r => {
            if(typeof(r.RecordID) === 'number' && r.RecordID > maxId)
                maxId = r.RecordID;
        });

        maxId++;
        records.forEach(r => {
            if(typeof(r.RecordID) !== 'number' || r.RecordID < 1) {
                r.RecordID = maxId;
                maxId++;
            }
        });
    };

    /**
     * Add a raffle ticket
     * @param ticket 
     */
    AddRaffleTicket = (ticket:RaffleTicket) => {
        MainStore.dispatch({
            type:Actions.ADD_RAFFLE_TICKET,
            record:ticket
        });
    };

    /**
     * 
     * @param side 
     * @param records 
     */
    AddRosterSkaters = (side:TeamSide, records:SkaterRoster[]) => {
        MainStore.dispatch({
            type:Actions.ADD_ROSTER_SKATERS,
            side:side,
            records:records
        });
    };

    /**
     * Main state of clock.
     * @returns 
     */
    GetClockState = () : SClock => ClockStore.getState();

    /**
     * Get the current scoreboard state.
     * @returns 
     */
    GetScoreboardState = () : SScoreboard => ScoreStore.getState();
    
    /**
     * Get the current state
     * @returns 
     */
    GetState = () : SMainController => MainStore.getState();

    /**
     * Ge the most recent update time from the store.
     * @returns 
     */
    GetUpdateTime = () : number => {
        const state = this.GetState();
        return Math.max(
            state.UpdateTimeAnnouncer,
            state.UpdateTimeAnthem,
            state.UpdateTimeMediaQueue,
            state.UpdateTimePenaltyTracker,
            state.UpdateTimeRaffle,
            state.UpdateTimeRoster,
            // state.UpdateTimeScoreboard,
            state.UpdateTimeScorekeeper,
            state.UpdateTimeSkaters,
            state.UpdateTimeSlideshow,
            state.UpdateTimeSlideshows,
            state.UpdateTimeSponsors,
            state.UpdateTimeTeams,
            state.UpdateTimeVideos
        );
    };

    /**
     * 
     * @returns 
     */
    Load = () : Promise<boolean> => {
        return new Promise(res => {
            return res(true);
        });
    };

    /**
     * Remove anthem singers
     * @param records 
     */
    RemoveAnthemSingers = (records:number[]) => {
        MainStore.dispatch({
            type:Actions.REMOVE_ANTHEM_SINGERS,
            records:records
        })
    };

    /**
     * Remove penalty records.
     * @param records 
     */
    RemovePenalties = (records:number[]) => {
        MainStore.dispatch({
            type:Actions.REMOVE_PENALTIES,
            records:records
        });
    };

    /**
     * Remove phase records.
     * @param records 
     */
    RemovePhases = (records:number[]) => {
        MainStore.dispatch({
            type:Actions.REMOVE_PHASES,
            records:records
        });
    };

    /**
     * Remove a raffle ticket
     * @param index 
     */
    RemoveRaffleTicket = (index:number = -1) => {
        MainStore.dispatch({
            type:Actions.REMOVE_RAFFLE_TICKET,
            index:index
        })
    }

    /**
     * 
     * @param side 
     * @param records 
     */
    RemoveRosterSkaters = (side:TeamSide, records:number[]) => {
        MainStore.dispatch({
            type:Actions.REMOVE_ROSTER_SKATERS,
            side:side,
            records:records
        });
    };

    /**
     * Remove season records.
     * @param records 
     */
    RemoveSeasons = (records:number[]) => {
        MainStore.dispatch({
            type:Actions.REMOVE_SEASONS,
            records:records
        });
    }

    /**
     * Remove skater records
     * @param records 
     */
    RemoveSkaters = (records:number[]) => {
        MainStore.dispatch({
            type:Actions.REMOVE_SKATERS,
            records:records
        });
    };

    /**
     * Remove slideshow records.
     * @param records 
     */
    RemoveSlideshows = (records:number[]) => {
        MainStore.dispatch({
            type:Actions.REMOVE_SLIDESHOWS,
            records:records
        });
    };

    /**
     * Remove sponsor records
     * @param records 
     */
    RemoveSponsors = (records:number[]) => {
        MainStore.dispatch({
            type:Actions.REMOVE_SPONSORS,
            records:records
        })
    }

    /**
     * Remove team records
     * @param records 
     */
    RemoveTeams = (records:number[]) => {
        MainStore.dispatch({
            type:Actions.REMOVE_TEAMS,
            records:records
        });
    };

    /**
     * Remove videos
     * @param records 
     */
    RemoveVideos = (records:number[]) => {
        MainStore.dispatch({
            type:Actions.REMOVE_VIDEOS,
            records:records
        });
    };

    /**
     * Reset the penalty tracker.
     * - Remove all skaters from penalty tracker.
     */
    ResetPenaltyTracker = () => {
        MainStore.dispatch({
            type:Actions.RESET_PENALTY_TRACKER
        });
    };

    /**
     * Set the name of one of the announcers.
     * @param name 
     * @param index 
     */
    SetAnnouncer = (name:string, index:1|2) => {
        MainStore.dispatch({
            type:Actions.SET_ANNOUNCER,
            name:name,
            index:index
        })
    }

    /**
     * Set anthem singer records
     * @param records 
     */
    SetAnthemSingers = (records:AnthemSinger[]) => {
        MainStore.dispatch({
            type:Actions.SET_ANTHEM_RECORDS,
            records:records
        });
    };

    /**
     * Set the local ip address for server requests
     * @param ip 
     */
    SetLocalIPAddress = (ip:string) => {
        MainStore.dispatch({
            type:Actions.SET_LOCAL_IP,
            ip:ip
        });
    }

    /**
     * Set peer records
     * @param records 
     */
    SetPeers = (records:Peer[]) => {
        MainStore.dispatch({
            type:Actions.SET_PEERS,
            records:records
        });
    };

    /**
     * Update last timestamp for peer connections.
     */
    SetPeerConnectionTime = () => {
        MainStore.dispatch({
            type:Actions.SET_PEER_CONNECTION_TIME
        });
    }

    /**
     * Set penalty records
     * @param records 
     */
    SetPenalties = (records:Penalty[]) => {
        MainStore.dispatch({
            type:Actions.SET_PENALTIES,
            records:records
        });
    };

    /**
     * Set phase records
     * @param records 
     */
    SetPhases = (records:Phase[]) => {
        MainStore.dispatch({
            type:Actions.SET_PHASES,
            records:records
        })
    }

    /**
     * Set the role of a skater on a team's roster.
     * @param side 
     * @param role 
     * @param recordId 
     */
    SetRosterRole = (side:TeamSide, role:string, recordId:number) => {
        MainStore.dispatch({
            type:Actions.SET_ROSTER_ROLE,
            side:side,
            role:role,
            recordId:recordId
        })
    }

    /**
     * 
     * @param side 
     * @param records 
     */
    SetRosterSkaters = (side:TeamSide, records:SkaterRoster[]) => {
        MainStore.dispatch({
            type:Actions.SET_ROSTER_SKATERS,
            side:side,
            records:records
        });
    };

    /**
     * Set season records.
     * @param records 
     */
    SetSeasons = (records:Season[]) => {
        MainStore.dispatch({
            type:Actions.SET_SEASONS,
            records:records
        });
    }

    /**
     * Set the position on the scorekeeper
     * @param side 
     * @param record 
     * @param deck 
     * @param position 
     */
    SetScorekeeperPosition = (side:TeamSide, record?:Skater, deck?:DeckChoice, position?:ScorekeeperPosition) => {
        MainStore.dispatch({
            type:Actions.SET_SCOREKEEPER_POSITION,
            side:side,
            record:record,
            deck:deck,
            position:position
        });
    };

    /**
     * 
     * @param records 
     */
    SetSkaters = (records:Skater[]) => {
        MainStore.dispatch({
            type:Actions.SET_SKATERS,
            records:records
        })
    };

    /**
     * 
     * @param records 
     */
    SetSlideshows = (records:Slideshow[]) => {
        MainStore.dispatch({
            type:Actions.SET_SLIDESHOWS,
            records:records
        })
    };

    /**
     * Set sponsor records
     * @param records 
     */
    SetSponsors = (records:Sponsor[]) => {
        MainStore.dispatch({
            type:Actions.SET_SPONSORS,
            records:records
        })
    }

    /**
     * 
     * @param records 
     */
    SetTeams = (records:Team[]) => {
        MainStore.dispatch({
            type:Actions.SET_TEAMS,
            records:records
        });
    };

    /**
     * Set video records
     * @param records 
     */
    SetVideos = (records:Video[]) => {
        MainStore.dispatch({
            type:Actions.SET_VIDEOS,
            records:records
        })
    }

    /**
     * Subscribe to changes in the store.
     * @param f 
     * @returns 
     */
    Subscribe = (f:{():void}) : Unsubscribe => MainStore.subscribe(f);

    /**
     * Subscribe to changes for the clocks.
     * @param f 
     * @returns 
     */
    SubscribeClocks = (f:{():void}) : Unsubscribe => ClockStore.subscribe(f);

    /**
     * Subscribe to changes in the scoreboard store.
     * @param f 
     * @returns 
     */
    SubscribeScoreboard = (f:{():void}) : Unsubscribe => ScoreStore.subscribe(f);

    /**
     * Add/remove a skater from the penalty tracker.
     * @param skaterId 
     */
    TogglePenaltySkater = (skaterId:number) => {
        MainStore.dispatch({
            type:Actions.TOGGLE_PENALTY_SKATER,
            jamNumber:this.GetScoreboardState().JamNumber || 0,
            skaterId:skaterId
        });
    };

    /**
     * Toggle a penalty on a skater (adds the skater if they're not in the penalty tracker).
     * Does not remove the skater from the penalty tracker if there are no penalties.
     * @param skaterId 
     * @param penaltyId 
     */
    ToggleSkaterPenalty = (skaterId:number, penaltyId:number) => {
        MainStore.dispatch({
            type:Actions.TOGGLE_SKATER_PENALTY,
            jamNumber:this.GetScoreboardState().JamNumber || 0,
            skaterId:skaterId,
            penaltyId:penaltyId
        });
    };

    /**
     * Update anthem state.
     * @param values 
     */
    UpdateAnthemState = (values:SAnthem) => {
        MainStore.dispatch({
            type:Actions.SET_ANTHEM_STATE,
            values:values
        });
    };

    /**
     * Update the main clock store.
     * @param values 
     */
    UpdateClockState = (values:SClock) => {
        ClockStore.dispatch({
            type:Actions.WRITE_CLOCKS,
            values:values
        })
    }

    /**
     * 
     * @param values 
     */
    UpdateMediaQueueState = (values:SMediaQueue) => {
        MainStore.dispatch({
            type:Actions.SET_MEDIAQUEUE_STATE,
            values:values
        });
    };

    /**
     * 
     * @param values 
     */
    UpdatePenaltyTrackerState = (values:SPenaltyTracker) => {
        MainStore.dispatch({
            type:Actions.SET_PENALTY_STATE,
            values:values
        });
    }

    /**
     * 
     * @param values 
     */
    UpdateRaffleState = (values:SRaffle) => {
        MainStore.dispatch({
            type:Actions.SET_RAFFLE_STATE,
            values:values
        });
    }

    /**
     * 
     * @param side 
     * @param values 
     */
    UpdateRosterSkater = (side:TeamSide, values:SkaterRoster) => {
        MainStore.dispatch({
            type:Actions.UPDATE_ROSTER_SKATER,
            side:side,
            values:values
        })
    };

    /**
     * 
     * @param values 
     */
    UpdateRosterState = (values:SRoster) => {
        MainStore.dispatch({
            type:Actions.SET_ROSTER_STATE,
            values:values
        });
    };

    // /**
    //  * Update scoreboard break clock
    //  * @param values 
    //  * @returns 
    //  */
    // UpdateScoreboardBreakClock = (values:ClockState) => {
    //     this.UpdateClockState({
    //         BreakHour:values.Hours,
    //         BreakMinute:values.Minutes,
    //         BreakSecond:values.Seconds,
    //         BreakStatus:values.Status
    //     });
    //     // MainStore.dispatch({type:Actions.SET_SCOREBOARD_BREAK_CLOCK, values:values});
    //     // const state = MainController.GetState().Scoreboard;
    //     // this.UpdateScoreboardState({BreakClock:{...state.BreakClock, ...values}});
    // }

    // /**
    //  * Update scoreboard game clock
    //  * @param values 
    //  * @returns 
    //  */
    // UpdateScoreboardGameClock = (values:ClockState) => {
    //     this.UpdateClockState({
    //         GameHour:values.Hours,
    //         GameMinute:values.Minutes,
    //         GameSecond:values.Seconds,
    //         GameStatus:values.Status
    //     });
    //     //MainStore.dispatch({type:Actions.SET_SCOREBOARD_GAME_CLOCK, values:values});
    //     // const state = MainController.GetState().Scoreboard;
    //     // this.UpdateScoreboardState({GameClock:{...state.GameClock, ...values}});
    // }

    // /**
    //  * Update scoreboard jam clock
    //  * @param values 
    //  * @returns 
    //  */
    // UpdateScoreboardJamClock = (values:ClockState) => {
    //     this.UpdateClockState({
    //         JamHour:values.Hours,
    //         JamMinute:values.Minutes,
    //         JamSecond:values.Seconds,
    //         JamStatus:values.Status
    //     });
    //     // const state = MainController.GetState().Scoreboard;
    //     // this.UpdateScoreboardState({JamClock:{...state.JamClock, ...values}});
    // }

    /**
     * Update the values of the scoreboard.
     * @param values 
     * @returns 
     */
    UpdateScoreboardState = (values:SScoreboard) => {
        ScoreStore.dispatch({type:Actions.SET_SCOREBOARD_STATE, values:values});
    }

    /**
     * Update the values of a team on the scoreboard.
     * @param side 
     * @param values 
     */
    UpdateScoreboardTeam = (side:TeamSide, values:ScoreboardTeam) => {
        const state = this.GetScoreboardState();
        if(side === 'A') {
            this.UpdateScoreboardState({TeamA:{...state.TeamA, ...values}});
        } else {
            this.UpdateScoreboardState({TeamB:{...state.TeamB,...values}});
        }
    };

    /**
     * Update scorekeeper state
     * @param values 
     */
    UpdateScorekeeperState = (values:SScorekeeper) => {
        MainStore.dispatch({
            type:Actions.SET_SCOREKEEPER_STATE,
            values:values
        });
    };

    /**
     * 
     * @param values 
     */
    UpdateSlideshowState = (values:SSlideshow) => {
        MainStore.dispatch({
            type:Actions.SET_SLIDESHOW_STATE,
            values:values
        })
    };

    /**
     * Update/create anthem records
     * @param records 
     */
    WriteAnthemSingers = (records:AnthemSinger[]) => {
        this.__AssignRecordID('ANT', records);
        MainStore.dispatch({
            type:Actions.WRITE_ANTHEM_SINGERS,
            records:records
        });
    };

    /**
     * Update/create peer records
     * @param records 
     */
    WritePeers = (records:Peer[]) => {
        this.__AssignRecordID('PER', records);
        MainStore.dispatch({
            type:Actions.WRITE_PEERS,
            records:records
        })
    }

    /**
     * Update/create penalty records.
     * @param records 
     */
    WritePenalties = (records:Phase[]) => {
        this.__AssignRecordID('PEN', records);
        MainStore.dispatch({
            type:Actions.WRITE_PENALTIES,
            records:records
        });
    };

    /**
     * Update/create phase records.
     * @param records 
     */
    WritePhases = (records:Phase[]) => {
        this.__AssignRecordID('PHS', records);
        MainStore.dispatch({
            type:Actions.WRITE_PHASES,
            records:records
        });
    };

    /**
     * Update/create season records.
     * @param records 
     */
    WriteSeasons = (records:Season[]) => {
        this.__AssignRecordID('SEA', records);
        MainStore.dispatch({
            type:Actions.WRITE_SEASONS,
            records:records
        });
    };

    /**
     * Update/create skater records.
     * @param records 
     */
    WriteSkaters = (records:Skater[]) => {
        this.__AssignRecordID('SKR', records);
        MainStore.dispatch({
            type:Actions.WRITE_SKATERS,
            records:records
        });
    };

    /**
     * Update/create skater records.
     * @param records 
     */
    WriteSlideshows = (records:Slideshow[]) => {
        this.__AssignRecordID('SLS', records);
        MainStore.dispatch({
            type:Actions.WRITE_SLIDESHOWS,
            records:records
        });
    };

    /**
     * Update/create sponsor records
     * @param records 
     */
    WriteSponsors = (records:Sponsor[]) => {
        this.__AssignRecordID('SPN', records);
        MainStore.dispatch({
            type:Actions.WRITE_SPONSORS,
            records:records
        });
    }

    /**
     * Update/create team records
     * @param records 
     */
    WriteTeams = (records:Team[]) => {
        this.__AssignRecordID('TEM', records);
        MainStore.dispatch({
            type:Actions.WRITE_TEAMS,
            records:records
        });
    };

    /**
     * Update/create video records
     * @param records 
     */
    WriteVideos = (records:Video[]) => {
        this.__AssignRecordID('VID', records);
        MainStore.dispatch({
            type:Actions.WRITE_VIDEOS,
            records:records
        });
    };
};

const MainController = new Controller();
export {MainController};