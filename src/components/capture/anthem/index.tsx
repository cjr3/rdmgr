import classNames from 'classnames';
import React from 'react';
import { Anthem } from 'tools/anthem/functions';
import { Capture } from 'tools/capture/functions';
import Data from 'tools/data';

interface Props extends React.HTMLProps<HTMLDivElement> {
    stream:boolean;
}

const AnthemCapture:React.FunctionComponent<Props> = props => {
    const {stream, ...rprops} = {...props};
    const [visible, setVisible] = React.useState(Capture.GetAnthem().visible || false);
    const [name, setName] = React.useState(Anthem.Get().Singer?.Name || 'National Anthem');
    const [photo, setPhoto] = React.useState(Anthem.Get().Singer?.Photo || '');
    const [thumbnail, setThumbnail] = React.useState(Anthem.Get().Singer?.Thumbnail || '');
    const [bio, setBio] = React.useState(Anthem.Get().Singer?.Description || '');
    const [background, setBackground] = React.useState(Capture.GetAnthem().backgroundImage || '');

    const style:React.CSSProperties = {};
    if(background && background.length) {
        style.backgroundImage = "url('" + Data.GetMediaPath(background, 'file:///') + "')";
    }
    
    React.useEffect(() => {
        return Anthem.Subscribe(() => {
            const singer = Anthem.Get().Singer;
            setName(singer?.Name || 'National Anthem');
            setPhoto(singer?.Photo || '');
            setThumbnail(singer?.Thumbnail || '');
            setBio(singer?.Description || '');
        });
    }, []);

    React.useEffect(() => {
        return Capture.Subscribe(() => {
            const state = Capture.GetAnthem();
            setVisible(state.visible || false);
            setBackground(state.backgroundImage || '');
        });
    }, []);

    return <div {...rprops} className={classNames('capture-anthem', {active:visible})}>
        <div className='flag' style={style}>
            {
                (!stream && photo && photo.length > 0) &&
                <div className='photo'>
                    <img src={Data.GetMediaPath(photo)} alt=''/>
                </div>
            }
            {
                (stream && thumbnail && thumbnail.length > 0) &&
                <div className='photo'>
                    <img src={Data.GetMediaPath(thumbnail)} alt=''/>
                </div>
            }
            <div className='name'>{name}</div>
            <div className='bio'>{bio}</div>
        </div>
    </div>
};

export {AnthemCapture};