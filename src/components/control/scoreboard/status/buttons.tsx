import classNames from 'classnames';
import { IconCheck, IconX } from 'components/common/icons';
import React from 'react';
import { Unsubscribe } from 'redux';
import { Scoreboard } from 'tools/scoreboard/functions';
import { ScoreboardStatus } from 'tools/vars';

interface Props {

}

interface State {
    confirm:boolean;
    status:ScoreboardStatus;
}

interface ButtonProps {
    active:boolean;
    label:string;
    status:ScoreboardStatus;
}


class Main extends React.PureComponent<Props, State> {
    readonly state:State = {
        confirm:Scoreboard.GetState().ConfirmStatus || false,
        status:ScoreboardStatus.NORMAL
    }

    protected remote?:Unsubscribe;

    protected update = () => {
        this.setState({
            confirm:Scoreboard.GetState().ConfirmStatus || false,
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
        return <>
            {
                (this.state.confirm) &&
                <IconCheck asButton={true} active={true} onClick={this.onClickConfirm} title='Confirm changes with infield.'>Confirm</IconCheck>
            }
            {
                (!this.state.confirm) &&
                <IconX asButton={true} onClick={this.onClickConfirm} title='Confirm changes with infield.'>Confirm</IconX>
            }
            <ScoreboardButton
                active={this.state.status === ScoreboardStatus.REVIEW}
                label='REVIEW'
                status={ScoreboardStatus.REVIEW}
            />
            <ScoreboardButton
                active={this.state.status === ScoreboardStatus.TIMEOUT}
                label='TIMEOUT'
                status={ScoreboardStatus.TIMEOUT}
            />
            <ScoreboardButton
                active={this.state.status === ScoreboardStatus.UPHELD}
                label='UPHELD'
                status={ScoreboardStatus.UPHELD}
            />
            <ScoreboardButton
                active={this.state.status === ScoreboardStatus.OVERTURNED}
                label='OVERTURNED'
                status={ScoreboardStatus.OVERTURNED}
            />
        </>
    }
}


const ScoreboardButton:React.FunctionComponent<ButtonProps> = props => {
    return <div 
        className={classNames('button text-left', {
            active:props.active
        })}
        onClick={() => {
            Scoreboard.SetStatus(props.status);
        }}
        >
        {props.label}
    </div>;
};

export {Main as ScoreboardButtons};