import classNames from 'classnames';
import { IconStar } from 'components/common/icons';
import React from 'react';
import Data from 'tools/data';
import { Scorekeeper } from 'tools/scorekeeper/functions';
import { Skaters } from 'tools/skaters/functions';
import { DeckChoice, ScorekeeperPosition, TeamSide } from 'tools/vars';

interface Props extends React.HTMLProps<HTMLDivElement> {
    deck:DeckChoice;
    position:ScorekeeperPosition;
    side:TeamSide;
}

/**
 * Display a skater on the scorekeeper.
 * @param props 
 * @returns 
 */
const SkaterItem:React.FunctionComponent<Props> = props => {
    const {deck, position, side, ...rprops} = {...props};
    const [num, setNumber] = React.useState('');
    const [thumbnail, setThumbnail] = React.useState('');

    React.useEffect(() => {
        return Scorekeeper.Subscribe(() => {
            const record = Scorekeeper.GetSkater(side, deck, position);
            const skater = Skaters.Get(record?.RecordID);
            setThumbnail(skater?.Thumbnail || record?.Thumbnail || '');
            setNumber(skater?.Number || record?.Number || '');
        });
    }, []);

    return <div {...rprops} className={classNames('skater', rprops.className)}>
        <div className='num'>{num}</div>
        <div className='pos'>
        {
            (position === 'Jammer' && num && num.length > 0) && <IconStar/>
        }
        </div>
        <div className='thumb'>
            {
                (thumbnail && thumbnail.length > 0) &&
                <img src={Data.GetMediaPath(thumbnail)} alt=''/>
            }
        </div>
    </div>
}

export {SkaterItem};