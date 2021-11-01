import React from 'react';

interface Props extends React.HTMLProps<HTMLTextAreaElement> {
    onChangeValue?:{(value:string):void};
}

/**
 * Input for blocked text.
 * @param props 
 * @returns 
 */
const TextBlock:React.FunctionComponent<Props> = props => {
    const {onChangeValue, ...rprops} = {...props};
    const [value, setValue] = React.useState('');
    const onChange = React.useCallback((ev:React.ChangeEvent<HTMLTextAreaElement>) => {
        let v = ev.currentTarget.value;
        setValue(v);
        if(onChangeValue)
            onChangeValue(v);
    }, [onChangeValue]);

    const onKey = React.useCallback((ev:React.KeyboardEvent<HTMLTextAreaElement>) => { ev.stopPropagation();}, []);
    const onFocus = React.useCallback((ev:React.FocusEvent<HTMLTextAreaElement>) => ev.currentTarget.select(), []);

    return <textarea
        rows={5}
        cols={20}
        onChange={onChange}
        onFocus={onFocus}
        onKeyDown={onKey}
        onKeyUp={onKey}
        onKeyPress={onKey}
        value={value}
        {...rprops}
    />
}

export {TextBlock};