import React from 'react';
import { SlideAnimationType } from 'tools/vars';
import { NumberInput } from '../inputs/numberinput';
import { TextInput } from '../inputs/textinput';

interface Props {
    duration:number;
    enabled:boolean;
    hideAnimation:SlideAnimationType;
    hideDuration:number;
    name:string;
    showAnimation:SlideAnimationType;
    showDuration:number;
    onChangeDuration:{(value:number):void};
    onChangeEnabled:{(value:boolean):void};
    onChangeHideAnimation:{(value:SlideAnimationType):void};
    onChangeHideDuration:{(value:number):void};
    onChangeShowAnimation:{(value:SlideAnimationType):void};
    onChangeShowDuration:{(value:number):void};
    onChangeName:{(value:string):void};
}

/**
 * Main component for editing a slideshow.
 * @param props 
 * @returns 
 */
const SlideEditor:React.FunctionComponent<Props> = props => {
    const onChangeEnabled = React.useCallback((ev:React.ChangeEvent<HTMLInputElement>) => {
        ev.stopPropagation();
        props.onChangeEnabled(!props.enabled);
    }, [props.onChangeEnabled, props.enabled]);
    return <table className='table'>
        <tbody>
            <tr>
                <td colSpan={3}>Name</td>
            </tr>
            <tr>
                <td colSpan={3}>
                    <TextInput value={props.name} onChangeValue={props.onChangeName}/>
                </td>
            </tr>
            <tr>
                <td>Length</td>
                <td colSpan={2}>
                    <NumberInput
                        size={10}
                        value={props.duration}
                        onChangeValue={props.onChangeDuration}
                        min={0}
                        max={120}
                    />
                </td>
            </tr>
            <tr>
                <td>Show</td>
                <td>
                    <AnimationSelection
                        value={props.showAnimation}
                        onChange={props.onChangeShowAnimation}
                    />
                </td>
                <td>
                        <NumberInput
                            size={10}
                            value={props.showDuration}
                            onChangeValue={props.onChangeShowDuration}
                            min={0}
                            max={10}
                        />
                </td>
            </tr>
            <tr>
                <td>Hide</td>
                <td>
                    <AnimationSelection
                        value={props.hideAnimation}
                        onChange={props.onChangeHideAnimation}
                    />
                </td>
                <td>
                    <NumberInput
                        size={10}
                        value={props.hideDuration}
                        onChangeValue={props.onChangeHideDuration}
                        min={0}
                        max={10}
                    />
                </td>
            </tr>
            <tr>
            </tr>
            <tr>
                <td colSpan={3}>
                    <label>
                        <input type='checkbox'
                            checked={props.enabled}
                            onChange={onChangeEnabled}
                            /> Enabled
                    </label>
                </td>
            </tr>
        </tbody>
    </table>
}

/**
 * Determines how the slide is animated.
 * @param props 
 * @returns 
 */
const AnimationSelection:React.FunctionComponent<{
    value:SlideAnimationType;
    onChange:{(value:SlideAnimationType):void};
}> = props => {
    const onChange = React.useCallback((ev:React.ChangeEvent<HTMLSelectElement>) => {
        let value:any = ev.currentTarget.value;
        props.onChange(value);
    }, [props.onChange]);
    return <select size={1} value={props.value} onChange={onChange}>
        <option value=''>(Default - Fade w/black)</option>
        <option value='cut'>Cut (instant)</option>
        <option value='fade'>Fade w/black</option>
        <option value='move-north'>Slide Up</option>
        <option value='move-west'>Slide Left</option>
        <option value='move-east'>Slide Right</option>
        <option value='move-south'>Slide Down</option>
    </select>
}

export {SlideEditor};