import { ClockView } from 'components/common/clock';
import React from 'react';
import {JamClock} from 'tools/scoreboard/jamclock';

interface Props {
    
}

const h = 0;

class Main extends React.PureComponent<Props, any> {
    protected timer:any = 0;
    protected ShowTenths = false;

    protected update = async () => this.forceUpdate();
    
    protected onContextMenu = (ev:React.MouseEvent<HTMLElement>) => {
        ev.stopPropagation();
        ev.preventDefault();
        this.ShowTenths = !this.ShowTenths;
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
        return <div className='jam-clock' onContextMenu={this.onContextMenu}>
            <ClockView
                clockType='stopwatch'
                showTenths={this.ShowTenths}
                Hours={h}
                Minutes={JamClock.Minute}
                Seconds={JamClock.Second}
                Status={JamClock.Status}
                Tenths={JamClock.Tenths}
            />
        </div>
    }
}

export {Main as JamClockControl};