import React from 'react';
import cnames from 'classnames';
import { Icon, IconDelete, IconFolder, IconLoop } from 'components/Elements';
import DataController from 'controllers/DataController';
import './css/MediaPreview.scss';

/**
 * Component for previewing and changing a media element, such as an Image or video
 */
export default class MediaPreview extends React.PureComponent<{
    /**
     * Source
     */
    src:string;
    /**
     * Title for the element
     */
    title?:string;
    /**
     * Callback for when the user selects a file
     */
    onChange?:Function;
}> {
    /**
     * 
     */
    private CanvasItem:React.RefObject<HTMLCanvasElement> = React.createRef();
    /**
     * 
     */
    private CurrentImage:HTMLImageElement = new Image();
    /**
     * 
     */
    private Brush:CanvasRenderingContext2D|null = null;
    
    /**
     * Constructor
     * @param props
     */
    constructor(props) {
        super(props);
        this.onSelectFile = this.onSelectFile.bind(this);
        this.onClickDelete = this.onClickDelete.bind(this);
        this.onClickSelect = this.onClickSelect.bind(this);
        this.onClickReplace = this.onClickReplace.bind(this);
        this.paint = this.paint.bind(this);
        this.clear = this.clear.bind(this);
        this.CurrentImage.onload = this.paint;
    }

    /**
     * Paints the image to the canvas
     */
    private async paint() {
        if(this.Brush !== null && this.CanvasItem !== null && this.CanvasItem.current !== null) {
            this.clear();
            var size = DataController.aspectSize(this.CanvasItem.current.width, this.CanvasItem.current.height, this.CurrentImage.width, this.CurrentImage.height);
            this.Brush.drawImage(this.CurrentImage, size.x, size.y, size.width, size.height);
        }
    }

    /**
     * Clears the brush
     */
    clear() {
        if(this.Brush !== null && this.CanvasItem !== null && this.CanvasItem.current !== null) {
            this.Brush.clearRect(0, 0, this.CanvasItem.current.width, this.CanvasItem.current.height);
        }
    }

    /**
     * Triggered when the user selects a new file
     * - Use the onChange property to receive the filename
     * @param filename string
     */
    private onSelectFile(filename:string) {
        if(this.props.onChange)
            this.props.onChange(filename);
    }

    /**
     * Triggered when the user clicks the delete icon
     */
    private onClickDelete() {
        if(this.props.onChange)
            this.props.onChange('');
    }

    /**
     * Triggered when the user clicks the select folder icon
     */
    private onClickSelect() {
        window.onSelectFile = this.onSelectFile;
        window.client.showFileBrowser();
    }

    /**
     * Triggered when the user clicks the replace icon
     */
    private onClickReplace() {
        DataController.showOpenDialog({
            filters:[{name:'Images', extensions:['jpg', 'png', 'gif', 'jpeg']}],
        }).then((files:Array<string>|undefined) => {
            if(files !== undefined && files instanceof Array && files.length >= 1) {
                DataController.uploadFile(files[0])
                    .then((destination:string|boolean) => {
                        if(typeof(destination) === 'string') {
                            this.CurrentImage.src = destination;
                            if(this.props.onChange)
                                this.props.onChange(DataController.mpath(destination, true));
                        }
                    }).catch(() => {

                    });
            }
        });
    }

    /**
     * Triggered when the component is mounted to the DOM
     * - Generate the Brush
     * - Load the image to the canvas
     */
    componentDidMount() {
        if(this.CanvasItem !== null && this.CanvasItem.current !== null)
            this.Brush = this.CanvasItem.current.getContext('2d');
        if(this.props.src !== null && this.props.src !== '')
            this.CurrentImage.src = DataController.mpath(this.props.src);
    }

    /**
     * Triggered when the component is updated
     * - If the src changes, then the image will be repainted
     * @param prevProps SMediaPreview
     */
    componentDidUpdate(prevProps) {
        if(prevProps.src !== this.props.src) {
            this.clear();
            if(this.props.src !== null && this.props.src !== '') {
                this.CurrentImage.src = '';
                this.CurrentImage.src = DataController.mpath(this.props.src);
            }
        }
    }

    /**
     * Renders the component
     */
    render() {
        let className:string = cnames('media-preview', {
            filled:(this.props.src !== null && this.props.src !== '')
        });
        return (
            <div className={className}>
                <canvas width="150" height="150" ref={this.CanvasItem}></canvas>
                <div className="name">{this.props.title}</div>
                <div className="buttons">
                    <Icon src={IconDelete} onClick={this.onClickDelete}/>
                    <Icon src={IconLoop} onClick={this.onClickReplace}/>
                    <Icon src={IconFolder} onClick={this.onClickSelect}/>
                </div>
            </div>
        );
    }
}