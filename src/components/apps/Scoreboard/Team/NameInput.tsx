import React from 'react';
import {Icon, IconCheck} from 'components/Elements';
import ScoreboardController, {SScoreboardTeam} from 'controllers/ScoreboardController';

interface SNameInput {
    name:string
}

interface PNameInput {
    Team:SScoreboardTeam
}

/**
 * Name input handler for the a team.
 */
class NameInput extends React.PureComponent<{
    /**
     * Team object from ScoreboardController
     */
    Team:SScoreboardTeam;
}, {
    /**
     * User entered name
     */
    name:string;
}> {
    readonly state:SNameInput = {
        name:''
    }

    /**
     * Constructor
     * @param props 
     */
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.onSubmitName = this.onSubmitName.bind(this);
    }

    /**
     * Triggered when the textbox value changes.
     * @param {Event} ev 
     */
    onChange(ev) {
        const name = ev.target.value;
        this.setState(() => {
            return {name:name};
        });
    }

    /**
     * Triggered when the user accepts the name change.
     */
    onSubmitName() {
        ScoreboardController.SetTeamName(this.props.Team, this.state.name);
    }

    /**
     * Triggered when the component updates.
     * @param {Object} prevProps 
     */
    componentDidUpdate(prevProps) {
        if(prevProps.Team.Name !== this.props.Team.Name) {
            this.setState(() => {
                return {name:this.props.Team.Name};
            });
        }
    }

    /**
     * Set name from Team
     */
    componentDidMount() {
        this.setState({name:this.props.Team.Name});
    }

    /**
     * Renders the component.
     */
    render() {
        let name:string = (this.state.name) ? this.state.name : '';
        let changed:boolean = (this.props.Team.Name !== name);
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
                        active={changed}
                        onClick={this.onSubmitName}
                    />
                </div>
            </div>
        )
    }
}

export default NameInput;