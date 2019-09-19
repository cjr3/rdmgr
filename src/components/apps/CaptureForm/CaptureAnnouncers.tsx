import React from 'react';
import cnames from 'classnames';
import CaptureController, {CaptureStateAnnouncer} from 'controllers/CaptureController';
import {IconMic, Icon} from 'components/Elements';
import './css/CaptureAnnouncer.scss';

interface PCaptureAnnouncers {
    shown:boolean
}

/**
 * Component for displaying the announcer names on the capture window.
 */
class CaptureAnnouncers extends React.PureComponent<PCaptureAnnouncers, CaptureStateAnnouncer> {
    readonly state:CaptureStateAnnouncer = CaptureController.getState().Announcers;
    remote:Function
    constructor(props) {
        super(props);
        this.updateState = this.updateState.bind(this);
        this.remote = CaptureController.subscribe(this.updateState);
    }

    /**
     * Updates the state to match the capture controller.
     */
    updateState() {
        this.setState(CaptureController.getState().Announcers);
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

export default CaptureAnnouncers;