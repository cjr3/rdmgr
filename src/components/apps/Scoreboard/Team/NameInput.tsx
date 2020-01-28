import React from 'react';
import {Icon, IconCheck} from 'components/Elements';
import ScoreboardController from 'controllers/ScoreboardController';
import { Unsubscribe } from 'redux';

/**
 * Name input handler for the a team.
 */
class NameInput extends React.PureComponent<{
    side:'A' | 'B';
}, {
    name:string;
    id:number;
}> {
    readonly state = {
        name:ScoreboardController.GetState().TeamA.Name,
        id:ScoreboardController.GetState().TeamA.ID
    }

    /**
     * ScoreboardController listener
     */
    protected remoteScoreboard?:Unsubscribe;

    /**
     * Constructor
     * @param props 
     */
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.onSubmitName = this.onSubmitName.bind(this);
        this.updateScoreboard = this.updateScoreboard.bind(this);
        if(this.props.side == 'B') {
            this.state.id = ScoreboardController.GetState().TeamB.ID;
            this.state.name = ScoreboardController.GetState().TeamB.Name;
        }
    }

    /**
     * Change the name if the team ID changed
     */
    protected updateScoreboard() {
        let id:number = ScoreboardController.GetState().TeamA.ID;
        let name:string = ScoreboardController.GetState().TeamA.Name;
        if(this.props.side == 'B') {
            id = ScoreboardController.GetState().TeamB.ID;
            name = ScoreboardController.GetState().TeamB.Name;
        }

        if(this.state.id != id) {
            this.setState({id:id,name:name});
        }
    }

    /**
     * Triggered when the textbox value changes.
     * @param {Event} ev 
     */
    protected onChange(ev:React.ChangeEvent<HTMLInputElement>) {
        const name = ev.currentTarget.value;
        this.setState({name:name});
    }

    /**
     * Triggered when the user accepts the name change.
     */
    protected onSubmitName() {
        ScoreboardController.SetTeamName(this.props.side, this.state.name);
    }

    /**
     * Start listeners
     */
    componentDidMount() {
        this.remoteScoreboard = ScoreboardController.Subscribe(this.updateScoreboard);
    }

    /**
     * Close listeners
     */
    componentWillUnmount() {
        if(this.remoteScoreboard)
            this.remoteScoreboard();
    }

    /**
     * Renders the component.
     */
    render() {
        let name:string = (this.state.name) ? this.state.name : '';
        let sname:string = ScoreboardController.GetState().TeamA.Name;
        if(this.props.side === 'B')
            sname = ScoreboardController.GetState().TeamB.Name;
        return (
            <div>
                <div>Name</div>
                <div>
                    <input 
                        type="text" 
                        size={15}
                        maxLength={30}
                        value={name}
                        onChange={this.onChange}
                    />
                </div>
                <div>
                    <Icon
                        src={IconCheck}
                        title="Change Name"
                        active={(sname !== name)}
                        onClick={this.onSubmitName}
                    />
                </div>
            </div>
        )
    }
}

export default NameInput;