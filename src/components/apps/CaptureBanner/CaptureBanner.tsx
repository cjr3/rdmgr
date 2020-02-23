import React, { CSSProperties } from 'react';
import cnames from 'classnames';
import {Unsubscribe} from 'redux';
import DataController from 'controllers/DataController';
import CaptureController from 'controllers/CaptureController';
import { AddMediaPath } from 'controllers/functions';
import Scorebanner from './Scorebanner/Scorebanner';
import Scorekeeper from './Scorekeeper/Scorekeeper';
import Roster from './Roster/Roster';
import PenaltyTracker from './PenaltyTracker/PenaltyTracker';
import Announcer from './Announcer/Announcer';
import Anthem from './Anthem/Anthem';
import Scores from './API/Scores';
import Schedule from './API/Schedule';
import Standings from './API/Standings';

export default class CaptureBanner extends React.PureComponent<any, {
    Background:string;
    className:string;
}> {
    readonly state = {
        Background:DataController.GetMiscRecord('ScorebannerBackground'),
        className:CaptureController.GetState().className
    }

    protected remoteData?:Unsubscribe;
    protected remoteCapture?:Unsubscribe;

    constructor(props) {
        super(props);
    }

    protected updateData(){
        this.setState({
            Background:DataController.GetMiscRecord('ScorebannerBackground')
        });
    }

    protected updateCapture(){
        this.setState({
            className:CaptureController.GetState().className
        });
    }

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

    render() {
        let style:CSSProperties = {};
        if(this.state.Background)
            style.backgroundImage = `url('${ AddMediaPath(this.state.Background) }')`;
        let className:string = cnames('capture-banner dragger', this.state.className);
        return (
            <div className={className}>
                <Scorebanner/>
                <Scorekeeper/>
                <Roster/>
                <PenaltyTracker/>
                <Announcer/>
                <Anthem/>
                <Scores/>
                <Schedule/>
                <Standings/>
            </div>
        )
    }
}