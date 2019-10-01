import React from 'react';
import cnames from 'classnames';
import CaptureController, {CaptureStateAnnouncer} from 'controllers/CaptureController';
import {IconMic, Icon} from 'components/Elements';
import './css/CaptureAnnouncer.scss';

/**
 * Component for displaying the announcer names on the capture window.
 */
export default class CaptureAnnouncers extends React.PureComponent<{
    /**
     * Show/Hide the announcers
     */
    shown:boolean;
}, CaptureStateAnnouncer> {
    readonly state:CaptureStateAnnouncer = CaptureController.getState().Announcers;
    /**
     * CaptureController remote
     */
    protected remoteState:Function|null = null;

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
    updateState() {
        this.setState(CaptureController.getState().Announcers);
    }

    /**
     * Starts listeners
     */
    componentDidMount() {
        this.remoteState = CaptureController.subscribe(this.updateState);
    }

    /**
     * Closes listeners
     */
    componentWillUnmount() {
        if(this.remoteState !== null)
            this.remoteState();
    }

    /**
     * Renders the component.
     */
    render() {
        return (
            <div className={cnames('capture-announcers', this.state.className, {
                shown:this.props.shown
            })}>
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