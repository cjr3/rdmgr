/**
 * This set of components are wrappers for common elements,
 * such as buttons, so we can have default behaviors,
 * such as keeping buttons from retaining focus when clicked.
 */
import React from 'react'
import cnames from 'classnames'
import './css/Elements.scss'
import {default as UISlider, SliderProps} from '@material-ui/core/Slider'
import DataController from 'controllers/DataController';

//static icons
export const IconAttachment:any = require('images/icons/attachment.png');
export const IconAV:any = require('images/icons/av.png');
export const IconAuto:any = require('images/icons/loop-auto.png');
export const IconBolt:any = require('images/icons/bolt.png');
export const IconCameraDefault:any = require('images/icons/camera-style-default.png');
export const IconCamera5050:any = require('images/icons/camera-style-5050.png');
export const IconCamera2080:any = require('images/icons/camera-style-2080.png');
export const IconCameraLeftThird:any = require('images/icons/camera-style-lower-third.png');
export const IconCameraRightThird:any = require('images/icons/camera-style-right-third.png');
export const IconChat:any = require('images/icons/chat.png');
export const IconCheck:any = require('images/icons/check.png');
export const IconClipboard:any = require('images/icons/clipboard.png');
export const IconConnected:any = require('images/icons/online.png');
export const IconDelete:any = require('images/icons/trash.png');
export const IconDisconnected:any = require('images/icons/offline.png');
export const IconDown:any = require('images/icons/down.png');
export const IconFlag:any = require('images/icons/flag.png');
export const IconFolder:any = require('images/icons/folder.png');
export const IconHidden:any = require('images/icons/eye-closed.png');
export const IconInjury:any = require('images/icons/injury.png');
export const IconLeft = require('images/icons/left.png');
export const IconLoop = require('images/icons/loop.png');
export const IconMic = require('images/icons/microphone.png');
export const IconMonitor = require('images/icons/monitor.png');
export const IconMovie = require('images/icons/movie.png');
export const IconMuted = require('images/icons/volume-mute.png');
export const IconNo = require('images/icons/no.png');
export const IconOfficialTimeout = require('images/icons/oto.png');
export const IconOffline = require('images/icons/offline.png');
export const IconOnline = require('images/icons/online.png');
export const IconPlus = require('images/icons/plus.png');
export const IconQueue = require('images/icons/queue.png');
export const IconRight = require('images/icons/right.png');
export const IconSave = require('images/icons/save.png');
export const IconSettings = require('images/icons/settings.png');
export const IconSlideshow = require('images/icons/slideshow.png');
export const IconSkate = require('images/icons/skate.png');
export const IconSkater = require('images/icons/skater.png');
export const IconStar = require('images/icons/star.png');
export const IconStopwatch = require('images/icons/stopwatch.png');
export const IconStreamOff = require('images/icons/stream.png');
export const IconStreamOn = require('images/icons/stream-live.png');
export const IconCapture = require('images/icons/stream-send.png');
export const IconShown = require('images/icons/eye-open.png');
export const IconSubtract = require('images/icons/minus.png');
export const IconTeam = require('images/icons/team.png');
export const IconTicket = require('images/icons/ticket.png');
export const IconUnmute = require('images/icons/volume-nomute.png');
export const IconUp = require('images/icons/up.png');
export const IconWhistle = require('images/icons/whistle.png');
export const IconX = require('images/icons/x.png');
export const IconYouTube = require('images/icons/youtube.png');
export const IconFastForward = require('images/icons/fastforward.png');
export const IconPlay = require('images/icons/play.png');
export const IconPause = require('images/icons/pause.png');

/**
 * Creates a <button> element
 * @param {Object} props 
 */
function ButtonElement(props) {
    var className = cnames({active:props.active}, props.className);
    return (
        <button
            className={className}
            onClick={props.onClick}
            onDoubleClick={props.onDoubleClick}
            onContextMenu={props.onContextMenu}
            title={props.title}
            //{...props}
            onFocus={(ev) => {
                ev.preventDefault();
                ev.target.blur();
                if(props.onFocus)
                    props.onFocus(ev)
            }}>{props.children}</button>
    )
}

/**
 * General interface for elements
 */
interface PElement {
    className?:string;
    active?:boolean;
    title?:string;
}

interface PMediaElement extends PElement {
    src:string,
    children?:any,
    onClick?:Function
}

/**
 * Button with an icon and text labels.
 */
