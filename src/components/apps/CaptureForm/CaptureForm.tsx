import React, { CSSProperties } from 'react';
import cnames from 'classnames';
import CaptureController from 'controllers/CaptureController';
import CaptureScoreboard from './CaptureScoreboard';
import CaptureScorebanner from './CaptureScorebanner';
import CaptureJamClock from './CaptureJamClock';
import CaptureJamCounter from './CaptureJamCounter';
import CaptureCamera from './CaptureCamera';
import CaptureVideo from './CaptureVideo';
import CaptureSlideshow from './CaptureSlideshow'
import CapturePenaltyTracker from './CapturePenaltyTracker'
import CaptureAnthem, {CaptureAnthemBanner} from './CaptureAnthem'
import CaptureRaffle from './CaptureRaffle'
import CaptureScorekeeper from './CaptureScorekeeper'
import CaptureSponsor from './CaptureSponsor';
import CaptureAnnouncers from './CaptureAnnouncers';
import CaptureRoster from './CaptureRoster';
import CaptureStandings from './CaptureStandings';
import CaptureSchedule from './CaptureSchedule';
import CaptureScores from './CaptureScores';
import { Unsubscribe } from 'redux';
import { AddMediaPath } from 'controllers/functions';
import './css/CaptureForm.scss';

/**
 * Main component for the capture window.
 */
export default class CaptureForm extends React.Component<any, {
    Background:string;
}> {
    readonly state = {
        Background:CaptureController.GetState().Background
    };

    protected remoteStatus?:Unsubscribe;

    /**
     * Constructor
     * @param props 
     */
    constructor(props) {
        super(props);
    }

    /**
     * Triggered when the component is mounted.
     * - Position capture window to the secondary monitor, if available.
     */
    componentDidMount() {
        CaptureController.Init(true);
    }

    /**
     * Renders the component.
     */
    render() {
        let style:CSSProperties = {};
        if(this.state.Background)
            style.backgroundImage = `url('${ AddMediaPath(this.state.Background) }')`;

        return (
            <div className="capture-form" style={style}>
                <div className="dragger"></div>
                <CaptureCamera/>
                <CaptureVideo/>
                <CaptureScoreboard/>
                <CaptureSlideshow/>
                <CaptureSponsor/>
                <CaptureScorebanner/>
                <CapturePenaltyTracker/>
                <CaptureAnthem/>
                <CaptureAnthemBanner/>
                <CaptureJamClock/>
                <CaptureJamCounter/>
                <CaptureRaffle/>
                <CaptureScorekeeper/>
                <CaptureAnnouncers/>
                <CaptureRoster/>
                <CaptureStandings/>
                <CaptureSchedule/>
                <CaptureScores/>
            </div>
        );
    }
}