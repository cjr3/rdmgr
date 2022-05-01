import { IconSave, IconX } from 'components/common/icons';
import { ColorPicker } from 'components/common/inputs/colorpicker';
import { MediaItem } from 'components/common/inputs/mediaitem';
import { ipcRenderer } from 'electron';
import React from 'react';
import { Capture } from 'tools/capture/functions';
import Data from 'tools/data';
import { UIController } from 'tools/UIController';
import { Config } from 'tools/vars';
import { remote } from 'electron';
import { TextInput } from 'components/common/inputs/textinput';

interface Props extends React.HTMLProps<HTMLDivElement> {
    onCancel:{():void};
    onSave:{():void};
}

const es = '';

interface State {
    anthemBackground:string;
    captureMonitorId:number;
    captureWidth:number;
    colorActive:string;
    colorBackground:string;
    colorCalls:string;
    colorCaptureBackground:string;
    colorDanger:string;
    colorElements:string;
    colorForeground:string;
    colorNeutral:string;
    colorReady:string;
    colorStop:string;
    colorWarning:string;
    controlWidth:number;
    displayCapture:boolean;
    labelChallenge:string;
    labelInjury:string;
    labelLeadJammer:string;
    labelOfficialTimeout:string;
    labelOverturned:string;
    labelPowerJam:string;
    labelReview:string;
    labelTimeouts:string;
    labelUpheld:string;
    leagueLogo:string;
    maxTeamChallenges:number;
    maxTeamTimeouts:number;
    monitors:Electron.Display[];
    raffleBackground:string;
    raffleTicketBackground:string;
    scorebannerBackground:string;
    scoreboardClassName:string;
}

class ConfigForm extends React.PureComponent<Props, State> {

    readonly state:State = {
        anthemBackground:es,
        captureMonitorId:0,
        captureWidth:1280,
        colorActive:es,
        colorBackground:es,
        colorCalls:es,
        colorCaptureBackground:es,
        colorDanger:es,
        colorElements:es,
        colorForeground:es,
        colorNeutral:es,
        colorReady:es,
        colorStop:es,
        colorWarning:es,
        controlWidth:1280,
        displayCapture:true,
        labelChallenge:es,
        labelInjury:es,
        labelLeadJammer:es,
        labelOfficialTimeout:es,
        labelOverturned:es,
        labelPowerJam:es, 
        labelReview:es,
        labelTimeouts:es,
        labelUpheld:es,
        leagueLogo:es,
        maxTeamChallenges:2,
        maxTeamTimeouts:2,
        monitors:[],
        raffleBackground:es,
        raffleTicketBackground:es,
        scorebannerBackground:es,
        scoreboardClassName:es
    }

    /**
     * 
     */
    protected load = () => {
        const state = UIController.GetState();
        this.setState({
            anthemBackground:state.Capture?.Anthem?.backgroundImage || es,
            captureWidth:state.Config?.Misc?.CaptureWindow?.width || 1280,
            colorActive:state.Config?.Colors?.Active || es,
            colorBackground:state.Config?.Colors?.Background || es,
            colorCalls:state.Config?.Colors?.Calls || es,
            colorCaptureBackground:state.Config?.Colors?.CaptureBackground || '#000000',
            colorDanger:state.Config?.Colors?.Danger || es,
            colorElements:state.Config?.Colors?.Elements || es,
            colorForeground:state.Config?.Colors?.Foreground || es,
            colorNeutral:state.Config?.Colors?.Neutral || es,
            colorReady:state.Config?.Colors?.Ready || es,
            colorStop:state.Config?.Colors?.Stop || es,
            colorWarning:state.Config?.Colors?.Warning || es,
            controlWidth:state.Config?.Misc?.MainWindow?.width || 1280,
            displayCapture:typeof(state.Config?.Misc?.CaptureWindow?.display) === 'boolean' ? state.Config?.Misc?.CaptureWindow?.display : true,
            labelChallenge:state.Config?.Scoreboard?.LabelChallenges || es,
            labelInjury:state.Config?.Scoreboard?.LabelInjury || es,
            labelLeadJammer:state.Config?.Scoreboard?.LabelLeadJammer || es,
            labelOfficialTimeout:state.Config?.Scoreboard?.LabelOfficialTimeout || es,
            labelOverturned:state.Config?.Scoreboard?.LabelOverturned || es,
            labelPowerJam:state.Config?.Scoreboard?.LabelPowerJam || es,
            labelReview:state.Config?.Scoreboard?.LabelReview || es,
            labelTimeouts:state.Config?.Scoreboard?.LabelTimeouts || es,
            labelUpheld:state.Config?.Scoreboard?.LabelUpheld || es,
            leagueLogo:state.Config?.Misc?.LeagueLogo || es,
            maxTeamChallenges:state.Config?.Scoreboard?.MaxTeamChallenges || 2,
            maxTeamTimeouts:state.Config?.Scoreboard?.MaxTeamTimeouts || 2,
            raffleBackground:state.Capture.Raffle.backgroundImage || es,
            raffleTicketBackground:state.Config.Misc?.RaffleTicketBackground || es,
            scorebannerBackground:state.Capture?.Scorebanner?.backgroundImage || es,
            scoreboardClassName:state.Capture?.Scoreboard?.className || es
        })
    }

