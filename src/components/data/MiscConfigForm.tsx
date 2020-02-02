import React from 'react';
import Panel from 'components/Panel';
import DataController from 'controllers/DataController';
import { IconButton, IconNo, ToggleButton, Button } from 'components/Elements';
import MediaPreview from 'components/tools/MediaPreview';
import ScoreboardCaptureController, { ScorebannerCaptureController, JamCounterCaptureController, JamClockCaptureController } from 'controllers/capture/Scoreboard';
import AnnouncerCaptureController from 'controllers/capture/Announcer';
import PenaltyCaptureController from 'controllers/capture/Penalty';
import ScorekeeperCaptureController from 'controllers/capture/Scorekeeper';
import { ICaptureController } from 'controllers/capture/vars';
import { Unsubscribe } from 'redux';
import AnthemCaptureController from 'controllers/capture/Anthem';
import RaffleCaptureController from 'controllers/capture/Raffle';
import RosterCaptureController from 'controllers/capture/Roster';
import ScheduleCaptureController from 'controllers/capture/Schedule';
import SlideshowCaptureController from 'controllers/capture/Slideshow';
import ScoresCaptureController from 'controllers/capture/Scores';
import StandingsCaptureController from 'controllers/capture/Standings';
import SponsorCaptureController from 'controllers/capture/Sponsor';

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
    AnnouncerAutoHide:boolean;
    AnnouncerDuration:number;
    PenaltyTrackerAutoHide:boolean;
    PenaltyTrackerDuration:number;
    ScorekeeperAutoHide:boolean;
    ScorekeeperDuration:number;
    StreamMode:boolean;
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

        AnnouncerAutoHide:AnnouncerCaptureController.GetState().AutoHide,
        AnnouncerDuration:Math.round(AnnouncerCaptureController.GetState().Duration / 1000),

        PenaltyTrackerAutoHide:PenaltyCaptureController.GetState().AutoHide,
        PenaltyTrackerDuration:Math.round(PenaltyCaptureController.GetState().Duration / 1000),
        
        ScorekeeperAutoHide:ScorekeeperCaptureController.GetState().AutoHide,
        ScorekeeperDuration:Math.round(ScorekeeperCaptureController.GetState().Duration / 1000),

        StreamMode:DataController.GetMiscRecord('StreamMode')
    }

    constructor(props) {
        super(props);
        this.onChangeStreamMode = this.onChangeStreamMode.bind(this);
    }

    protected async onChangeStreamMode() {
        let value:boolean = DataController.GetMiscRecord('StreamMode');
        if(typeof(value) !== 'boolean')
            value = true;
        else
            value = !value;
        await DataController.SaveMiscRecord('StreamMode', value);
        this.setState({StreamMode:value});
    }

    render() {
        let buttons:Array<React.ReactElement> = new Array<React.ReactElement>(
            <Button onClick={this.props.onCancel} key='btn-close'>Close</Button>
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
                        <h3>Media</h3>
                        <div className="stack-panel">
                            <MediaPreview
                                src={this.state.LeagueLogo}
                                title="League Logo"
                                onChange={async (filename) => {
                                    await DataController.SaveMiscRecord('LeagueLogo', filename);
                                    this.setState({LeagueLogo:filename});
                                }}
                                />
                            <MediaPreview
                                src={this.state.LeagueBackground}
                                title="League Background"
                                onChange={async (filename) => {
                                    await DataController.SaveMiscRecord('LeagueBackground', filename);
                                    this.setState({LeagueBackground:filename});
                                }}
                                />
                            <MediaPreview
                                src={this.state.NationalFlag}
                                title="National Flag"
                                onChange={async (filename) => {
                                    await DataController.SaveMiscRecord('NationalFlag', filename);
                                    this.setState({NationalFlag:filename});
                                }}
                                />
                            <MediaPreview
                                src={this.state.RaffleBackground}
                                title="Raffle Background"
                                onChange={async (filename) => {
                                    await DataController.SaveMiscRecord('RaffleBackground', filename);
                                    this.setState({RaffleBackground:filename});
                                }}
                                />
                            <MediaPreview
                                src={this.state.RaffleTicketBackground}
                                title="Ticket Background"
                                onChange={async (filename) => {
                                    await DataController.SaveMiscRecord('RaffleTicketBackground', filename);
                                    this.setState({RaffleTicketBackground:filename});
                                }}
                                />
                            <MediaPreview
                                src={this.state.ScorebannerBackground}
                                title="Score Banner Background"
                                onChange={(filename) => {
                                    this.setState({ScorebannerBackground:filename}, () => {
                                        ScorebannerCaptureController.SetBackground(filename);
                                    });
                                }}
                                />
                        </div>
                    </div>
                    <div className="form-section">
                        <h3>Camera</h3>
                        <div>
                            <ToggleButton
                                checked={this.state.StreamMode}
                                label="Stream Mode"
                                onClick={this.onChangeStreamMode}
                                /> - Check if you're live streaming on this computer.
                        </div>
                    </div>
                    <CaptureBase
                        controller={AnnouncerCaptureController}
                        title="Announcers"
                    />
                    <CaptureBase
                        controller={JamClockCaptureController}
                        title="Jam Clock"
                    />
                    <CaptureBase
                        controller={JamCounterCaptureController}
                        title="Jam Counter"
                    />
                    <CaptureBase
                        controller={AnthemCaptureController}
                        title="National Anthem"
                    />
                    <CaptureBase
                        controller={PenaltyCaptureController}
                        title="Penalty Tracker"
                    />
                    <CaptureBase
                        controller={RaffleCaptureController}
                        title="Raffle"
                    />
                    <CaptureBase
                        controller={RosterCaptureController}
                        title="Roster / Intros"
                    />
                    <CaptureBase
                        controller={ScheduleCaptureController}
                        title="Schedule"
                    />
                    <div className="form-section">
                        <h3>Score Banner (Stream)</h3>
                        <table cellPadding={3}>
                            <tbody>
                                <tr>
                                    <td>
                                    </td>
                                    <td>
                                        <div>
                                            <ToggleButton
                                                checked={this.state.ScorebannerClocks}
                                                label="Show Clocks"
                                                onClick={() => {
                                                    this.setState({ScorebannerClocks:!this.state.ScorebannerClocks}, () => {
                                                        ScorebannerCaptureController.SetClocks(this.state.ScorebannerClocks);
                                                    })
                                                }}
                                                />
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="form-section">
                        <h3>Scoreboard</h3>
                        <select 
                            value={this.state.ScoreboardClassName}
                            onChange={(ev) => {
                                let value:string = ev.currentTarget.value;
                                this.setState({ScoreboardClassName:value}, () => {
                                    ScoreboardCaptureController.SetClass(this.state.ScoreboardClassName);
                                });
                            }}
                            size={1}>
                            {scoreboardStyles}
                        </select>
                    </div>
                    <CaptureBase
                        controller={ScoresCaptureController}
                        title="Scores"
                    />
                    <CaptureBase
                        controller={ScorekeeperCaptureController}
                        title="Scorekeeper (Jammers)"
                    />
                    <CaptureBase
                        controller={SlideshowCaptureController}
                        title="Slideshow"
                    />
                    <CaptureBase
                        controller={SponsorCaptureController}
                        title="Sponsor Slideshow"
                    />
                    <CaptureBase
                        controller={StandingsCaptureController}
                        title="Standings"
                    />
                </div>
            </Panel>
        )
    }
}

