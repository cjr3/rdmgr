import React from 'react'
import Counter from 'components/tools/Counter'
import {Icon, IconSubtract} from 'components/Elements'
import ScoreboardController, {SScoreboardTeam} from 'controllers/ScoreboardController'

interface SChallenge {
    amount:number
}

interface PChallenge {
    Team:SScoreboardTeam
}

/**
 * Component for team challenges.
 */
class Challenges extends React.PureComponent<PChallenge, SChallenge> {
    readonly state:SChallenge = {
        amount:3
    }

    CounterItem:React.RefObject<Counter> = React.createRef();

    remoteScoreboard:Function

    constructor(props) {
        super(props);
        this.state.amount = this.props.Team.Challenges;

        //bindings
        this.onChange = this.onChange.bind(this);
        this.updateState = this.updateState.bind(this);
        this.remoteScoreboard = ScoreboardController.subscribe(this.updateState);
    }

    /**
     * Updates the state to match the controller.
     */
    updateState() {
        this.setState(() => {
            var cstate = ScoreboardController.getState();
            var amount = cstate.TeamA.Challenges;
            if(this.props.Team.Side === 'B')
                amount = cstate.TeamB.Challenges;
            
            if(this.CounterItem !== null && this.CounterItem.current !== null)
                this.CounterItem.current.set(amount, false);
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
            ScoreboardController.SetTeamChallenges(this.props.Team, amount);
        });
    }

    /**
     * Triggered when the component mounts to the DOM.
     */
    componentDidMount() {
        if(this.CounterItem !== null && this.CounterItem.current !== null) {
            this.CounterItem.current.set(this.state.amount, false);
        }
    }

    /**
     * Renders the component.
     */
    render() {
        return (
            <div>
                <div>Challenges</div>
                <div>
                    <Counter
                        min={0}
                        max={3}
                        amount={3}
                        padding={2}
                        onChange={this.onChange}
                        ref={this.CounterItem}
                    />
                </div>
                <div>
                    <Icon 
                        src={IconSubtract}
                        onClick={() => {
                            ScoreboardController.DecreaseTeamChallenges(this.props.Team, 1);
                        }}
                        onContextMenu={() => {
                            ScoreboardController.IncreaseTeamChallenges(this.props.Team, 1)
                        }}
                        />
                </div>
            </div>
        )
    }
}

export default Challenges;