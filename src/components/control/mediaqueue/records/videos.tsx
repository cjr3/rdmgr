import classNames from 'classnames';
import { Collapsable } from 'components/common/collapsable';
import { IconPlus } from 'components/common/icons';
import { TextInput } from 'components/common/inputs/textinput';
import React from 'react';
import { RecordType } from 'tools/vars';
import { Videos } from 'tools/videos/functions';

interface Props {
    active:boolean;
    recordId:number;
    recordType:RecordType;
    onSelect:{(recordId:number, recordType:RecordType):void};
    onToggle:{():void};
}

/**
 * List of videos to display.
 * @param props 
 * @returns 
 */
const VideoSelectionList:React.FunctionComponent<Props> = props => {
    const [records, setRecords] = React.useState(Videos.GetRecords());
    const [updateTime, setUpdateTime] = React.useState(Videos.GetUpdateTime());
    const [url, setURL] = React.useState(Videos.GetMainVideo().Source || '');

    const onClickPlayURL = React.useCallback(() => {
        Videos.UpdateMainVideo({Source:url}, true);
        props.onSelect(99999, 'VID');
    }, [url]);

    React.useEffect(() => Videos.Subscribe(() => { setUpdateTime(Videos.GetUpdateTime()); }), []);
    React.useEffect(() => { setRecords(Videos.GetRecords()); }, [updateTime]);

    return <Collapsable
        active={props.active}
        label='Videos'
        onToggle={props.onToggle}
        >
            <div
                style={{
                    display:'grid',
                    gridTemplateColumns:'1fr auto'
                }}
            >
                <TextInput
                    value={url}
                    onChangeValue={setURL}
                    size={10}
                    maxLength={1000}
                />
                <IconPlus
                    onClick={onClickPlayURL}
                    title='Play URL'
                />
            </div>
        {
            records.map(record => {
                return <div
                    className={classNames('button', {active:props.recordId === record.RecordID && props.recordType === 'VID'})}
                    style={{
                        display:'grid',
                        gridTemplateColumns:'1fr auto',
                        cursor:'pointer',
                        textAlign:'left'
                    }}
                    onDoubleClick={ev => {
                        ev.preventDefault();
                        ev.stopPropagation();
                        Videos.UpdateMainVideo({Source:record.Filename || ''}, true);
                        setURL(record.Filename || '');
                        props.onSelect(record.RecordID || 0, 'VID');
                    }}
                    key={`record-${record.RecordID}`}
                >
                    <span>{record.Name}</span>
                </div>
            })
        }
    </Collapsable>
};

export {VideoSelectionList};