import React from 'react'
import Counter from 'components/tools/Counter'
import {Icon} from 'components/Elements'
import ScoreboardController from 'controllers/ScoreboardController'

/**
 * Component for team jam points entry.
 */
class JamPoints extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            amount:(this.props.Team) ? this.props.Team.JamPoints : 0
        }

        this.Counter = React.createRef();

        //bindings
        this.onChange = this.onChange.bind(this);
        this.updateState = this.updateState.bind(this);
        this.remote = ScoreboardController.subscribe(this.updateState);
    }

    /**
     * Updates the state to match the controller.
     */
    updateState() {
        this.setState(() => {
            var amount = ScoreboardController.getState().TeamA.JamPoints;
            if(this.props.Team.Side === 'B')
                amount = ScoreboardController.getState().TeamB.JamPoints;
            
            this.Counter.current.set(amount, false);
            return {amount:amount};
        });
    }

    /**
     * Triggered when the counter changes.
     * @param {Number} amount 
     */
    onChange(amount) {
        this.setState(() => {
            return {amount:amount}
        }, () => {
            ScoreboardController.SetTeamJamPoints(this.props.Team, amount);
        });
    }

    /**
     * Triggered when the component mounts to the DOM.
     */
    componentDidMount() {
        if(this.Counter.current) {
            this.Counter.current.set(this.state.amount, false);
        }
    }

    /**
     * Renders the component.
     */
    render() {
        return (
            <div>
                <div>Jam Points</div>
                <div>
                    <Counter
                        min={-99}
                        max={99}
                        padding={2}
                        onChange={this.onChange}
                        ref={this.Counter}
                    />
                </div>
                <div>
                    <Icon 
                        src={require('images/icons/plus.png')}
                        onClick={() => {
                            ScoreboardController.IncreaseTeamJamPoints(this.props.Team, 1);
                        }}
                        onContextMenu={() => {
                            ScoreboardController.DecreaseTeamJamPoints(this.props.Team, 1);
                        }}
                        />
                </div>
            </div>
        )
    }
}

export default JamPoints;