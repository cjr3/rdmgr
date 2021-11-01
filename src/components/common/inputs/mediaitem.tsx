import React from 'react';
import {remote} from 'electron';
import Data from 'tools/data';
import { IconOffline, IconTrash } from 'components/common/icons';
import { Dialog, DialogBody, DialogFooter, DialogTitle, URLDialog } from '../dialog';
import { TextInput } from './textinput';

interface Props {
    code:'background' | 'photo' | 'thumbnail' | 'scoreboard';
    label?:string;
    value:string;
    onSelect:{(value:string):void};
}

/**
 * 
 * @param props 
 * @returns 
 */
const MediaItem:React.FunctionComponent<Props> = props => {
    const [showURL, setShowURL] = React.useState(false);
    const onContextMenu = React.useCallback((ev:React.MouseEvent<HTMLDivElement>) => {
        ev.stopPropagation();
        ev.preventDefault();
        props.onSelect('');
    }, []);

    const onClickURL = React.useCallback((ev:React.MouseEvent<HTMLButtonElement>) => {
        ev.stopPropagation();
        ev.preventDefault();
        setShowURL(true);
    }, []);

    const onClick = React.useCallback((ev:React.MouseEvent<HTMLDivElement>) => {
        ev.stopPropagation();
        ev.preventDefault();
        const win = remote.BrowserWindow.getFocusedWindow();
        if(win) {
            remote.dialog.showOpenDialog(win, {
                buttonLabel:'Select',
                filters:[
                    {name:'Image Files', extensions:['jpg','png','jpeg','gif']}
                ],
                properties:[
                    'openFile',
                    'dontAddToRecent'
                ]
            }).then(result => {
                if(Array.isArray(result.filePaths) && result.filePaths.length > 0) {
                    props.onSelect(result.filePaths[0]);
                }
            }).catch(() => {})
        }
    }, [props.onSelect]);

    return <>
        <div className='thumbnail media-thumbnail' onClick={onClick} onContextMenu={onContextMenu}>
            {
                (props.value && props.value.length > 0) &&
                <>
                    <img src={Data.GetMediaPath(props.value)} alt={props.code} title={props.value}/>
                    <IconTrash
                        onClick={ev => {
                            ev.stopPropagation();
                            props.onSelect('')
                        }}
                    />
                </>
            }
            <IconOffline onClick={onClickURL} title='Enter URL' style={{right:'initial',left:0}}/>
            {
                (props.label && props.label.length > 0) &&
                <span className='label'>{props.label}</span>
            }
        </div>
        {
            (showURL) && 
            <URLDialog onChangeValue={props.onSelect} value={props.value} onHide={() => setShowURL(false)}/>
        }
    </>
};

export {MediaItem};