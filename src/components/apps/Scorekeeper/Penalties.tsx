import React from 'react';
import { Sides } from 'controllers/ScorekeeperController';
import { SkaterRecord } from 'tools/vars';
import { Unsubscribe } from 'redux';
import RosterController from 'controllers/RosterController';

export default class Penalties extends React.PureComponent<{
    side:Sides;
}, {
    Skaters:Array<SkaterRecord>;
}>{
    readonly state = {
        Skaters:new Array<SkaterRecord>()
    }

    protected remoteRoster?:Unsubscribe;

    constructor(props) {
        super(props);
        this.updateRoster = this.updateRoster.bind(this);
        if(this.props.side == 'A') {
            this.state.Skaters = RosterController.GetState().TeamA.Skaters;
        } else {
            this.state.Skaters = RosterController.GetState().TeamB.Skaters;
        }
    }

    protected updateRoster() {
        if(this.props.side == 'A') {
            this.setState({Skaters:RosterController.GetState().TeamA.Skaters});
        } else {
            this.setState({Skaters:RosterController.GetState().TeamB.Skaters});
        }
    }

    componentDidMount() {
        this.remoteRoster = RosterController.Subscribe(this.updateRoster);
    }

    componentWillUnmount() {
        if(this.remoteRoster)
            this.remoteRoster();
    }

    render() {
        let skaters:Array<React.ReactElement> = new Array<React.ReactElement>();
        this.state.Skaters.forEach((skater:SkaterRecord) => {
            if(skater.Penalties && skater.Penalties.length) {
                let codes:Array<string> = new Array<string>();
                skater.Penalties.forEach((p) => {
                    if(p.Acronym)
                        codes.push(p.Acronym);
                    else if(p.Code)
                        codes.push(p.Code);
                });
                if(codes && codes.length) {
                    skaters.push(
                        <div className="skater" key={`${skater.RecordType}-${skater.RecordID}`}>
                            {`#${skater.Number} : ${codes.join(', ')}`}
                        </div>
                    );
                }
            }
        });
        return (
            <div className={`team-${this.props.side}`}>
                {skaters}
            </div>
        )
    }
}