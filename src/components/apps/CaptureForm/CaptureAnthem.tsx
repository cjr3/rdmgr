import React, { CSSProperties } from 'react'
import CaptureController, {CaptureStateAnthem} from 'controllers/CaptureController';
import cnames from 'classnames'
import './css/CaptureAnthem.scss'
import DataController from 'controllers/DataController';

/**
 * Component for displaying national anthem singer info on the capture window.
 */
export default class CaptureAnthem extends React.PureComponent<any, CaptureStateAnthem> {

    readonly state:CaptureStateAnthem = CaptureController.getState().NationalAnthem
    /**
     * Background of national anthem singer
     */
    protected BackgroundImage:string = DataController.GetMiscRecord('NationalAnthemSinger').Background
    /**
     * CaptureController remote
     */
    protected remoteCapture:Function|null = null;

    /**
     * Constructor
     * @param props 
     */
    constructor(props) {
        super(props);
        this.updateState = this.updateState.bind(this);
    }

    /**
     * Updates the state to match the controller.
     */
    updateState() {
        this.setState(CaptureController.getState().NationalAnthem);
    }

    /**
     * Start listeners
     */
    componentDidMount() {
        this.remoteCapture = CaptureController.subscribe(this.updateState);
    }

    /**
     * Close listeners
     */
    componentWillUnmount() {
        if(this.remoteCapture !== null)
            this.remoteCapture();
    }

    /**
     * Renders the component
     */
    render() {
        let className:string = cnames('capture-anthem', this.state.className, {
            shown:this.state.Shown
        });

        let bioClass:string = cnames({
            bio:true,
            shown:(this.state.Record.Biography !== '')
        });

        let nameClass:string = cnames({
            name:true,
            shown:(this.state.Record.Name !== '')
        });

        let style:CSSProperties = {backgroundImage:'none'};
        if(this.BackgroundImage)
            style.backgroundImage = "url('" + DataController.mpath(this.BackgroundImage) + "')";

        return (
            <div className={className} style={style}>
                <div className={bioClass}>{this.state.Record.Biography}</div>
                <div className={nameClass}>{this.state.Record.Name}</div>
            </div>
        );
    }
}