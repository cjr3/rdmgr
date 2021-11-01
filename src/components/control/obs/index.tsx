import { Panel, PanelContent, PanelFooter, PanelTitle } from 'components/common/panel';
import React from 'react';
import { OBS } from 'tools/obs/functions';
import { OBSController } from 'tools/OBSController';


interface Props {
    active:boolean;
    onHide:{():void}
}

/**
 * OBS Control Panel
 * @param props 
 * @returns 
 */
const OBSControl:React.FunctionComponent<Props> = props => {
    const {active, onHide} = {...props};
    const [connected, setConnected] = React.useState(OBSController.Connected);

    const connect = React.useCallback(() => {
        if(!connected) {
            OBSController.Init().then(() => {
                OBS.Init().then(() => {}).catch(() => {});
            }).catch(() => {
    
            });
        }
    }, [connected]);

    React.useEffect(() => { connect(); }, [connect]);

    React.useEffect(() => OBS.Subscribe(() => {
        setConnected(OBS.GetState().OBSSettings.Connected);
    }), []);

    
    return <Panel active={active} onHide={onHide} style={{maxWidth:'300px'}}>
            <PanelTitle onHide={onHide}>Open Broadcaster Studio</PanelTitle>
            <PanelContent>
                {
                    (!connected) &&
                    <div style={{
                        display:'grid',
                        gridTemplateColumns:'auto auto 1fr'
                    }}>
                        <span style={{padding:'16px'}}>
                            Is OBS Connected?
                        </span>
                    </div>
                }
            </PanelContent>
            <PanelFooter>
                {
                    (!connected) &&
                    <>
                        <button onClick={connect}>Connect</button>
                    </>
                }
                {
                    (connected) &&
                    <>
                        ...
                    </>
                }
            </PanelFooter>
        </Panel>
    ;
};

export {OBSControl};