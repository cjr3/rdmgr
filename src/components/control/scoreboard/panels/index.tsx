import React from 'react';
import { CallPanel } from './call';
import { JamResetPanel } from './jamreset';
import { PhasePanel } from './phase';
import { TeamsPanel } from './teams';

interface Props {
    active:boolean;
    panel:string;
    onHide:{():void};
}

const ScoreboardPanels:React.FunctionComponent<Props> = props => {
    return <>
        {
            (props.panel === 'teams') &&
            <TeamsPanel active={true} onHide={props.onHide}/>
        }
        {
            (props.panel === 'phase') &&
            <PhasePanel active={true} onHide={props.onHide}/>
        }
        {
            (props.panel === 'jamreset') &&
            <JamResetPanel active={true} onHide={props.onHide}/>
        }
        {
            (props.panel === 'call') &&
            <CallPanel active={true} onHide={props.onHide}/>
        }
    </>
}

export {ScoreboardPanels};