    /**
     * 
     * @param value 
     * @returns 
     */
    protected onChangeAnthemBackground = (value:string) => this.setState({anthemBackground:value});

    /**
     * 
     * @param ev 
     */
    protected onChangeCaptureDisplay = (ev:React.ChangeEvent<HTMLInputElement>) => {
        let checked = (ev.currentTarget.checked) ? true : false;
        this.setState({displayCapture:checked});
    }

    /**
     * 
     * @param ev 
     */
    protected onChangeCaptureMonitor = (ev:React.ChangeEvent<HTMLSelectElement>) => {
        let value = ev.currentTarget.value;
        let id = parseInt(value);
        this.setState({captureMonitorId:id});
    }

    /**
     * 
     * @param ev 
     */
    protected onChangeCaptureWidth = (ev:React.ChangeEvent<HTMLSelectElement>) => {
        let value = ev.currentTarget.value;
        this.setState({captureWidth:parseInt(value)});
    }

    protected onChangeColorActive = (value:string) => this.setState({colorActive:value});
    protected onChangeColorBackground = (value:string) => this.setState({colorBackground:value});
    protected onChangeColorCalls = (value:string) => this.setState({colorCalls:value});
    protected onChangeColorcaptureBackground = (value:string) => this.setState({colorCaptureBackground:value});
    protected onChangeColorDanger = (value:string) => this.setState({colorDanger:value});
    protected onChangeColorElements = (value:string) => this.setState({colorElements:value});
    protected onChangeColorNeutral = (value:string) => this.setState({colorNeutral:value});
    protected onChangeColorReady = (value:string) => this.setState({colorReady:value});
    protected onChangeColorStop = (value:string) => this.setState({colorStop:value});
    protected onChangeColorWarning = (value:string) => this.setState({colorWarning:value});
    protected onChangeLabelChallenges = (value:string) => this.setState({labelChallenge:value});
    protected onChangeLabelInjury = (value:string) => this.setState({labelInjury:value});
    protected onChangeLabelLeadJammer = (value:string) => this.setState({labelLeadJammer:value});
    protected onChangeLabelOfficialTimeout = (value:string) => this.setState({labelOfficialTimeout:value});

    /**
     * Called
     * @param value 
     * @returns 
     */
    protected onChangeLabelOverturned = (value:string) => this.setState({labelOverturned:value});

    /**
     * Called when the user sets the text value for when a team has a power jam
     * @param value 
     * @returns 
     */
    protected onChangeLabelPowerJam = (value:string) => this.setState({labelPowerJam:value});

    /**
     * Called when the user sets the text value for when a timeout is called for official review.
     * @param value 
     * @returns 
     */
    protected onChangeLabelReview = (value:string) => this.setState({labelReview:value});

    /**
     * Called when the user sets the text value for when a team calls a timeout
     * @param value 
     * @returns 
     */
    protected onChangeLabelTimeouts = (value:string) => this.setState({labelTimeouts:value});

    /**
     * Called when the user sets the text value for when a penalty is upheld
     * @param value 
     * @returns 
     */
    protected onChangeLabelUpheld = (value:string) => this.setState({labelUpheld:value});

    /**
     * Called when the user sets the league logo image, which is shown at the center of the scoreboard
     * @param value 
     * @returns 
     */
    protected onChangeLeagueLogo = (value:string) => this.setState({leagueLogo:value});

    /**
     * Caled when the user sets the max number of team challenges
     * @param value 
     * @returns 
     */
    protected onChangeMaxTeamChallenges = (value:number) => this.setState({maxTeamChallenges:value});

    /**
     * Called when the user sets the maximum number of team timeouts
     * @param value 
     * @returns 
     */
    protected onChangeMaxTeamTimeouts = (value:number) => this.setState({maxTeamTimeouts:value});

    /**
     * Called when the user sets the raffle background image
     * @param value 
     * @returns 
     */
    protected onChangeRaffleBackground = (value:string) => this.setState({raffleBackground:value});

    /**
     * Called when the user sets the raffle ticket background image
     * @param value 
     * @returns 
     */
    protected onChangeRaffleTicketBackground = (value:string) => this.setState({raffleTicketBackground:value});

    /**
     * Called when the user sets the scorebanner background image
     * @param value 
     * @returns 
     */
    protected onChangeScorebannerBackground = (value:string) => this.setState({scorebannerBackground:value});

