import classNames from 'classnames';
import React from 'react';
import { IconHidden, IconVisible } from '../icons';

interface Props extends React.HTMLProps<HTMLDivElement> {
    active:boolean;
    label:string;
    visible?:boolean;
    onToggle?:{():void};
    onToggleVisibility?:{():void};
}

/**
 * A component with collapsable content.
 * @param props 
 * @returns 
 */
const Collapsable:React.FunctionComponent<Props> = props => {
    const {active, onToggle, onToggleVisibility, visible, label, ...rprops} = {...props};
    const onClickToggleVisibility = React.useCallback((ev:React.MouseEvent<HTMLButtonElement>) => {
        ev.stopPropagation();
        if(onToggleVisibility)
            onToggleVisibility();
    }, [onToggleVisibility]);

    const onClickToggle = React.useCallback((ev:React.MouseEvent<HTMLDivElement>) => {
        ev.stopPropagation();
        if(onToggle)
            onToggle();
    }, [onToggle]);

    return <div {...rprops} className={classNames('collapsable', rprops.className, {active:active})}>
        <div className='title' onClick={onClickToggle}>
            <IconVisible active={true} title='Hide' onClick={onClickToggleVisibility} style={{display:(visible) ? 'inline-flex' : 'none'}}/>
            <IconHidden title='Show' onClick={onClickToggleVisibility} style={{display:(!visible) ? 'inline-flex' : 'none'}}/>
            <span className='label'>{label}</span>
        </div>
        <div className='content'>
            {props.children}
        </div>
    </div>
}

export {Collapsable};