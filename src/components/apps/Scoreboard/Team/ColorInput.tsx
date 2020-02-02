import React from 'react'
import {Icon, IconCheck} from 'components/Elements'
import ScoreboardController from 'controllers/ScoreboardController';
import ColorPicker from 'material-ui-color-picker';
import { Unsubscribe } from 'redux';

/**
 * Component for a team's color input on the scoreboard.
 * Does not save to original record.
 */
export default class ColorInput extends React.PureComponent<{
    side:'A' | 'B';
}, {
    /**
     * Color for user selection
     */
    color:string;
    id:number;
}> {
    readonly state = {
        color:'#000000',
        id:ScoreboardController.GetState().TeamA.ID
    }

    protected remoteScoreboard?:Unsubscribe;

    /**
     * Constructor
     * @param props 
     */
    constructor(props) {
        super(props);

        //bindings
        this.onChange = this.onChange.bind(this);
        this.onChangeColor = this.onChangeColor.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onContextMenu = this.onContextMenu.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
        this.updateScoreboard = this.updateScoreboard.bind(this);
    }

    /**
     * Change the color if the team ID changed
     */
    protected updateScoreboard() {
        let id:number = ScoreboardController.GetState().TeamA.ID;
        let color:string = ScoreboardController.GetState().TeamA.Color;
        if(this.props.side == 'B') {
            id = ScoreboardController.GetState().TeamB.ID;
            color = ScoreboardController.GetState().TeamB.Color;
        }

        if(id != this.state.id) {
            this.setState({id:id,color:color});
        }
    }

    /**
     * Triggered when the textbox value has changed
     * @param {Event} ev 
     */
    protected onChange(ev:React.ChangeEvent<HTMLInputElement>) {
        const color = ev.currentTarget.value;
        this.setState({color:color});
    }

    /**
     * Triggered when the 'checkmark' icon is updated.
     * @param {MouseEvent} ev 
     */
    protected onClick() {
        ScoreboardController.SetTeamColor(this.props.side, this.state.color);
    }

    protected onContextMenu() {
        let color:string = ScoreboardController.GetState().TeamA.Color;
        if(this.props.side == 'B')
            color = ScoreboardController.GetState().TeamB.Color;
        this.setState({color:color});
    }

    /**
     * Triggered when the user presses a key with the textbox focused.
     * @param {KeyEvent} ev 
     */
    protected onKeyUp(ev:React.KeyboardEvent<HTMLInputElement>) {
        if(ev.keyCode === 13) {
            ScoreboardController.SetTeamColor(this.props.side, this.state.color);
        } else if(ev.keyCode === 27) {
            ev.currentTarget.blur();
        }
    }

    /**
     * Triggered when the color field changes.
     * @param {string} value
     */
    protected onChangeColor(value) {
        this.setState({color:value});
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
        let color:string = (this.state.color) ? this.state.color : '#000000';
        let scolor:string = ScoreboardController.GetState().TeamA.Color;
        if(this.props.side === 'B')
            scolor = ScoreboardController.GetState().TeamB.Color;
        return (
            <div>
                <div>Color</div>
                <div className="color-picker">
                    <ColorPicker
                        name='color'
                        value={color}
                        onChange={this.onChangeColor}
                        />
                </div>
                <div>
                    <Icon
                        src={IconCheck}
                        onClick={this.onClick}
                        onContextMenu={this.onContextMenu}
                        title="Change Color"
                        active={(color !== scolor)}
                    />
                </div>
            </div>
        )
    }
}