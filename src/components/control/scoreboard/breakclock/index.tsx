import { ClockView } from 'components/common/clock';
import { IconStopwatch } from 'components/common/icons';
import React from 'react';
import { BreakClock } from 'tools/scoreboard/breakclock';
import { Scoreboard } from 'tools/scoreboard/functions';

interface Props {

}


/**
 * Break clock control
 */
class Main extends React.PureComponent<Props, any> {
    protected timer:any = 0;
    protected ShowTenths = false;

    protected update = async () => this.forceUpdate();
    
    protected onContextMenu = (ev:React.MouseEvent<HTMLElement>) => {
        ev.stopPropagation();
        ev.preventDefault();
        this.ShowTenths = !this.ShowTenths;
    }

    protected onClick = () => {
        Scoreboard.ToggleBreakClock();
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
        return <div className='break-clock' onContextMenu={this.onContextMenu} onClick={this.onClick}>
            <span>Break</span>
            <ClockView
                clockType='stopwatch'
                showTenths={this.ShowTenths}
                Hours={0}
                Minutes={0}
                Seconds={BreakClock.Second}
                Tenths={BreakClock.Tenths}
            />
            <IconStopwatch title='Toggle Break Clock'/>
        </div>
    }
}

export {Main as BreakClockControl};