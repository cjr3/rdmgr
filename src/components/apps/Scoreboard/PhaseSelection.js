import React from 'react'
import Panel from 'components/Panel'
import vars from 'tools/vars';
import ScoreboardController from 'controllers/ScoreboardController'
import DataController from 'controllers/DataController'

class PhaseSelection extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            Phases:DataController.getState().Phases
        }

        //bindings
        this.onSelect = this.onSelect.bind(this);
        this.updateState = this.updateState.bind(this);
        this.remote = DataController.subscribe(this.updateState);
    }

    /**
     * Updates the state to match the controller.
     */
    updateState() {
        if(!Object.is(this.state.Phases, DataController.getState().Phases)) {
            this.setState(() => {
                return { Phases : DataController.getState().Phases };
            });
        }
    }

    /**
     * Triggered when the user select a phase/quarter.
     * @param {Number} index 
     */
    onSelect(index) {
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
        const phases = [];

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