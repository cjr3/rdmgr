import React from 'react'
import cnames from 'classnames'
import vars from 'tools/vars'
import ScoreboardController from 'controllers/ScoreboardController'

/**
 * Component for board status, such as official timeout, injury timeout, and more.
 */
class BoardStatus extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            BoardStatus:ScoreboardController.getState().BoardStatus
        }

        this.updateState = this.updateState.bind(this);
        this.remote = ScoreboardController.subscribe(this.updateState);
    }

    /**
     * Updates the state to match the controller.
     */
    updateState() {
        this.setState(() => {
            return {BoardStatus:ScoreboardController.getState().BoardStatus};
        });
    }

    /**
     * Renders the component.
     */
    render() {
        var classNames = cnames({
            boardstatus:true,
            timeout:(this.state.BoardStatus === vars.Scoreboard.Status.Timeout),
            injury:(this.state.BoardStatus === vars.Scoreboard.Status.Injury),
            upheld:(this.state.BoardStatus === vars.Scoreboard.Status.Upheld),
            overturned:(this.state.BoardStatus === vars.Scoreboard.Status.Overturned),
            review:(this.state.BoardStatus === vars.Scoreboard.Status.Review)
        }, this.props.className);

        return (
            <div className={classNames}>{vars.Scoreboard.StatusText[this.state.BoardStatus]}</div>
        );
    }
}

export default BoardStatus;