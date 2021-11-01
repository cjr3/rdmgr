import classNames from 'classnames';
import { IconLeft, IconRight, IconX } from 'components/common/icons';
import React from 'react';
import { Capture } from 'tools/capture/functions';
import { MainController } from 'tools/MainController';
import { TeamSide } from 'tools/vars';

interface Props extends React.HTMLProps<HTMLDivElement> {
    active:boolean;
    index:number;
    name:string;
    number:string;
    recordId:number;
    rosterIndex:number;
    rosterSide:string;
    side:string|TeamSide;
}

const RosterSkaterItem:React.FunctionComponent<Props> = props => {
    const {side, index, name, number, recordId, rosterIndex, rosterSide, active, ...rprops} = {...props};
    const onDoubleClick = React.useCallback((ev:React.MouseEvent<HTMLDivElement>) => {
        ev.stopPropagation();
        if(index >= 0) {
            Capture.UpdateRoster({
                side:props.side,
                index:index
            });
        }
    }, [index, props.side]);

    const onClickRemove = React.useCallback((ev:React.MouseEvent<HTMLButtonElement>) => {
        ev.stopPropagation();
        MainController.RemoveRosterSkaters(props.side === 'A' ? 'A' : 'B', [props.recordId])
    }, [props.side, props.recordId]);

    const onClickLeft = React.useCallback((ev:React.MouseEvent<HTMLButtonElement>) => {
        ev.stopPropagation();
        MainController.AddRosterSkaters('A', [
            {
                RecordID:props.recordId,
                Name:props.name,
                Number:props.number
            }
        ])
    }, [props.recordId, props.name, props.number]);

    const onClickRight = React.useCallback((ev:React.MouseEvent<HTMLButtonElement>) => {
        ev.stopPropagation();
        MainController.AddRosterSkaters('B', [
            {
                RecordID:props.recordId,
                Name:props.name,
                Number:props.number
            }
        ])
    }, [props.recordId, props.name, props.number]);

    return <div 
        {...rprops} className={classNames('skater', rprops.className, {
            active:(rosterIndex === index && rosterSide === side && rosterSide !== '')
        })}
        onDoubleClick={onDoubleClick}
        >
        <span className='num'>{props.number}</span>
        <span className='name'>{props.name}</span>
        {
            (props.side === 'A' || props.side === 'B') &&
            <IconX title='Remove' onClick={onClickRemove}/>
        }
        {
            (active || props.side === 'B') &&
            <IconLeft disabled={(props.side === 'A')} title='Transfer to left side team' onClick={onClickLeft}/>
        }
        {
            (active || props.side === 'A') &&
            <IconRight disabled={(props.side === 'B')} title='Transfer to right side team' onClick={onClickRight}/>
        }
    </div>
};

export {RosterSkaterItem};