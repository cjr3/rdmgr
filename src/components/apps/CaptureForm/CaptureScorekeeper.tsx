import React, { CSSProperties } from 'react';
import DataController from 'controllers/DataController';
import ScorekeeperController, {SScorekeeperState} from 'controllers/ScorekeeperController';
import {SScoreboardTeam} from 'controllers/ScoreboardController';
import cnames from 'classnames';
import './css/CaptureScorekeeper.scss';

/**
 * Component for displaying Scorekeeper elements on the capture window.
 */
export default class CaptureScorekeeper extends React.Component<{
    /**
     * True to show/hide the component
     */
    shown:boolean;
    /**
     * Left-side team
     */
    TeamA:SScoreboardTeam;
    /**
     * Right-side team
     */
    TeamB:SScoreboardTeam;
}, SScorekeeperState> {
    /**
     * State
     */
    readonly state:SScorekeeperState = ScorekeeperController.getState();
    /**
     * Listener for changes to the scorekeeper controller
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
     * Updates the state to match the scorekeeper controller
     */
    updateState() {
        this.setState(ScorekeeperController.getState());
    }

    /**
     * Start listeners
     */
    componentDidMount() {
        this.remoteState = ScorekeeperController.subscribe(this.updateState);
    }

    /**
     * Close listeners
     */
    componentWillUnmount() {
        if(this.remoteState !== null)
            this.remoteState();
    }

    /**
     * Renders the component
     */
    render() {
        let className:string = cnames('capture-scorekeeper', {
            shown:(this.props.shown)
        });

        let classNameA:string = cnames('skater', {
            shown:(this.state.TeamA.Track.Jammer !== null)
        });

        let classNameB:string = cnames('skater', {
            shown:(this.state.TeamB.Track.Jammer !== null)
        });

        let srcA:string|undefined = '';
        let srcB:string|undefined = '';
        let styleA:CSSProperties = {};
        let styleB:CSSProperties = {};
        let nameA:string|undefined = '';
        let nameB:string|undefined = '';

        if(this.state.TeamA.Track.Jammer !== null) {
            if(this.state.TeamA.Track.Jammer.Thumbnail)
                srcA = DataController.mpath(this.state.TeamA.Track.Jammer.Thumbnail);
            else
                srcA = DataController.mpath(this.props.TeamA.Thumbnail);
            if(this.state.TeamA.Track.Jammer.Number !== undefined)
                nameA = this.state.TeamA.Track.Jammer.Number;
            styleA = {
                backgroundImage:`linear-gradient(0deg, rgba(0,0,0,0), ${this.state.TeamA.Track.Jammer.Color})`
            }
        }

        if(this.state.TeamB.Track.Jammer !== null) {
            if(this.state.TeamB.Track.Jammer.Thumbnail)
                srcB = DataController.mpath(this.state.TeamB.Track.Jammer.Thumbnail);
            else
                srcB = DataController.mpath(this.props.TeamB.Thumbnail);
            if(this.state.TeamB.Track.Jammer.Number !== undefined)
                nameB = this.state.TeamB.Track.Jammer.Number;
            styleB = {
                backgroundImage:`linear-gradient(0deg, rgba(0,0,0,0), ${this.state.TeamB.Track.Jammer.Color})`
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