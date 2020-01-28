import React from 'react'
import Panel from 'components/Panel'
import ScoreboardController from 'controllers/ScoreboardController'
import {IconButton, IconNo, IconCheck} from 'components/Elements'

/**
 * 
 */
export interface PJamReset {
    /**
     * Hour when last jam started
     */
    hour:number,
    /**
     * Minute when last jam started
     */
    minute:number,
    /**
     * Second when last jam started
     */
    second:number,
    /**
     * true = shown, false = hidden
     */
    opened:boolean,
    /**
     * Triggered when closed
     */
    onClose:Function
}

/**
 * Component for displaying jam reset options
 * - Displays the game clock time when the previous jam started
 * @param props PJamReset
 */
export default class JamReset extends React.PureComponent<{
    /**
     * true = shown, false = hidden
     */
    opened:boolean;
    /**
     * Triggered when closed
     */
    onClose:Function;
}, {
    hour:number;
    minute:number;
    second:number;
}> {

    readonly state = {
        hour:ScoreboardController.GetState().StartGameHour,
        minute:ScoreboardController.GetState().StartGameMinute,
        second:ScoreboardController.GetState().StartGameSecond
    }

    protected remoteScoreboard;

    constructor(props) {
        super(props);
        this.updateScoreboard = this.updateScoreboard.bind(this);
    }

    updateScoreboard() {
        let hour = ScoreboardController.GetState().StartGameHour;
        let minute = ScoreboardController.GetState().StartGameMinute;
        let second = ScoreboardController.GetState().StartGameSecond;
        if(hour !== this.state.hour || minute !== this.state.minute || second !== this.state.second) {
            this.setState({
                hour:hour,
                minute:minute,
                second:second
            });
        }
    }

    componentDidMount() {
        this.remoteScoreboard = ScoreboardController.Subscribe(this.updateScoreboard);
    }

    componentWillUnmount() {
        if(this.remoteScoreboard !== null)
            this.remoteScoreboard();
    }
    
    render() {
        let startClock:string = `${this.state.hour.toString().padStart(2,'0')}:${this.state.minute.toString().padStart(2,'0')}:${this.state.second.toString().padStart(2,'0')}`;
        return (
            <Panel 
                opened={this.props.opened}
                buttons={[
                    <IconButton
                        key="button-submit"
                        onClick={() => {
                            ScoreboardController.ResetJam();
                            this.props.onClose();
                        }}
                        src={IconCheck}
                        >Yes</IconButton>,
                    <IconButton
                        key="button-cancel"
                        onClick={this.props.onClose}
                        src={IconNo}
                        >No</IconButton>
                ]}
                popup={true}
                className="jam-reset-panel"
                contentName="jam-reset"
                >
                <p>
                    Reset the game clock to the time below?
                </p>
                <h1>{startClock}</h1>
            </Panel>
        )
    }
}