import React from 'react'
import Counter from 'components/tools/Counter'
import {Icon, IconSubtract} from 'components/Elements'
import ScoreboardController, {SScoreboardTeam} from 'controllers/ScoreboardController'

/**
 * Component for team challenges.
 */
export default class Challenges extends React.PureComponent<{
    /**
     * Team, from the scoreboard controller
     */
    Team:SScoreboardTeam;
}, {
    /**
     * Amount of challenges
     */
    amount:number;
}> {
    readonly state = {
        amount:3
    }

    /**
     * Reference to counter component
     */
    protected CounterItem:React.RefObject<Counter> = React.createRef();

    /**
     * Listener for scoreboard controller
     */
    protected remoteScoreboard:Function|null = null;

    constructor(props) {
        super(props);
        this.state.amount = this.props.Team.Challenges;

        //bindings
        this.onChange = this.onChange.bind(this);
        this.onAdd = this.onAdd.bind(this);
        this.onSubtract = this.onSubtract.bind(this);
        this.updateState = this.updateState.bind(this);
        //this.remoteScoreboard = ScoreboardController.subscribe(this.updateState);
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
     * Triggered when the user adds challenges
     * @param amount number
     */
    onAdd(amount:number) {
        ScoreboardController.IncreaseTeamChallenges(this.props.Team, amount);
    }

    /**
     * Triggered when the user subtracts challenges
     * @param amount number
     */
    onSubtract(amount:number) {
        ScoreboardController.DecreaseTeamChallenges(this.props.Team, amount);
    }

    /**
     * Triggered when the component mounts to the DOM.
     * - Start listeners
     * - Set value on counter
     */
    componentDidMount() {
        this.remoteScoreboard = ScoreboardController.subscribe(this.updateState);

        if(this.CounterItem !== null && this.CounterItem.current !== null) {
            this.CounterItem.current.set(this.state.amount, false);
        }
    }

    /**
     * Close listeners
     */
    componentWillUnmount() {
        if(this.remoteScoreboard !== null)
            this.remoteScoreboard();
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
                        onAdd={this.onAdd}
                        onSubtract={this.onSubtract}
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