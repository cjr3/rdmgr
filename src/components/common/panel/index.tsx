import classNames from 'classnames';
import React from 'react';
import { IconX } from '../icons';

interface Props extends React.HTMLProps<HTMLDivElement> {
    active:boolean;
    onHide:{():void};
}

/**
 * Display a popup panel for small forms / actions.
 * @param props 
 * @returns 
 */
const Panel:React.FunctionComponent<Props> = props => {
    const {active, onHide, children, ...rprops} = {...props};
    const onClick = React.useCallback((ev:React.MouseEvent<HTMLDivElement>) => {
        ev.stopPropagation();
    }, []);
    return <>
        {
            (active) &&
            <PanelContainer active={active} onHide={onHide}/>
        }
        <div 
            {...rprops} 
            className={classNames('panel', props.className, {
                active:active
            })}
            onClick={onClick}
            onContextMenu={onClick}
            >
            <PanelBody>{children}</PanelBody>
        </div>
    </>
};

/**
 * Display body of panel.
 * @param props 
 * @returns 
 */
const PanelBody:React.FunctionComponent<React.HTMLProps<HTMLDivElement>> = props => {
    const onContextMenu = React.useCallback((ev:React.MouseEvent<HTMLDivElement>) => {
        ev.preventDefault();
        ev.stopPropagation();
    }, []);

    const onClick = React.useCallback((ev:React.MouseEvent<HTMLDivElement>) => {
        ev.stopPropagation();
    }, []);

    return <div className='panel-body' onClick={onClick} onContextMenu={onContextMenu}>{props.children}</div>
};

/**
 * Display content of a panel.
 * @param props 
 * @returns 
 */
const PanelContent:React.FunctionComponent<React.HTMLProps<HTMLDivElement>> = props => {
    return <div {...props} className={classNames('panel-content', props.className)}>{props.children}</div>
};

/**
 * Display title of panel
 * @param props 
 * @returns 
 */
const PanelTitle:React.FunctionComponent<{
    onHide:{():void}
}> = props => {
    const onContextMenu = React.useCallback((ev:React.MouseEvent<HTMLDivElement>) => {
        ev.preventDefault();
        ev.stopPropagation();
    }, []);

    const onClick = React.useCallback((ev:React.MouseEvent<HTMLDivElement>) => {
        ev.stopPropagation();
    }, []);

    return <div 
        className='panel-title'
        onClick={onClick}
        onContextMenu={onContextMenu}>
            <span className='title'>
                {props.children}
            </span>
            <IconX title='Close' onClick={props.onHide}/>
    </div>
};

/**
 * Display footer
 * @param props 
 * @returns 
 */
const PanelFooter:React.FunctionComponent<{}> = props => {
    const onContextMenu = React.useCallback((ev:React.MouseEvent<HTMLDivElement>) => {
        ev.preventDefault();
        ev.stopPropagation();
    }, []);

    const onClick = React.useCallback((ev:React.MouseEvent<HTMLDivElement>) => {
        ev.stopPropagation();
    }, []);

    return <div className='panel-footer' onClick={onClick} onContextMenu={onContextMenu}>
        {props.children}
    </div>
};

const PanelContainer:React.FunctionComponent<Props> = props => {
    const onContextMenu = React.useCallback((ev:React.MouseEvent<HTMLDivElement>) => {
        ev.preventDefault();
        ev.stopPropagation();
    }, []);

    const onClick = React.useCallback((ev:React.MouseEvent<HTMLDivElement>) => {
        ev.stopPropagation();
        props.onHide();
    }, [props.onHide]);
    return <div 
        className={classNames('panel-container', {active:props.active})}
        onClick={onClick}
        onContextMenu={onContextMenu}
        >
        {props.children}
    </div>
}

export {
    Panel,
    PanelContent,
    PanelFooter,
    PanelTitle
}