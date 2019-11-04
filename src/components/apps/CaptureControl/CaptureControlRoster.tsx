import React, { ReactElement } from 'react';
import ReactDOM from 'react-dom';
import RosterController from 'controllers/RosterController';
import ScoreboardController from 'controllers/ScoreboardController';
import CaptureController from 'controllers/CaptureController';
import DataController from 'controllers/DataController';
import CaptureControlPanel, {PCaptureControlPanel} from './CaptureControlPanel';

import {
    Button,
    IconShown,
    IconHidden,
    IconButton,
    IconLoop,
    IconLeft,
    IconRight,
    IconTeam
} from 'components/Elements';

interface SCaptureControlRoster {
    Shown:boolean;
    CurrentTeam:string;
    SkaterIndex:number;
    TeamA:any;
    TeamB:any;
    SkatersA:any;
    SkatersB:any;
    ScrollPosition:number;
}

/**
 * Component for configuring the roster.
 */
class CaptureControlRoster extends React.PureComponent<PCaptureControlPanel, SCaptureControlRoster> {

    readonly state:SCaptureControlRoster = {
        Shown:CaptureController.getState().Roster.Shown,
        CurrentTeam:RosterController.getState().CurrentTeam,
        SkaterIndex:RosterController.getState().SkaterIndex,
        TeamA:ScoreboardController.getState().TeamA,
        TeamB:ScoreboardController.getState().TeamB,
        SkatersA:RosterController.getState().TeamA.Skaters,
        SkatersB:RosterController.getState().TeamB.Skaters,
        ScrollPosition:0
    }

    remoteState:Function
    remoteCapture:Function
    remoteScoreboard:Function

    protected RecordsItem:React.RefObject<HTMLDivElement> = React.createRef();
    protected RecordItem:React.RefObject<HTMLDivElement> = React.createRef();

    constructor(props) {
        super(props);

        this.updateState = this.updateState.bind(this);
        this.updateCapture = this.updateCapture.bind(this);
        this.updateScoreboard = this.updateScoreboard.bind(this);
        this.onClickNext = this.onClickNext.bind(this);
        this.onClickPrev = this.onClickPrev.bind(this);

        this.remoteState = RosterController.subscribe(this.updateState);
        this.remoteCapture = CaptureController.subscribe(this.updateCapture);
        this.remoteScoreboard = ScoreboardController.subscribe(this.updateScoreboard);
    }

    /**
     * Updates the state to match the camera controller.
     */
    protected async updateState() {
        let cstate = RosterController.getState();
        let changes:any = {
            CurrentTeam:cstate.CurrentTeam,
            SkaterIndex:cstate.SkaterIndex,
        }

        if(!DataController.compare(cstate.TeamA.Skaters, this.state.SkatersA))
            changes.SkatersA = cstate.TeamA.Skaters;
        if(!DataController.compare(cstate.TeamB.Skaters, this.state.SkatersB))
            changes.SkatersB = cstate.TeamB.Skaters;

        this.setState(changes);
    }

    /**
     * Updates the state to match the capture controller.
     */
    protected async updateCapture() {
        this.setState({
            Shown:CaptureController.getState().Roster.Shown
        });
    }

    /**
     * Updates the state to match the scoreboard controller.
     * - Update Team A
     * - Update Team B
     */
    protected async updateScoreboard() {
        let teamA = ScoreboardController.getState().TeamA;
        let teamB = ScoreboardController.getState().TeamB;
        if(!DataController.compare(teamA, this.state.TeamA))
            this.setState({TeamA:teamA});
        if(!DataController.compare(teamB, this.state.TeamB))
            this.setState({TeamB:teamB});
    }

    /**
     * 
     */
    onClickNext() {
        RosterController.Next();
    }

    /**
     * 
     */
    onClickPrev() {
        RosterController.Prev();
    }

