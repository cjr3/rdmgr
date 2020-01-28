import React from 'react';
import {IconX, IconCheck, IconButton} from 'components/Elements';
import AnnouncerCaptureController from 'controllers/capture/Announcer';
import Panel from 'components/Panel';

/**
 * Component for configuring announcers.
 */
export default class AnnouncerPanel extends React.PureComponent<{
    opened:boolean;
}, {
    /**
     * Name of the first announcer
     */
    Announcer1:string;
    /**
     * Name of the second announcer
     */
    Announcer2:string;
    /**
     * How long, in seconds, to display the announcer names
     */
    Duration:number;
    /**
     * Determines if the announcer names are shown or not
     */
    Shown:boolean;
}> {

    /**
     * State
     */
    readonly state = {
        Announcer1:AnnouncerCaptureController.GetState().Announcer1,
        Announcer2:AnnouncerCaptureController.GetState().Announcer2,
        Duration:AnnouncerCaptureController.GetState().Duration/1000,
        Shown:AnnouncerCaptureController.GetState().Shown
    }

    /**
     * Listener for capture controller
     */
    protected remoteCapture:Function|null = null;

    constructor(props) {
        super(props);
        this.onChangeAnnouncer1 = this.onChangeAnnouncer1.bind(this);
        this.onChangeAnnouncer2 = this.onChangeAnnouncer2.bind(this);
        this.onChangeDuration = this.onChangeDuration.bind(this);
        this.onClickSubmit = this.onClickSubmit.bind(this);
        this.onClickCancel = this.onClickCancel.bind(this);
        this.updateCapture = this.updateCapture.bind(this);
    }

    /**
     * Updates the state to match the capture controller.
     */
    protected updateCapture() {
        this.setState({
            Shown:AnnouncerCaptureController.GetState().Shown
        });
    }

    /**
     * Triggered when the user changes the name of the first announcer.
     * @param {Event} ev 
     */
    protected onChangeAnnouncer1(ev: React.ChangeEvent<HTMLInputElement>) {
        var value = ev.currentTarget.value;
        this.setState(() => {return {Announcer1:value}});
    }

    /**
     * Triggered when the user changes the name of the second announcer
     * @param {Event} ev 
     */
    protected onChangeAnnouncer2(ev: React.ChangeEvent<HTMLInputElement>) {
        var value = ev.currentTarget.value;
        this.setState(() => {return {Announcer2:value}});
    }

    /**
     * Triggered when the user clicks the submit button.
     */
    protected onClickSubmit() {
        AnnouncerCaptureController.SetAnnouncers(this.state.Announcer1, this.state.Announcer2, this.state.Duration * 1000);
    }

    /**
     * Triggered when the user clicks the cancel button.
     */
    protected onClickCancel() {
        this.setState({
            Announcer1:AnnouncerCaptureController.GetState().Announcer1,
            Announcer2:AnnouncerCaptureController.GetState().Announcer2,
            Duration:AnnouncerCaptureController.GetState().Duration/1000,
            Shown:AnnouncerCaptureController.GetState().Shown
        });
    }

    /**
     * Triggered when the user changes the duration for the announcer
     * @param {Event} ev 
     */
    protected onChangeDuration(ev: React.ChangeEvent<HTMLInputElement>) {
        var duration = parseInt(ev.currentTarget.value);
        this.setState(() => {
            return {Duration:duration}
        });
    }

    /**
     * Start listeners
     */
    componentDidMount() {
        this.remoteCapture = AnnouncerCaptureController.Subscribe(this.updateCapture);
    }

    /**
     * Triggered when the component will unmount from the DOM
     * - Close listeners
     */
    componentWillUnmount() {
        if(this.remoteCapture !== null)
            this.remoteCapture();
    }

    /**
     * Renders the component.
     */
    render() {
        //submit button is active if values don't match the state
        let changed:boolean = (
            this.state.Announcer1 !== AnnouncerCaptureController.GetState().Announcer1 ||
            this.state.Announcer2 !== AnnouncerCaptureController.GetState().Announcer2 ||
            (this.state.Duration*1000) !== AnnouncerCaptureController.GetState().Duration
        );

        let buttons:Array<React.ReactElement> = Array<React.ReactElement>(
            <IconButton
                key="btn-cancel"
                src={IconX}
                onClick={this.onClickCancel}
                />,

            <IconButton
                key="btn-submit"
                src={IconCheck}
                active={changed}
                onClick={this.onClickSubmit}
                />
        );

        return (
            <Panel
                opened={this.props.opened}
                popup={true}
                buttons={buttons}
                title="Announcers"
                contentName="announcers"
                >
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
            </Panel>
        );
    }
}