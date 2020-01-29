import React from 'react';
import Panel from 'components/Panel';
import DataController from 'controllers/DataController';
import { IconButton, IconSave, IconNo, ToggleButton } from 'components/Elements';
import MediaPreview from 'components/tools/MediaPreview';
import ScoreboardCaptureController, { ScorebannerCaptureController } from 'controllers/capture/Scoreboard';
import { Compare } from 'controllers/functions';
import AnnouncerCaptureController from 'controllers/capture/Announcer';

/**
 * Component for misc configuration
 */
export default class MiscConfigForm extends React.PureComponent<{
    opened:boolean;
    onSubmit:Function;
    onCancel:Function;
}, {
    RaffleBackground:string;
    RaffleTicketBackground:string;
    NationalFlag:string;
    LeagueBackground:string;
    LeagueLogo:string;
    ScorebannerBackground:string;
    ScorebannerClocks:boolean;
    ScoreboardClassName:string;
    AnnouncerDuration:number;
}> {
    readonly state = {
        RaffleBackground:DataController.GetMiscRecord('RaffleBackground'),
        RaffleTicketBackground:DataController.GetMiscRecord('RaffleTicketBackground'),
        NationalFlag:DataController.GetMiscRecord('NationalFlag'),
        LeagueBackground:DataController.GetMiscRecord('LeagueBackground'),
        LeagueLogo:DataController.GetMiscRecord('LeagueLogo'),
        ScorebannerBackground:ScorebannerCaptureController.GetState().BackgroundImage,
        ScorebannerClocks:ScorebannerCaptureController.GetState().ClocksShown,
        ScoreboardClassName:ScoreboardCaptureController.GetState().className,
        AnnouncerDuration:Math.round(AnnouncerCaptureController.GetState().Duration / 1000)
    }

    constructor(props) {
        super(props);
        this.onClickCancel = this.onClickCancel.bind(this);
        this.onClickSubmit = this.onClickSubmit.bind(this);
        this.onSelectLeagueBackground = this.onSelectLeagueBackground.bind(this);
        this.onSelectLeagueLogo = this.onSelectLeagueLogo.bind(this);
        this.onSelectNationalFlag = this.onSelectNationalFlag.bind(this);
        this.onSelectRaffleBackground = this.onSelectRaffleBackground.bind(this);
        this.onSelectRaffleTicketBackground = this.onSelectRaffleTicketBackground.bind(this);
        this.onSelectScorebannerBackground = this.onSelectScorebannerBackground.bind(this);
        this.onChangeScorebannerClocks = this.onChangeScorebannerClocks.bind(this);
        this.onChangeScoreboardClassName = this.onChangeScoreboardClassName.bind(this);
        this.onChangeAnnouncerDuration = this.onChangeAnnouncerDuration.bind(this);
    }

    protected getDefaultState() {
        return {
            RaffleBackground:DataController.GetMiscRecord('RaffleBackground'),
            RaffleTicketBackground:DataController.GetMiscRecord('RaffleTicketBackground'),
            NationalFlag:DataController.GetMiscRecord('NationalFlag'),
            LeagueBackground:DataController.GetMiscRecord('LeagueBackground'),
            LeagueLogo:DataController.GetMiscRecord('LeagueLogo'),
            ScorebannerBackground:ScorebannerCaptureController.GetState().BackgroundImage,
            ScorebannerClocks:ScorebannerCaptureController.GetState().ClocksShown,
            ScoreboardClassName:ScoreboardCaptureController.GetState().className,
            AnnouncerDuration:Math.round(AnnouncerCaptureController.GetState().Duration / 1000)
        };
    }

    protected onSelectRaffleBackground(filename:string) {
        this.setState({RaffleBackground:filename});
    }

    protected onSelectRaffleTicketBackground(filename:string) {
        this.setState({RaffleTicketBackground:filename});
    }

    protected onSelectNationalFlag(filename:string) {
        this.setState({NationalFlag:filename});
    }

    protected onSelectLeagueBackground(filename:string) {
        this.setState({LeagueBackground:filename});
    }

    protected onSelectLeagueLogo(filename:string) {
        this.setState({LeagueLogo:filename});
    }

    protected onSelectScorebannerBackground(filename:string) {
        this.setState({ScorebannerBackground:filename});
    }

    protected onChangeScorebannerClocks() {
        this.setState({ScorebannerClocks:!this.state.ScorebannerClocks});
    }

    protected onChangeScoreboardClassName(ev: React.ChangeEvent<HTMLSelectElement>)
    {
        let value:string = ev.currentTarget.value;
        this.setState({ScoreboardClassName:value});
    }

    protected onChangeAnnouncerDuration(ev: React.ChangeEvent<HTMLInputElement>) {
        let value:number = parseInt(ev.currentTarget.value);
        this.setState({AnnouncerDuration:value});
    }

    protected async onClickSubmit() {

        AnnouncerCaptureController.SetDuration(this.state.AnnouncerDuration * 1000);
        
        if(!await DataController.SaveMiscRecord('RaffleBackground', this.state.RaffleBackground)) {
            return;
        }

        if(!await DataController.SaveMiscRecord('RaffleTicketBackground', this.state.RaffleTicketBackground)) {
            return;
        }

        if(!await DataController.SaveMiscRecord('NationalFlag', this.state.NationalFlag)) {
            return;
        }

        if(!await DataController.SaveMiscRecord('LeagueBackground', this.state.LeagueBackground)) {
            return;
        }

        if(!await DataController.SaveMiscRecord('LeagueLogo', this.state.LeagueLogo)) {
            return;
        }

        ScorebannerCaptureController.SetBackground(this.state.ScorebannerBackground);
        ScorebannerCaptureController.SetState({ClocksShown:this.state.ScorebannerClocks});
        ScoreboardCaptureController.SetClass(this.state.ScoreboardClassName);

        if(this.props.onSubmit)
            this.props.onSubmit();
    }

    protected async onClickCancel() {
        this.setState(this.getDefaultState(), () => {
            if(this.props.onCancel)
                this.props.onCancel();
        });
    }

    render() {

        let changed:boolean = !Compare(this.state, this.getDefaultState());

        let buttons:Array<React.ReactElement> = new Array<React.ReactElement>(
            <IconButton
                key='btn-submit'
                src={IconSave}
                active={changed}
                onClick={this.onClickSubmit}
                >Save</IconButton>,
            <IconButton
                key='btn-cancel'
                src={IconNo}
                onClick={this.onClickCancel}
                >Cancel</IconButton>
        );

        let scoreboardStyles:Array<React.ReactElement> = new Array<React.ReactElement>(
            <option key='c-default' value=''>Default (for dark areas)</option>,
            <option key='c-light' value='light'>Light (for bright areas)</option>
        );


        return (
            <Panel
                opened={this.props.opened}
                buttons={buttons}
            >
                <div className="record-form">
                    <div className="form-section">
                        <h3>Announcers</h3>
                        <table cellPadding={3}>
                            <tbody>
                                <tr>
                                    <td>Duration</td>
                                    <td>
                                        <input type="number"
                                            max={20}
                                            min={5}
                                            value={this.state.AnnouncerDuration}
                                            onChange={this.onChangeAnnouncerDuration}
                                            /> seconds
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="form-section">
                        <h3>Media</h3>
                        <div className="stack-panel">
                            <MediaPreview
                                src={this.state.LeagueLogo}
                                title="League Logo"
                                onChange={this.onSelectLeagueLogo}
                                />
                            <MediaPreview
                                src={this.state.LeagueBackground}
                                title="League Background"
                                onChange={this.onSelectLeagueBackground}
                                />
                            <MediaPreview
                                src={this.state.NationalFlag}
                                title="National Flag"
                                onChange={this.onSelectNationalFlag}
                                />
                            <MediaPreview
                                src={this.state.RaffleBackground}
                                title="Raffle Background"
                                onChange={this.onSelectRaffleBackground}
                                />
                            <MediaPreview
                                src={this.state.RaffleTicketBackground}
                                title="Ticket Background"
                                onChange={this.onSelectRaffleTicketBackground}
                                />
                        </div>
                    </div>
                    <div className="form-section">
                        <h3>Scoreboard</h3>
                        <select 
                            value={this.state.ScoreboardClassName}
                            onChange={this.onChangeScoreboardClassName}
                            size={1}>
                            {scoreboardStyles}
                        </select>
                    </div>
                    <div className="form-section">
                        <h3>Score Banner (Stream)</h3>
                        <table cellPadding={3}>
                            <tbody>
                                <tr>
                                    <td>
                                        <MediaPreview
                                            src={this.state.ScorebannerBackground}
                                            title="Background"
                                            onChange={this.onSelectScorebannerBackground}
                                            />
                                    </td>
                                    <td>
                                        <ToggleButton
                                            checked={this.state.ScorebannerClocks}
                                            label="Show Clocks"
                                            onClick={this.onChangeScorebannerClocks}
                                            />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </Panel>
        )
    }
}