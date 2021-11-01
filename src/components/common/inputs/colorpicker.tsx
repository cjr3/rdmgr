import React from 'react';

interface Props extends React.HTMLProps<HTMLInputElement> {
    onChangeValue:{(value:string):void};
}

const ColorPicker:React.FunctionComponent<Props> = props => {
    const {onChangeValue, ...rprops} = {...props};

    const onChange = React.useCallback((ev:React.ChangeEvent<HTMLInputElement>) => {
        onChangeValue(ev.currentTarget.value)
    }, [onChangeValue]);

    return <input onChange={onChange} {...rprops} type='color'/>
};

export {ColorPicker};