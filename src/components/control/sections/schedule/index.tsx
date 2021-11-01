import { SeasonSelector } from 'components/common/inputs/selectors';
import React from 'react';
import { Capture } from 'tools/capture/functions';
import { Seasons } from 'tools/seasons/functions';
import { Teams } from 'tools/teams/functions';
import { Bout, Season } from 'tools/vars';

interface Props {

}

/**
 * 
 * @param props 
 * @returns 
 */
const ScheduleControl:React.FunctionComponent<Props> = props => {
    const [seasonId, setSeasonId] = React.useState(Capture.GetSchedule().seasonId || 0);
    const [teams, setTeams] = React.useState(Teams.GetRecords());

    const onSelectSeason = React.useCallback((record?:Season) => {
        setSeasonId(record?.RecordID || 0);
    }, []);

    React.useEffect(() => {
        return Teams.Subscribe(() => {
            setTeams(Teams.GetRecords())
        })
    }, []);

    React.useEffect(() => {
        const record = Seasons.Get(seasonId);
        const bouts = (record?.Bouts || []);
        const results:Bout[] = [];
        if(bouts.length) {
            bouts.forEach(bout => {
                const result:Bout = {...bout, Matches:[]};
                if(bout.Matches && bout.Matches.length) {
                    bout.Matches.forEach(match => {
                        const teamA = teams.find(t => t.RecordID === match.TeamA.ID);
                        const teamB = teams.find(t => t.RecordID === match.TeamB.ID);
                        if(teamA && teamA) {
                            result.Matches?.push({
                                TeamA:{...match.TeamA, Name:teamA?.Name, Logo:teamA?.Thumbnail, Color:teamA?.Color},
                                TeamB:{...match.TeamB, Name:teamB?.Name, Logo:teamB?.Thumbnail, Color:teamB?.Color},
                            })
                        }
                    });
                }
                results.push(result);
            })
        }
        
        Capture.UpdateSchedule({bouts:results});
    }, [seasonId]);

    return <SeasonSelector value={seasonId} onSelectValue={onSelectSeason}/>
};

export {ScheduleControl};