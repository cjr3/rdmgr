import React from 'react';
import PenaltyController from 'controllers/PenaltyController';
import CaptureControlPanel, {PCaptureControlPanel} from './CaptureControlPanel';
import { SkaterRecord, PenaltyRecord } from 'tools/vars';
import PenaltiesController from 'controllers/PenaltiesController';
import PenaltyCaptureController from 'controllers/capture/Penalty';

/**
 * Component for configuring penalty tracker elements.
 */
export default class CaptureControlPenaltyTracker extends React.PureComponent<PCaptureControlPanel, {
    /**
     * Duration, in seconds, to display penalties
     */
    Duration:number;
    /**
     * Collection of penalized skaters
     */
    Skaters:Array<SkaterRecord>;
    /**
     * Determines if the penalty tracker is shown or not
     */
    Shown:boolean;
    /**
     * Collection of penalty records
     */
    Penalties:Array<PenaltyRecord>;
}> {

    readonly state = {
        Duration:PenaltyCaptureController.GetState().Duration/1000,
        Shown:PenaltyCaptureController.GetState().Shown,
        Skaters:PenaltyController.GetState().Skaters,
        Penalties:PenaltiesController.Get()
    }

    /**
     * Listener for Penalty Controller
     */
    protected remoteState:Function|null = null;

    /**
     * Listener for Capture Controller
     */
    protected remoteCapture:Function|null = null;

    /**
     * Listener for data controller, to get penalty codes
     */
    protected remoteData:Function|null = null;

    /**
     * Constructor
     * @param props PCaptureControlPanel
     */
    constructor(props:PCaptureControlPanel) {
        super(props);
        this.onChangeDuration = this.onChangeDuration.bind(this);
        this.updateState = this.updateState.bind(this);
        this.updateCapture = this.updateCapture.bind(this);
        this.updateData = this.updateData.bind(this);
    }

    /**
     * Updates the state to match the camera controller.
     */
    updateState() {
        this.setState(() => {
            return {
                Skaters:PenaltyController.GetState().Skaters
            }
        });
    }

    /**
     * Updates the state to match the capture controller.
     */
    updateCapture() {
        this.setState(() => {
            return {
                Shown:PenaltyCaptureController.GetState().Shown
            }
        });
    }
    
    /**
     * Updates the state to match the data controller
     * - Gets the penalty records
     */
    updateData() {
        this.setState(() => {
            return {Penalties:PenaltiesController.Get()};
        });
    }

    /**
     * Triggered when the user changes the value for the duration to hide the penalty tracker.
     * @param {Event} ev 
     */
    protected onChangeDuration(ev) {
        var value = parseInt(ev.target.value);
        this.setState(() => {
            return {Duration:value};
        }, () => {
            PenaltyCaptureController.SetDuration(this.state.Duration * 1000)
        });
    }

    /**
     * Triggered when the component mounts to the DOM
     * - Create controller listeners
     */
    componentDidMount() {
        this.remoteState = PenaltyController.Subscribe(this.updateState);
        this.remoteCapture = PenaltyCaptureController.Subscribe(this.updateCapture);
        this.remoteData = PenaltiesController.Subscribe(this.updateData);
    }

    /**
     * Triggered when the component will unmount from the DOM
     * - Remove controller listeners
     */
    componentWillUnmount() {
        if(this.remoteCapture !== null)
            this.remoteCapture();

        if(this.remoteState !== null)
            this.remoteState();

        if(this.remoteData !== null)
            this.remoteData();
    }

    /**
     * Renders the component.
     */
    render() {
        const buttons = [
            <input
                key="txt-duration"
                type="number"
                size={2}
                maxLength={2}
                min={5}
                max={20}
                step={1}
                value={this.state.Duration}
                onChange={this.onChangeDuration}
                />
        ];

        let skaters:Array<React.ReactElement> = [];
        this.state.Skaters.forEach((skater) => {
            let codes:Array<string> = [];
            if(skater.Penalties !== undefined && skater.Penalties.length >= 1) {
                skater.Penalties.forEach((pen:any) => {
                    if(pen.Acronym)
                        codes.push(pen.Acronym);
                    else if(pen.Code)
                        codes.push(pen.Code);
                });
            }
            skaters.push(
                <div className="stack-panel s2" key={`${skater.RecordID}-${skater.RecordID}`}>
                    <div>{`#${skater.Number}`}</div>
                    <div>{codes.join(', ')}</div>
                </div>
            );
        });

        return (
            <CaptureControlPanel
                active={this.props.active}
                name={this.props.name}
                icon={this.props.icon}
                toggle={this.props.toggle}
                shown={this.state.Shown}
                buttons={buttons}
                onClick={this.props.onClick}>
                    {skaters}
                </CaptureControlPanel>
        );
    }
}