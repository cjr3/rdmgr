import React from 'react';
import Panel from 'components/Panel';
import DataController from 'controllers/DataController';
import { IconButton, IconSave, IconNo, ToggleButton } from 'components/Elements';

/**
 * Component for Scoreboard settings
 */
export default class ConfirmFormScoreboard extends React.PureComponent<{
    opened:boolean;
    onSubmit?:Function;
    onCancel?:Function;
    onClose?:Function;
    onOpen?:Function;
}, {
    MaxTimeouts:number;
    MaxTimeoutSeconds:number;
    MaxChallenges:number;
    MaxChallengeSeconds:number;
    MaxJamSeconds:number;
    MaxBreakSeconds:number;
    JamChangeMode:boolean;
}> {
    readonly state = {
        MaxTimeouts:2,
        MaxTimeoutSeconds:60,
        MaxChallenges:1,
        MaxChallengeSeconds:60,
        MaxJamSeconds:60,
        MaxBreakSeconds:30,
        JamChangeMode:false
    }

    protected RecordKey:string = 'ScoreboardConfig';

    /**
     * Constructor
     * @param props 
     */
    constructor(props) {
        super(props);

        this.onChangeBreakClockSeconds = this.onChangeBreakClockSeconds.bind(this);
        this.onChangeJamClockSeconds = this.onChangeJamClockSeconds.bind(this);
        this.onChangeTeamChallengeMax = this.onChangeTeamChallengeMax.bind(this);
        this.onChangeTeamChallengeSeconds  = this.onChangeTeamChallengeSeconds.bind(this);
        this.onChangeTeamTimeoutMax = this.onChangeTeamTimeoutMax.bind(this);
        this.onChangeTeamTimeoutSeconds = this.onChangeTeamTimeoutSeconds.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.onChangeJamMode = this.onChangeJamMode.bind(this);
    }

    /**
     * Triggered when the user changes the toggle for changing jam modes
     * @param checked 
     */
    private onChangeJamMode() {
        this.setState({JamChangeMode:!this.state.JamChangeMode});
    }

    /**
     * Triggered when the user changes the team max timeouts
     * @param ev 
     */
    private onChangeTeamTimeoutMax(ev: React.ChangeEvent<HTMLInputElement>) {
        let value:number = parseInt(ev.currentTarget.value);
        if(!Number.isNaN(value)) {
            this.setState({MaxTimeouts:value});
        }
    }

    /**
     * Triggered when the user changes the duration of team timeouts
     * @param ev 
     */
    private onChangeTeamTimeoutSeconds(ev: React.ChangeEvent<HTMLInputElement>) {
        let value:number = parseInt(ev.currentTarget.value);
        if(!Number.isNaN(value)) {
            this.setState({MaxTimeoutSeconds:value});
        }
    }

    /**
     * Triggered when the user changes the team max challenges
     * @param ev 
     */
    private onChangeTeamChallengeMax(ev: React.ChangeEvent<HTMLInputElement>) {
        let value:number = parseInt(ev.currentTarget.value);
        if(!Number.isNaN(value)) {
            this.setState({MaxChallenges:value});
        }
    }

    /**
     * Triggered when the user changes the duration of team challenges
     * @param ev 
     */
    private onChangeTeamChallengeSeconds(ev: React.ChangeEvent<HTMLInputElement>) {
        let value:number = parseInt(ev.currentTarget.value);
        if(!Number.isNaN(value)) {
            this.setState({MaxChallengeSeconds:value});
        }
    }

    /**
     * Triggered when the user changes the jam clock seconds
     * @param ev 
     */
    private onChangeJamClockSeconds(ev: React.ChangeEvent<HTMLInputElement>) {
        let value:number = parseInt(ev.currentTarget.value);
        if(!Number.isNaN(value)) {
            this.setState({MaxJamSeconds:value});
        }
    }

    /**
     * Triggered when the user changes the seconds for the break clock.
     * @param ev 
     */
    private onChangeBreakClockSeconds(ev: React.ChangeEvent<HTMLInputElement>) {
        let value:number = parseInt(ev.currentTarget.value);
        if(!Number.isNaN(value)) {
            this.setState({MaxBreakSeconds:value});
        }
    }

    /**
     * Triggered when the user clicks the submit button
     * - Saves the congfiguration
     */
    private async onSubmit() {
        let record = Object.assign({}, this.state);
        let response = await DataController.SaveMiscRecord(this.RecordKey, record);
        if(response) {
            if(this.props.onSubmit)
                this.props.onSubmit(record);
        }
    }

    /**
     * Triggered when the user clicks the cancel button
     * - Resets the form values
     */
    protected async onCancel() {
        let response = await this.load();
        if(response) {
            if(this.props.onCancel)
                this.props.onCancel();
        }
    }

    /**
     * Loads the record and applies it to the state
     */
    protected async load() : Promise<boolean> {
        return new Promise((res, rej) => {
            let record = DataController.GetMiscRecord(this.RecordKey);
            if(record) {
                this.setState({
                    MaxTimeouts:record.MaxTimeouts,
                    MaxTimeoutSeconds:record.MaxTimeoutSeconds,
                    MaxChallenges:record.MaxChallenges,
                    MaxChallengeSeconds:record.MaxChallengeSeconds,
                    MaxJamSeconds:record.MaxJamSeconds,
                    MaxBreakSeconds:record.MaxBreakSeconds,
                    JamChangeMode:record.JamChangeMode
                });
                res(true);
            } else {
                res(false);
            }
        });
    }

    /**
     * Triggered when the component updates
     * @param prevProps 
     */
    componentDidUpdate(prevProps) {
        if(prevProps.opened != this.props.opened) {
            if(this.props.opened)
                this.load();
        }
    }

    /**
     * Triggered when the component mounts to the DOM
     */
    componentDidMount() {
        this.load();
    }

    /**
     * Renders the component
     */
    render() {

        const buttons:Array<React.ReactElement> = [
            <IconButton
                key="btn-save"
                src={IconSave}
                onClick={this.onSubmit}
            >{"Save"}</IconButton>,
            <IconButton
                key="btn-cancel"
                src={IconNo}
                onClick={this.onCancel}
            >{"Cancel"}</IconButton>
        ];

        let teamTimeoutMax:number = (this.state.MaxTimeouts) ? this.state.MaxTimeouts : 0;
        let teamTimeoutSeconds:number = (this.state.MaxTimeoutSeconds) ? this.state.MaxTimeoutSeconds : 0;
        let teamChallengeMax:number = (this.state.MaxChallenges) ? this.state.MaxChallenges : 0;
        let teamChallengeSeconds:number = (this.state.MaxChallengeSeconds) ? this.state.MaxChallengeSeconds : 0;
        let jamSeconds:number = (this.state.MaxJamSeconds) ? this.state.MaxJamSeconds : 0;
        let breakSeconds:number = (this.state.MaxBreakSeconds) ? this.state.MaxBreakSeconds : 0;
        let jamMode:boolean = (this.state.JamChangeMode) ? true : false;

        return (
            <Panel
                opened={this.props.opened}
                onClose={this.props.onClose}
                buttons={buttons}
            >
                <div className="record-form">
                    <table className="grid" cellPadding={3}>
                        <tbody>
                            <tr>
                                <td colSpan={2}><b>Team Settings</b></td>
                            </tr>
                            <tr>
                                <td>Max Timeouts</td>
                                <td>
                                    <input
                                        type="number"
                                        min={0}
                                        max={5}
                                        size={10}
                                        value={teamTimeoutMax}
                                        onChange={this.onChangeTeamTimeoutMax}
                                        /> per half
                                </td>
                            </tr>
                            <tr>
                                <td>Timeout Duration</td>
                                <td>
                                    <input
                                        type="number"
                                        min={15}
                                        max={60}
                                        step={5}
                                        size={10}
                                        value={teamTimeoutSeconds}
                                        onChange={this.onChangeTeamTimeoutSeconds}
                                        /> seconds
                                </td>
                            </tr>
                            <tr>
                                <td>Max Challenges</td>
                                <td>
                                    <input
                                        type="number"
                                        min={0}
                                        max={5}
                                        size={10}
                                        value={teamChallengeMax}
                                        onChange={this.onChangeTeamChallengeMax}
                                        /> per half
                                </td>
                            </tr>
                            <tr>
                                <td>Challenge Duration</td>
                                <td>
                                    <input
                                        type="number"
                                        min={15}
                                        max={60}
                                        step={5}
                                        size={10}
                                        value={teamChallengeSeconds}
                                        onChange={this.onChangeTeamChallengeSeconds}
                                        /> seconds
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={2}>Clock Settings</td>
                            </tr>
                            <tr>
                                <td>Jam Mode</td>
                                <td>
                                    <ToggleButton
                                        checked={jamMode}
                                        onClick={this.onChangeJamMode}
                                        label="Three-step Jam Mode: JAM, STOP, and READY"
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>Jam Duration</td>
                                <td>
                                    <input
                                        type="number"
                                        min={30}
                                        max={120}
                                        step={5}
                                        size={10}
                                        value={jamSeconds}
                                        onChange={this.onChangeJamClockSeconds}
                                        /> seconds
                                </td>
                            </tr>
                            <tr>
                                <td>Break Duration</td>
                                <td>
                                    <input
                                        type="number"
                                        min={0}
                                        max={60}
                                        step={5}
                                        size={10}
                                        value={breakSeconds}
                                        onChange={this.onChangeBreakClockSeconds}
                                        /> seconds
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <p>
                        Jam Clock changes take effect after you reset the board, by
                        selectong <i>Teams</i> on the Scoreboard, and checking <i>Reset Board</i>
                    </p>
                </div>
            </Panel>
        )
    }
}