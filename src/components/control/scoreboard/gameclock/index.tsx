import { ClockView } from 'components/common/clock';
import { IconPause, IconPlay } from 'components/common/icons';
import React from 'react';
import { Scoreboard } from 'tools/scoreboard/functions';
import {GameClock} from 'tools/scoreboard/gameclock';
import { ClockStatus } from 'tools/vars';
import { GameClockEditor } from './editor';

interface Props {
    
}

/**
 * Component for gameclock control.
 */
class Main extends React.PureComponent<Props> {
    protected timer:any = 0;
    protected ShowTenths = false;

    protected update = async () => this.forceUpdate();

    protected onContextMenu = (ev:React.MouseEvent<HTMLElement>) => {
        ev.stopPropagation();
        ev.preventDefault();
        this.ShowTenths = !this.ShowTenths;
    }

    protected onClick = () => {
        Scoreboard.ToggleGameClock();
    }

    componentDidMount() {
        this.timer = setInterval(this.update, 100);
    }

    componentWillUnmount() {
        try {
            clearInterval(this.timer);
        } catch(er) {

        }
    }

    render() {
        return <div 
            className='game-clock'
            >
            <GameClockEditor/>
            <ClockView
                clockType='clock'
                showTenths={this.ShowTenths}
                Hours={GameClock.Hour}
                Minutes={GameClock.Minute}
                Seconds={GameClock.Second}
                Status={GameClock.Status}
                Tenths={GameClock.Tenths}
                onClick={this.onClick}
                onContextMenu={this.onContextMenu}
            />
            {
                (GameClock.Status === ClockStatus.RUNNING) &&
                <IconPause onClick={this.onClick} title='Pause'/>
            }
            {
                (GameClock.Status !== ClockStatus.RUNNING) &&
                <IconPlay onClick={this.onClick} title='Start'/>
            }
        </div>
    }
}

export {Main as GameClockControl};