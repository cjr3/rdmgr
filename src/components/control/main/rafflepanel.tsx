import { Panel, PanelContent, PanelTitle } from 'components/common/panel';
import React from 'react';
// import { Capture } from 'tools/capture/functions';
import { RaffleControl } from '../raffle';

interface Props {
    active:boolean;
    onHide:{():void};
}

/**
 * Popup panel for raffle entry.
 * @param props 
 * @returns 
 */
const RafflePanel:React.FunctionComponent<Props> = props => {
    const onHide = React.useCallback(() => {
        // Capture.UpdateRaffle({visible:false});
        props.onHide();
    }, [props.onHide]);
    return <Panel active={props.active} onHide={onHide} style={{maxWidth:'300px'}}>
        <PanelTitle onHide={onHide}>Raffle</PanelTitle>
        <PanelContent>
            <RaffleControl autoFocus={true} onClear={onHide}/>
        </PanelContent>
    </Panel>
}

export {RafflePanel};