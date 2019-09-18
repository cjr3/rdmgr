import React from 'react'
import Counter from 'components/tools/Counter'
import vars from 'tools/vars';
import ScoreboardController from 'controllers/ScoreboardController'

/**
 * Score component for team score on the scoreboard control.
 */
class Score extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            score:(this.props.Team) ? this.props.Team.Score : 0,
            color:(this.props.Team) ? this.props.Team.Color : '#000000',
            jampoints:(this.props.Team) ? this.props.Team.JamPoints : 0
        }

        this.Counter = React.createRef();

        //bindings
        this.onChange = this.onChange.bind(this);
        this.onAdd = this.onAdd.bind(this);
        this.onSubtract = this.onSubtract.bind(this);
        this.updateState = this.updateState.bind(this);
        this.remote = ScoreboardController.subscribe(this.updateState);
    }

    /**
     * Updates the state to match the controller.
     */
    updateState() {
        this.setState(() => {
            var score = ScoreboardController.getState().TeamA.Score;
            var jampoints = ScoreboardController.getState().TeamA.JamPoints;
            if(this.props.Team.Side === 'B') {
                score = ScoreboardController.getState().TeamB.Score;
                jampoints = ScoreboardController.getState().TeamB.JamPoints;
            }
            
            this.Counter.current.set(score, false);
            return {
                score:score,
                jampoints:jampoints
            };
        });
    }

    /**
     * Triggered when the counter changes.
     * @param {Number} amount 
     */
    onChange(amount) {
        this.setState(() => {
            return {score:amount}
        }, () => {
            //ScoreboardController.SetTeamScore(this.props.Team, amount);
        });
    }

    /**
     * Triggered when the counter increases.
     * @param {Number} amount 
     */
    onAdd(amount) {
        ScoreboardController.IncreaseTeamScore(this.props.Team, amount);
        //if(ScoreboardController.getState().JamState !== vars.Clock.Status.Running) {
            //ScoreboardController.IncreaseTeamJamPoints(this.props.Team, amount);
        //}
    }

    /**
     * Triggered when the counter decreases.
     * @param {Number} amount 
     */
    onSubtract(amount) {
        ScoreboardController.DecreaseTeamScore(this.props.Team, amount);
        //if(ScoreboardController.getState().JamState !== vars.Clock.Status.Running) {
            //ScoreboardController.DecreaseTeamJamPoints(this.props.Team, amount);
        //}
    }

    /**
     * Triggered when the component mounts to the DOM.
     */
    componentDidMount() {
        if(this.Counter.current) {
            this.Counter.current.set(this.state.score, false);
        }
    }

    /**
     * Renders the component.
     */
    render() {
        var style = {
            backgroundColor:this.props.color
        }

        return (
            <Counter 
                className="score"
                min={0}
                max={999}
                style={style}
                onChange={this.onChange}
                onAdd={this.onAdd}
                onSubtract={this.onSubtract}
                ref={this.Counter}
                {...this.props}
            />
        )
    }
}

export default Score;