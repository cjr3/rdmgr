import React from 'react';
import { ExitApplication } from '../../../../tools/functions';
import {JamClockView, GameClockView} from './clocks';
import { Team } from './team';
import {JamCounter} from './jamcounter';
import { BoardStatus } from './boardstatus';
import { PhaseName } from './phase';

interface Props {

}

interface State {
    
}

class Main extends React.PureComponent<Props, State> {

    render() {
        return <div className='titlebar'>
            <div className='close-icon'>
                <button onClick={() => {
                    // console.log('ok...')
                    ExitApplication();
                }}>X</button>
            </div>
            <div className='teams'>
                <Team side='A'/>
                <Team side='B'/>
            </div>
            <PhaseName/>
            <GameClockView/>
            <JamClockView/>
            <JamCounter/>
            <BoardStatus/>
        </div>
    }
}

export {Main as Titlebar};