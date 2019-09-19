import React from 'react'
import CaptureController, {StateAnthem} from 'controllers/CaptureController';
import cnames from 'classnames'
import './css/CaptureAnthem.scss'
import DataController from 'controllers/DataController';


class CaptureAnthem extends React.PureComponent<any, StateAnthem> {

    readonly state:StateAnthem = CaptureController.getState().NationalAnthem
    BackgroundImage:string = DataController.GetMiscRecord('NationalAnthemSinger').Background
    remoteCapture:Function

    constructor(props) {
        super(props);
        this.updateState = this.updateState.bind(this);
        this.remoteCapture = CaptureController.subscribe(this.updateState);
    }

    /**
     * Updates the state to match the controller.
     */
    updateState() {
        this.setState(CaptureController.getState().NationalAnthem);
    }

    /**
     * Renders the component
     */
    render() {
        var className = cnames('capture-anthem', this.state.className, {
            shown:this.state.Shown
        });

        var bioClass = cnames({
            bio:true,
            shown:(this.state.Record.Biography !== '')
        });

        var nameClass = cnames({
            name:true,
            shown:(this.state.Record.Name !== '')
        });

        var background = 'none';
        if(this.BackgroundImage)
            background = "url('" + DataController.mpath(this.BackgroundImage) + "')";
        var style = {backgroundImage:background};

        return (
            <div className={className} style={style}>
                <div className={bioClass}>{this.state.Record.Biography}</div>
                <div className={nameClass}>{this.state.Record.Name}</div>
            </div>
        );
    }
}

export default CaptureAnthem;