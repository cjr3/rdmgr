import React from 'react';
import {Icon, IconFastForward, IconStopwatch} from 'components/Elements'
import ScoreboardController from 'controllers/ScoreboardController'
import vars from 'tools/vars';
import { Unsubscribe } from 'redux';

/**
 * Component for setting phase / game clock time
 */
export default class PhaseControl extends React.PureComponent<any, {
    PhaseHour:number;
    PhaseMinute:number;
    PhaseSecond:number;
    GameState:number;
}> {
    readonly state = {
        PhaseHour:ScoreboardController.GetState().PhaseHour,
        PhaseMinute:ScoreboardController.GetState().PhaseMinute,
        PhaseSecond:ScoreboardController.GetState().PhaseSecond,
        GameState:ScoreboardController.GetState().GameState
    }

    /**
     * ScoreboardController listener
     */
    protected remoteScore?:Unsubscribe;

    /**
     * Constructor
     * @param props 
     */
    constructor(props) {
        super(props);
        this.onChangeMinute = this.onChangeMinute.bind(this);
        this.onChangeSecond = this.onChangeSecond.bind(this);
        this.onChangeHour = this.onChangeHour.bind(this);
        this.onSetGameTime = this.onSetGameTime.bind(this);
        this.onCopyGameTime = this.onCopyGameTime.bind(this);
        this.updateState = this.updateState.bind(this);
    }

    /**
     * Updates the state to match the scoreboard controller
     */
    protected updateState() {
        this.setState({
            //PhaseHour:ScoreboardController.GetState().PhaseHour,
            //PhaseMinute:ScoreboardController.GetState().PhaseMinute,
            //PhaseSecond:ScoreboardController.GetState().PhaseSecond,
            GameState:ScoreboardController.GetState().GameState
        });
    }

    /**
     * Triggered when the user changes the phase minute.
     * @param {KeyEvent} ev 
     */
    protected onChangeMinute(ev: React.ChangeEvent<HTMLInputElement>) {
        let value:number = parseInt( ev.currentTarget.value );
        this.setState({PhaseMinute:value});
    }

    /**
     * Triggered when the user changes the phase second.
     */
    protected onChangeSecond(ev: React.ChangeEvent<HTMLInputElement>) {
        let value:number = parseInt( ev.currentTarget.value );
        this.setState({PhaseSecond:value});
    }

    /**
     * Triggered when the user changes the phase hour.
     * @param {KeyEvent} ev 
     */
    protected onChangeHour(ev: React.ChangeEvent<HTMLInputElement>) {
        let value:number = parseInt( ev.currentTarget.value );
        this.setState({PhaseHour:value});
    }

    /**
     * Triggered when the user sets the game clock time.
     */
    protected onSetGameTime() {
        if(this.state.GameState != vars.Clock.Status.Running)
            ScoreboardController.SetGameTime(this.state.PhaseHour, this.state.PhaseMinute, this.state.PhaseSecond);
    }

    /**
     * Triggered when the user copies the game clock time.
     */
    protected onCopyGameTime() {
        this.setState({
            PhaseHour:ScoreboardController.GetState().GameHour,
            PhaseMinute:ScoreboardController.GetState().GameMinute,
            PhaseSecond:ScoreboardController.GetState().GameSecond
        });
    }

    public setPhase(phase) {
        if(phase && phase.Duration) {
            this.setState({
                PhaseHour:phase.Duration[0],
                PhaseMinute:phase.Duration[1],
                PhaseSecond:phase.Duration[2]
            });
        }
    }

    /**
     * Start listeners
     */
    componentDidMount() {
        this.remoteScore = ScoreboardController.Subscribe(this.updateState);
    }

    /**
     * Close listeners
     */
    componentWillUnmount() {
        if(this.remoteScore)
            this.remoteScore();
    }

    /**
     * Renders the component
     */
    render() {
        return (
            <div className="phase-control">
                <Icon
                    src={IconFastForward}
                    title="Next Phase"
                    onClick={ScoreboardController.IncreasePhase}
                    onContextMenu={ScoreboardController.DecreasePhase}
                />
                <input type="number" onChange={this.onChangeHour} value={this.state.PhaseHour} max={23} min={0}/>
                {":"}
                <input type="number" onChange={this.onChangeMinute} value={this.state.PhaseMinute} max={59} min={0}/>
                {":"}
                <input type="number" onChange={this.onChangeSecond} value={this.state.PhaseSecond} max={59} min={0}/>
                <Icon
                    src={IconStopwatch}
                    title="Set Game Time"
                    onClick={this.onSetGameTime}
                    onContextMenu={this.onCopyGameTime}
                />
            </div>
        )
    }
}