import React from 'react'
import Counter from 'components/tools/Counter'
import {Icon} from 'components/Elements'
import ScoreboardController, {SScoreboardTeam} from 'controllers/ScoreboardController'

interface STimeouts {
    amount:number
}

interface PTimeouts {
    Team:SScoreboardTeam
}

class Timeouts extends React.PureComponent<PTimeouts, STimeouts> {
    readonly state:STimeouts = {
        amount:3
    }

    CounterItem:React.RefObject<Counter> = React.createRef();
    remoteScore:Function

    constructor(props) {
        super(props);
        this.state.amount = this.props.Team.Timeouts;
        this.state = {
            amount:(this.props.Team) ? this.props.Team.Timeouts : 0
        }

        //bindings
        this.onChange = this.onChange.bind(this);
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
                        onChange={this.onChange}
                        ref={this.CounterItem}
                    />
                </div>
                <div>
                    <Icon 
                        src={require('images/icons/minus.png')}
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