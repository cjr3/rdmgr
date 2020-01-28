import React from 'react'
import Counter from 'components/tools/Counter'
import {Icon, IconSubtract, IconPlus} from 'components/Elements'
import ScoreboardController from 'controllers/ScoreboardController'
import { Unsubscribe } from 'redux'

/**
 * Component for controlling team timeout value
 */
class Timeouts extends React.PureComponent<{
    side:string
}, {
    /**
     * Amount of timeouts
     */
    amount:number;
    /**
     * Maximum number of timeouts
     */
    max:number;
}> {
    readonly state = {
        amount:ScoreboardController.GetState().MaxTimeouts,
        max:ScoreboardController.GetState().MaxTimeouts
    }

    /**
     * Reference for counter component
     */
    protected CounterItem:React.RefObject<Counter> = React.createRef();
    /**
     * Listener for scoreboard controller
     */
    protected remoteScore?:Unsubscribe;

    /**
     * Constructor
     * @param props PTimeouts
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
            var cstate = ScoreboardController.GetState();
            var amount = cstate.TeamA.Timeouts;
            if(this.props.side === 'B')
                amount = cstate.TeamB.Timeouts;
            
            if(this.CounterItem !== null && this.CounterItem.current !== null) {
                this.CounterItem.current.set(amount, false);
            }
            return {amount:amount, max:cstate.MaxTimeouts};
        });
    }
    
    /**
     * Triggered when the amount changes.
     * @param {Number} amount 
     */
    protected onChange(amount) {
        this.setState(() => {
            return {amount:amount}
        }, () => {
            ScoreboardController.SetTeamTimeouts(this.props.side, amount);
        });
    }

    /**
     * Triggered when the user adds challenges
     * @param amount number
     */
    protected onAdd(amount:number) {
        ScoreboardController.IncreaseTeamTimeouts(this.props.side, amount);
    }

    /**
     * Triggered when the user subtracts challenges
     * @param amount number
     */
    protected onSubtract(amount:number) {
        ScoreboardController.DecreaseTeamTimeouts(this.props.side, amount);
    }

    /**
     * Triggered when the component mounts to the DOM.
     */
    componentDidMount() {
        this.remoteScore = ScoreboardController.Subscribe(this.updateState);
    }

    /**
     * Close listeners
     */
    componentWillUnmount() {
        if(this.remoteScore)
            this.remoteScore();
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
                            ScoreboardController.IncreaseTeamTimeouts(this.props.side, 1);
                        }}
                        />
                    <Icon 
                        src={IconSubtract}
                        onClick={() => {
                            ScoreboardController.DecreaseTeamTimeouts(this.props.side, 1);
                        }}
                        />
                </div>
            </div>
        )
    }
}

export default Timeouts;