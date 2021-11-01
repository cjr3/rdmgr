import classNames from 'classnames';
import { MediaItem } from 'components/common/inputs/mediaitem';
import { TextBlock } from 'components/common/inputs/textblock';
import { TextInput } from 'components/common/inputs/textinput';
import React from 'react';
import { Anthem } from 'tools/anthem/functions';

interface Props extends React.HTMLProps<HTMLDivElement> {
    active:boolean;
}

let timer:any = 0;

const AnthemControl:React.FunctionComponent<Props> = props => {
    const {active, ...rprops} = {...props};
    const [name, setName] = React.useState(Anthem.Get().Singer?.Name || '');
    const [bio, setBio] = React.useState(Anthem.Get()?.Singer?.Description || '');
    const [photo, setPhoto] = React.useState(Anthem.Get()?.Singer?.Photo || '');
    const [thumbnail, setThumbnail] = React.useState(Anthem.Get()?.Singer?.Thumbnail || '');

    const onChangeName = React.useCallback((value:string) => {
        setName(value);
        try {
            clearTimeout(timer);
        } catch(er) {

        }
        timer = setTimeout(() => {
            const singer = Anthem.Get().Singer || {};
            Anthem.Update({
                Singer:{
                    ...singer,
                    Name:value
                }
            });
        }, 50);
    }, []);

    const onChangeBio = React.useCallback((value:string) => {
        setBio(value);
        try {
            clearTimeout(timer);
        } catch(er) {

        }
        timer = setTimeout(() => {
            const singer = Anthem.Get().Singer || {};
            Anthem.Update({
                Singer:{
                    ...singer,
                    Description:value
                }
            });
        }, 50);
    }, []);

    const onSelectPhoto = React.useCallback((value:string) => {
        setPhoto(value);
        const singer = Anthem.Get().Singer || {};
        try {
            clearTimeout(timer);
        } catch(er) {

        }
        timer = setTimeout(() => {
            Anthem.Update({
                Singer:{
                    ...singer,
                    Photo:value
                }
            });
        }, 50);
    }, []);

    const onSelectThumbnail = React.useCallback((value:string) => {
        setThumbnail(value);
        const singer = Anthem.Get().Singer || {};
        try {
            clearTimeout(timer);
        } catch(er) {

        }
        timer = setTimeout(() => {
            Anthem.Update({
                Singer:{
                    ...singer,
                    Thumbnail:value
                }
            });
        }, 50);
    }, []);

    React.useEffect(() => Anthem.Subscribe(() => {
        // console.log(Anthem.Get());
        setName(Anthem.Get().Singer?.Name || '');
        setPhoto(Anthem.Get().Singer?.Photo || '');
        setThumbnail(Anthem.Get().Singer?.Thumbnail || '');
        setBio(Anthem.Get().Singer?.Description || '');
    }),[])

    return <div {...rprops} className={classNames('anthem-control mq-control', rprops.className, {active:active})}>
        <table className='table'>
            <tbody>
                <tr>
                    <td colSpan={2}>
                        <TextInput value={name} onChangeValue={onChangeName} placeholder='Name'/>
                    </td>
                </tr>
                <tr>
                    <td>
                        <MediaItem code='photo' onSelect={onSelectPhoto} value={photo} label='Photo'/>
                    </td>
                    <td>
                        <MediaItem code='thumbnail' onSelect={onSelectThumbnail} value={thumbnail} label='Thumbnail'/>
                    </td>
                </tr>
                <tr>
                    <td colSpan={2}>
                        <TextBlock value={bio} onChangeValue={onChangeBio} placeholder='Bio - Hidden in stream mode.'/>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
}

export {AnthemControl};