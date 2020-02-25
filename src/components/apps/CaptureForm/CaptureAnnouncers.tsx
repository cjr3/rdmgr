import React, { CSSProperties } from 'react';
import cnames from 'classnames';
import {IconMic, Icon} from 'components/Elements';
import './css/CaptureAnnouncer.scss';
import AnnouncerCaptureController from 'controllers/capture/Announcer';
import { Unsubscribe } from 'redux';
import PopupBanner from 'components/2d/PopupBanner';
import DataController from 'controllers/DataController';
import { AddMediaPath } from 'controllers/functions';

/**
 * Component for displaying the announcer names on the capture window.
 */
export default class CaptureAnnouncers extends React.PureComponent<any, {
    Shown:boolean;
    className:string;
    Announcer1:string;
    Announcer2:string;
    LeagueLogo:string;
}> {
    readonly state = {
        Shown:AnnouncerCaptureController.GetState().Shown,
        className:AnnouncerCaptureController.GetState().className,
        Announcer1:AnnouncerCaptureController.GetState().Announcer1,
        Announcer2:AnnouncerCaptureController.GetState().Announcer2,
        LeagueLogo:DataController.GetMiscRecord('LeagueLogo')
    }
    
    protected remoteState?:Unsubscribe;
    protected remoteData?:Unsubscribe;

    /**
     * 
     * @param props 
     */
    constructor(props) {
        super(props);
        this.updateState = this.updateState.bind(this);
        this.updateData = this.updateData.bind(this);
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

    protected updateData(){
        this.setState({
            LeagueLogo:DataController.GetMiscRecord('LeagueLogo')
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
        let name:string = '';
        let names:Array<string> = new Array<string>();
        let style:CSSProperties = {};
        if(this.state.Announcer1)
            names.push(this.state.Announcer1);
        if(this.state.Announcer2)
            names.push(this.state.Announcer2);

        if(names.length >= 1) {
            name = names.join(' & ');
        }

        if(this.state.LeagueLogo)
            style.backgroundImage = `url('${AddMediaPath(this.state.LeagueLogo)}')`;

        return (
            <div
                className={cnames('announcer-banner', this.state.className, {shown:this.state.Shown})}
                style={style}
                >
                <div className="content">
                    <div className="icon">
                        <Icon src={IconMic}/>
                    </div>
                    <div className="names">
                        {name}
                    </div>
                </div>
            </div>
        )
    }
}