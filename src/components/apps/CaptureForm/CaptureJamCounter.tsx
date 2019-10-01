import React from 'react';
import ScoreboardController from 'controllers/ScoreboardController';
import cnames from 'classnames';

/**
 * Component for displaying a large jam counter on the CaptureForm
 */
export default class CaptureJamCounter extends React.PureComponent<{
    /**
     * True to show, false to hide
     */
    shown:boolean;
}, {
    /**
     * Current jam number
     */
    JamCounter:number;
}> {
    readonly state = {
        JamCounter:ScoreboardController.getState().JamCounter
    }

    /**
     * ScoreboardController remote
     */
    protected remoteScoreboard:Function|null = null;

    /**
     * Constructor
     * @param props 
     */
    constructor(props) {
        super(props);
        this.updateState = this.updateState.bind(this);
    }

    /**
     * Updates the state to match the Scoreboard Controller
     */
    updateState() {
        this.setState({
            JamCounter:ScoreboardController.getState().JamCounter
        });
    }

    /**
     * Start listeners
     */
    componentDidMount() {
        this.remoteScoreboard = ScoreboardController.subscribe(this.updateState);
    }

    /**
     * Close listeners
     */
    componentWillUnmount() {
        if(this.remoteScoreboard !== null)
            this.remoteScoreboard();
    }

    /**
     * Renders the component
     */
    render() {
        var className = cnames('capture-jam-counter', {shown:this.props.shown});
        return (
            <div className={className}>
                {this.state.JamCounter.toString().padStart(2,'0')}
            </div>
        )
    }
}