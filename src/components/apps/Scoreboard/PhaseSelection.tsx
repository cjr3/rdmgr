import React from 'react'
import Panel from 'components/Panel'
import vars, { PhaseRecord } from 'tools/vars';
import ScoreboardController from 'controllers/ScoreboardController'
import { Button } from 'components/Elements';
import UIController from 'controllers/UIController';
import PhasesController from 'controllers/PhasesController';

export interface PPhaseSelection {
    /**
     * True to show, false to hide
     */
    opened:boolean,
    /**
     * Triggered when the user selects a phase
     */
    onSelect:Function,
    /**
     * Triggered when the panel closes
     */
    onClose:Function,
    /**
     * Class name of panel content
     */
    className?:string
}

/**
 * Component for displaying the phase/quarter selection on the scoreboard
 */
export default class PhaseSelection extends React.PureComponent<{
    /**
     * True to show, false to hide
     */
    opened:boolean;
    /**
     * Triggered when the user selects a phase
     */
    onSelect:Function;
    /**
     * Triggered when the panel closes
     */
    onClose:Function;
    /**
     * Class name of panel content
     */
    className?:string
}, {
    /**
     * Record of phases to select from
     */
    Phases:Array<PhaseRecord>;
    /**
     * Selected phase record
     */
    PhaseID:number;
}> {
    readonly state = {
        Phases:PhasesController.Get(),
        PhaseID:ScoreboardController.GetState().PhaseID
    }

    /**
     * DataController listener
     */
    protected remoteData:Function|null = null;

    /**
     * ScoreboardController listener
     */
    protected remoteScore:Function|null = null;

    /**
     * Constructor
     * @param props 
     */
    constructor(props:PPhaseSelection) {
        super(props);
        this.onSelect = this.onSelect.bind(this);
        this.updateState = this.updateState.bind(this);
        this.updateScore = this.updateScore.bind(this);
    }

    /**
     * Updates the state to match the controller.
     */
    updateState() {
        this.setState({Phases:PhasesController.Get()});
    }

    /**
     * Updates the state to match the controller.
     */
    protected async updateScore() {
        let id:number = ScoreboardController.GetState().PhaseID;
        if(id !== this.state.PhaseID)
            this.setState({PhaseID:id});
    }

    /**
     * Triggered when the user select a phase/quarter.
     * @param {Number} index 
     */
    protected async onSelect(index:number) {
        ScoreboardController.SetPhase(index);
        UIController.SetScoreboardPanel('');
        if(ScoreboardController.GetState().GameState !== vars.Clock.Status.Running) {
            if(this.state.Phases[index]) {
                let duration:any = this.state.Phases[index].Duration;
                if(duration) {
                    ScoreboardController.SetGameTime(duration[0], duration[1], duration[2]);
                }
            }
        }

        if(this.props.onSelect)
            this.props.onSelect(index);
    }

    /**
     * Start listeners
     */
    componentDidMount() {
        this.remoteData = PhasesController.Subscribe(this.updateState);
        this.remoteScore = ScoreboardController.Subscribe(this.updateScore);
    }

    /**
     * Close listeners
     */
    componentWillUnmount() {
        if(this.remoteData !== null)
            this.remoteData();

        if(this.remoteScore !== null)
            this.remoteScore();
    }

    /**
     * Renders the component.
     */
    render() {
        const phases:Array<React.ReactElement> = [];

        this.state.Phases.forEach((phase, i) => {
            let time:string = '00:00:00';
            if(phase.Duration) {
                time = phase.Duration[0].toString().padStart(2,'0') + ":" +
                    phase.Duration[1].toString().padStart(2,'0') + ":" +
                    phase.Duration[2].toString().padStart(2,'0');
            }
            phases.push(
                <Button
                key={`${phase.RecordType}-${phase.RecordID}`}
                onClick={() => {this.onSelect(i)}}
                active={(this.state.PhaseID == phase.RecordID)}
                >
                    <div>{phase.Name}</div>
                    <div>{time}</div>
                </Button>
            );
        });

        return (
            <Panel popup={true} opened={this.props.opened} {...this.props}>
                {phases}
            </Panel>
        )
    }
}