import { IconPlay } from 'components/common/icons';
import { TextInput } from 'components/common/inputs/textinput';
import { Panel, PanelContent, PanelFooter, PanelTitle } from 'components/common/panel';
import React from 'react';
import { VideoStatus } from 'tools/vars';
import { Videos } from 'tools/videos/functions';

interface Props {
    active:boolean;
    onHide:{():void};
}

const QuickVideoPanel:React.FunctionComponent<Props> = props => {
    const [records, setRecords] = React.useState(Videos.GetRecords());
    const [url, setURL] = React.useState('https://youtu.be/J76uvnBzMPE');

    const playURL = React.useCallback(() => {
        if(url) {
            Videos.UpdateMainVideo({
                Status:VideoStatus.PLAYING,
                Source:url
            }, true);
            props.onHide();
        }
    }, [url]);

    React.useEffect(() => {
        return Videos.Subscribe(() => {
            setRecords(Videos.GetRecords())
        })
    }, []);

    return <Panel
        active={props.active}
        onHide={props.onHide}
        >
        <PanelTitle onHide={props.onHide}>Play Video</PanelTitle>
        <PanelContent>
            <div style={{
                display:'grid',
                gridTemplateRows:'1fr auto',
                height:'100%'
            }}>
                <div style={{gridRow:'1',overflow:'hidden auto'}}>
                    {
                        records.map((record, index) => {
                            return <div 
                                className='button'
                                style={{
                                    textAlign:'left'
                                }}
                                onClick={ev => {
                                    ev.stopPropagation();
                                    ev.preventDefault();
                                    setURL(record.Filename || '');
                                }}
                                key={`video-${record.RecordID}-${index}`}
                                >
                                {record.Name}
                            </div>
                        })
                    }
                </div>
                <div style={{gridRow:'2', display:'grid', gridTemplateColumns:'1fr auto'}}>
                    <TextInput value={url} onChangeValue={setURL} placeholder='URL'/>
                    <IconPlay onClick={playURL} title='Play YouTube Video'/>
                </div>
            </div>
        </PanelContent>
    </Panel>
}

export {QuickVideoPanel};