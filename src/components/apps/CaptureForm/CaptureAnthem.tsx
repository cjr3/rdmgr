import React, { CSSProperties } from 'react'
import cnames from 'classnames'
import './css/CaptureAnthem.scss'
import DataController from 'controllers/DataController';
import AnthemCaptureController from 'controllers/capture/Anthem';
import { Unsubscribe } from 'redux';
import { AddMediaPath } from 'controllers/functions';
import PopupBanner from 'components/2d/PopupBanner';

/**
 * Component for displaying national anthem singer info on the capture window.
 */
export default class CaptureAnthem extends React.PureComponent<any, {
    Shown:boolean;
    Name:string;
    Bio:string;
    BackgroundImage:string;
}> {

    readonly state = {
        Shown:AnthemCaptureController.GetState().Shown,
        Name:AnthemCaptureController.GetState().Record.Name,
        Bio:AnthemCaptureController.GetState().Record.Description,
        BackgroundImage:DataController.GetMiscRecord('NationalFlag')
    }
    
    /**
     * CaptureController remote
     */
    protected remoteCapture?:Unsubscribe;
    protected remoteData?:Unsubscribe;

    /**
     * Constructor
     * @param props 
     */
    constructor(props) {
        super(props);
        this.updateState = this.updateState.bind(this);
        this.updateData = this.updateData.bind(this);
    }

    /**
     * Updates the state to match the controller.
     */
    protected updateState() {
        this.setState({
            Shown:AnthemCaptureController.GetState().Shown,
            Name:AnthemCaptureController.GetState().Record.Name,
            Bio:AnthemCaptureController.GetState().Record.Description
        });
    }

    protected updateData() {
        this.setState({
            BackgroundImage:DataController.GetMiscRecord('NationalFlag')
        });
    }

    /**
     * Start listeners
     */
    componentDidMount() {
        this.remoteCapture = AnthemCaptureController.Subscribe(this.updateState);
        this.remoteData = DataController.Subscribe(this.updateData);
    }

    /**
     * Close listeners
     */
    componentWillUnmount() {
        if(this.remoteCapture)
            this.remoteCapture();
        if(this.remoteData)
            this.remoteData();
    }

    /**
     * Renders the component
     */
    render() {
        let className:string = cnames('anthem-screen', {
            shown:this.state.Shown
        });

        let bioClass:string = cnames({
            bio:true,
            shown:(this.state.Bio)
        });

        let nameClass:string = cnames({
            name:true,
            shown:(this.state.Name)
        });

        let style:CSSProperties = {};
        if(this.state.BackgroundImage)
            style.backgroundImage = `url('${AddMediaPath(this.state.BackgroundImage)}')`;

        return (
            <div className={className} style={style}>
                <div className={bioClass}>{this.state.Bio}</div>
                <div className={nameClass}>{this.state.Name}</div>
            </div>
        );
    }
}

export class CaptureAnthemBanner extends React.PureComponent<any, {
    Shown:boolean;
    Name:string;
    BackgroundImage:string;
}> {
    readonly state = {
        Shown:AnthemCaptureController.GetState().Shown,
        Name:AnthemCaptureController.GetState().Record.Name,
        BackgroundImage:DataController.GetMiscRecord('NationalFlag')
    }

    protected remoteCapture?:Unsubscribe;
    protected remoteData?:Unsubscribe;

    constructor(props) {
        super(props);
        this.updateCapture = this.updateCapture.bind(this);
        this.updateData = this.updateData.bind(this);
    }

    protected updateCapture() {
        this.setState({
            Shown:AnthemCaptureController.GetState().Shown,
            Name:AnthemCaptureController.GetState().Record.Name
        });
    }

    protected updateData() {
        this.setState({
            BackgroundImage:DataController.GetMiscRecord('NationalFlag')
        });
    }

    /**
     * Start listeners
     */
    componentDidMount() {
        this.remoteCapture = AnthemCaptureController.Subscribe(this.updateCapture);
        this.remoteData = DataController.Subscribe(this.updateData);
    }

    /**
     * Close listeners
     */
    componentWillUnmount() {
        if(this.remoteCapture)
            this.remoteCapture();
        if(this.remoteData)
            this.remoteData();
    }

    render() {
        let style:CSSProperties = {};
        if(this.state.BackgroundImage)
            style.backgroundImage = "url('" + AddMediaPath(this.state.BackgroundImage) + "')";
        return (
            <PopupBanner
                shown={this.state.Shown}
                className="anthem-banner"
                style={style}
                >
                <div className="name">{this.state.Name}</div>
            </PopupBanner>
        );
    }
}