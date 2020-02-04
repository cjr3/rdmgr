import React from 'react';
import {IconX, IconCheck, IconButton, IconHidden, IconShown} from 'components/Elements';
import AnnouncerCaptureController from 'controllers/capture/Announcer';
import Panel from 'components/Panel';
import './css/Announcer.scss';
import { Unsubscribe } from 'redux';

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
        Shown:AnnouncerCaptureController.GetState().Shown
    }

    protected remoteCapture?:Unsubscribe;

    constructor(props) {
        super(props);
        this.onChangeAnnouncer1 = this.onChangeAnnouncer1.bind(this);
        this.onChangeAnnouncer2 = this.onChangeAnnouncer2.bind(this);
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
        AnnouncerCaptureController.SetAnnouncers(this.state.Announcer1, this.state.Announcer2);
    }

    /**
     * Triggered when the user clicks the cancel button.
     */
    protected onClickCancel() {
        this.setState({
            Announcer1:AnnouncerCaptureController.GetState().Announcer1,
            Announcer2:AnnouncerCaptureController.GetState().Announcer2,
            Shown:AnnouncerCaptureController.GetState().Shown
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
        if(this.remoteCapture)
            this.remoteCapture();
    }

    /**
     * Renders the component.
     */
    render() {
        //submit button is active if values don't match the state
        let changed:boolean = (
            this.state.Announcer1 !== AnnouncerCaptureController.GetState().Announcer1 ||
            this.state.Announcer2 !== AnnouncerCaptureController.GetState().Announcer2
        );

        let iconVisibility:string = IconHidden;
        if(this.state.Shown) {
            iconVisibility = IconShown;
        }

        let buttons:Array<React.ReactElement> = Array<React.ReactElement>(
            <IconButton
                key="btn-toggle"
                src={iconVisibility}
                onClick={AnnouncerCaptureController.Toggle}
                active={this.state.Shown}
                title="Show/Hide"
                />,
            <IconButton
                key="btn-cancel"
                src={IconX}
                onClick={this.onClickCancel}
                title="Cancel"
                />,
            <IconButton
                key="btn-submit"
                src={IconCheck}
                active={changed}
                onClick={this.onClickSubmit}
                title="Submit"
                />
        );

        return (
            <Panel
                opened={this.props.opened}
                buttons={buttons}
                popup={true}
                title="Announcers"
                className="announcers"
                >
                <div className="record-form">
                    <div className="form-section">
                        <input type="text"
                            size={20}
                            maxLength={15}
                            value={this.state.Announcer1}
                            onChange={this.onChangeAnnouncer1}
                            placeholder={"Announcer #1"}
                        />
                    </div>
                    <div className="form-section">
                    <input type="text"
                        size={20}
                        maxLength={15}
                        value={this.state.Announcer2}
                        onChange={this.onChangeAnnouncer2}
                        placeholder={"Announcer #2"}
                    />
                    </div>
                </div>
            </Panel>
        );
    }
}