    /**
     * Called when the user sets the scoreboard class
     * @param ev 
     */
    protected onChangeScoreboardClassName = (ev:React.ChangeEvent<HTMLSelectElement>) => {
        const value = ev.currentTarget.value;
        this.setState({scoreboardClassName:value});
    }

    /**
     * Save the configuration
     */
    protected onClickSubmit = async () => {
        const captureMonitor = this.state.monitors.find(m => m.id === this.state.captureMonitorId);
        let captureHeight = 0;
        let captureWidth = 0;
        let captureX = 0;
        let captureY = 0;
        if(this.state.captureWidth) {
            captureWidth = this.state.captureWidth;
            captureHeight = 720;
            if(this.state.captureWidth === 1366)
                captureHeight = 768;
            else if(this.state.captureWidth === 1920)
                captureHeight = 1080;
        }
        
        if(captureMonitor) {
            captureX = captureMonitor.bounds.x;
            captureY = captureMonitor.bounds.y;
            if(captureWidth === 0) {
                captureWidth = captureMonitor.bounds.width;
                captureHeight = captureMonitor.bounds.height;
            }
        }

        const config:Config = {
            Colors:{
                CaptureBackground:this.state.colorCaptureBackground
            },
            Misc:{
                CaptureWindow:{
                    display:this.state.displayCapture,
                    height:captureHeight,
                    width:captureWidth,
                    x:captureX,
                    y:captureY,
                    monitor:this.state.captureMonitorId
                },
                RaffleTicketBackground:this.state.raffleTicketBackground,
                LeagueLogo:this.state.leagueLogo
            }
        };

        if(config.Colors)
            UIController.UpdateConfigColors(config.Colors);

        if(config.Misc)
            UIController.UpdateConfigMisc(config.Misc);

        Capture.UpdateAnthem({
            backgroundImage:this.state.anthemBackground
        });

        Capture.UpdateRaffle({
            backgroundImage:this.state.raffleBackground
        });

        Capture.UpdateScorebanner({
            backgroundImage:this.state.scorebannerBackground
        })

        Capture.UpdateScoreboard({
            className:this.state.scoreboardClassName
        });

        Data.SaveConfig(UIController.GetState().Config).then(() => {
            this.props.onSave();
        }).catch(() => {
            
        });

        Data.SaveCapture(UIController.GetState().Capture).then(() => {}).catch(() => {});
    }

    /**
     * Called when the user changes the Resolution of the capture window.
     */
    protected onApplyCaptureMonitor = () => {
        const captureMonitor = this.state.monitors.find(m => m.id === this.state.captureMonitorId);
        let captureHeight = 0;
        let captureWidth = 0;
        let captureX = 0;
        let captureY = 0;
        if(this.state.captureWidth) {
            captureWidth = this.state.captureWidth;
            captureHeight = 720;
            if(this.state.captureWidth === 1366)
                captureHeight = 768;
            else if(this.state.captureWidth === 1920)
                captureHeight = 1080;
        }
        
        if(captureMonitor) {
            captureX = captureMonitor.bounds.x;
            captureY = captureMonitor.bounds.y;
            if(captureWidth === 0) {
                captureWidth = captureMonitor.bounds.width;
                captureHeight = captureMonitor.bounds.height;
            }
        }

        const config:Config = {
            Misc:{
                CaptureWindow:{
                    display:this.state.displayCapture,
                    height:captureHeight,
                    width:captureWidth,
                    x:captureX,
                    y:captureY,
                    monitor:this.state.captureMonitorId
                }
            }
        };

        if(config.Misc)
            UIController.UpdateConfigMisc(config.Misc);

        Data.SaveConfig(UIController.GetState().Config).then(() => {}).catch(() => {});
        Data.SaveCapture(UIController.GetState().Capture).then(() => {}).catch(() => {});

        //send changes to capture window
        ipcRenderer.invoke('capture-config', {
            width:captureWidth,
            height:captureHeight,
            x:captureX,
            y:captureY,
        }).then(() => {}).catch(() => {});
    }

    /**
     * Load collection of monitors / display devices.
     */
    protected loadMonitors = () => {
        try {
            let monitors = remote.screen.getAllDisplays();
            if(Array.isArray(monitors)) {
                this.setState({monitors:monitors});

                //get id of monitor 
                ipcRenderer.invoke('capture-info').then(result => {
                    // console.log(result);
                    if(typeof(result) === 'object' && result && typeof(result.x) === 'number' && typeof(result.y) === 'number') {
                        const monitor = monitors.find(m => {
                            // console.log(m.bounds);
                            if(m.bounds.x === result.x && m.bounds.y === result.y)
                                return true;
                            if(result.x >= m.bounds.x && result.x <= (m.bounds.x + m.bounds.width)) {
                                if(result.y >= m.bounds.y && result.y <= (m.bounds.y + m.bounds.height)) {
                                    return true;
                                }
                            }
                            
                            return false;
                        });

                        // console.log(monitor);

                        if(monitor) {
                            this.setState({captureMonitorId:monitor.id});
                        } else {
                            this.setState({captureMonitorId:0});
                        }
                    }
                }).catch(() => {});
            }
        } catch(er) {

        }
    }

