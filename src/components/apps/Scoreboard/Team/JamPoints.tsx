import React from 'react'
import Counter from 'components/tools/Counter'
import {Icon, IconPlus} from 'components/Elements'
import ScoreboardController, {SScoreboardTeam} from 'controllers/ScoreboardController'

interface SJamPoints {
    amount:number
}

interface PJamPoints {
    Team:SScoreboardTeam
}

/**
 * Component for team jam points entry.
 */
class JamPoints extends React.PureComponent<PJamPoints, SJamPoints> {
    readonly state:SJamPoints = {
        amount:0
    }

    CounterItem:React.RefObject<Counter> = React.createRef()
    remoteScoreboard:Function

    constructor(props) {
        super(props);

        //bindings
        this.onChange = this.onChange.bind(this);
        this.onAdd = this.onAdd.bind(this);
        this.onSubtract = this.onSubtract.bind(this);
        this.updateState = this.updateState.bind(this);
        this.remoteScoreboard = ScoreboardController.subscribe(this.updateState);
    }

    /**
     * Updates the state to match the controller.
     */
    updateState() {
        this.setState(() => {
            var amount = ScoreboardController.getState().TeamA.JamPoints;
            if(this.props.Team.Side === 'B')
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
            ScoreboardController.SetTeamJamPoints(this.props.Team, amount);
        });
    }

    /**
     * Triggered when the user adds jam points
     * @param amount number
     */
    onAdd(amount) {
        ScoreboardController.IncreaseTeamJamPoints(this.props.Team, amount);
    }

    /**
     * Triggered when the user subtracts jam points
     * @param amount number
     */
    onSubtract(amount) {
        ScoreboardController.DecreaseTeamJamPoints(this.props.Team, amount);
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
                <div>Jam Points</div>
                <div>
                    <Counter
                        min={-99}
                        max={99}
                        padding={2}
                        //onChange={this.onChange}
                        onAdd={this.onAdd}
                        onSubtract={this.onSubtract}
                        ref={this.CounterItem}
                    />
                </div>
                <div>
                    <Icon 
                        src={IconPlus}
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