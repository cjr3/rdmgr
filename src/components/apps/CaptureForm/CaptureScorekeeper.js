import React from 'react';
import DataController from 'controllers/DataController';
import ScorekeeperController from 'controllers/ScorekeeperController';
import cnames from 'classnames'
import './css/CaptureScorekeeper.scss';

class CaptureScorekeeper extends React.Component {
    constructor(props) {
        super(props);
        this.state = Object.assign({}, ScorekeeperController.getState());
        this.updateState = this.updateState.bind(this);
        this.remote = ScorekeeperController.subscribe(this.updateState);
    }

    updateState() {
        this.setState(() => {
            return Object.assign({}, ScorekeeperController.getState())
        });
    }

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

        var srcA = null;
        var srcB = null;
        var styleA = {};
        var styleB = {};
        var nameA = null;
        var nameB = null;

        if(this.state.TeamA.Track.Jammer !== null) {
            if(this.state.TeamA.Track.Jammer.Thumbnail)
                srcA = DataController.mpath(this.state.TeamA.Track.Jammer.Thumbnail);
            nameA = this.state.TeamA.Track.Jammer.Number;
            styleA = {
                backgroundImage:`linear-gradient(0deg, rgba(0,0,0,0), ${this.state.TeamA.Track.Jammer.Color})`
            }
        }

        if(this.state.TeamB.Track.Jammer !== null) {
            if(this.state.TeamB.Track.Jammer.Thumbnail)
                srcB = DataController.mpath(this.state.TeamB.Track.Jammer.Thumbnail);
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