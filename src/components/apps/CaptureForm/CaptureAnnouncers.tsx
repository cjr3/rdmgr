import React from 'react';
import cnames from 'classnames';
import {IconMic, Icon} from 'components/Elements';
import './css/CaptureAnnouncer.scss';
import AnnouncerCaptureController from 'controllers/capture/Announcer';
import { Unsubscribe } from 'redux';

/**
 * Component for displaying the announcer names on the capture window.
 */
export default class CaptureAnnouncers extends React.PureComponent<any, {
    Shown:boolean;
    className:string;
    Announcer1:string;
    Announcer2:string;
}> {
    readonly state = {
        Shown:AnnouncerCaptureController.GetState().Shown,
        className:AnnouncerCaptureController.GetState().className,
        Announcer1:AnnouncerCaptureController.GetState().Announcer1,
        Announcer2:AnnouncerCaptureController.GetState().Announcer2
    }
    /**
     * CaptureController remote
     */
    protected remoteState?:Unsubscribe;

    /**
     * 
     * @param props 
     */
    constructor(props) {
        super(props);
        this.updateState = this.updateState.bind(this);
    }

    /**
     * Updates the state to match the capture controller.
     */
    protected updateState() {
        this.setState({
            Shown:AnnouncerCaptureController.GetState().Shown,
            className:AnnouncerCaptureController.GetState().className,
            Announcer1:AnnouncerCaptureController.GetState().Announcer1,
            Announcer2:AnnouncerCaptureController.GetState().Announcer2
        });
    }

    /**
     * Starts listeners
     */
    componentDidMount() {
        this.remoteState = AnnouncerCaptureController.Subscribe(this.updateState);
    }

    /**
     * Closes listeners
     */
    componentWillUnmount() {
        if(this.remoteState)
            this.remoteState();
    }

    /**
     * Renders the component.
     */
    render() {
        return (
            <div className={cnames('capture-announcers', this.state.className, {shown:this.state.Shown})}>
                <h1>
                    <Icon src={IconMic}/>
                    Announcers
                </h1>
                <div className={cnames('announcer', 'announcer1', {
                    shown:(this.state.Announcer1 !== '')
                })}>{this.state.Announcer1}</div>
                <div className={cnames('announcer', 'announcer2', {
                    shown:(this.state.Announcer2 !== '')
                })}>{this.state.Announcer2}</div>
            </div>
        )
    }
}