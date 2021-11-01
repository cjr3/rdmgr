import classNames from 'classnames';
import { Panel, PanelContent, PanelTitle } from 'components/common/panel';
import React, { useState } from 'react';
import { Phases } from 'tools/phases/functions';
import { Scoreboard } from 'tools/scoreboard/functions';

interface Props {
    active:boolean;
    onHide:{():void}
}

/**
 * Popup panel to select a phase record.
 * @param props 
 * @returns 
 */
const PhasePanel:React.FunctionComponent<Props> = props => {
    const [phaseID, setPhaseID] = useState(Scoreboard.GetState().PhaseID || 0);
    const onSelect = React.useCallback((id:number) => {
        Scoreboard.SetPhase(id);
        props.onHide();
    }, [props.onHide]);

    React.useEffect(() => Scoreboard.Subscribe(() => {
        setPhaseID(Scoreboard.GetState().PhaseID || 0);
    }), []);

    const phases = Phases.GetRecords();

    return <Panel
        active={props.active}
        onHide={props.onHide}
    >
        <PanelTitle onHide={props.onHide}>Quarter</PanelTitle>
        <PanelContent>
            {
                phases.map(record => {
                    return <PhaseItem
                        active={phaseID === record.RecordID}
                        hour={record.Hours || 0}
                        minute={record.Minutes || 0}
                        name={record.Name || ''}
                        second={record.Seconds || 0}
                        recordId={record.RecordID || 0}
                        onSelect={onSelect}
                        key={`record-${record.RecordID}`}
                    />
                })
            }
        </PanelContent>
    </Panel>
}

/**
 * 
 * @param props 
 * @returns 
 */
const PhaseItem:React.FunctionComponent<{
    hour:number;
    minute:number;
    second:number;
    active:boolean;
    name:string;
    recordId:number;
    onSelect:{(recordId:number):void};
}> = props => {
    let time = `${props.hour.toString().padStart(2,'0')}:${props.minute.toString().padStart(2,'0')}:${props.second.toString().padStart(2,'0')}`;
    const onClick = React.useCallback(() => {
        props.onSelect(props.recordId);
    }, [props.onSelect, props.recordId]);
    return <div 
        className={classNames('flex-cols button', {active:props.active})}
        onClick={onClick}
        >
        <div className='flex-fill text-left'>{props.name}</div>
        <div className='flex-nofill text-right'>
            {time}
        </div>
    </div>
};

export {PhasePanel}