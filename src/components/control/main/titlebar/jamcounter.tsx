import React from 'react';
import { Unsubscribe } from 'redux';
import { Scoreboard } from 'tools/scoreboard/functions';

interface Props {

}

interface State {
    value:number;
}

class JamCounter extends React.PureComponent<Props, State> {
    readonly state:State = {
        value:0
    }

    protected remote?:Unsubscribe;

    protected update = () => {
        this.setState({value:Scoreboard.GetState().JamNumber || 0});
    }

    componentDidMount() {
        this.remote = Scoreboard.Subscribe(this.update);
    }

    componentWillUnmount() {
        if(this.remote)
            this.remote();
    }
    
    render() {
        return <span className='jam-counter'>#{this.state.value.toString().padStart(2, '0')}</span>;
    }
}

export {JamCounter};