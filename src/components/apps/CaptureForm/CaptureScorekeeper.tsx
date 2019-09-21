import React, { CSSProperties } from 'react';
import DataController from 'controllers/DataController';
import ScorekeeperController, {SScorekeeperState} from 'controllers/ScorekeeperController';
import cnames from 'classnames'
import './css/CaptureScorekeeper.scss';

/**
 * Properties for the CaptureScorekeeper component
 */
export interface PCaptureScorekeeper {
    /**
     * True to show/hide the component
     */
    shown:boolean
}

/**
 * Component for displaying Scorekeeper elements on the capture window.
 */
class CaptureScorekeeper extends React.Component<PCaptureScorekeeper, SScorekeeperState> {
    /**
     * State
     */
    readonly state:SScorekeeperState = ScorekeeperController.getState();
    /**
     * Listener for changes to the scorekeeper controller
     */
    protected remoteState:Function

    constructor(props) {
        super(props);
        this.updateState = this.updateState.bind(this);
        this.remoteState = ScorekeeperController.subscribe(this.updateState);
    }

    /**
     * Updates the state to match the scorekeeper controller
     */
    updateState() {
        this.setState(ScorekeeperController.getState());
    }

    /**
     * Renders the component
     */
    render() {
        var className = cnames('capture-scorekeeper', {
            shown:(this.props.shown)
        });

        var classNameA = cnames('skater', {
            shown:(this.state.TeamA.Track.Jammer !== null)
        });

        var classNameB = cnames('skater', {
            shown:(this.state.TeamB.Track.Jammer !== null)
        });

        var srcA:string|undefined = '';
        var srcB:string|undefined = '';
        var styleA:CSSProperties = {};
        var styleB:CSSProperties = {};
        var nameA:string|undefined = '';
        var nameB:string|undefined = '';

        if(this.state.TeamA.Track.Jammer !== null) {
            if(this.state.TeamA.Track.Jammer.Thumbnail)
                srcA = DataController.mpath(this.state.TeamA.Track.Jammer.Thumbnail);
            if(this.state.TeamA.Track.Jammer.Number !== undefined)
                nameA = this.state.TeamA.Track.Jammer.Number;
            styleA = {
                backgroundImage:`linear-gradient(0deg, rgba(0,0,0,0), ${this.state.TeamA.Track.Jammer.Color})`
            }
        }

        if(this.state.TeamB.Track.Jammer !== null) {
            if(this.state.TeamB.Track.Jammer.Thumbnail)
                srcB = DataController.mpath(this.state.TeamB.Track.Jammer.Thumbnail);
            if(this.state.TeamB.Track.Jammer.Number !== undefined)
                nameB = this.state.TeamB.Track.Jammer.Number;
            styleB = {
                backgroundImage:`linear-gradient(0deg, rgba(0,0,0,0), ${this.state.TeamB.Track.Jammer.Color})`,
            }
        }

        return (
            <div className={className}>
                <div className="jammers">
                    <div className={classNameA}>
                        <img src={srcA} alt=""/>
                        <label style={styleA}>{nameA}</label>
                    </div>
                    <div className={classNameB}>
                        <img src={srcB} alt=""/>
                        <label style={styleB}>{nameB}</label>
                    </div>
                </div>
            </div>
        )
    }
}

export default CaptureScorekeeper;