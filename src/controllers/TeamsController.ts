/**
 * Controller for Team records
 */
import vars, { TeamRecord, SkaterRecord, SkaterTeamRecord } from 'tools/vars';
import {CreateController, SaveRecord } from './functions.records';
import {Files, IRecordController} from './vars';
import { PrepareObjectForSending } from './functions';
import SkatersController from './SkatersController';

interface ITeamsController extends IRecordController {
    GetTeamSkaters:{(id:number,sorted:boolean)};
}

const TeamsController:ITeamsController = CreateController(vars.RecordType.Team, Files.Teams);

TeamsController.NewRecord = () : TeamRecord => {
    return {
        RecordID:0,
        RecordType:vars.RecordType.Peer,
        Name:'',
        ShortName:'',
        Number:'',
        Color:'',
        Thumbnail:'',
        Photo:'',
        Background:'',
        Slide:'',
        Acronym:'',
        Tagline:'',
        Skaters:[],
        TeamType:'H',
        LeagueID:0,
        YouthTeam:'N'
    }
};

/**
 * Saves the team record
 * Removes skaters from the team before saving!
 */
TeamsController.SaveRecord = async (record:TeamRecord) => {
    return new Promise((res, rej) => {
        SaveRecord(TeamsController, record, (team:TeamRecord) => {
            if(team.Skaters) {
                team.Skaters.length = 0;
            }
        }).then(() => {
            res(true);
        }).catch((er) => {
            rej(er);
        })
    });
};

/**
 * Gets the skaters assigned to the given team.
 * @param {Number} id Team's record ID
 */
TeamsController.GetTeamSkaters = (id:number, sorted:boolean = true) : Array<SkaterRecord> => {
    let team:TeamRecord = TeamsController.GetRecord(id);
    if(!team)
        return new Array<SkaterRecord>();
    let skaters:Array<SkaterRecord> = [];
    let records:Array<SkaterRecord> = SkatersController.Get();
    records.forEach((skater:SkaterRecord) => {
        if(skater.Teams && skater.Teams.length >= 1) {
            let team:SkaterTeamRecord|undefined = skater.Teams.find(r => r.TeamID == id);
            if(team) {
                skaters.push(Object.assign({}, skater, {
                    Teams:[team],
                    Penalties:[],
                    Position:null
                }));
            }
        }
    });

    skaters = skaters.sort((a:SkaterRecord, b) => {
        if(a !== undefined && b !== undefined && a.Name !== undefined && b.Name !== undefined)
            return a.Name.localeCompare(b.Name);
        return 0;
    });

    if(!sorted)
        return skaters;

    let captains:Array<SkaterRecord> = [];
    let cocaptains:Array<SkaterRecord> = [];
    let coaches:Array<SkaterRecord> = [];
    skaters.forEach((skater, index) => {
        if(skater.Teams !== undefined && skater.Teams.length === 1) {
            if(skater.Teams[0].Captain)
                captains.push(skater);
            else if(skater.Teams[0].CoCaptain)
                cocaptains.push(skater);
            else if(skater.Teams[0].Coach)
                coaches.push(skater);
        }
    });

    captains.forEach((skater) => {
        skaters.splice(skaters.findIndex(tskater => (tskater.RecordID === skater.RecordID)), 1);
    });

    cocaptains.forEach((skater) => {
        skaters.splice(skaters.findIndex(tskater => (tskater.RecordID === skater.RecordID)), 1);
    });

    coaches.forEach((skater) => {
        skaters.splice(skaters.findIndex(tskater => (tskater.RecordID === skater.RecordID)), 1);
    });

    return skaters.concat(cocaptains, captains, coaches);
};

/**
 * /api/team (teams)
 * /api/team/# (team)
 */
TeamsController.BuildAPI = async () => {
    const server = window.LocalServer;
    const exp = server.ExpressApp;

    //list of teams
    exp.get(/^\/api\/v1\/team(\/?)$/i, (req, res) => {
        res.send(server.PrepareObjectForSending(PrepareObjectForSending(TeamsController.Get())));
        res.end();
    });

    //get individual team
    exp.get(/^\/api\/v1\/team\/:id([0-9]{1,6})$/i, (req, res) => {
        let record:TeamRecord = TeamsController.GetRecord(req.params.id);
        if(record) {
            res.send(server.PrepareObjectForSending(PrepareObjectForSending(record)));
        } else {
            res.send(null);
        }
        res.end();
    });
};

export default TeamsController;