    componentDidUpdate() {
        if(this.RecordItem !== null && this.RecordItem.current !== null
            && this.RecordsItem !== null && this.RecordsItem.current !== null) {
            this.RecordItem.current.scrollIntoView({behavior:"smooth"});
        }
    }

    /**
     * Renders the component.
     */
    render() {
        let skaters:Array<React.ReactElement> = [
            <Button
                key="team-a"
                active={(this.state.CurrentTeam === 'A' && this.state.SkaterIndex < 0)}
                className="skater"
                onDoubleClick={() => {
                    RosterController.SetSkater('A', -1)
                }}
                >
                    <div ref={(this.state.CurrentTeam === 'A' && this.state.SkaterIndex < 0) ? this.RecordItem : null}>
                        <div className="num">
                            <img src={DataController.mpath(this.state.TeamA.Thumbnail, false)} alt=""/>
                        </div>
                        <div className="name">{this.state.TeamA.Name}</div>
                    </div>
                </Button>
        ];

        this.state.SkatersA.forEach((skater, index) => {
            skaters.push(
                <Button
                    key={`${skater.RecordType}-${skater.RecordID}`}
                    active={(this.state.CurrentTeam === 'A' && this.state.SkaterIndex === index)}
                    className="skater"
                    onDoubleClick={() => {
                        RosterController.SetSkater('A', index)
                    }}
                    >
                        <div ref={(this.state.CurrentTeam === 'A' && this.state.SkaterIndex === index) ? this.RecordItem : null}>
                            <div className="num">{skater.Number}</div>
                            <div className="name">{skater.Name}</div>
                        </div>
                    </Button>
            );
        });

        skaters.push(
            <Button
                key="team-b"
                active={(this.state.CurrentTeam === 'B' && this.state.SkaterIndex < 0)}
                className="skater"
                onDoubleClick={() => {
                    RosterController.SetSkater('B', -1)
                }}
                >
                    <div ref={(this.state.CurrentTeam === 'B' && this.state.SkaterIndex < 0) ? this.RecordItem : null}>
                        <div className="num">
                            <img src={DataController.mpath(this.state.TeamB.Thumbnail, false)} alt=""/>
                        </div>
                        <div className="name">{this.state.TeamB.Name}</div>
                    </div>
                </Button>
        );

        this.state.SkatersB.forEach((skater, index) => {
            skaters.push(
                <Button
                    key={`${skater.RecordType}-${skater.RecordID}`}
                    active={(this.state.CurrentTeam === 'B' && this.state.SkaterIndex === index)}
                    className="skater"
                    onDoubleClick={() => {
                        RosterController.SetSkater('B', index)
                    }}
                    >
                        <div ref={(this.state.CurrentTeam === 'B' && this.state.SkaterIndex === index) ? this.RecordItem : null}>
                            <div className="num">{skater.Number}</div>
                            <div className="name">{skater.Name}</div>
                        </div>
                    </Button>
            );
        });

        let buttons:Array<React.ReactElement> = [
            <IconButton
                key="btn-load"
                src={IconLoop}
                title="Load Roster"
                onClick={RosterController.LoadSkaters}
                />,
            <IconButton
                key="btn-hide"
                active={this.state.Shown}
                title="Show/Hide"
                src={(this.state.Shown) ? IconShown : IconHidden}
                onClick={CaptureController.ToggleRoster}
                />,
            <IconButton
                key="btn-prev"
                src={IconLeft}
                title="Previous"
                onClick={this.onClickPrev}
                />,
            <IconButton
                key="btn-next"
                src={IconRight}
                title="Next"
                onClick={this.onClickNext}
                />
        ];

        return (
            <CaptureControlPanel
                active={this.props.active}
                name={'Intro'}
                icon={IconTeam}
                toggle={CaptureController.ToggleRoster}
                shown={this.state.Shown}
                buttons={buttons}
                onClick={this.props.onClick}>
                <div className="record-list roster-skaters" ref={this.RecordsItem}>
                    {skaters}
                </div>
            </CaptureControlPanel>
        );
    }
}

export default CaptureControlRoster;