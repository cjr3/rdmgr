import React, { CSSProperties } from 'react';
import Counter from 'components/tools/Counter';
import ScoreboardController, {SScoreboardTeam} from 'controllers/ScoreboardController';

/**
 * Score component for team score on the scoreboard control.
 */
export default class Score extends React.PureComponent<{
    Team:SScoreboardTeam
}, {
    amount:number
}> {
    readonly state = {
        amount:0
    }

    /**
     * Counter reference item
     */
    protected CounterItem:React.RefObject<Counter> = React.createRef();

    /**
     * ScoreboardController listener
     */
    protected remoteScore:Function|null = null;

    constructor(props) {
        super(props);
        this.state.amount = this.props.Team.Score;

        //bindings
        this.onChange = this.onChange.bind(this);
        this.onAdd = this.onAdd.bind(this);
        this.onSubtract = this.onSubtract.bind(this);
        this.updateState = this.updateState.bind(this);
        //this.remoteScore = ScoreboardController.subscribe(this.updateState);
    }

    /**
     * Updates the state to match the controller.
     */
    updateState() {
        this.setState(() => {
            var score = ScoreboardController.getState().TeamA.Score;
            if(this.props.Team.Side === 'B')
                score = ScoreboardController.getState().TeamB.Score;
            if(this.CounterItem !== null && this.CounterItem.current !== null) {
                this.CounterItem.current.set(score, false);
            }
            return {amount:score};
        });
    }

    /**
     * Triggered when the counter changes.
     * @param {Number} amount 
     */
    onChange(amount) {
        this.setState(() => {
            return {amount:amount};
        });
    }

    /**
     * Triggered when the counter increases.
     * @param {Number} amount 
     */
    onAdd(amount) {
        ScoreboardController.IncreaseTeamScore(this.props.Team, amount);
    }

    /**
     * Triggered when the counter decreases.
     * @param {Number} amount 
     */
    onSubtract(amount) {
        ScoreboardController.DecreaseTeamScore(this.props.Team, amount);
    }

    /**
     * Triggered when the component mounts to the DOM.
     */
    componentDidMount() {
        this.remoteScore = ScoreboardController.subscribe(this.updateState);
        if(this.CounterItem !== null && this.CounterItem.current !== null) {
            this.CounterItem.current.set(this.state.amount, false);
        }
    }

    /**
     * Close listeners
     */
    componentWillUnmount() {
        if(this.remoteScore !== null)
            this.remoteScore();
    }

    /**
     * Renders the component.
     */
    render() {
        var style:CSSProperties = {
            backgroundColor:this.props.Team.Color
        }

        return (
            <Counter 
                className="score"
                min={0}
                max={999}
                style={style}
                onChange={this.onChange}
                onAdd={this.onAdd}
                onSubtract={this.onSubtract}
                ref={this.CounterItem}
                {...this.props}
            />
        )
    }
}