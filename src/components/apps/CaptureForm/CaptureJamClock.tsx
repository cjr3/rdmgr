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
    /**
     * Maximum jam seconds
     */
    MaxJamSeconds:number;
}> {
    readonly state = {
        JamSecond:ScoreboardController.getState().JamSecond,
        MaxJamSeconds:ScoreboardController.getState().MaxJamSeconds
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
    async updateState() {
        this.setState({
            JamSecond:ScoreboardController.getState().JamSecond,
            MaxJamSeconds:ScoreboardController.getState().MaxJamSeconds
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
        let className:string = cnames('capture-jam-clock', {
            shown:this.props.shown,
            warning:(this.state.JamSecond <= 10),
            danger:(this.state.JamSecond <= 5)
        });

        let text:string = this.state.JamSecond.toString().padStart(2,'0');
        if(this.state.JamSecond > 60 || this.state.MaxJamSeconds > 60) {
            let seconds:number = this.state.JamSecond;
            let minutes:number = 0;
            while(seconds >= 60) {
                minutes++;
                seconds -= 60;
            }
            text = minutes.toString().padStart(2,'0') + ":" + seconds.toString().padStart(2,'0');
        }

        return (
            <div className={className}>
                {text}
            </div>
        )
    }
}