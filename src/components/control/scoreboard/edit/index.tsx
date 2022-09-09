import { Dialog, DialogBody, DialogFooter, DialogTitle } from 'components/common/dialog';
import { ColorPicker } from 'components/common/inputs/colorpicker';
import { MediaItem } from 'components/common/inputs/mediaitem';
import { NumberInput } from 'components/common/inputs/numberinput';
import { TeamSelector } from 'components/common/inputs/selectors';
import { TextInput } from 'components/common/inputs/textinput';
import React from 'react';
import { MainController } from 'tools/MainController';
import { Scoreboard } from 'tools/scoreboard/functions';
import { GameClock } from 'tools/scoreboard/gameclock';
import { UIController } from 'tools/UIController';
import { Team } from 'tools/vars';

interface Props {
    onHide:{():void}
}

interface State {
    gameClockHour:number;
    gameClockMinute:number;
    gameClockReset:boolean;
    gameClockSecond:number;
    gameClockTenths:number;
    jamNumber:number;
    phaseName:string;
    teamAChallenges:number;
    teamAColor:string;
    teamAID:number;
    teamALogo:string;
    teamABannerLogo:string;
    teamAJamPoints:number;
    teamAName:string;
    teamAScore:number;
    teamATimeouts:number;
    teamBChallenges:number;
    teamBColor:string;
    teamBID:number;
    teamBLogo:string;
    teamBBannerLogo:string;
    teamBJamPoints:number;
    teamBName:string;
    teamBScore:number;
    teamBTimeouts:number;
}

class Main extends React.PureComponent<Props, State> {
    readonly state:State = {
        gameClockHour:0,
        gameClockMinute:0,
        gameClockReset:false,
        gameClockSecond:0,
        gameClockTenths:0,
        jamNumber:0,
        phaseName:'',
        teamAChallenges:0,
        teamAColor:'',
        teamAID:0,
        teamALogo:'',
        teamABannerLogo:'',
        teamAJamPoints:0,
        teamAName:'',
        teamAScore:0,
        teamATimeouts:0,
        teamBColor:'',
        teamBID:0,
        teamBLogo:'',
        teamBBannerLogo:'',
        teamBJamPoints:0,
        teamBName:'',
        teamBScore:0,
        teamBTimeouts:0,
        teamBChallenges:0
    }

    /**
     * Set the game clock hour
     * @param ev 
     */
    protected onChangeGameClockHour = (value:number) => this.setState({gameClockHour:value});

    /**
     * Set the game clock minute
     * @param ev 
     */
    protected onChangeGameClockMinute = (value:number) => this.setState({gameClockMinute:value});

    /**
     * Set the game clock second
     * @param ev 
     */
    protected onChangeGameClockSecond = (value:number) => this.setState({gameClockSecond:value});

    /**
     * Set the game clock minute
     * @param ev 
     */
    protected onChangeGameClockTenths = (value:number) => this.setState({gameClockTenths:value});

    /**
     * Toggle game clock reset checkbox
     * @returns 
     */
    protected onChangeGameClockReset = () => this.setState({gameClockReset:!this.state.gameClockReset});

    /**
     * Set the jam number
     * @param ev 
     */
    protected onChangeJamNumber = (value:number) => this.setState({jamNumber:value});

    /**
     * Set the phase name
     */
    protected onChangePhaseName = (value:string) => this.setState({phaseName:value});

    /**
     * Called when the user selects a different team.
     * @param team 
     */
    protected onChangeTeamA = (team?:Team) => {
        if(team) {
            this.setState({
                teamAID:team.RecordID || 0,
                teamAName:team.Name || 'Team A',
                teamAColor:team.Color || '#000000',
                teamALogo:team.Thumbnail || '',
                teamABannerLogo:team.ScoreboardThumbnail || ''
            })
        }
    };

    /**
     * Set left-side team challenges
     * @param ev 
     */
    protected onChangeTeamAChallenges = (value:number) => this.setState({teamAChallenges:value});

    /**
     * Set left side team color
     * @param ev 
     */
    protected onChangeTeamAColor = (value:string) => this.setState({teamAColor:value});

    /**
     * Set left side team jam points
     * @param ev 
     */
    protected onChangeTeamAJamPoints = (value:number) => this.setState({teamAJamPoints:value});

    /**
     * Set left-side team logo.
     * @param value 
     * @returns 
     */
    protected onChangeTeamALogo = (value:string) => this.setState({teamALogo:value});

    /**
     * Set left-side team scorebanner logo
     * @param value 
     * @returns 
     */
    protected onChangeTeamABannerLogo = (value:string) => this.setState({teamABannerLogo:value});

    /**
     * Set left side team name
     * @param ev 
     */
    protected onChangeTeamAName = (value:string) => this.setState({teamAName:value});

