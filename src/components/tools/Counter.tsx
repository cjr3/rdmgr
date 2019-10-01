import React, { CSSProperties } from 'react'
import cnames from 'classnames'
import './css/Counter.scss'

/**
 * Component for counters
 */
export default class Counter extends React.Component<{
    /**
     * Minimum amount
     */
    min:number;
    /**
     * Maximum amount
     */
    max:number;
    /**
     * Style
     */
    style?:CSSProperties;
    /**
     * Current value
     */
    value?:number;
    /**
     * Initial amount
     */
    amount?:number;
    /**
     * Number of digits to pad
     */
    padding?:number;
    /**
     * Additional class names
     */
    className?:string;
    /**
     * Triggered when the counter adds an amount
     */
    onAdd?:Function;
    /**
     * Triggered when the counter subtracts an amount
     */
    onSubtract?:Function;
    /**
     * Triggered when the counter value changes
     */
    onChange?:Function;
}, {
    /**
     * Current amount
     */
    amount:number;
}> {
    readonly state = {
        amount:0
    }

    /**
     * Constructor
     * @param props 
     */
    constructor(props) {
        super(props);

        if(this.props.amount)
            this.state.amount = this.props.amount;

        //bindings
        this.onClick = this.onClick.bind(this);
        this.onContextMenu = this.onContextMenu.bind(this);
    }

    /**
     * Adds an amount to the counter
     * @param amount number
     */
    add(amount:number) {
        this.setState((state) => {
            return {amount:this._value(state.amount + amount)};
        }, () => {
            if(this.props.onAdd)
                this.props.onAdd(amount);
        });
    }

    /**
     * Subtracts an amount
     * @param amount number
     */
    subtract(amount:number) {
        this.setState((state) => {
            return {amount:this._value(state.amount - amount)};
        }, () => {
            if(this.props.onSubtract)
                this.props.onSubtract(amount);
        });
    }

    /**
     * Sets the value of the counter
     * @param amount number
     * @param trigger boolean
     */
    set(amount:number, trigger:boolean = false) {
        this.setState(() => {
            return {amount:this._value(amount)};
        }, () => {
            if(this.props.onChange && trigger)
                this.props.onChange(this.state.amount);
        });
    }

    /**
     * Adjusts the amount to fit within the min/max of the counter.
     * @param {Number} amount 
     */
    _value(amount) {
        if(amount > this.props.max) 
            return this.props.max;
        else if(amount < this.props.min)
            return this.props.min;
        return amount;
    }

    /**
     * Triggered when the user clicks the counter.
     * @param {MouseEvent} ev 
     */
    onClick(ev) {
        ev.stopPropagation();
        ev.preventDefault();
        if(ev.ctrlKey && ev.shiftKey)
            this.set(0, true);
        else if(ev.shiftKey)
            this.subtract(1);
        else
            this.add(1);
    }

    /**
     * Triggered when the user right-clicks the counter.
     * @param {MouseEvent} ev 
     */
    onContextMenu(ev) {
        ev.stopPropagation();
        ev.preventDefault();
        this.subtract(1);
    }

    /**
     * Triggered when the component updates
     * @param prevProps 
     */
    componentDidUpdate(prevProps) {
        if(typeof(prevProps.value) === "number") {
            if(prevProps.value !== this.props.value && this.props.value !== this.state.amount) {
                if(this.props.value !== undefined)
                    this.set(this.props.value, false);
            }
        }
    }

    /**
     * Renders the component.
     */
    render() {
        let classes:string = cnames({counter:true}, this.props.className);
        let value:number|string = this.state.amount;
        if(this.props.padding)
            value = value.toString().padStart(this.props.padding, '0');

        return (
            <div className={classes}
                onClick={this.onClick}
                style={this.props.style}
                onContextMenu={this.onContextMenu}>
                {value}
            </div>
        )
    }
}