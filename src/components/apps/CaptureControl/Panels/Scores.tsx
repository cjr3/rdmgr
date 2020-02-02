import React from 'react';
import APIMatchesController from 'controllers/api/Matches';
import { IconButton, IconLoop } from 'components/Elements';
import Panel from 'components/Panel';
import Scores from 'components/data/api/Scores';

/**
 * Component for posting scores to the API Endpoint
 * - This is a wrapper component
 */
export default class ScoresPanel extends React.PureComponent<{
    opened:boolean;
    sdate?:string;
    edate?:string;
    onClose?:Function;
    className?:string;
}, {
    Matches:Array<any>;
    error?:string;
    title:string;
}> {

    readonly state = {
        Matches:[],
        error:'',
        title:"Post Scores"
    }

    /**
     * Constructor
     * @param props 
     */
    constructor(props) {
        super(props);
        this.load = this.load.bind(this);
    }

    /**
     * Attempts to load matches from the API
     */
    protected load() {
        this.setState({error:'',title:"Loading...",Matches:[]});
        let tdate:Date = new Date();
        let edate:string = tdate.toLocaleDateString('en-us',{
            year:'numeric',
            month:'2-digit',
            day:'2-digit'
        });
        tdate.setDate(tdate.getDate() - 7);
        let sdate:string = tdate.toLocaleDateString('en-us',{
            year:'numeric',
            month:'2-digit',
            day:'2-digit'
        });

        APIMatchesController.Load({
            sdate:sdate,
            edate:edate
        }).then((records) => {
            if(typeof(records) === 'object')
                this.setState({Matches:records, error:'', title:'Post Scores'});
            else
                this.setState({error:'', title:'Scores'});
        }).catch((er) => {
            this.setState({error:er});
        });
    }

    /**
     * Triggered when the component is mounted to the DOM
     */
    componentDidMount() {
        this.load();
    }

    /**
     * Renders the component
     * - A list of matches with textbox entries to adjust scores, and save them.
     */
    render() {
        const buttons:Array<React.ReactElement> = new Array<React.ReactElement>(
            <IconButton
                src={IconLoop}
                onClick={this.load}
                key="btn-load"
                >
                Load
            </IconButton>
        );

        return (
            <Panel
                popup={true}
                className="scores-panel"
                contentName="rdmgr-api-scores"
                opened={this.props.opened}
                buttons={buttons}
                error={this.state.error}
                title={this.state.title}
                onOpen={this.load}
                {...this.props}
                >
                <div className="record-form">
                    <Scores Matches={this.state.Matches}/>
                </div>
            </Panel>
        );
    }
}