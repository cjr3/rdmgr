import React from 'react'
import cnames from 'classnames'
import './css/Counter.scss'

class Counter extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            amount:(this.props.amount) ? this.props.amount : 0,
            min:0,
            max:999
        };

        //bindings
        this.onClick = this.onClick.bind(this);
        this.onContextMenu = this.onContextMenu.bind(this);
    }

    add(amount) {
        this.setState((state) => {
            return {amount:this._value(state.amount + amount)};
        }, (state) => {
            //if(this.props.onChange)
                //this.props.onChange(this.state.amount);
            if(this.props.onAdd)
                this.props.onAdd(amount);
        });
    }

    subtract(amount) {
        this.setState((state) => {
            return {amount:this._value(state.amount - amount)};
        }, (state) => {
            //if(this.props.onChange)
                //this.props.onChange(this.state.amount);
            if(this.props.onSubtract)
                this.props.onSubtract(amount);
        });
    }

    set(amount, trigger) {
        this.setState((state) => {
            return {amount:this._value(amount)};
        }, (state) => {
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

    componentDidUpdate(prevProps) {
        if(typeof(prevProps.value) === "number") {
            if(prevProps.value !== this.props.value && this.props.value !== this.state.amount) {
                this.set(this.props.value, false);
            }
        }
    }

    /**
     * Renders the component.
     */
    render() {
        const classes = cnames({counter:true}, this.props.className);
        var value = this.state.amount;
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

export default Counter;