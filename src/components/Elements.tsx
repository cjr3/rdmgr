/**
 * This set of components are wrappers for common elements,
 * such as buttons, so we can have default behaviors,
 * such as keeping buttons from retaining focus when clicked.
 */
import React from 'react'
import cnames from 'classnames'
import './css/Elements.scss'
import {default as UISlider, SliderProps, Mark} from '@material-ui/core/Slider'
import DataController from 'controllers/DataController';

export const TeamALogo = require('images/default/TeamA.jpg');

//static icons
const IconAttachment = require('images/icons/attachment.png');
const IconAV = require('images/icons/av.png');
const IconAuto = require('images/icons/loop-auto.png');
const IconBolt = require('images/icons/bolt.png');
const IconCameraDefault = require('images/icons/camera-style-default.png');
const IconCamera5050 = require('images/icons/camera-style-5050.png');
const IconCamera2080 = require('images/icons/camera-style-2080.png');
const IconCameraLeftThird = require('images/icons/camera-style-lower-third.png');
const IconCameraRightThird = require('images/icons/camera-style-right-third.png');
const IconChat = require('images/icons/chat.png');
const IconCheck = require('images/icons/check.png');
const IconClipboard = require('images/icons/clipboard.png');
const IconConnected = require('images/icons/online.png');
const IconDelete = require('images/icons/trash.png');
const IconDisconnected = require('images/icons/offline.png');
const IconDown = require('images/icons/down.png');
const IconHidden = require('images/icons/eye-closed.png');
const IconFlag = require('images/icons/flag.png');
const IconFolder = require('images/icons/folder.png');
const IconLeft = require('images/icons/left.png');
const IconLoop = require('images/icons/loop.png');
const IconMic = require('images/icons/microphone.png');
const IconMonitor = require('images/icons/monitor.png');
const IconMovie = require('images/icons/movie.png');
const IconMuted = require('images/icons/volume-mute.png');
const IconNo = require('images/icons/no.png');
const IconOffline = require('images/icons/offline.png');
const IconOnline = require('images/icons/online.png');
const IconPlus = require('images/icons/plus.png');
const IconQueue = require('images/icons/queue.png');
const IconRight = require('images/icons/right.png');
const IconSave = require('images/icons/save.png');
const IconSettings = require('images/icons/settings.png');
const IconSlideshow = require('images/icons/slideshow.png');
const IconSkate = require('images/icons/skate.png');
const IconSkater = require('images/icons/skater.png');
const IconStar = require('images/icons/star.png');
const IconStopwatch = require('images/icons/stopwatch.png');
const IconStreamOff = require('images/icons/stream.png');
const IconStreamOn = require('images/icons/stream-live.png');
const IconShown = require('images/icons/eye-open.png');
const IconSubtract = require('images/icons/minus.png');
const IconTeam = require('images/icons/team.png');
const IconTicket = require('images/icons/ticket.png');
const IconUnmute = require('images/icons/volume-nomute.png');
const IconUp = require('images/icons/up.png');
const IconWhistle = require('images/icons/whistle.png');
const IconX = require('images/icons/x.png');
const IconYouTube = require('images/icons/youtube.png');
const IconFastForward = require('images/icons/fastforward.png');
const IconPlay = require('images/icons/play.png');
const IconPause = require('images/icons/pause.png');

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
    TextboxElement as Textbox,
    IconAttachment,
    IconX,
    IconDelete,
    IconLeft,
    IconRight,
    IconCheck,
    IconShown,
    IconHidden,
    IconLoop,
    IconSave,
    IconDisconnected,
    IconConnected,
    IconStreamOff,
    IconStreamOn,
    IconNo,
    IconSettings,
    IconSubtract,
    IconPlus,
    IconMovie,
    IconFlag,
    IconSkate,
    IconSkater,
    IconTeam,
    IconAV,
    IconSlideshow,
    IconWhistle,
    IconClipboard,
    IconOffline,
    IconOnline,
    IconQueue,
    IconStopwatch,
    IconChat,
    IconMonitor,
    IconStar,
    IconFolder,
    IconTicket,
    IconMuted,
    IconUnmute,
    IconAuto,
    IconYouTube,
    IconMic,
    IconBolt,
    IconDown,
    IconUp,
    IconCameraDefault,
    IconCamera5050,
    IconCamera2080,
    IconCameraLeftThird,
    IconCameraRightThird,
    IconFastForward,
    IconPlay,
    IconPause
};