class ButtonIconElement extends React.PureComponent<PMediaElement> {
    render() {
        var className = cnames('button-icon', this.props.className, {
            active:this.props.active
        });
        return (
            <ButtonElement
                className={className}
                {...this.props}
                >
                <IconElement src={(this.props.src)}/>
                <span className='label'>{this.props.children}</span>
            </ButtonElement>
        );
    }
}

/**
 * A checkbox with toggle capabilities.
 */
class ToggleButtonElement extends React.PureComponent<{
    checked:boolean,
    onClick:Function,
    className?:string,
    label?:string,
    title?:string
}> {

    constructor(props) {
        super(props);
    }

    /**
     * Renders the component
     */
    render() {
        const className = cnames('toggle-button', {
            checked:this.props.checked
        }, this.props.className);
        return (
            <ButtonElement className={className} {...this.props}>
                <div className="toggle-button-content">
                    <span className="icon">
                        <img src={IconCheck} alt=''/>
                    </span>
                    <span className="text">{this.props.label}</span>
                </div>
            </ButtonElement>
        );
    }
}

/**
 * Element for handling single-line text input.
 */
class TextboxElement extends React.PureComponent<{
    size:number;
    maxLength:number;
    type:string;
    onChange:Function;
    value:string;
}, {
    value:string
}> {
    readonly state = {
        value:''
    }
    constructor(props) {
        super(props);
        if(this.props.value)
            this.state.value = this.props.value;
        this.onChange = this.onChange.bind(this);
    }

    /**
     * Triggered when the value is changes by the user.
     * @param {Event} ev 
     */
    onChange(ev) {
        var value = ev.target.value;
        this.setState(() => {
            return {value:value};
        }, () => {
            if(this.props.onChange)
                this.props.onChange(this.state.value);
        });
    }

    /**
     * Triggered when the component updates.
     * @param {Object} prevProps 
     */
    componentDidUpdate(prevProps) {
        if(prevProps.value !== this.props.value && this.props.value !== this.state.value) {
            if(this.props.value === undefined) {
                if(this.state.value !== '')
                    this.setState({value:''});
            } else {
                this.setState({value:this.props.value});
            }
        }
    }

    /**
     * Renders the component.
     */
    render() {
        return (
            <input type="text"
                value={this.state.value}
                size={this.props.size}
                maxLength={this.props.maxLength}
                onChange={this.onChange}
                />
        )
    }
}

/**
 * Creates a <input> element of type checkbox
 * @param {Object} props 
 */
function CheckboxElement(props) {
    var src = 'checkbox_unchecked.png';
    if(props.checked)
        src = 'checkbox_checked.png';
    var className = cnames({
        checkbox:true,
        checked:props.checked
    }, props.className);
    if(props.label) {
        return (
            <label className={className} onClick={props.onClick}>
                <img src={require('images/icons/' + src)} alt={props.alt}/>
                {props.label}
            </label>
        );

    } else {
        return (
            <img src={require('images/icons/' + src)}
                className={className}
                onClick={props.onClick}
                alt={props.alt}
                />
        );
    }
}

/**
 * Radio element
 * @param {Object} props 
 */
function RadioElement(props) {
    return (
        <input type="radio"
            onChange={props.onChange}
            name={props.name}
            value={props.value}
        />
    )
}

/**
 * Creates an img component used for icons
 * @param {Object} props 
 */
function IconElement(props) {
    var classNames = cnames({
        icon:true,
        active:props.active,
        attention:props.attention
    }, props.className);
    return (
        <img 
            className={classNames} 
            src={props.src} 
            title={props.title}
            alt=""
            onClick={props.onClick}
            onContextMenu={props.onContextMenu}
            />
    );
}

interface PProgressBarElement {
    value:number,
    max:number,
    className?:string
}

function ProgressBarElement(props:PProgressBarElement) {
    var className = cnames('progress-bar', props.className);
    var progress = 0;
    if(props.value && props.max)
        progress = props.value / props.max;
    var style = {
        transform:"scale(" + progress + ",1)"
    };
    return (
        <div 
            className={className}
            >
            <div className={"progress-amount"} style={style}/>
        </div>
    )
}

interface PMediaThumbnailElement {
    width?:number,
    height?:number,
    src:string
}

/**
 * A component for displaying a preview of a visual media element,
 * such as an image or a video. This reduces the load of large animated GIFs
 * and videos for slideshows.
 */
class MediaThumbnailElement extends React.PureComponent<PMediaThumbnailElement> {

    Width:number = 256;
    Height:number = 144;
    Brush:CanvasRenderingContext2D|null = null;
    ImageItem:HTMLImageElement = new Image();
    CanvasItem:React.RefObject<HTMLCanvasElement> = React.createRef();