    componentDidMount() {
        this.load();
        this.loadMonitors();
    }

    render() {
        
        return <div className='record-form'>
            <div className='content'>
                <h3>Capture Window</h3>
                <table className='table'>
                    <tbody>
                        <tr>
                            <td width={100}>Chroma</td>
                            <td>
                                <div className='input-group'>
                                    <TextInput
                                        className='form-control'
                                        value={this.state.colorCaptureBackground}
                                        maxLength={20}
                                        placeholder='#000000'
                                        style={{flex:'0 0 150px'}}
                                        onChangeValue={this.onChangeColorcaptureBackground}
                                    />
                                    <button 
                                        style={{
                                        backgroundColor:this.state.colorCaptureBackground || '#000000',
                                        border:'solid 1px #666666',
                                        color: '#fff',
                                        flex:'0 0 100px'
                                    }}></button>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>Resolution</td>
                            <td>
                                <div className='input-group'>
                                    <select 
                                        className='form-control'
                                        style={{flex:'0 0 200px'}}
                                        size={1} 
                                        value={this.state.captureWidth} 
                                        onChange={this.onChangeCaptureWidth}>
                                        <option value={0}>Fullscreen</option>
                                        <option value={1024}>1024 x 768</option>
                                        <option value={1280}>1280 x 720</option>
                                        <option value={1366}>1366 x 768</option>
                                        <option value={1920}>1920 x 1080</option>
                                    </select>
                                    {
                                        (this.state.monitors.length > 0) &&
                                        <select 
                                            className='form-control'
                                            size={1} 
                                            style={{flex:'0 0 200px'}}
                                            value={this.state.captureMonitorId} 
                                            onChange={this.onChangeCaptureMonitor}>
                                            {
                                                this.state.monitors.map((monitor, index) => {
                                                    return <option value={monitor.id} key={`mon-${monitor.id}`}>
                                                        {`#${(index+1)}: ${monitor.bounds.x}, ${monitor.bounds.y}`}    
                                                    </option>
                                                })
                                            }
                                        </select>
                                    }
                                    <label className='form-control' style={{flex:'0 0 150px'}}>
                                        <input
                                            type='checkbox'
                                            checked={this.state.displayCapture}
                                            onChange={this.onChangeCaptureDisplay}
                                            />
                                        Show
                                    </label>
                                    <button
                                        title='Apply changes to capture monitor'
                                        onClick={this.onApplyCaptureMonitor}
                                    >
                                        Apply
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <MediaItem
                                    code='background'
                                    label='Anthem Background'
                                    value={this.state.anthemBackground}
                                    onSelect={this.onChangeAnthemBackground}
                                />
                            </td>
                            <td>
                                <MediaItem
                                    code='background'
                                    label='Scorebanner Background'
                                    value={this.state.scorebannerBackground}
                                    onSelect={this.onChangeScorebannerBackground}
                                />
                            </td>
                            <td>
                                <MediaItem
                                    code='background'
                                    label='Raffle Background'
                                    value={this.state.raffleBackground}
                                    onSelect={this.onChangeRaffleBackground}
                                />
                            </td>
                            <td>
                                <MediaItem
                                    code='background'
                                    label='Ticket Background'
                                    value={this.state.raffleTicketBackground}
                                    onSelect={this.onChangeRaffleTicketBackground}
                                />
                            </td>
                            <td>
                                <MediaItem
                                    code='background'
                                    label='League Logo'
                                    value={this.state.leagueLogo}
                                    onSelect={this.onChangeLeagueLogo}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <h3 style={{marginTop:'16px'}}>Scoreboard</h3>
                <table className='table table-striped'>
                    <tbody>
                        <tr>
                            <td width={100}>Display</td>
                            <td>
                                <select
                                    className='form-control'
                                    size={1}
                                    value={this.state.scoreboardClassName}
                                    onChange={this.onChangeScoreboardClassName}
                                >
                                    <option value=''>Default</option>
                                    <option value='show-names'>Default + Show Names</option>
                                    <option value='light'>Light (ideal for outside / well-lit rooms)</option>
                                    <option value='light show-names'>Light + Show Names</option>
                                </select>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className='buttons'>
                <IconSave asButton={true} onClick={this.onClickSubmit}>Submit</IconSave>
                <IconX asButton={true} onClick={this.props.onCancel}>Cancel</IconX>
            </div>
        </div>
    }
}

export {ConfigForm};