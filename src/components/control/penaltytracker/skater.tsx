import React from 'react';
import Data from 'tools/data';
import classNames from 'classnames';

interface Props {
    active:boolean;
    name:string;
    number:string;
    skaterId:number;
    selected:boolean;
    thumbnail:string;
    onSelect:{(id:number):void};
}

/**
 * Display skater on penalty tracker control.
 * @param props 
 * @returns 
 */
const SkaterItem:React.FunctionComponent<Props> = props => {
    const onClick = React.useCallback((ev:React.MouseEvent<HTMLDivElement>) => {
        ev.stopPropagation();
        props.onSelect(props.skaterId);
    }, [props.onSelect]);
    return <div 
        className={classNames('thumbnail', {selected:props.selected, active:props.active})} 
        title={props.name}
        onClick={onClick}
        >
            {
                (props.thumbnail && props.thumbnail.length > 0) &&
                <img src={Data.GetMediaPath(props.thumbnail)} alt='Thumbnail' title={props.name}/>
            }
        <span className='num'>{props.number}</span>
    </div>
};

export {SkaterItem};