    constructor(props) {
        super(props);
        if(this.props.width !== undefined)
            this.Width = this.props.width;

        if(this.props.height !== undefined)
            this.Height = this.props.height;
            
        this.paint = this.paint.bind(this);
        this.ImageItem.onload = this.paint;
    }

    /**
     * Paints the image onto the canvas element.
     */
    async paint() {
        if(this.Brush == null)
            return;

        this.clear();

        var size = DataController.aspectSize(this.Width, this.Height, this.ImageItem.width, this.ImageItem.height);
        this.Brush.drawImage(this.ImageItem, size.x, size.y, size.width, size.height);
        //this.ImageItem.src = '';
    }

    /**
     * Clears the preview canvas
     */
    protected clear() {
        if(this.Brush === null)
            return;
        this.Brush.clearRect(0,0,this.Width, this.Height);
    }

    /**
     * Loads the image to preview.
     */
    async loadImage() {
        if(this.props.src && this.props.src.search) {
            if(this.props.src.search('http') === 0) {
                this.ImageItem.src = this.props.src;
            } else if(this.props.src.search('c:') === 0) {
                DataController.access(this.props.src).then(() => {
                    this.ImageItem.src = this.props.src;
                }).catch(() => {this.clear();});
            } else {
                DataController.access(DataController.mpath(this.props.src)).then(() => {
                    this.ImageItem.src = DataController.mpath(this.props.src);
                }).catch(() => {this.clear();});
            }
        }
    }

    /**
     * Triggered when the component mounts
     */
    componentDidMount() {
        if(this.CanvasItem !== null && this.CanvasItem.current !== null)
            this.Brush = this.CanvasItem.current.getContext('2d');
        this.loadImage();
    }

    /**
     * Triggered when the component has been updated.
     * @param {Object} prevProps 
     */
    componentDidUpdate(prevProps) {
        if(prevProps.src !== this.props.src) {
            this.loadImage();
        }
    }

    /**
     * Renders the component.
     */
    render() {
        return (
            <canvas 
                width={this.Width} 
                height={this.Height} 
                ref={this.CanvasItem}
                ></canvas>
        )
    }
}

interface PSliderElement extends SliderProps {
    className?:string
}

/**
 * A component with a range of values, and a knob
 * that can be 'slid' into position to set that value.
 */
class SliderElement extends React.PureComponent<PSliderElement, {
    value:number | number[]
}> {
    readonly state = {
        value:0
    }

    ChangingValue:boolean = false;

    /**
     * Triggered when the component updates
     */
    componentDidUpdate() {
        if(!this.ChangingValue && this.state.value !== this.props.value && this.props.value !== undefined) {
            this.setState({value:this.props.value});
        }
    }

    /**
     * Renders the component.
     */
    render() {
        var className = cnames('slider', this.props.className);
        var value = this.props.value;
        if(this.ChangingValue)
            value = this.state.value;
        return (
            <UISlider
                className={className}
                defaultValue={this.props.defaultValue}
                min={this.props.min}
                max={this.props.max}
                step={this.props.step}
                orientation={this.props.orientation}
                marks={this.props.marks}
                valueLabelFormat={this.props.valueLabelFormat}
                valueLabelDisplay={this.props.valueLabelDisplay}

                value={value}

                onChangeCommitted={(o, value) => {
                    this.setState({value:value});
                    if(this.props.onChangeCommitted)
                        this.props.onChangeCommitted(o, value);
                }}

                onChange={(o, value) => {
                    if(this.ChangingValue) {
                        this.setState(() => {
                            return {value:value}
                        });
                    } else if(this.props.onChange) {
                        this.props.onChange(o, value); 
                    }
                }}

                onMouseDown={() => {
                    this.ChangingValue = true;
                }}
                onMouseUp={() => {
                    this.ChangingValue = false;
                }}
                onMouseOut={(ev) => {
                    //if(ev.target === ev.target.parentNode)
                        //this.ChangingValue = false;
                }}
                onMouseEnter={() => {
                    //this.ChangingValue = false;
                }}
                onFocus={(ev) => {
                    ev.target.blur();
                }}
            />
        )
    }
}

export default ButtonElement;
export {
    ButtonElement as Button,
    CheckboxElement as Checkbox,
    IconElement as Icon,
    ButtonIconElement as IconButton,
    RadioElement as Radio,
    MediaThumbnailElement as MediaThumbnail,
    ToggleButtonElement as ToggleButton,
    ProgressBarElement as ProgressBar,
    SliderElement as Slider,
    TextboxElement as Textbox
};