import { IconLeft, IconX } from 'components/common/icons';
import React from 'react';

interface Props {
    onSelect:{(value:string):void};
}

/**
 * Display buttons for raffle entry.
 * @param props 
 * @returns 
 */
const RaffleButtons:React.FunctionComponent<Props> = props => {
    const onClickX = React.useCallback(() => props.onSelect('X'), [props.onSelect]);
    const onClickDelete = React.useCallback(() => props.onSelect('L'), [props.onSelect]);

    return <div style={{
        display:'flex',
        flexFlow:'row wrap'
    }}>
        <ButtonItem digit='7' onSelect={props.onSelect}/>
        <ButtonItem digit='8' onSelect={props.onSelect}/>
        <ButtonItem digit='9' onSelect={props.onSelect}/>
        <ButtonItem digit='4' onSelect={props.onSelect}/>
        <ButtonItem digit='5' onSelect={props.onSelect}/>
        <ButtonItem digit='6' onSelect={props.onSelect}/>
        <ButtonItem digit='1' onSelect={props.onSelect}/>
        <ButtonItem digit='2' onSelect={props.onSelect}/>
        <ButtonItem digit='3' onSelect={props.onSelect}/>
        <ButtonItem digit='0' onSelect={props.onSelect}/>
        <IconX onClick={onClickX} title='Clear' style={{flex:'1 0 33%'}}/>
        <IconLeft onClick={onClickDelete} title='Delete' style={{flex:'1 0 33%'}}/>
    </div>
};

const ButtonItem:React.FunctionComponent<{
    digit:string;
    onSelect:{(value:string):void}
}> = props => {
    const onClick = React.useCallback((ev:React.MouseEvent<HTMLButtonElement>) => {
        ev.stopPropagation();
        ev.preventDefault();
        props.onSelect(props.digit);
    }, [props.digit, props.onSelect]);
    return <button onClick={onClick} style={{flex:'1 0 33%'}}>{props.digit}</button>
}

export {RaffleButtons};