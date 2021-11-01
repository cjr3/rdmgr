import React from 'react';
import { Unsubscribe } from 'redux';
import { MainController } from 'tools/MainController';

interface Props {

}

interface State {
    value:number;
}

class Main extends React.PureComponent<Props, State> {
    readonly state:State = {
        value:0
    }

    protected remote?:Unsubscribe;

    protected update = () => {
        this.setState({value:MainController.GetState().Scoreboard.JamNumber || 0});
    }

    componentDidMount() {
        this.remote = MainController.Subscribe(this.update);
    }

    componentWillUnmount() {
        if(this.remote)
            this.remote();
    }
    
    render() {
        return <span className='jam-counter'>#{this.state.value.toString().padStart(2, '0')}</span>;
    }
}

export {Main as JamCounter};