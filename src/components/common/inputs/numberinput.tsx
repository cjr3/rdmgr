import React from 'react';

interface Props extends React.HTMLProps<HTMLInputElement> {
    onChangeValue:{(value:number):void};
}

/**
 * Numeric input.
 * @param props 
 * @returns 
 */
const NumberInput:React.FunctionComponent<Props> = props => {
    const {onChangeValue, type, ...rprops} = {...props};
    const [internalValue, setInternalValue] = React.useState(rprops.value || '');
    const onChange = React.useCallback((ev:React.ChangeEvent<HTMLInputElement>) => {
        let value = ev.currentTarget.value;
        if(typeof(value) === 'string' && value.length > 0 && !Number.isNaN(value)) {
            let v = parseInt(value);
            if(typeof(props.min) === 'number')
                v = Math.max(props.min, v);
            if(typeof(props.max) === 'number')
                v = Math.min(v, props.max);
            onChangeValue(v);
        } else {
            setInternalValue('');
        }
    }, [props.min, props.max, onChangeValue]);

    React.useEffect(() => {
        let v = props.value;
        if(typeof(v) === 'string' && v.length > 0 && !Number.isNaN(v)) {
            v = parseInt(v);
            if(typeof(props.min) === 'number')
                v = Math.max(props.min, v);
            if(typeof(props.max) === 'number')
                v = Math.min(v, props.max);
        } else if(typeof(v) === 'number') {
            v = v.toString();
        }
        setInternalValue(v || '');
    }, [props.value, props.min, props.max]);

    const onKey = React.useCallback((ev:React.KeyboardEvent<HTMLInputElement>) => { ev.stopPropagation();}, []);
    const onFocus = React.useCallback((ev:React.FocusEvent<HTMLInputElement>) => ev.currentTarget.select(), []);

    return <input
        onFocus={onFocus}
        onKeyDown={onKey}
        onKeyUp={onKey}
        onKeyPress={onKey}
        {...rprops}
        value={internalValue}
        onChange={onChange}
        type='number'
        max={rprops.max}
        min={rprops.min}
    />
}

export {NumberInput};