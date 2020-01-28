import React from 'react'
import Counter from 'components/tools/Counter'
import {Icon, IconPlus, IconSubtract} from 'components/Elements'
import ScoreboardController from 'controllers/ScoreboardController'
import { Unsubscribe } from 'redux'

/**
 * Component for team jam points entry.
 */
export default class JamPoints extends React.PureComponent<{
    side:string;
}, {
    /**
     * Number of jam points
     */
    amount:number;
}> {
    readonly state = {
        amount:0
    }

    /**
     * Reference to Counter item
     */
    protected CounterItem:React.RefObject<Counter> = React.createRef()

    /**
     * ScoreboardController listener
     */
    protected remoteScoreboard?:Unsubscribe;

    /**
     * Constructor
     * @param props 
     */
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
            var amount = ScoreboardController.GetState().TeamA.JamPoints;
            if(this.props.side === 'B')
                amount = ScoreboardController.GetState().TeamB.JamPoints;
            if(this.CounterItem !== null && this.CounterItem.current !== null)
                this.CounterItem.current.set(amount, false);
            return {amount:amount};
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
            ScoreboardController.SetTeamJamPoints(this.props.side, amount);
        });
    }

    /**
     * Triggered when the user adds jam points
     * @param amount number
     */
    protected onAdd(amount) {
        ScoreboardController.IncreaseTeamJamPoints(this.props.side, amount);
    }

    /**
     * Triggered when the user subtracts jam points
     * @param amount number
     */
    protected onSubtract(amount) {
        ScoreboardController.DecreaseTeamJamPoints(this.props.side, amount);
    }

    /**
     * Triggered when the component mounts to the DOM.
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
                <div>Jam Points</div>
                <div>
                    <Counter
                        min={-99}
                        max={99}
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
                            ScoreboardController.IncreaseTeamJamPoints(this.props.side, 1);
                        }}
                        />
                    <Icon 
                        src={IconSubtract}
                        onClick={() => {
                            ScoreboardController.DecreaseTeamJamPoints(this.props.side, 1);
                        }}
                        />
                </div>
            </div>
        )
    }
}