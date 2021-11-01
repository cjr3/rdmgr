import classNames from 'classnames';
import React from 'react';
import { IconX } from '../icons';
import { TextInput } from '../inputs/textinput';

interface Props extends React.HTMLProps<HTMLDivElement> {
    onHide:{():void};
}

const Dialog:React.FunctionComponent<Props> = props => {
    const {onHide, ...rprops} = {...props};
    const onClickClose = (ev:React.MouseEvent<HTMLDivElement>) => props.onHide();
    return <>
        <div 
            className='dialog-container active'
            onClick={onClickClose}
            onContextMenu={ev => ev.preventDefault()}
        ></div>
        <div 
            onClick={ev => ev.stopPropagation()}
            onContextMenu={ev => {
                ev.preventDefault();
                ev.stopPropagation();
            }}
            {...rprops}
            className={classNames('dialog', rprops.className)}
            >
            {props.children}
        </div>
    </>
};

const DialogBody:React.FunctionComponent<React.HTMLProps<HTMLDivElement>> = props => {
    return <div
        onClick={ev => ev.stopPropagation()}
        onContextMenu={ev => {
            ev.preventDefault();
            ev.stopPropagation();
        }}
        {...props}
        className={classNames('dialog-body', props.className)}
        >
        {props.children}
    </div>
};

const DialogTitle:React.FunctionComponent<Props> = props => {
    const {onHide, ...rprops} = {...props}
    return <div
        onClick={ev => ev.stopPropagation()}
        onContextMenu={ev => {
            ev.preventDefault();
            ev.stopPropagation();
        }}
        {...rprops}
        className={classNames('dialog-title', props.className)}
        >
            <span className='title'>
                {props.children}
            </span>
            <IconX onClick={onHide} className='close-icon'/>
    </div>
};

const DialogFooter:React.FunctionComponent<React.HTMLProps<HTMLDivElement>> = props => {
    return <div
        onClick={ev => ev.stopPropagation()}
        onContextMenu={ev => {
            ev.preventDefault();
            ev.stopPropagation();
        }}
        {...props}
        className={classNames('dialog-footer', props.className)}
        >
        {props.children}
    </div>
};

/**
 * Dialog for entering a URL / file path.
 * @param props 
 * @returns 
 */
const URLDialog:React.FunctionComponent<Props & {
    value:string;
    onChangeValue:{(value:string):void};
}> = props => {
    const {onChangeValue, value, ...rprops} = {...props};
    const [url, setURL] = React.useState(value && value.toLowerCase().startsWith('http') ? value : '');
    const onClickApply = React.useCallback(() => {
        onChangeValue(url);
        props.onHide();
    }, [onChangeValue, url, props.onHide]);
    return <Dialog {...rprops} style={{
            width:'480px',
            height:'150px',
            ...rprops.style
        }}>
        <DialogTitle onHide={rprops.onHide}>Enter URL</DialogTitle>
        <DialogBody style={{overflow:'hidden'}}>
            <TextInput
                autoFocus={true}
                maxLength={2000}
                value={url}
                onChangeValue={setURL}
            />
        </DialogBody>
        <DialogFooter>
            <button onClick={onClickApply}>Apply</button>
        </DialogFooter>
    </Dialog>
}

export {
    Dialog,
    DialogBody,
    DialogFooter,
    DialogTitle,
    URLDialog
}