import React from 'react';
import cnames from 'classnames';
import {TeamRecord} from 'tools/vars';
import TeamsController from 'controllers/TeamsController';
import { AddMediaPath } from 'controllers/functions';

/**
 * Component for selecting a single team
 */
export default class TeamSelection extends React.PureComponent<{
    /**
     * Current team ID
     */
    teamid?:number;
    /**
     * Triggered when the user changes the team
     */
    onChange?:Function;
    /**
     * Additional class names
     */
    className?:string;
}, {
    /**
     * Collection of teams to choose from
     */
    teams:Array<TeamRecord>;
    /**
     * Selected team
     */
    index:number;
}> {
    readonly state = {
        teams:TeamsController.Get(),
        index:0
    }

    /**
     * DataController listener
     */
    protected remoteData:Function|null = null;

    /**
     * Constructor
     * @param props 
     */
    constructor(props) {
        super(props);
        this.onChangeSelect = this.onChangeSelect.bind(this);
        this.next = this.next.bind(this);
        this.prev = this.prev.bind(this);
        this.updateData = this.updateData.bind(this);
    }

    /**
     * Updates the state to match the controller.
     */
    protected updateData() {
        this.setState({teams:TeamsController.Get()});
    }

    /**
     * Shows the next team.
     */
    protected next() {
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
    protected prev() {
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
    protected onChangeSelect(ev: React.ChangeEvent<HTMLSelectElement>) {
        var value = parseInt( ev.target.value );
        this.setState(() => {
            return {index:value};
        }, () => {
            if(this.props.onChange)
                this.props.onChange(this.state.teams[this.state.index]);
        });
    }

    /**
     * Updates the team selection from props
     */
    protected updateTeam() {
        let index:number = -1;
        for(let i=0; i < this.state.teams.length; i++) {
            if(this.state.teams[i].RecordID === this.props.teamid) {
                index = i;
                break;
            }
        }
        if(index != this.state.index && index >= 0) {
            this.setState({index:index});
        }
    }

    /**
     * Triggered when the component updates
     * @param prevProps 
     */
    componentDidUpdate(prevProps) {
        if(prevProps.teamid !== this.props.teamid) {
            this.updateTeam();
        }
    }

    /**
     * Triggered when the component mounts to the DOM
     */
    componentDidMount() {
        if(this.props.teamid)
            this.updateTeam();
        this.remoteData = TeamsController.Subscribe(this.updateData);
    }

    /**
     * Close listeners
     */
    componentWillUnmount() {
        if(this.remoteData !== null)
            this.remoteData();
    }

    /**
     * Renders the component.
     */
    render() {
        let options:Array<React.ReactElement> = [];
        let src:string = '';
        let i = 0;
        this.state.teams.forEach((team) => {
            options.push(
                <option value={i} key={`${team.RecordType}-${team.RecordID}`}>{team.Name.replace('|', ' ')}</option>
            );
    
            if(i === this.state.index) {
                src = AddMediaPath(team.Thumbnail);
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