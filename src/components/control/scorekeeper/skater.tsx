import { IconStar } from 'components/common/icons';
import React from 'react';
import Data from 'tools/data';
import { Scorekeeper } from 'tools/scorekeeper/functions';
import { Skaters } from 'tools/skaters/functions';
import { DeckChoice, ScorekeeperPosition, TeamSide } from 'tools/vars';

interface Props {
    currentDeck?:DeckChoice;
    currentPosition?:ScorekeeperPosition;
    deck?:DeckChoice;
    position?:ScorekeeperPosition;
    jammerOnly:boolean;
    name:string;
    num:string;
    recordId:number;
    side:TeamSide;
    thumbnail:string;
    onSet:{():void};
}

/**
 * 
 * @param props 
 * @returns 
 */
const SkaterItem:React.FunctionComponent<Props> = props => {
    const onClick = React.useCallback((ev:React.MouseEvent<HTMLDivElement>) => {
        ev.stopPropagation();
        ev.preventDefault();

        const skater = Skaters.Get(props.recordId);
        if(skater) {
            if(props.jammerOnly) {
                const current = Scorekeeper.GetSkater(props.side, 'Track', 'Jammer');
                if(current && current.RecordID === props.recordId)
                    Scorekeeper.SetPosition(props.side, undefined, 'Track', 'Jammer');
                else
                    Scorekeeper.SetPosition(props.side, skater, 'Track', 'Jammer');
                return;
            }

            if(props.currentDeck && props.currentPosition) {
                //remove from current position
                if(props.deck && props.position)
                    Scorekeeper.SetPosition(props.side, undefined, props.deck, props.position);
                //set new position
                Scorekeeper.SetPosition(props.side, skater, props.currentDeck, props.currentPosition);
            } else if(props.deck && props.position) {
                //remove position
                Scorekeeper.SetPosition(props.side, undefined, props.deck, props.position);
            } else {
                //set skater to next available position
                Scorekeeper.SetPosition(props.side, skater);
            }
        }
        props.onSet();
    }, [props.recordId, props.side, props.jammerOnly, props.deck, props.position, props.currentDeck, props.currentPosition, props.onSet]);

    return <div 
        className='thumbnail'
        title={props.name}
        onClick={onClick}
        >
        <div className='num'>{props.num}</div>
        {
            (props.thumbnail && props.thumbnail.length > 0) &&
            <img src={Data.GetMediaPath(props.thumbnail)} alt=''/>
        }
        {
            (props.position === 'Jammer') && <IconStar/>
        }
    </div>
};

export {SkaterItem};