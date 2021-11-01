import classNames from 'classnames';
import React from 'react';
import { IconMinus, IconPlus } from '../icons';

interface Props extends React.HTMLProps<HTMLDivElement> {
    amount:number;
    padding?:number;
    onAdd:{():void};
    onSubtract:{():void};
}

/**
 * Number input type
 * @param props 
 * @returns 
 */
const InputCounter:React.FunctionComponent<Props> = props => {
    const {amount, onAdd, onSubtract, ...rprops} = {...props};
    const value = (props.padding) ? amount.toString().padStart(props.padding, '0') : amount.toString();

    return <span {...rprops} className={classNames('counter-input', rprops.className)}>
        {props.children}
        <span className='value'>{value}</span>
        <IconMinus onClick={onSubtract} title='Minus 1'/>
        <IconPlus onClick={onAdd} title='Add 1'/>
    </span>
};

/**
 * Clickable input counter
 * @param props 
 * @returns 
 */
const CounterButton:React.FunctionComponent<Props> = props => {
    const {amount, onAdd, onSubtract, ...rprops} = {...props};
    const value = (props.padding) ? amount.toString().padStart(props.padding, '0') : amount.toString();
    const onClick = React.useCallback((ev:React.MouseEvent<HTMLSpanElement>) => {
        ev.stopPropagation();
        onAdd()
    }, [onAdd]);
    const onContextMenu = React.useCallback((ev:React.MouseEvent<HTMLSpanElement>) => {
        ev.preventDefault();
        ev.stopPropagation();
        onSubtract();
    }, [onSubtract]);
    return <span 
        onClick={onClick}
        onContextMenu={onContextMenu}
        title='Click Add / Right-Click Subtract'
        {...rprops} 
        className={classNames('counter-button', rprops.className)}>
        {props.children}
        <span className='value'>{value}</span>
    </span>
}

export {InputCounter, CounterButton}