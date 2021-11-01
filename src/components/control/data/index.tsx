import { Dialog, DialogBody, DialogTitle } from 'components/common/dialog';
import { IconFlag, IconMicrophone, IconMovie, IconOffline, IconSettings, IconSkater, IconSlideshow, IconStopwatch, IconTeam, IconTicket, IconVS } from 'components/common/icons';
import React from 'react';
import { RecordType } from 'tools/vars';
import { ConfigForm } from './config';
import { RecordForm } from './records';
import { RecordList } from './records/list';

interface Props extends React.HTMLProps<HTMLDivElement> {
    active:boolean;
    onHide:{():void}
}

const style:React.CSSProperties = {
    display:'grid',
    gridTemplateColumns:'1fr 250px',
    gridTemplateRows:'1fr auto',
    height:'100%'
}

/**
 * Main configuration dialog.
 * @param props 
 * @returns 
 */
const DataControl:React.FunctionComponent<Props> = props => {
    const {active, onHide, ...rprops} = {...props};
    const [recordId, setRecordId] = React.useState(-1);
    const [recordType, setRecordType] = React.useState<RecordType>('');
    const [listType, setListType] = React.useState<RecordType>('');
    const [configActive, setConfigActive] = React.useState(true);

    const onSelectRecord = React.useCallback((id:number, type:RecordType) => {
        setRecordId(id);
        setRecordType(type);
        setConfigActive(false);
    }, [recordId, recordType]);

    const onSelectRecordType = React.useCallback((type:RecordType) => {
        setRecordId(-1);
        setRecordType(type);
        setListType(type);
        setConfigActive(false);
    }, []);

    const onSave = React.useCallback(() => {
        setRecordId(-1);
        setConfigActive(false);
    }, []);

    const onSaveCancelConfig = React.useCallback(() => {
        setConfigActive(false);
    }, []);

    const onClickANT = React.useCallback(() => onSelectRecordType('ANT'), []);
    const onClickPER = React.useCallback(() => onSelectRecordType('PER'), []);
    const onClickPEN = React.useCallback(() => onSelectRecordType('PEN'), []);
    const onClickPHS = React.useCallback(() => onSelectRecordType('PHS'), []);
    const onClickSEA = React.useCallback(() => onSelectRecordType('SEA'), []);
    const onClickSKR = React.useCallback(() => onSelectRecordType('SKR'), []);
    const onClickSLS = React.useCallback(() => onSelectRecordType('SLS'), []);
    const onClickSPN = React.useCallback(() => onSelectRecordType('SPN'), []);
    const onClickTEM = React.useCallback(() => onSelectRecordType('TEM'), []);
    const onClickVID = React.useCallback(() => onSelectRecordType('VID'), []);
    const onClickConfig = React.useCallback(() => {
        onSelectRecordType('');
        setConfigActive(true);
    }, []);

    if(props.active) {
        return <Dialog onHide={onHide}>
            <DialogTitle onHide={onHide}>Records and Settings</DialogTitle>
            <DialogBody style={{overflow:'hidden'}}>
                <div {...rprops} style={style}>
                    <div style={{gridColumn:'1', gridRow:'1/3', padding:'0px 6px',height:'100%'}}>
                        {
                            (recordId >= 0) &&
                            <RecordForm recordId={recordId} recordType={recordType} onSave={onSave}/>
                        }
                        {
                            (configActive) &&
                            <ConfigForm onSave={onSaveCancelConfig} onCancel={onSaveCancelConfig}/>
                        }
                    </div>
                    <RecordList
                        allowNewRecord={true}
                        listType={listType}
                        recordId={recordId}
                        recordType={recordType}
                        style={{gridColumn:'2', gridRow:'1'}}
                        onSelectRecord={onSelectRecord}
                    />
                    <div style={{gridColumn:'2', gridRow:'2'}}>
                        <IconMicrophone active={recordType === 'ANT'} onClick={onClickANT} title='Anthem Singers'/>
                        <IconOffline active={recordType === 'PER'} onClick={onClickPER} title='Peers / Network'/>
                        <IconFlag active={recordType === 'PEN'} onClick={onClickPEN} title='Penalties'/>
                        <IconStopwatch active={recordType === 'PHS'} onClick={onClickPHS} title='Quarters'/>
                        <IconVS active={recordType === 'SEA'} onClick={onClickSEA} title='Seasons, Bouts, Matches'/>
                        <IconSkater active={recordType === 'SKR'} onClick={onClickSKR} title='Skaters'/>
                        <IconSlideshow active={recordType === 'SLS'} onClick={onClickSLS} title='Slideshows'/>
                        <IconTicket active={recordType === 'SPN'} onClick={onClickSPN} title='Sponsors'/>
                        <IconTeam active={recordType === 'TEM'} onClick={onClickTEM} title='Teams'/>
                        <IconMovie active={recordType === 'VID'} onClick={onClickVID} title='Videos'/>
                        <IconSettings active={configActive} onClick={onClickConfig} title='Settings'/>
                    </div>
                </div>
            </DialogBody>
        </Dialog>
    }

    return null;
}

export {DataControl};