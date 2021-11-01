import { SeasonSelector } from 'components/common/inputs/selectors';
import React from 'react';
import { Capture } from 'tools/capture/functions';
import { Seasons } from 'tools/seasons/functions';
import { Teams } from 'tools/teams/functions';
import { Season, Standing } from 'tools/vars';

interface Props {

}

/**
 * 
 * @param props 
 * @returns 
 */
const StandingsControl:React.FunctionComponent<Props> = props => {
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
        const standings = (record?.Standings || []);
        const results:Standing[] = [];
        if(standings.length) {
            standings.forEach(standing => {
                const team = teams.find(t => t.RecordID === standing.TeamID);
                results.push({
                    ...standing,
                    TeamLogo:team?.Thumbnail
                });
            })
        }
        
        Capture.UpdateStandings({standings:results});
    }, [seasonId]);

    return <SeasonSelector value={seasonId} onSelectValue={onSelectSeason}/>
};

export {StandingsControl};