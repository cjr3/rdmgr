import React from 'react'
import Counter from 'components/tools/Counter'
import {Icon} from 'components/Elements'
import ScoreboardController from 'controllers/ScoreboardController'

class JamCounter extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            JamCounter:ScoreboardController.getState().JamCounter
        }
        this.Counter = React.createRef();
        this.onChange = this.onChange.bind(this);
        this.updateState = this.updateState.bind(this);
        this.remote = ScoreboardController.subscribe(this.updateState);
    }

    /**
     * Updates the state to match the controller.
     */
    updateState() {
        this.setState(() => {
            return {JamCounter:ScoreboardController.getState().JamCounter}
        }, () => {
            this.Counter.current.set(this.state.JamCounter, false);
        });
    }

    /**
     * Triggered when the user changes the counter's value.
     * @param {Number} amount The new amount
     */
    onChange(amount) {
        this.setState(() => {
            return {JamCounter:amount}
        }, ()=> {
            ScoreboardController.SetJamCounter(this.state.JamCounter);
        });
    }

    /**
     * Renders the component
     */
    render() {
        return (
            <tr>
                <td>JAM #</td>
                <td>
                    <Counter
                        min={0}
                        max={99}
                        padding={2}
                        onChange={this.onChange}
                        ref={this.Counter}
                    />
                </td>
                <td>
                    <Icon 
                        src={require('images/icons/minus.png')}
                        onClick={() => {
                            this.Counter.current.subtract(1);
                        }}
                        onContextMenu={() => {
                            this.Counter.current.add(1);
                        }}
                        />
                </td>
            </tr>
        )
    }
}

export default JamCounter;