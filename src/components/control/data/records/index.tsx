import React from 'react';
import { RecordType } from 'tools/vars';
import { AnthemForm } from './anthem';
import { PeerForm } from './peer';
import { PenaltyForm } from './penalty';
import { PhaseForm } from './phase';
import { SeasonForm } from './season';
import { SkaterForm } from './skater';
import { SlideshowForm } from './slideshow';
import { SponsorForm } from './sponsor';
import { TeamForm } from './team';
import { VideoForm } from './video';

interface Props {
    recordId:number;
    recordType:RecordType;
    onSave:{():void};
}

/**
 * Determines which record form to display.
 * @param props 
 * @returns 
 */
const RecordForm:React.FunctionComponent<Props> = props => {
    switch(props.recordType) {
        case 'ANT' : return <AnthemForm recordId={props.recordId} onSave={props.onSave}/>;
        case 'PER' : return <PeerForm recordId={props.recordId} onSave={props.onSave}/>;
        case 'PEN' : return <PenaltyForm recordId={props.recordId} onSave={props.onSave}/>;
        case 'PHS' : return <PhaseForm recordId={props.recordId} onSave={props.onSave}/>;
        case 'SEA' : return <SeasonForm recordId={props.recordId} onSave={props.onSave}/>;
        case 'SKR' : return <SkaterForm recordId={props.recordId} onSave={props.onSave}/>;
        case 'SLS' : return <SlideshowForm recordId={props.recordId} onSave={props.onSave}/>;
        case 'SPN' : return <SponsorForm recordId={props.recordId} onSave={props.onSave}/>;
        case 'TEM' : return <TeamForm recordId={props.recordId} onSave={props.onSave}/>;
        case 'VID' : return <VideoForm recordId={props.recordId} onSave={props.onSave}/>;
        default : return null;
    }
}

export {RecordForm};