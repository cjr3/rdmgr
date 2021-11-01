import React from 'react';
import { Unsubscribe } from 'redux';
import { Scoreboard } from 'tools/scoreboard/functions';
import { ScoreboardStatus } from 'tools/vars';

interface Props {

}

interface State {
    status:number;
}

class Main extends React.PureComponent<Props, State> {
    readonly state:State = {
        status:ScoreboardStatus.NORMAL
    }

    protected remote?:Unsubscribe;

    protected update = () => {
        this.setState({
            status:Scoreboard.GetState().BoardStatus || ScoreboardStatus.NORMAL
        })
    }

    protected onClick = () => Scoreboard.SetStatus(ScoreboardStatus.NORMAL);

    componentDidMount() {
        this.remote = Scoreboard.Subscribe(this.update);
        this.update();
    }

    componentWillUnmount() {
        if(this.remote)
            this.remote();
    }

    render() {
        return <div 
            className='status' 
            style={{backgroundColor:Scoreboard.GetStatusBackground()}}
            onClick={this.onClick}
            >
            {Scoreboard.GetStatusLabel()}
        </div>
    }
}

export {Main as ScoreboardStatusLabel};