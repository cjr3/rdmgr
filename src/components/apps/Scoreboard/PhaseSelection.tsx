import React from 'react'
import Panel from 'components/Panel'
import vars, { PhaseRecord } from 'tools/vars';
import ScoreboardController from 'controllers/ScoreboardController'
import DataController from 'controllers/DataController'

interface SPhaseSelection {
    Phases:Array<PhaseRecord>
}

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
class PhaseSelection extends React.PureComponent<PPhaseSelection, SPhaseSelection> {
    readonly state:SPhaseSelection = {
        Phases:DataController.getState().Phases
    }

    remoteData:Function
    constructor(props:PPhaseSelection) {
        super(props);
        this.onSelect = this.onSelect.bind(this);
        this.updateState = this.updateState.bind(this);
        this.remoteData = DataController.subscribe(this.updateState);
    }

    /**
     * Updates the state to match the controller.
     */
    updateState() {
        this.setState({Phases:DataController.getPhases()});
    }

    /**
     * Triggered when the user select a phase/quarter.
     * @param {Number} index 
     */
    onSelect(index:number) {
        ScoreboardController.SetPhase(index);
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
     * Renders the component.
     */
    render() {
        const phases:Array<React.ReactElement> = [];

        for(let i=0; i < this.state.Phases.length; i++) {
            let phase = this.state.Phases[i];
            phases.push(
                <button
                key={"phase-" + i}
                onClick={() => {this.onSelect(i)}}
                >
                    <div>{phase.Name}</div>
                    <div>{
                        phase.Duration[1].toString().padStart(2,'0') + ":" +
                        phase.Duration[2].toString().padStart(2,'0')
                        }</div>
                </button>
            );
        }

        return (
            <Panel popup={true} opened={this.props.opened} {...this.props}>
                {phases}
            </Panel>
        )
    }
}

export default PhaseSelection;