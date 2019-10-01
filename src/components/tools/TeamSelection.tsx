import React from 'react'
import cnames from 'classnames'
import DataController from 'controllers/DataController';
import {TeamRecord} from 'tools/vars';

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
        teams:DataController.getTeams(true),
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
    updateData() {
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
        this.remoteData = DataController.subscribe(this.updateData);
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