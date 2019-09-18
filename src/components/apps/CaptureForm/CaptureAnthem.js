import React from 'react'
import CaptureController from 'controllers/CaptureController';
import cnames from 'classnames'
import './css/CaptureAnthem.scss'
import DataController from 'controllers/DataController';

class CaptureAnthem extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = Object.assign({}, CaptureController.getState().NationalAnthem);
        this.BackgroundImage = DataController.GetMiscRecord('NationalAnthemSinger').Background;
        this.updateState = this.updateState.bind(this);
        this.remote = CaptureController.subscribe(this.updateState);
    }

    /**
     * Updates the state to match the controller.
     */
    updateState() {
        this.setState(() => {
            return Object.assign({}, CaptureController.getState().NationalAnthem);
        });
    }

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