import React from 'react'
import Counter from 'components/tools/Counter'
import {Icon, IconSubtract} from 'components/Elements'
import ScoreboardController from 'controllers/ScoreboardController'

/**
 * Component for displaying the jam number on the scoreboard control
 */
export default class JamCounter extends React.PureComponent<any, {
    /**
     * Current Jam #
     */
    amount:number;
}> {
    readonly state = {
        amount:ScoreboardController.GetState().JamCounter
    }

    /**
     * Counter reference
     */
    protected CounterItem:React.RefObject<Counter> = React.createRef();
    /**
     * ScoreboardContorller listener
     */
    protected remoteScore:Function|null = null;

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
            return {amount:ScoreboardController.GetState().JamCounter}
        }, () => {
            if(this.CounterItem !== null && this.CounterItem.current !== null) {
                this.CounterItem.current.set(this.state.amount, false);
            }
        });
    }

    /**
     * Triggered when the user changes the counter's value.
     * @param {Number} amount The new amount
     */
    onChange(amount) {
        this.setState(() => {
            return {amount:amount}
        }, ()=> {
            ScoreboardController.SetJamCounter(this.state.amount);
        });
    }

    /**
     * Triggered when the user increase the counter
     * @param amount Amount added
     */
    onAdd(amount:number) {
        ScoreboardController.IncreaseJamCounter(amount);
    }

    /**
     * Triggered when the user decreases the counter
     * @param amount Amount subtracted
     */
    onSubtract(amount:number) {
        ScoreboardController.DecreaseJamCounter(amount);
    }

    /**
     * Start listeners
     */
    componentDidMount() {
        this.remoteScore = ScoreboardController.Subscribe(this.updateState);
    }

    /**
     * Close listeners
     */
    componentWillUnmount() {
        if(this.remoteScore !== null)
            this.remoteScore();
    }

    /**
     * Renders the component
     */
    render() {
        return (
            <tr className="jam-counter">
                <td>JAM #</td>
                <td>
                    <Counter
                        min={0}
                        max={99}
                        padding={2}
                        onAdd={this.onAdd}
                        onSubtract={this.onSubtract}
                        ref={this.CounterItem}
                    />
                </td>
                <td>
                    <Icon 
                        src={IconSubtract}
                        onClick={() => {
                            if(this.CounterItem !== null && this.CounterItem.current !== null)
                                this.CounterItem.current.subtract(1);
                        }}
                        onContextMenu={() => {
                            if(this.CounterItem !== null && this.CounterItem.current !== null)
                                this.CounterItem.current.add(1);
                        }}
                        title="Add ( + ) or Subtract ( - ) Jam #"
                        />
                </td>
            </tr>
        )
    }
}