    /**
     * Set left side team score
     * @param ev 
     */
    protected onChangeTeamAScore = (value:number) => this.setState({teamAScore:value});

    /**
     * Set left side team timeouts
     * @param ev 
     */
    protected onChangeTeamATimeouts = (value:number) => this.setState({teamATimeouts:value});

    /**
     * Called when the user selects a different team.
     * @param team 
     */
    protected onChangeTeamB = (team?:Team) => {
        if(team) {
            this.setState({
                teamBID:team.RecordID || 0,
                teamBName:team.Name || 'Team B',
                teamBColor:team.Color || '#000000',
                teamBLogo:team.Thumbnail || '',
                teamBBannerLogo:team.ScoreboardThumbnail || ''
            });
        }
    };

    /**
     * Set right side team challenges
     * @param ev 
     */
    protected onChangeTeamBChallenges = (value:number) => this.setState({teamBChallenges:value});

    /**
     * Set right side team color
     * @param ev 
     */
    protected onChangeTeamBColor = (value:string) => this.setState({teamBColor:value});

    /**
     * set right side team jam points
     * @param ev 
     */
    protected onChangeTeamBJamPoints = (value:number) => this.setState({teamBJamPoints:value});

    /**
     * Set left-side team logo.
     * @param value 
     * @returns 
     */
    protected onChangeTeamBLogo = (value:string) => this.setState({teamBLogo:value});

    /**
     * Set left-side team scorebanner logo
     * @param value 
     * @returns 
     */
    protected onChangeTeamBBannerLogo = (value:string) => this.setState({teamBBannerLogo:value});

    /**
     * Set right side team name
     * @param ev 
     */
    protected onChangeTeamBName = (value:string) => this.setState({teamBName:value});

    /**
     * Set right side team score
     * @param ev 
     */
    protected onChangeTeamBScore = (value:number) => this.setState({teamBScore:value});

    /**
     * Set right side team timeouts
     * @param ev 
     */
    protected onChangeTeamBTimeouts = (value:number) => this.setState({teamBTimeouts:value});

    /**
     * Update the scoreboard, and game clock if needed.
     */
    protected onClickSubmit = () => {
        if(this.state.gameClockReset) {
            GameClock.set(this.state.gameClockHour, this.state.gameClockMinute, this.state.gameClockSecond, 0);
        }

        Scoreboard.UpdateTeam('A', {
            Challenges:this.state.teamAChallenges,
            Color:this.state.teamAColor,
            JamPoints:this.state.teamAJamPoints,
            Logo:this.state.teamALogo,
            Name:this.state.teamAName,
            Score:this.state.teamAScore,
            ScoreboardThumbnail:this.state.teamABannerLogo,
            Timeouts:this.state.teamATimeouts
        })

        Scoreboard.UpdateTeam('B', {
            Challenges:this.state.teamBChallenges,
            Color:this.state.teamBColor,
            JamPoints:this.state.teamBJamPoints,
            Logo:this.state.teamBLogo,
            Name:this.state.teamBName,
            Score:this.state.teamBScore,
            ScoreboardThumbnail:this.state.teamBBannerLogo,
            Timeouts:this.state.teamBTimeouts
        });

        MainController.UpdateScoreboardState({
            PhaseName:this.state.phaseName
        });

        this.props.onHide();
    }

    /**
     * Cancel changes
     */
    protected onClickCancel = () => {
        this.props.onHide();
    }

    /**
     * Copy values from current state.
     */
    protected update = () => {
        const state = Scoreboard.GetState();
        this.setState({
            gameClockHour:GameClock.Hour,
            gameClockMinute:GameClock.Minute,
            gameClockSecond:GameClock.Second,
            gameClockTenths:GameClock.Tenths,
            gameClockReset:false,
            jamNumber:state.JamNumber || 0,
            phaseName:state.PhaseName || '',
            teamAChallenges:state.TeamA?.Challenges || 0,
            teamAColor:state.TeamA?.Color || '',
            teamAID:state.TeamA?.ID || 0,
            teamAJamPoints:state.TeamA?.JamPoints || 0,
            teamALogo:state.TeamA?.Logo || '',
            teamAName:state.TeamA?.Name || '',
            teamAScore:state.TeamA?.Score || 0,
            teamABannerLogo:state.TeamA?.ScoreboardThumbnail || '',
            teamATimeouts:state.TeamA?.Timeouts || 0,
            teamBChallenges:state.TeamB?.Challenges || 0,
            teamBColor:state.TeamB?.Color || '',
            teamBID:state.TeamB?.ID || 0,
            teamBJamPoints:state.TeamB?.JamPoints || 0,
            teamBLogo:state.TeamB?.Logo || '',
            teamBName:state.TeamB?.Name || '',
            teamBScore:state.TeamB?.Score || 0,
            teamBBannerLogo:state.TeamB?.ScoreboardThumbnail || '',
            teamBTimeouts:state.TeamB?.Timeouts || 0
        });
    }

