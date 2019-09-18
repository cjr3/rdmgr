import React from 'react';
import {Button} from 'components/Elements';

interface SCaptureControlMonitor {
    /**
     * ID of monitor the capture window is displayed on
     */
    MonitorID:string,
    /**
     * Width of the capture window
     */
    Width:1280,
    /**
     * Height of the capture window
     */
    Height:720,
    /**
     * Collection of Monitors (Display objects)
     */
    Monitors:Array<any>
}

type DimensionRecord = {
    width:number,
    height:number
}

/**
 * Component for controlling the monitor, dimensions, and position,
 * of the capture window.
 */
class CaptureControlMonitor extends React.PureComponent<any, SCaptureControlMonitor> {

    readonly state:SCaptureControlMonitor = {
        MonitorID:'',
        Width:1280,
        Height:720,
        Monitors:new Array<any>()
    }

    /**
     * Screen sizes allowed
     */
    Dimensions:Array<DimensionRecord> = [
        {width:1280,height:720},
        {width:1024,height:576}
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
    onClickSubmit() {
        this.state.Monitors.forEach((monitor) => {
            if(monitor.id == this.state.MonitorID) {
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
    onChangeMonitor(ev:React.FormEvent<HTMLSelectElement>) {
        var value = ev.currentTarget.value;
        this.setState(() => {
            return {MonitorID:value};
        });
    }

    /**
     * Triggered when the user changes the window size list.
     * @param {Event} ev 
     */
    onChangeSize(ev:React.FormEvent<HTMLSelectElement>) {
        var value = parseInt( ev.currentTarget.value );
        this.setState(() => {
            var changes:any = {Width:value};
            this.Dimensions.forEach((dim) => {
                if(dim.width == value)
                    changes.Height = dim.height;
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
                var monitors = window.require('electron').remote.screen.getAllDisplays();
                var changes:any = {Monitors:monitors};
                if(monitors.length > 1) {
                    changes.MonitorID = monitors[1].id;
                    changes.Width = monitors[1].bounds.width;
                    changes.Height = monitors[1].bounds.height;
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
        this.state.Monitors.forEach((monitor) => {
            monitors.push(
                <option 
                    value={monitor.id}
                    key={`mon-${i}`}
                    >{`Monitor #${i}`}</option>
            );
            i++;
        });

        i = 0;
        this.Dimensions.forEach((dim) => {
            sizes.push(
                <option 
                    value={dim.width}
                    key={`dim-${i}`}
                    >{`${dim.width}x${dim.height}`}</option>
            );
            i++;
        });

        return (
            <div className="monitor-control">
                <div>
                    <select 
                        value={this.state.MonitorID}
                        onChange={this.onChangeMonitor}
                        >{monitors}</select>
                </div>
                <div>
                    <select 
                        value={this.state.Width}
                        onChange={this.onChangeSize}
                        >{sizes}</select>
                </div>
                <Button
                    onClick={this.onClickSubmit}
                >Update</Button>
            </div>
        );
    }
}

export default CaptureControlMonitor;