import classNames from 'classnames';
import { IconStar } from 'components/common/icons';
import React from 'react';
import { Unsubscribe } from 'redux';
import Data from 'tools/data';
import { Scorekeeper } from 'tools/scorekeeper/functions';
import { Skaters } from 'tools/skaters/functions';
import { DeckChoice, ScorekeeperPosition, TeamSide } from 'tools/vars';

interface Props extends React.HTMLProps<HTMLDivElement> {
    deck:DeckChoice;
    position:ScorekeeperPosition;
    side:TeamSide;
}

interface State {
    active:boolean;
    num:string;
    thumbnail:string;
}

/**
 * Display a skater on the scorekeeper
 */
class SkaterItem extends React.PureComponent<Props, State> {
    readonly state:State = {
        active:false,
        num:'',
        thumbnail:''
    }

    protected remote?:Unsubscribe;

    protected update = () => {
        const record = Scorekeeper.GetSkater(this.props.side, this.props.deck, this.props.position);
        if(record && (record.Number || record.Thumbnail)) {
            let thumb = record.Thumbnail || '';
            if(thumb) {
                thumb = Data.GetMediaPath(thumb);
            }

            this.setState({
                num:record?.Number || '',
                thumbnail:thumb,
                active:true
            });

        } else {
            this.setState({active:false});
        }
    }

    componentDidMount() {
        this.update();
        this.remote = Scorekeeper.Subscribe(this.update);
    }

    componentWillUnmount() {
        if(this.remote)
            this.remote();
    }

    render(): React.ReactNode {
        const {deck, position, side, ...rprops} = {...this.props};

        return <div {...rprops} className={classNames('skater', rprops.className, {
            active:this.state.active,
            jammer:(position === 'Jammer')
        })}>
            <div className='num'>{this.state.num}</div>
            <div className='pos'>
                <IconStar/>
            </div>
            <div className='thumb'>
                {
                    (this.state.thumbnail && this.state.thumbnail.length > 0) &&
                    <img src={this.state.thumbnail} alt=''/>
                }
            </div>
        </div>
    }
}

/**
 * Display a skater on the scorekeeper.
 * @param props 
 * @returns 
 */
const _SkaterItem:React.FunctionComponent<Props> = props => {
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

    return <div {...rprops} className={classNames('skater', rprops.className, {
        active:(num || thumbnail)
    })}>
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