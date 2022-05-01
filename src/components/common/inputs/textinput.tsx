import React from 'react';

interface Props extends React.HTMLProps<HTMLInputElement> {
    onChangeValue?:{(value:string):void};
}

interface State {
    value:string;
}

class Main extends React.PureComponent<Props, State> {
    readonly state:State = {
        value:''
    };
    
    protected onKey = (ev:React.KeyboardEvent<HTMLInputElement>) => {
        ev.stopPropagation();
    }

    protected onFocus = (ev:React.FocusEvent<HTMLInputElement>) => {
        ev.target.select();
    }

    protected onChange = (ev:React.ChangeEvent<HTMLInputElement>) => {
        let v = ev.currentTarget.value;
        this.setState({value:v});
        if(this.props.onChangeValue)
            this.props.onChangeValue(v);
    }

    render() {
        const {onChangeValue, ...rprops} = {...this.props};
        return <input
            size={30}
            className='form-control'
            onContextMenu={ev => ev.stopPropagation()}
            onChange={this.onChange}
            onFocus={this.onFocus}
            onKeyDown={this.onKey}
            onKeyUp={this.onKey}
            onKeyPress={this.onKey}
            value={this.state.value}
            {...rprops}
            type='text'
        />
    }
}

export {Main as TextInput};