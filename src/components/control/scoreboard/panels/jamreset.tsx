import { IconCheck, IconX } from 'components/common/icons';
import { Panel, PanelContent, PanelFooter, PanelTitle } from 'components/common/panel';
import React from 'react';
import { Scoreboard } from 'tools/scoreboard/functions';
import { GameClock } from 'tools/scoreboard/gameclock';
import { ClockStatus } from 'tools/vars';

interface Props {
    active:boolean;
    onHide:{():void};
}

/**
 * Popup panel to reset the jam.
 * @param props 
 * @returns 
 */
const JamResetPanel:React.FunctionComponent<Props> = props => {
    const state = Scoreboard.GetState();
    const hour = state.JamHour || 0;
    const minute = state.JamMinute || 0;
    const second = state.JamSecond || 0;
    const time = hour.toString().padStart(2,'0') + ':' +
        minute.toString().padStart(2,'0') + ':' + 
        second.toString().padStart(2,'0') + '.0';
    let message = `Are you sure you wish to reset the game clock to ${time}?`;
    if(GameClock.Status !== ClockStatus.STOPPED)
        message = 'The game clock must be stopped for a jam reset.';
    const onClickYes = React.useCallback(() => {
        GameClock.set(hour, minute, second, 0);
        props.onHide();
    }, [hour, minute, second, props.onHide]);
    return <Panel
        active={props.active}
        onHide={props.onHide}
        style={{width:'300px'}}
    >
        <PanelTitle onHide={props.onHide}>Jam Reset</PanelTitle>
        <PanelContent className='pad-6'>
            {message}
        </PanelContent>
        <PanelFooter>
            {
                (GameClock.Status === ClockStatus.STOPPED) &&
                <>
                    <IconCheck asButton={true} onClick={onClickYes} style={{width:'100px'}}>Yes</IconCheck>
                    <IconX asButton={true} onClick={props.onHide} style={{width:'100px'}}>No</IconX>
                </>
            }
            {
                (GameClock.Status !== ClockStatus.STOPPED) &&
                <>
                    <IconCheck asButton={true} onClick={props.onHide} style={{width:'100px'}}>OK</IconCheck>
                </>
            }
        </PanelFooter>
    </Panel>
}

export {JamResetPanel};