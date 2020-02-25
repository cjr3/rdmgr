import React from 'react';
import {IconButton, IconCheck} from 'components/Elements';
import Panel from 'components/Panel';
import DataController from 'controllers/DataController';

type DimensionRecord = {
    width:number;
    height:number;
}

/**
 * Component for controlling the monitor, dimensions, and position,
 * of the capture window.
 */
export default class CaptureControlMonitor extends React.PureComponent<{
    opened:boolean;
    onClose:Function;
    onSubmit:Function;
}, {
    /**
     * ID of monitor the capture window is displayed on
     */
    MonitorID:string;
    /**
     * Width of the capture window
     */
    Width:number;
    /**
     * Height of the capture window
     */
    Height:number;
    /**
     * Collection of Monitors (Display objects)
     */
    Monitors:Array<any>;
}> {

    readonly state = {
        MonitorID:'',
        Width:1280,
        Height:720,
        Monitors:[]
    }

    /**
     * Screen sizes allowed
     */
    protected Dimensions:Array<DimensionRecord> = [
        {width:1280,height:720},
        {width:1024,height:576},
        {width:1920,height:1080}
    ];

    /**
     * Constructor
     * @param props any
     */
    constructor(props) {
        super(props);
        this.onClickSubmit = this.onClickSubmit.bind(this);
        this.onChangeMonitor = this.onChangeMonitor.bind(this);
        this.onChangeSize = this.onChangeSize.bind(this);
    }

    /**
     * Triggered when the user clicks the button to set the monitor.
     */
    protected async onClickSubmit() {
        this.state.Monitors.forEach((monitor:any) => {
            if(monitor.id === this.state.MonitorID) {
                if(window && window.RDMGR && window.RDMGR.captureWindow) {
                    var bounds = monitor.bounds;
                    var width = this.state.Width;
                    var height = this.state.Height;
                    var y = bounds.y;
                    var x = bounds.x;

                    if(width > bounds.width)
                        width = bounds.width;

                    if(height > bounds.height)
                        height = bounds.height;

                    //center vertically
                    if(height < bounds.height) {
                        y += bounds.height / 2 - height / 2;
                    }

                    //center horizontally
                    if(width < bounds.width) {
                        x += bounds.width / 2 - width / 2;
                    }

                    window.RDMGR.captureWindow.setBounds({
                        x:x,
                        y:y,
                        width:width,
                        height:height
                    });
                }
            }
        });
    }

    /**
     * Triggered when the user changes the monitor list.
     * @param {Event} ev 
     */
    protected onChangeMonitor(ev:React.FormEvent<HTMLSelectElement>) {
        var value = ev.currentTarget.value;
        this.setState(() => {
            return {MonitorID:value};
        });
    }

    /**
     * Triggered when the user changes the window size list.
     * @param {Event} ev 
     */
    protected onChangeSize(ev:React.FormEvent<HTMLSelectElement>) {
        var value = parseInt( ev.currentTarget.value );
        this.setState(() => {
            var changes:any = {Height:value};
            this.Dimensions.forEach((dim) => {
                if(dim.height === value)
                    changes.Width = dim.width;
            });
            return changes;
        });
    }

    /**
     * Triggered when the component is mounted to the DOM.
     */
    componentDidMount() {
        if(window && window.RDMGR && window.RDMGR.captureWindow) {
            this.setState(() => {
                let screen = window.require('electron').remote.screen;
                let monitors = screen.getAllDisplays();
                let changes:any = {Monitors:monitors};
                let dstate:any = DataController.GetState();
                if(monitors.length > 1) {
                    let primary = screen.getPrimaryDisplay();
                    let index = 0;
                    monitors.forEach((monitor, mindex) => {
                        if(primary && monitor.id === primary.id) {
                            return;
                        }
                        if(index <= 0)
                            index = mindex;
                    });
                    
                    changes.MonitorID = monitors[index].id;
                    changes.Width = monitors[index].bounds.width;
                    changes.Height = monitors[index].bounds.height;
                    
                    window.RDMGR.captureWindow.setBounds({
                        x:monitors[index].bounds.x,
                        y:monitors[index].bounds.y,
                        width:changes.Width,
                        height:changes.Height
                    });
                }
                return changes;
            });
        }
    }

    /**
     * Renders the component.
     */
    render() {
        var monitors:Array<React.ReactElement> = [];
        var sizes:Array<React.ReactElement> = [];
        let i = 1;
        this.state.Monitors.forEach((monitor:any) => {
            monitors.push(
                <option value={monitor.id} key={`mon-${i}`}>{`Monitor #${i}`}</option>
            );
            i++;
        });

        i = 0;
        this.Dimensions.forEach((dim) => {
            sizes.push(
                <option value={dim.height} key={`dim-${i}`}>{`${dim.width}x${dim.height}`}</option>
            );
            i++;
        });

        let buttons:Array<React.ReactElement> = new Array<React.ReactElement>(
            <IconButton
                src={IconCheck}
                key='btn-submit'
                title='Set Monitor'
                onClick={this.onClickSubmit}
                />
        );

        return (
            <Panel
                opened={this.props.opened}
                popup={true}
                onClose={this.props.onClose}
                buttons={buttons}
                className="monitor"
                >
                <div className="record-form">
                    <h3>Capture Window Location</h3>
                    <div className="form-section">
                        <p>Monitors</p>
                        <select value={this.state.MonitorID} onChange={this.onChangeMonitor}>{monitors}</select>
                    </div>
                    <div className="form-section">
                        <p>Dimensions</p>
                        <select value={this.state.Height} onChange={this.onChangeSize}>{sizes}</select>
                    </div>
                </div>
            </Panel>
        );
    }
}