    componentDidMount() {
        this.update();
    }

    render() {
        const maxTimeouts = UIController.GetState().Config.Scoreboard?.MaxTeamTimeouts || 3;
        const maxChallenges = UIController.GetState().Config.Scoreboard?.MaxTeamChallenges || 2;
        return <Dialog onHide={this.props.onHide}>
            <DialogTitle onHide={this.props.onHide}>Scoreboard Edit</DialogTitle>
            <DialogBody>
                <div style={{
                    display:'grid',
                    gridTemplateColumns:'1fr'
                }}>
                    <div>
                        <table className='table'>
                            <tbody>
                                <tr>
                                    <td width='34%'></td>
                                    <td width='33%'>
                                        <TeamSelector value={this.state.teamAID} onSelectValue={this.onChangeTeamA}/>
                                    </td>
                                    <td width='33%'>
                                        <TeamSelector value={this.state.teamBID} onSelectValue={this.onChangeTeamB}/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Name</td>
                                    <td>
                                        <TextInput value={this.state.teamAName} onChangeValue={this.onChangeTeamAName}/>
                                    </td>
                                    <td>
                                        <TextInput value={this.state.teamBName} onChangeValue={this.onChangeTeamBName}/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Color</td>
                                    <td>
                                        <ColorPicker value={this.state.teamAColor} onChangeValue={this.onChangeTeamAColor}/>
                                    </td>
                                    <td>
                                        <ColorPicker value={this.state.teamBColor} onChangeValue={this.onChangeTeamBColor}/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Score</td>
                                    <td>
                                        <NumberInput
                                            onChangeValue={this.onChangeTeamAScore}
                                            value={this.state.teamAScore}
                                            min={0}
                                            max={999}
                                        />
                                    </td>
                                    <td>
                                        <NumberInput
                                            onChangeValue={this.onChangeTeamBScore}
                                            value={this.state.teamBScore}
                                            min={0}
                                            max={999}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Jam Points</td>
                                    <td>
                                        <NumberInput
                                            onChangeValue={this.onChangeTeamAJamPoints}
                                            value={this.state.teamAJamPoints}
                                            min={-99}
                                            max={99}
                                        />
                                    </td>
                                    <td>
                                        <NumberInput
                                            onChangeValue={this.onChangeTeamBJamPoints}
                                            value={this.state.teamBJamPoints}
                                            min={-99}
                                            max={99}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Timeouts</td>
                                    <td>
                                        <NumberInput
                                            onChangeValue={this.onChangeTeamATimeouts}
                                            value={this.state.teamATimeouts}
                                            min={0}
                                            max={maxTimeouts}
                                        />
                                    </td>
                                    <td>
                                        <NumberInput
                                            onChangeValue={this.onChangeTeamBTimeouts}
                                            value={this.state.teamBTimeouts}
                                            min={0}
                                            max={maxTimeouts}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Challenges</td>
                                    <td>
                                        <NumberInput
                                            onChangeValue={this.onChangeTeamAChallenges}
                                            value={this.state.teamAChallenges}
                                            min={0}
                                            max={maxChallenges}
                                        />
                                    </td>
                                    <td>
                                        <NumberInput
                                            onChangeValue={this.onChangeTeamBChallenges}
                                            value={this.state.teamBChallenges}
                                            min={0}
                                            max={maxChallenges}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Logo</td>
                                    <td>
                                        <MediaItem
                                            code='thumbnail'
                                            value={this.state.teamALogo}
                                            onSelect={this.onChangeTeamALogo}
                                        />
                                    </td>
                                    <td>
                                        <MediaItem
                                            code='thumbnail'
                                            value={this.state.teamBLogo}
                                            onSelect={this.onChangeTeamBLogo}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Banner Logo</td>
                                    <td>
                                        <MediaItem
                                            code='thumbnail'
                                            value={this.state.teamABannerLogo}
                                            onSelect={this.onChangeTeamABannerLogo}
                                        />
                                    </td>
                                    <td>
                                        <MediaItem
                                            code='thumbnail'
                                            value={this.state.teamBBannerLogo}
                                            onSelect={this.onChangeTeamBBannerLogo}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div>

                    </div>
                </div>
            </DialogBody>
            <DialogFooter>
                <button onClick={this.onClickSubmit}>
                    Submit
                </button>
                <button onClick={this.onClickCancel}>
                    Cancel
                </button>
            </DialogFooter>
        </Dialog>
    }
}

export {Main as ScoreboardEdit};