import React, { useEffect, useState } from 'react';
import cnames from 'classnames';
import { ClockState, ClockStatus, ClockType } from 'tools/vars';

interface Props extends ClockState, React.HTMLProps<HTMLSpanElement> {
    /**
     * True to show tenths
     */
    showTenths:boolean;
    /**
     * Determines how the clock text is displayed
     */
    clockType:ClockType;
}

/**
 * Displays a clock time.
 * @param props 
 * @returns 
 */
const ClockView:React.FunctionComponent<Props> = props => {
    const {Hours, clockType, showTenths, Minutes, Seconds, Tenths, Status, ...rprops} = {...props};
    const [text, setText] = React.useState('');
    const [className, setClassName] = React.useState('clock-view');
    React.useEffect(() => {
        let parts:string[] = [];
        let hour = Hours || 0;
        let minute = Minutes || 0;
        let second = Seconds || 0;
        let tenths = Tenths || 0;
        if(clockType === 'clock') {
            if(hour > 0)
                parts.push(hour.toString().padStart(2,'0'));
            parts.push(minute.toString().padStart(2,'0'));
        }
        
        parts.push(second.toString().padStart(2,'0'));
        let text = parts.join(':');
        if(showTenths)
            text += '.' + tenths;
        setText(text);
    }, [Hours, Minutes, Seconds, Tenths, showTenths, clockType]);

    React.useEffect(() => {
        setClassName(cnames('clock-view', {
            running:Status === ClockStatus.RUNNING,
            stopped:Status === ClockStatus.STOPPED
        }))
    }, [Status])

    return <span {...rprops} className={cnames(className, rprops.className)}>{text}</span>;
}

export {ClockView};