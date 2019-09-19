import React from 'react'
import cnames from 'classnames'
import DataController from 'controllers/DataController';
import {TeamRecord} from 'tools/vars';

interface STeamSelection {
    teams:Array<TeamRecord>,
    index:number
}

interface PTeamSelection {
    teamid?:number,
    onChange?:Function,
    className?:string
}

class TeamSelection extends React.PureComponent<PTeamSelection, STeamSelection> {
    readonly state:STeamSelection = {
        teams:DataController.getTeams(true),
        index:0
    }

    remoteData:Function

    constructor(props) {
        super(props);

        if(this.props.teamid) {
            for(let i=0; i < this.state.teams.length; i++) {
                if(this.state.teams[i].RecordID == this.props.teamid) {
                    this.state.index = i;
                    break;
                }
            }
        }

        //bindings
        this.onChangeSelect = this.onChangeSelect.bind(this);
        this.next = this.next.bind(this);
        this.prev = this.prev.bind(this);
        this.updateState = this.updateState.bind(this);
        this.remoteData = DataController.subscribe(this.updateState);
    }

    /**
     * Updates the state to match the controller.
     */
    updateState() {
        var teams = DataController.getTeams(true);
        if(!DataController.compare(teams, this.state.teams)) {
            this.setState((state) => {
                var index = state.index;
                if(index >= teams.length)
                    index = 0;
                return {
                    index:index,
                    teams:teams.slice()
                };
            })
        }
    }

    /**
     * Shows the next team.
     */
    next() {
        var index = this.state.index + 1;
        if(index >= this.state.teams.length)
            index = 0;
        this.setState(() => {
            return {index:index};
        }, () => {
            if(this.props.onChange)
                this.props.onChange(this.state.teams[this.state.index]);
        });
    }

    /**
     * Shows the previous team.
     */
    prev() {
        var index = this.state.index - 1;
        if(index < 0)
            index = this.state.teams.length - 1;
        this.setState(() => {
            return {index:index};
        }, () => {
            if(this.props.onChange)
                this.props.onChange(this.state.teams[this.state.index]);
        });
    }

    /**
     * Triggered when the user changes the selection of the drop-down menu.
     * @param {Event} ev 
     */
    onChangeSelect(ev) {
        var value = parseInt( ev.target.value );
        this.setState(() => {
            return {index:value};
        }, () => {
            if(this.props.onChange)
                this.props.onChange(this.state.teams[this.state.index]);
        });
    }

    componentDidUpdate(prevProps) {
        if(prevProps.teamid !== this.props.teamid) {
            var index = 0;
            if(this.state.teams) {
                for(var key in this.state.teams) {
                    if(this.state.teams[key].RecordID == this.props.teamid) {
                        index = parseInt(key);
                        break;
                    }
                }
            }

            if(index !== this.state.index && index >= 0) {
                this.setState({index:index});
            }
        }
    }

    /**
     * Renders the component.
     */
    render() {
        var options:Array<React.ReactElement> = [];
        var src:string = '';
        var i = 0;
        this.state.teams.forEach((team) => {
            options.push(
                <option value={i} key={`${team.RecordType}-${team.RecordID}`}>{team.Name.replace('|', ' ')}</option>
            );
    
            if(i == this.state.index) {
                src = DataController.mpath(team.Thumbnail);
            }
            i++;
        });

        return (
            <div className={cnames("team-selection", this.props.className)}>
                <select size={1} onChange={this.onChangeSelect} value={this.state.index}>{options}</select>
                <img src={src} onClick={this.next} onContextMenu={this.prev} alt=""/>
            </div>
        )
    }
}

export default TeamSelection;