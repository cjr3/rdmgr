import classNames from 'classnames';
import React from 'react';
import Data from 'tools/data';

interface Props extends React.HTMLProps<HTMLDivElement> {
    active:boolean;
    color:string;
    num:string;
    thumbnail:string;
}

const Skater:React.FunctionComponent<Props> = props => {
    const {
        active,
        color,
        num,
        thumbnail,
        ...rprops
    } = {...props};

    return <div {...rprops} 
        className={classNames('skater', props.className, {
            active:active
        })}
        style={{
            borderColor:color,
            ...rprops.style
        }}
        >
        <div className='num'>{num}</div>
        <div className='thumb'>
            {
                (thumbnail && thumbnail.length > 0) &&
                <img src={Data.GetMediaPath(thumbnail)} alt=''/>
            }
        </div>
    </div>
};

export {Skater};