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
import CaptureRoster, { CaptureRosterBanner } from './CaptureRoster';
import CaptureStandings, { StandingsBanner } from './CaptureStandings';
import CaptureSchedule, { ScheduleBanner } from './CaptureSchedule';
import CaptureScores, { ScoresBanner } from './CaptureScores';
import { Unsubscribe } from 'redux';
import { AddMediaPath } from 'controllers/functions';
import './css/CaptureForm.scss';
import DataController from 'controllers/DataController';

/**
 * Main component for the capture window.
 */
export default class CaptureForm extends React.Component<any, {
    Background:string;
    StreamMode:boolean;
    className:string;
}> {
    readonly state = {
        Background:DataController.GetMiscRecord('LeagueBackground'),
        StreamMode:DataController.GetMiscRecord('StreamMode'),
        className:CaptureController.GetState().className
    };

    protected remoteCapture?:Unsubscribe;
    protected remoteData?:Unsubscribe;

    /**
     * Constructor
     * @param props 
     */
    constructor(props) {
        super(props);
        this.updateCapture = this.updateCapture.bind(this);
        this.updateData = this.updateData.bind(this);
    }

    protected updateCapture() {
        this.setState({
            className:CaptureController.GetState().className
        });
    }

    protected updateData() {
        this.setState({
            Background:DataController.GetMiscRecord('LeagueBackground'),
            StreamMode:DataController.GetMiscRecord('StreamMode')
        });
    }

    /**
     * Triggered when the component is mounted.
     * - Position capture window to the secondary monitor, if available.
     */
    componentDidMount() {
        CaptureController.Init(true);
        this.remoteData = DataController.Subscribe(this.updateData);
        this.remoteCapture = CaptureController.Subscribe(this.updateCapture);
    }

    componentWillUnmount() {
        if(this.remoteCapture)
            this.remoteCapture();
        if(this.remoteData)
            this.remoteData();
    }

    /**
     * Renders the component.
     */
    render() {
        let style:CSSProperties = {};
        if(this.state.Background)
            style.backgroundImage = `url('${ AddMediaPath(this.state.Background) }')`;

        let className:string = cnames('capture-form',{
            stream:this.state.StreamMode
        });

        return (
            <div className={className} style={style}>
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
                <CaptureRosterBanner/>
                <CaptureStandings/>
                <StandingsBanner/>
                <CaptureSchedule/>
                <ScheduleBanner/>
                <CaptureScores/>
                <ScoresBanner/>
            </div>
        );
    }
}