import React from 'react'
import Counter from 'components/tools/Counter'
import {Icon, IconPlus} from 'components/Elements'
import ScoreboardController, {SScoreboardTeam} from 'controllers/ScoreboardController'

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
    protected remoteScoreboard:Function|null = null;

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
    updateState() {
        this.setState(() => {
            var amount = ScoreboardController.getState().TeamA.JamPoints;
            if(this.props.side === 'B')
                amount = ScoreboardController.getState().TeamB.JamPoints;
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
            ScoreboardController.SetTeamJamPoints(this.props.side, amount);
        });
    }

    /**
     * Triggered when the user adds jam points
     * @param amount number
     */
    onAdd(amount) {
        ScoreboardController.IncreaseTeamJamPoints(this.props.side, amount);
    }

    /**
     * Triggered when the user subtracts jam points
     * @param amount number
     */
    onSubtract(amount) {
        ScoreboardController.DecreaseTeamJamPoints(this.props.side, amount);
    }

    /**
     * Triggered when the component mounts to the DOM.
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
                <div>
                    <Icon 
                        src={IconPlus}
                        onClick={() => {
                            ScoreboardController.IncreaseTeamJamPoints(this.props.side, 1);
                        }}
                        onContextMenu={() => {
                            ScoreboardController.DecreaseTeamJamPoints(this.props.side, 1);
                        }}
                        />
                </div>
            </div>
        )
    }
}