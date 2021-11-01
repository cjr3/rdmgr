import { TextInput } from 'components/common/inputs/textinput';
import React, { useState } from 'react';
import { Scoreboard } from 'tools/scoreboard/functions';
import { TeamSide } from 'tools/vars';

interface Props {
    side:TeamSide;
    value:string;
}

const Name:React.FunctionComponent<Props> = props => {
    const [inputActive, setInputActive] = useState(false);

    const onComplete = React.useCallback((value:string) => {
        Scoreboard.UpdateTeam(props.side, {Name:value});
        setInputActive(false);
    }, [props.side]);

    return <div className='name'
        onDoubleClick={() => setInputActive(true)}
        >
        <>
            {
                (inputActive) && <Input {...props} onComplete={onComplete}/>
            }
        </>
        {props.value}
    </div>
}

const Input:React.FunctionComponent<{
    onComplete:{(value:string):void};
} & Props> = props => {
    const [value, setValue] = useState(props.value);

    const onBlur = React.useCallback((ev:React.FocusEvent<HTMLInputElement>) => {
        let v = ev.currentTarget.value;
        props.onComplete(v);
    }, [props.onComplete]);

    const onKeyUp = React.useCallback((ev:React.KeyboardEvent<HTMLInputElement>) => {
        ev.stopPropagation();
        let v = ev.currentTarget.value;
        if(ev.keyCode === 13) {
            props.onComplete(v);
        } else if(ev.keyCode === 27) {
            props.onComplete(props.value);
        }
    }, [props.onComplete, props.value]);

    const onFocus = React.useCallback((ev:React.FocusEvent<HTMLInputElement>) => {
        ev.currentTarget.select()
    }, []);

    return <div className='input'>
        <TextInput 
            autoFocus={true}
            value={value}
            onChangeValue={setValue}
            onBlur={onBlur}
            onFocus={onFocus}
            onKeyUp={onKeyUp}
            />
        <button
            onClick={() => props.onComplete(props.value)}
        >X</button>
    </div>
}

export {Name};