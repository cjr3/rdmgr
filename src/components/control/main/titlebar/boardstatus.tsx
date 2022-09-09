import React from 'react';
import { Unsubscribe } from 'redux';
import { Scoreboard } from 'tools/scoreboard/functions';

interface Props {

}

interface State {
    status:number;
}

class BoardStatus extends React.PureComponent<Props, State> {
    readonly state:State = {
        status:0
    }

    protected remote?:Unsubscribe;

    protected update = () => {
        this.setState({status:Scoreboard.GetState().BoardStatus || 0});
    }

    componentDidMount() {
        this.remote = Scoreboard.Subscribe(this.update);
    }

    componentWillUnmount() {
        if(this.remote)
            this.remote();
    }

    render() {
        return <span className='board-status'
            style={{
                backgroundColor:Scoreboard.GetStatusBackground()
            }}
        >{Scoreboard.GetStatusLabel()}</span>
    }
}

export {BoardStatus};