class CaptureBase extends React.PureComponent<{
    controller:ICaptureController;
    title:string;
    classNames?:Array<string>;
    maxDuration?:number;
    minDuration?:number;
    maxDelay?:number;
    minDelay?:number;
}, {
    Shown:boolean;
    Duration:number;
    Delay:number;
    AutoHide:boolean;
    className:string;
}> {
    readonly state = {
        Shown:false,
        Duration:0,
        Delay:0,
        AutoHide:false,
        className:''
    }

    protected remote?:Unsubscribe;

    constructor(props) {
        super(props);
        this.update = this.update.bind(this);
        this.state.Shown = this.props.controller.GetState().Shown;
        this.state.Duration = Math.round(this.props.controller.GetState().Duration / 1000);
        this.state.Delay = Math.round(this.props.controller.GetState().Delay / 1000);
        this.state.AutoHide = this.props.controller.GetState().AutoHide;
        this.state.className = this.props.controller.GetState().className;
    }

    protected update() {
        this.setState({
            Shown:this.props.controller.GetState().Shown,
            Duration:Math.round(this.props.controller.GetState().Duration / 1000),
            Delay:Math.round(this.props.controller.GetState().Delay / 1000),
            AutoHide:this.props.controller.GetState().AutoHide,
            className:this.props.controller.GetState().className
        });
    }

    componentDidMount() {
        this.remote = this.props.controller.Subscribe(this.update);
    }

    componentWillUnmount() {
        if(this.remote)
            this.remote();
    }

    render() {
        let classNames:Array<React.ReactElement> = new Array<React.ReactElement>(
            <option key='def-option' value=''>Default</option>
        );

        if(this.props.classNames && this.props.classNames.length >= 1) {
            this.props.classNames.forEach((className:string, index:number) => {
                classNames.push(
                    <option key={`opt-${className}-${index}`} value={className}>{className}</option>
                );
            });
        }

        return (
            <div className="form-section">
                <h3>{this.props.title}</h3>
                <table cellPadding={3}>
                    <tbody>
                        <tr>
                            <td>Delay</td>
                            <td>
                                <input type="number"
                                    min={0}
                                    max={60}
                                    value={this.state.Delay}
                                    title="Time, in seconds, to delay a transition"
                                    onChange={(ev) => {
                                        let value:number = parseInt(ev.currentTarget.value) * 1000;
                                        this.props.controller.SetDelay(value);
                                    }}
                                    />
                            </td>
                            <td>Duration</td>
                            <td>
                                <input type="number"
                                    min={0}
                                    max={60}
                                    value={this.state.Duration}
                                    title="Time, in seconds, to show element, where 0 seconds is infinite."
                                    onChange={(ev) => {
                                        let value:number = parseInt(ev.currentTarget.value) * 1000;
                                        this.props.controller.SetDuration(value);
                                        if(value <= 0)
                                            this.props.controller.SetAutoHide(false);
                                        else
                                            this.props.controller.SetAutoHide(true);
                                    }}
                                    />
                            </td>
                            <td>
                                <select size={1} 
                                    value={this.state.className}
                                    title="Class name for special styling"
                                    onChange={(ev) => {
                                        let value:string = ev.currentTarget.value;
                                        this.props.controller.SetClass(value);
                                    }}>
                                    {classNames}
                                </select>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
};