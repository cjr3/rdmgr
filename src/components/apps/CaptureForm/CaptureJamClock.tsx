import React from 'react';
import ScoreboardController from 'controllers/ScoreboardController';
import cnames from 'classnames';

/**
 * Component for displaying a large jam clock on the capture window
 */
export default class CaptureJamClock extends React.PureComponent<{
    /**
     * True to show, false to hide
     */
    shown:boolean;
}, {
    /**
     * Seconds on the jam clock
     */
    JamSecond:number;
}> {
    readonly state = {
        JamSecond:ScoreboardController.getState().JamSecond
    }

    /**
     * ScoreboardController remote
     */
    protected remoteScoreboard:Function|null = null;

    /**
     * 
     * @param props 
     */
    constructor(props) {
        super(props);
        this.updateState = this.updateState.bind(this);
    }

    /**
     * Updates the state to match the ScoreboardController
     */
    updateState() {
        this.setState({JamSecond:ScoreboardController.getState().JamSecond});
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
        let className:string = cnames('capture-jam-clock', {
            shown:this.props.shown,
            warning:(this.state.JamSecond <= 10),
            danger:(this.state.JamSecond <= 5)
        });
        return (
            <div className={className}>
                {this.state.JamSecond.toString().padStart(2,'0')}
            </div>
        )
    }
}