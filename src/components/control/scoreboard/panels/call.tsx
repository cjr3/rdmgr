import classNames from 'classnames';
import { Panel, PanelContent, PanelTitle } from 'components/common/panel';
import React from 'react';
import { Unsubscribe } from 'redux';
import { Scoreboard } from 'tools/scoreboard/functions';
import { ScoreboardStatus } from 'tools/vars';

interface Props {
    active:boolean;
    onHide:{():void};
}

interface State {
    status:number;
}

interface ButtonProps {
    active:boolean;
    label:string;
    status:ScoreboardStatus;
    onHide:{():void}
}


class Main extends React.PureComponent<Props, State> {
    readonly state:State = {
        status:Scoreboard.GetState().BoardStatus || ScoreboardStatus.NORMAL
    }

    protected remote?:Unsubscribe;

    protected update = () => {
        this.setState({
            status:Scoreboard.GetState().BoardStatus || ScoreboardStatus.NORMAL
        })
    }

    protected onClickConfirm = () => Scoreboard.ToggleConfirmStatus();

    componentDidMount() {
        this.remote = Scoreboard.Subscribe(this.update);
    }

    componentWillUnmount() {
        if(this.remote)
            this.remote();
    }

    render() {
        return <Panel
            active={this.props.active}
            onHide={this.props.onHide}
            style={{width:'300px'}}
        >
            <PanelTitle onHide={this.props.onHide}>Issue Call</PanelTitle>
            <PanelContent className='pad-6'>
                <ScoreboardButton
                    active={this.state.status === ScoreboardStatus.INJURY}
                    label='INJURY'
                    status={ScoreboardStatus.INJURY}
                    onHide={this.props.onHide}
                />
                <ScoreboardButton
                    active={this.state.status === ScoreboardStatus.REVIEW}
                    label='REVIEW'
                    status={ScoreboardStatus.REVIEW}
                    onHide={this.props.onHide}
                />
                <ScoreboardButton
                    active={this.state.status === ScoreboardStatus.TIMEOUT}
                    label='TIMEOUT'
                    status={ScoreboardStatus.TIMEOUT}
                    onHide={this.props.onHide}
                />
                <ScoreboardButton
                    active={this.state.status === ScoreboardStatus.UPHELD}
                    label='UPHELD'
                    status={ScoreboardStatus.UPHELD}
                    onHide={this.props.onHide}
                />
                <ScoreboardButton
                    active={this.state.status === ScoreboardStatus.OVERTURNED}
                    label='OVERTURNED'
                    status={ScoreboardStatus.OVERTURNED}
                    onHide={this.props.onHide}
                />
                
                <ScoreboardButton
                    active={false}
                    label='CLEAR'
                    status={ScoreboardStatus.NORMAL}
                    onHide={this.props.onHide}
                />
            </PanelContent>
        </Panel>
    }
}

const ScoreboardButton:React.FunctionComponent<ButtonProps> = props => {
    return <div 
        className={classNames('button text-left', {
            active:props.active
        })}
        onClick={() => {
            Scoreboard.SetStatus(props.status);
            props.onHide();
        }}
        >
        {props.label}
    </div>;
};

export {Main as CallPanel};