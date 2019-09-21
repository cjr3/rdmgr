import React from 'react';
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
    Shown:boolean,
    CurrentTeam:string,
    SkaterIndex:number,
    TeamA:any,
    TeamB:any,
    SkatersA:any,
    SkatersB:any
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
        SkatersB:RosterController.getState().TeamB.Skaters
    }

    remoteState:Function
    remoteCapture:Function
    remoteScoreboard:Function

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
    updateState() {
        this.setState({
            CurrentTeam:RosterController.getState().CurrentTeam,
            SkaterIndex:RosterController.getState().SkaterIndex,
            SkatersA:RosterController.getState().TeamA.Skaters,
            SkatersB:RosterController.getState().TeamB.Skaters
        });
    }

    /**
     * Updates the state to match the capture controller.
     */
    updateCapture() {
        this.setState({
            Shown:CaptureController.getState().Roster.Shown
        });
    }

    /**
     * Updates the state to match the scoreboard controller.
     * - Update Team A
     * - Update Team B
     */
    updateScoreboard() {
        this.setState({
            TeamA:ScoreboardController.getState().TeamA,
            TeamB:ScoreboardController.getState().TeamB
        });
    }

    /**
     * 
     */
    onClickNext() {
        let team = this.state.CurrentTeam;
        let index = this.state.SkaterIndex;
        if(!this.state.Shown && team === 'A' && index < 0) {
            CaptureController.ToggleRoster();
            return;
        }

        if(!this.state.Shown && team === 'B' && (index+1) >= this.state.SkatersB.length) {
             RosterController.SetSkater('A', -1);
             return;
        }

        if(team === 'A' && (index+1) >= this.state.SkatersA.length) {
            if(this.state.Shown) {
                CaptureController.ToggleRoster();
            } else {
                RosterController.Next();
                CaptureController.ToggleRoster();
            }
        } else {
            if(this.state.Shown) {
                if(team === 'B' && (index+1) >= this.state.SkatersB.length) {
                    CaptureController.ToggleRoster();
                } else {
                    RosterController.Next();
                }
            } else {
                CaptureController.ToggleRoster();
            }
        }
    }

    /**
     * 
     */
    onClickPrev() {
        let team = this.state.CurrentTeam;
        let index = this.state.SkaterIndex;
        if(team === 'A' && index < 0) {
            CaptureController.ToggleRoster();
            return;
        } else if(team === 'A' && (index - 1) === -1) {
            RosterController.Prev();
            return;
        }

        if(team === 'B' && (index-1) === -1) {
            RosterController.Prev();
            return;
        }
        
        if(team === 'B' && (index-1) < 0) {
            if(this.state.Shown) {
                CaptureController.ToggleRoster();
            } else {
                RosterController.Prev();
                CaptureController.ToggleRoster();
            }
        } else {
            if(this.state.Shown) {
                RosterController.Prev();
            } else {
                CaptureController.ToggleRoster();
            }
        }
    }

    /**
     * Renders the component.
     */
    render() {
        var skaters = [
            <Button
                key="team-a"
                active={(this.state.CurrentTeam === 'A' && this.state.SkaterIndex < 0)}
                className="skater"
                onDoubleClick={() => {
                    RosterController.SetSkater('A', -1)
                }}
                >
                    <div className="num">
                        <img src={DataController.mpath(this.state.TeamA.Thumbnail, false)} alt=""/>
                    </div>
                    <div className="name">{this.state.TeamA.Name}</div>
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
                        <div className="num">{skater.Number}</div>
                        <div className="name">{skater.Name}</div>
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
                    <div className="num">
                        <img src={DataController.mpath(this.state.TeamB.Thumbnail, false)} alt=""/>
                    </div>
                    <div className="name">{this.state.TeamB.Name}</div>
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
                        <div className="num">{skater.Number}</div>
                        <div className="name">{skater.Name}</div>
                    </Button>
            );
        });

        var buttons = [
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
                <div className="record-list roster-skaters">
                    {skaters}
                </div>
            </CaptureControlPanel>
        );
    }
}

export default CaptureControlRoster;