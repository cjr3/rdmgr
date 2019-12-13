import React from 'react';
import DataController from 'controllers/DataController';
import { 
    Icon,
    IconCheck,
    IconLoop,
    IconSave
} from 'components/Elements';

/**
 * Component for posting scores to bout records at the API endpoint.
 */
export default function Scores(props:{Matches:Array<any>}) {
    let matches:Array<React.ReactElement> = new Array<React.ReactElement>();
    props.Matches.forEach((match:any, index:number) => {
        matches.push(
            <MatchItem
                key={`${match.RecordType}-${match.RecordID}`}
                record={match}
            />
        );
    });

    return (
        <React.Fragment>
            {matches}
        </React.Fragment>
    );
}

/**
 * Component to display an individual match record
 */
class MatchItem extends React.PureComponent<{
    record:any;
}, {
    ScoreA:number;
    ScoreB:number;
    saving:boolean;
    errorMessage:string;
}> {

    readonly state = {
        ScoreA:0,
        ScoreB:0,
        errorMessage:'',
        saving:false
    }

    /**
     * Date of the bout
     */
    protected MatchDate:Date|undefined;

    /**
     * Constructor
     * @param props
     */
    constructor(props) {
        super(props);
        this.MatchDate = new Date(Date.parse(this.props.record.DateStart));
        this.state.ScoreA = this.props.record.TeamA.Score;
        this.state.ScoreB = this.props.record.TeamB.Score;
        this.onChangeScoreA = this.onChangeScoreA.bind(this);
        this.onChangeScoreB = this.onChangeScoreB.bind(this);
        this.onClickSubmit = this.onClickSubmit.bind(this);
    }

    /**
     * Triggered whe the user updates the left-side team's Score
     * @param ev React.ChangeEvent
     */
    protected onChangeScoreA(ev:React.ChangeEvent<HTMLInputElement>) {
        let value:number = parseInt(ev.currentTarget.value);
        this.setState({ScoreA:value});
    }

    /**
     * Triggered whe the user updates the right-side team's Score
     * @param ev React.ChangeEvent
     */
    protected onChangeScoreB(ev:React.ChangeEvent<HTMLInputElement>) {
        let value:number = parseInt(ev.currentTarget.value);
        this.setState({ScoreB:value});
    }

    /**
     * Triggered when the user clicks the Submit button
     * - Attempts to post the score to the API endpoint
     */
    protected onClickSubmit() {
        this.setState(() => {
            return {saving:true};
        }, async () => {
            DataController.putMatchScores(
                this.props.record.RecordID,
                this.state.ScoreA,
                this.state.ScoreB
            ).then(() => {
                this.setState({errorMessage:"",saving:false});
            }).catch((error) => {
                this.setState({errorMessage:error,saving:false});
            });
        });
    }

    /**
     * Renders the component
     */
    render() {
        let mdate:string = "";
        if(this.MatchDate) {
            mdate = this.MatchDate.toLocaleDateString('en-us', {
                month:'2-digit',
                day:'2-digit',
                year:'numeric'
            });
        }

        let iconSaving:string = IconSave;
        if(this.state.saving)
            iconSaving = IconLoop;

        return (
            <div className="match-item">
                <div className="match-date">{mdate}</div>
                <table>
                    <tbody>
                        <tr>
                            <td className="match-team">
                                <img src={this.props.record.TeamA.Thumbnail} title={this.props.record.TeamA.Name}/>
                            </td>
                            <td className="match-team">
                                <img src={this.props.record.TeamB.Thumbnail} title={this.props.record.TeamB.Name}/>
                            </td>
                        </tr>
                        <tr>
                            <td className="match-score">
                                <input
                                    type="number"
                                    min={0}
                                    max={999}
                                    value={this.state.ScoreA}
                                    onChange={this.onChangeScoreA}
                                    disabled={this.state.saving}
                                    size={4}
                                    />
                            </td>
                            <td className="match-score">
                                <input
                                    type="number"
                                    min={0}
                                    max={999}
                                    value={this.state.ScoreB}
                                    onChange={this.onChangeScoreB}
                                    disabled={this.state.saving}
                                    size={4}
                                    />
                            </td>
                            <td>
                                <Icon
                                    onClick={this.onClickSubmit}
                                    src={iconSaving}
                                    active={this.state.saving}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}