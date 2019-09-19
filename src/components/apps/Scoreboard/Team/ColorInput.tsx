import React from 'react'
import {Icon, IconCheck} from 'components/Elements'
import ScoreboardController, {SScoreboardTeam} from 'controllers/ScoreboardController';
import ColorPicker from 'material-ui-color-picker';

interface SColorInput {
    color:string
}

interface PColorInput {
    Team:SScoreboardTeam
}

/**
 * Component for a team's color input on the scoreboard.
 * Does not save to original record.
 */
class ColorInput extends React.PureComponent<PColorInput, SColorInput> {
    readonly state:SColorInput = {
        color:'#000000'
    }

    constructor(props) {
        super(props);

        this.state.color = this.props.Team.Color;

        //bindings
        this.onChange = this.onChange.bind(this);
        this.onChangeColor = this.onChangeColor.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
    }

    /**
     * Triggered when the textbox value has changed
     * @param {Event} ev 
     */
    onChange(ev) {
        const color = ev.target.value;
        this.setState(() => {
            return {color:color};
        });
    }

    /**
     * Triggered when the 'checkmark' icon is updated.
     * @param {MouseEvent} ev 
     */
    onClick() {
        ScoreboardController.SetTeamColor(this.props.Team, this.state.color);
    }

    /**
     * Triggered when the user presses a key with the textbox focused.
     * @param {KeyEvent} ev 
     */
    onKeyUp(ev) {
        if(ev.keyCode === 13) {
            ScoreboardController.SetTeamColor(this.props.Team, this.state.color);
        } else if(ev.keyCode === 27) {
            ev.target.blur();
        }
    }

    /**
     * Triggered when the component updates.
     * @param {Object} prevProps 
     */
    componentDidUpdate(prevProps) {
        if(prevProps.Team.Color !== this.props.Team.Color) {
            this.setState(() => {
                return {color:this.props.Team.Color};
            });
        }
    }

    /**
     * Triggered when the color field changes.
     * @param {string} value
     */
    onChangeColor(value) {
        this.setState(() => {
            return {color:value};
        });
    }

    /**
     * Renders the component.
     */
    render() {
        var color = (this.state.color) ? this.state.color : '#000000';
        var changed = (color !== this.props.Team.Color);
        return (
            <div>
                <div>Color</div>
                <div className="color-picker">
                    <ColorPicker
                        name='color'
                        value={color}
                        size='10'
                        onChange={this.onChangeColor}
                        />
                </div>
                <div>
                    <Icon
                        src={IconCheck}
                        onClick={this.onClick}
                        title="Change Color"
                        active={changed}
                    />
                </div>
            </div>
        )
    }
}

export default ColorInput;