import React from 'react';
import { RecordType } from 'tools/vars';
import { MediaItem } from 'components/common/inputs/mediaitem';

interface Props {
    background:string;
    photo:string;
    recordId:number;
    recordType:RecordType;
    scoreboardThumbnail:string;
    thumbnail:string;
    onSelectBackground:{(value:string):void};
    onSelectPhoto:{(value:string):void};
    onSelectScoreboardThumbnail:{(value:string):void};
    onSelectThumbnail:{(value:string):void};
}

/**
 * Display selection for a record's thumbnail, photo, banner, and background.
 * @param props 
 * @returns 
 */
const RecordMediaTable:React.FunctionComponent<Props> = props => {
    return <table>
        <tbody>
            <tr>
                <td width='25%' className='text-center'>Thumbnail</td>
                <td width='25%' className='text-center'>Photo</td>
                <td width='25%' className='text-center'>Banner</td>
                <td width='25%' className='text-center'>Background</td>
            </tr>
            <tr>
                <td>
                    <MediaItem
                        code='thumbnail'
                        value={props.thumbnail}
                        onSelect={props.onSelectThumbnail}
                    />
                </td>
                <td>
                    <MediaItem
                        code='photo'
                        value={props.photo}
                        onSelect={props.onSelectPhoto}
                    />
                </td>
                <td>
                    <MediaItem
                        code='scoreboard'
                        value={props.scoreboardThumbnail}
                        onSelect={props.onSelectScoreboardThumbnail}
                    />
                </td>
                <td>
                    <MediaItem
                        code='background'
                        value={props.background}
                        onSelect={props.onSelectBackground}
                    />
                </td>
            </tr>
        </tbody>
    </table>;
}

export {RecordMediaTable};