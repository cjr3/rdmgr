import React from 'react'
import Counter from 'components/tools/Counter'
import {Icon, IconSubtract} from 'components/Elements'
import ScoreboardController, {SScoreboardTeam} from 'controllers/ScoreboardController'

interface STimeouts {
    amount:number
}

export interface PTimeouts {
    /**
     * Team the timeouts belongs to
     */
    Team:SScoreboardTeam
}

/**
 * Component for controlling team timeout value
 */
class Timeouts extends React.PureComponent<PTimeouts, STimeouts> {
    readonly state:STimeouts = {
        amount:3
    }

    /**
     * Reference for counter component
     */
    protected CounterItem:React.RefObject<Counter> = React.createRef();
    /**
     * Listener for scoreboard controller
     */
    protected remoteScore:Function

    /**
     * Constructor
     * @param props PTimeouts
     */
    constructor(props) {
        super(props);
        this.state.amount = this.props.Team.Timeouts;
        this.state = {
            amount:(this.props.Team) ? this.props.Team.Timeouts : 0
        }

        //bindings
        this.onChange = this.onChange.bind(this);
        this.onAdd = this.onAdd.bind(this);
        this.onSubtract = this.onSubtract.bind(this);
        this.updateState = this.updateState.bind(this);
        this.remoteScore = ScoreboardController.subscribe(this.updateState);
    }

    /**
     * Updates the state to match the controller.
     */
    updateState() {
        this.setState(() => {
            var cstate = ScoreboardController.getState();
            var amount = cstate.TeamA.Timeouts;
            if(this.props.Team.Side === 'B')
                amount = cstate.TeamB.Timeouts;
            
            if(this.CounterItem !== null && this.CounterItem.current !== null) {
                this.CounterItem.current.set(amount, false);
            }
            return {amount:amount};
        });
    }
    
    /**
     * Triggered when the amount changes.
     * @param {Number} amount 
     */
    onChange(amount) {
        this.setState(() => {
            return {amount:amount}
        }, () => {
            ScoreboardController.SetTeamTimeouts(this.props.Team, amount);
        });
    }

    /**
     * Triggered when the user adds challenges
     * @param amount number
     */
    onAdd(amount:number) {
        ScoreboardController.IncreaseTeamTimeouts(this.props.Team, amount);
    }

    /**
     * Triggered when the user subtracts challenges
     * @param amount number
     */
    onSubtract(amount:number) {
        ScoreboardController.DecreaseTeamTimeouts(this.props.Team, amount);
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
                <div>Timeouts</div>
                <div>
                    <Counter
                        min={0}
                        max={3}
                        amount={3}
                        padding={2}
                        //onChange={this.onChange}
                        onAdd={this.onAdd}
                        onSubtract={this.onSubtract}
                        ref={this.CounterItem}
                    />
                </div>
                <div>
                    <Icon 
                        src={IconSubtract}
                        onClick={() => {
                            ScoreboardController.DecreaseTeamTimeouts(this.props.Team, 1);
                        }}
                        onContextMenu={() => {
                            ScoreboardController.IncreaseTeamTimeouts(this.props.Team, 1);
                        }}
                        />
                </div>
            </div>
        )
    }
}

export default Timeouts;