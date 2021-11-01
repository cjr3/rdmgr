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
        scorebannerBackground:es
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
    protected onChangeLabelOverturned = (value:string) => this.setState({labelOverturned:value});
    protected onChangeLabelPowerJam = (value:string) => this.setState({labelPowerJam:value});
    protected onChangeLabelReview = (value:string) => this.setState({labelReview:value});
    protected onChangeLabelTimeouts = (value:string) => this.setState({labelTimeouts:value});
    protected onChangeLabelUpheld = (value:string) => this.setState({labelUpheld:value});
    protected onChangeLeagueLogo = (value:string) => this.setState({leagueLogo:value});
    protected onChangeMaxTeamChallenges = (value:number) => this.setState({maxTeamChallenges:value});
    protected onChangeMaxTeamTimeouts = (value:number) => this.setState({maxTeamTimeouts:value});

    protected onChangeRaffleBackground = (value:string) => this.setState({raffleBackground:value});
    protected onChangeRaffleTicketBackground = (value:string) => this.setState({raffleTicketBackground:value});
    protected onChangeScorebannerBackground = (value:string) => this.setState({scorebannerBackground:value});

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
                RaffleTicketBackground:this.state.raffleTicketBackground
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

        Data.SaveConfig(UIController.GetState().Config).then(() => {
            this.props.onSave();
        }).catch(() => {
            
        });

        Data.SaveCapture(UIController.GetState().Capture).then(() => {}).catch(() => {});

        //send changes to capture window
        ipcRenderer.invoke('capture-config', {
            width:captureWidth,
            height:captureHeight,
            x:captureX,
            y:captureY,
        }).then(() => {}).catch(() => {});
    }

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
            <div className='title'>Config</div>
            <div className='content'>
                <p>Capture Window</p>
                <table className='table'>
                    <tbody>
                        <tr>
                            <td width={100}>Chroma</td>
                            <td>
                                <ColorPicker value={this.state.colorCaptureBackground} onChangeValue={this.onChangeColorcaptureBackground}/>
                            </td>
                        </tr>
                        <tr>
                            <td>Resolution</td>
                            <td>
                                <select size={1} value={this.state.captureWidth} onChange={this.onChangeCaptureWidth}>
                                    <option value={0}>Fullscreen</option>
                                    <option value={1024}>1024 x 768</option>
                                    <option value={1280}>1280 x 720</option>
                                    <option value={1366}>1366 x 768</option>
                                    <option value={1920}>1920 x 1080</option>
                                </select>
                                {
                                    (this.state.monitors.length > 0) &&
                                    <select size={1} value={this.state.captureMonitorId} onChange={this.onChangeCaptureMonitor}>
                                        {
                                            this.state.monitors.map((monitor, index) => {
                                                return <option value={monitor.id} key={`mon-${monitor.id}`}>
                                                    {`#${(index+1)}: ${monitor.bounds.x}, ${monitor.bounds.y}`}    
                                                </option>
                                            })
                                        }
                                    </select>
                                }
                                <label>
                                    <input
                                        type='checkbox'
                                        checked={this.state.displayCapture}
                                        onChange={this.onChangeCaptureDisplay}
                                        />
                                    Show
                                </label>
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
            </div>
            <div className='buttons'>
                <IconSave asButton={true} onClick={this.onClickSubmit}>Submit</IconSave>
                <IconX asButton={true} onClick={this.props.onCancel}>Cancel</IconX>
            </div>
        </div>
    }
}

export {ConfigForm};