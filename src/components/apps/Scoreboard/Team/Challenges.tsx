import React from 'react'
import Counter from 'components/tools/Counter'
import {Icon, IconSubtract, IconPlus} from 'components/Elements'
import ScoreboardController from 'controllers/ScoreboardController'
import { Unsubscribe } from 'redux'

/**
 * Component for team challenges.
 */
export default class Challenges extends React.PureComponent<{
    side:string;
}, {
    /**
     * Amount of challenges
     */
    amount:number;
    /**
     * Maximum number of challenges
     */
    max:number;
}> {
    readonly state = {
        amount:ScoreboardController.GetState().MaxChallenges,
        max:ScoreboardController.GetState().MaxChallenges
    }

    /**
     * Reference to counter component
     */
    protected CounterItem:React.RefObject<Counter> = React.createRef();

    /**
     * Listener for scoreboard controller
     */
    protected remoteScoreboard?:Unsubscribe;

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.onAdd = this.onAdd.bind(this);
        this.onSubtract = this.onSubtract.bind(this);
        this.updateState = this.updateState.bind(this);
    }

    /**
     * Updates the state to match the controller.
     */
    protected updateState() {
        this.setState(() => {
            var cstate = ScoreboardController.GetState();
            var amount = cstate.TeamA.Challenges;
            if(this.props.side === 'B')
                amount = cstate.TeamB.Challenges;
            
            if(this.CounterItem !== null && this.CounterItem.current !== null)
                this.CounterItem.current.set(amount, false);
            return {
                amount:amount,
                max:cstate.MaxChallenges
            };
        });
    }
    
    /**
     * Triggered when the counter changes.
     * @param {Number} amount 
     */
    protected onChange(amount) {
        this.setState(() => {
            return {amount:amount}
        }, () => {
            ScoreboardController.SetTeamChallenges(this.props.side, amount);
        });
    }

    /**
     * Triggered when the user adds challenges
     * @param amount number
     */
    protected onAdd(amount:number) {
        ScoreboardController.IncreaseTeamChallenges(this.props.side, amount);
    }

    /**
     * Triggered when the user subtracts challenges
     * @param amount number
     */
    protected onSubtract(amount:number) {
        ScoreboardController.DecreaseTeamChallenges(this.props.side, amount);
    }

    /**
     * Triggered when the component mounts to the DOM.
     * - Start listeners
     * - Set value on counter
     */
    componentDidMount() {
        this.remoteScoreboard = ScoreboardController.Subscribe(this.updateState);

        if(this.CounterItem !== null && this.CounterItem.current !== null) {
            this.CounterItem.current.set(this.state.amount, false);
        }
    }

    /**
     * Close listeners
     */
    componentWillUnmount() {
        if(this.remoteScoreboard)
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
                        max={this.state.max}
                        amount={this.state.max}
                        padding={2}
                        onAdd={this.onAdd}
                        onSubtract={this.onSubtract}
                        ref={this.CounterItem}
                    />
                </div>
                <div className="icons">
                    <Icon 
                        src={IconPlus}
                        onClick={() => {
                            ScoreboardController.IncreaseTeamChallenges(this.props.side, 1);
                        }}
                        />
                    <Icon 
                        src={IconSubtract}
                        onClick={() => {
                            ScoreboardController.DecreaseTeamChallenges(this.props.side, 1);
                        }}
                        />
                </div>
            </div>
        )
    }
}