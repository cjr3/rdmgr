import classNames from 'classnames';
import { IconDiagStripe, IconStar } from 'components/common/icons';
import React from 'react';
import Data from 'tools/data';
import { Scorekeeper } from 'tools/scorekeeper/functions';
import { Skaters } from 'tools/skaters/functions';
import { DeckChoice, ScorekeeperPosition, TeamSide } from 'tools/vars';

interface Props {
    active:boolean;
    currentDeck?:DeckChoice;
    currentPosition?:ScorekeeperPosition;
    deck:DeckChoice;
    position:ScorekeeperPosition;
    recordId:number;
    side:TeamSide;
    onSelect:{(side:TeamSide, deck:DeckChoice, position:ScorekeeperPosition):void};
}

/**
 * Display a position on the scorekeeper control.
 * @param props 
 * @returns 
 */
const PositionItem:React.FunctionComponent<Props> = props => {
    const [name, setName] = React.useState('');
    const [num, setNumber] = React.useState('');
    const [thumbnail, setThumbnail] = React.useState('');

    React.useEffect(() => {
        if(props.recordId) {
            let skater = Scorekeeper.GetSkater(props.side, props.deck, props.position);
            if(!skater) {
                skater = Skaters.Get(props.recordId);
            }
            
            setName(skater?.Name || '');
            setNumber(skater?.Number || '');
            setThumbnail(skater?.Thumbnail || '');
        } else {
            setName('');
            setNumber('');
            setThumbnail('');
        }
    }, [props.recordId, props.position, props.side, props.deck]);

    const onClick = React.useCallback(() => {
        if(props.currentDeck && props.currentPosition && (props.currentDeck !== props.deck || props.currentPosition !== props.position)) {
            //swap positions
            const source = Scorekeeper.GetSkater(props.side, props.currentDeck, props.currentPosition);
            const target = Scorekeeper.GetSkater(props.side, props.deck, props.position);
            Scorekeeper.SetPosition(props.side, target || undefined, props.currentDeck, props.currentPosition);
            Scorekeeper.SetPosition(props.side, source || undefined, props.deck, props.position);
            props.onSelect(props.side, props.currentDeck, props.currentPosition);
        } else {
            props.onSelect(props.side, props.deck, props.position);
        }
    }, [props.currentDeck, props.currentPosition, props.deck, props.position, props.side])

    return <div 
        className={classNames('thumbnail', {active:props.active})}
        draggable={true}
        onClick={onClick}
        title={name}
        >
        {
            (props.position === 'Jammer') && <IconStar/>
        }
        {
            (props.position === 'Pivot') && <IconDiagStripe/>
        }
        <span className='num'>{num}</span>
        {
            (thumbnail && thumbnail.length > 0) &&
            <img src={Data.GetMediaPath(thumbnail)} alt=''/>
        }
    </div>
};

export {PositionItem};