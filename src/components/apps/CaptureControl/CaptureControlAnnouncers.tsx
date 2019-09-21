import React from 'react';
import CaptureController from 'controllers/CaptureController';
import CaptureControlPanel, {PCaptureControlPanel} from './CaptureControlPanel';
import {IconX, IconCheck, IconButton} from 'components/Elements';
import DataController from 'controllers/DataController';

interface SCaptureControlAnnouncers {
    /**
     * Name of the first announcer
     */
    Announcer1:string,
    /**
     * Name of the second announcer
     */
    Announcer2:string,
    /**
     * How long, in seconds, to display the announcer names
     */
    Duration:number,
    /**
     * Determines if the announcer names are shown or not
     */
    Shown:boolean
}

/**
 * Component for configuring announcers.
 */
class CaptureControlAnnouncers extends React.PureComponent<PCaptureControlPanel, SCaptureControlAnnouncers> {

    /**
     * State
     */
    readonly state:SCaptureControlAnnouncers = {
        Announcer1:CaptureController.getState().Announcers.Announcer1,
        Announcer2:CaptureController.getState().Announcers.Announcer2,
        Duration:CaptureController.getState().Announcers.Duration/1000,
        Shown:CaptureController.getState().Announcers.Shown
    }

    /**
     * Listener for capture controller
     */
    protected remoteCapture:Function

    constructor(props) {
        super(props);
        this.onChangeAnnouncer1 = this.onChangeAnnouncer1.bind(this);
        this.onChangeAnnouncer2 = this.onChangeAnnouncer2.bind(this);
        this.onChangeDuration = this.onChangeDuration.bind(this);
        this.onClickSubmit = this.onClickSubmit.bind(this);
        this.onClickCancel = this.onClickCancel.bind(this);

        this.updateCapture = this.updateCapture.bind(this);
        this.remoteCapture = CaptureController.subscribe(this.updateCapture);
    }

    /**
     * Updates the state to match the capture controller.
     */
    updateCapture() {
        this.setState({
            Shown:CaptureController.getState().Announcers.Shown
        });
    }

    /**
     * Triggered when the user changes the name of the first announcer.
     * @param {Event} ev 
     */
    onChangeAnnouncer1(ev) {
        var value = ev.target.value;
        this.setState(() => {return {Announcer1:value}});
    }

    /**
     * Triggered when the user changes the name of the second announcer
     * @param {Event} ev 
     */
    onChangeAnnouncer2(ev) {
        var value = ev.target.value;
        this.setState(() => {return {Announcer2:value}});
    }

    /**
     * Triggered when the user clicks the submit button.
     */
    onClickSubmit() {
        CaptureController.SetAnnouncers(this.state.Announcer1, this.state.Announcer2, this.state.Duration * 1000);
    }

    /**
     * Triggered when the user clicks the cancel button.
     */
    onClickCancel() {
        this.setState({
            Announcer1:CaptureController.getState().Announcers.Announcer1,
            Announcer2:CaptureController.getState().Announcers.Announcer2,
            Duration:CaptureController.getState().Announcers.Duration/1000,
            Shown:CaptureController.getState().Announcers.Shown
        });
    }

    /**
     * Triggered when the user changes the duration for the announcer
     * @param {Event} ev 
     */
    onChangeDuration(ev) {
        var duration = parseInt(ev.target.value);
        this.setState(() => {
            return {Duration:duration}
        });
    }

    /**
     * Renders the component.
     */
    render() {
        //submit button is active if values don't match the state
        var active = (
            this.state.Announcer1 !== this.state.Announcer1 ||
            this.state.Announcer2 !== this.state.Announcer2 ||
            (this.state.Duration*1000) !== this.state.Duration
        );

        var buttons = [
            <IconButton
                key="btn-cancel"
                src={IconX}
                onClick={this.onClickCancel}
                />,
            <IconButton
                key="btn-submit"
                src={IconCheck}
                active={active}
                onClick={this.onClickSubmit}
                />
        ];

        return (
            <CaptureControlPanel
                active={this.props.active}
                name={this.props.name}
                icon={this.props.icon}
                toggle={this.props.toggle}
                shown={this.state.Shown}
                buttons={buttons}
                onClick={this.props.onClick}>
                    <p>Announcer #1:</p>
                    <div>
                        <input type="text"
                            size={20}
                            maxLength={15}
                            value={this.state.Announcer1}
                            onChange={this.onChangeAnnouncer1}
                        />
                    </div>
                    <p>Announcer #2:</p>
                    <div>
                        <input type="text"
                            size={20}
                            maxLength={15}
                            value={this.state.Announcer2}
                            onChange={this.onChangeAnnouncer2}
                        />
                    </div>
                    <p>
                        Show for 
                        <input type="number"
                            size={2}
                            maxLength={5}
                            min="5"
                            max="15"
                            value={this.state.Duration}
                            onChange={this.onChangeDuration}
                        /> seconds
                    </p>
            </CaptureControlPanel>
        );
    }
}

export default CaptureControlAnnouncers;