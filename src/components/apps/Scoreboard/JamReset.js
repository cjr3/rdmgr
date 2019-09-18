import React from 'react'
import Panel from 'components/Panel'
import ScoreboardController from 'controllers/ScoreboardController'
import {IconButton} from 'components/Elements'

/**
 * Component for displaying options to 
 */
class JamReset extends React.PureComponent {
    constructor(props) {
        super(props);
        var cstate = Object.assign({}, ScoreboardController.getState());
        this.state = {
            StartGameHour:cstate.StartGameHour,
            StartGameMinute:cstate.StartGameMinute,
            StartGameSecond:cstate.StartGameSecond
        };

        //bindings
        this.onClickSubmit = this.onClickSubmit.bind(this);
        this.updateState = this.updateState.bind(this);
        this.remote = ScoreboardController.subscribe(this.updateState);
    }

    /**
     * Updates the state to match the controller.
     */
    updateState() {
        this.setState(() => {
            var cstate = Object.assign({}, ScoreboardController.getState());
            return {
                StartGameHour:cstate.StartGameHour,
                StartGameMinute:cstate.StartGameMinute,
                StartGameSecond:cstate.StartGameSecond
            }
        });
    }

    /**
     * Triggered when the user clicks the 'Submit' button to reset the jam.
     */
    onClickSubmit() {
        ScoreboardController.ResetJam();
        if(this.props.onClose)
            this.props.onClose();
    }

    /**
     * Triggered when the component is about to be mounted.
     */
    componentWillMount() {
        this.Buttons = [
            <IconButton
                key="button-submit"
                onClick={ScoreboardController.ResetJam}
                src={require('images/icons/check.png')}
                >Yes</IconButton>,
            <IconButton
                key="button-cancel"
                onClick={this.props.onClose}
                src={require('images/icons/no.png')}
                >No</IconButton>
        ];
    }

    /**
     * Renders the component.
     */
    render() {
        var startClock = `
            ${this.state.StartGameHour.toString().padStart(2,'0')}:
            ${this.state.StartGameMinute.toString().padStart(2,'0')}:
            ${this.state.StartGameSecond.toString().padStart(2,'0')}
            `;

        return (
            <Panel 
                opened={this.props.opened}
                buttons={this.Buttons}
                popup={true}
                className="jam-reset-panel"
                contentName="jam-reset"
                >
                <p>
                    Reset the jam to the time below?
                </p>
                <h1>{startClock}</h1>
            </Panel>
        );
    }
}

export default JamReset;