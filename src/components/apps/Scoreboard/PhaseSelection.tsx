import React from 'react'
import Panel from 'components/Panel'
import vars, { PhaseRecord } from 'tools/vars';
import ScoreboardController from 'controllers/ScoreboardController'
import DataController from 'controllers/DataController'
import { Button } from 'components/Elements';
import UIController from 'controllers/UIController';

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
        Phases:DataController.getPhases(),
        PhaseID:ScoreboardController.getState().PhaseID
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
        DataController.compareAsync(DataController.getPhases(), this.state.Phases).then((response) => {
            if(!response) {
                this.setState(() => {
                    return {Phases:DataController.getPhases()}
                });
            }
        });
    }

    /**
     * Updates the state to match the controller.
     */
    protected async updateScore() {
        let id:number = ScoreboardController.getState().PhaseID;
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
        if(ScoreboardController.getState().GameState !== vars.Clock.Status.Running) {
            let Phases = DataController.getState().Phases;
            if(Phases[index]) {
                ScoreboardController.SetGameTime(
                    Phases[index].Duration[0],
                    Phases[index].Duration[1],
                    Phases[index].Duration[2]
                );
            }
        }

        if(this.props.onSelect)
            this.props.onSelect(index);
    }

    /**
     * Start listeners
     */
    componentDidMount() {
        this.remoteData = DataController.subscribe(this.updateState);
        this.remoteScore = ScoreboardController.subscribe(this.updateScore);
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
            phases.push(
                <Button
                key={`${phase.RecordType}-${phase.RecordID}`}
                onClick={() => {this.onSelect(i)}}
                active={(this.state.PhaseID == phase.RecordID)}
                >
                    <div>{phase.Name}</div>
                    <div>{
                        phase.Duration[0].toString().padStart(2,'0') + ":" +
                        phase.Duration[1].toString().padStart(2,'0') + ":" +
                        phase.Duration[2].toString().padStart(2,'0')
                        }</div>
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