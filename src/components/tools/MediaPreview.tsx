import React from 'react'
import cnames from 'classnames'
import { Icon, IconDelete, IconFolder } from 'components/Elements';
import DataController from 'controllers/DataController'
import './css/MediaPreview.scss'

interface PMediaPreview {
    /**
     * Source
     */
    src:string,
    /**
     * Title for the element
     */
    title?:string,
    /**
     * Callback for when the user selects a file
     */
    onChange?:Function,
}

/**
 * Component for previewing and changed a media element, such as an Image or video
 */
class MediaPreview extends React.PureComponent<PMediaPreview> {
    CanvasItem:React.RefObject<HTMLCanvasElement> = React.createRef();
    CurrentImage:HTMLImageElement = new Image();
    Brush:CanvasRenderingContext2D|null = null;
    constructor(props) {
        super(props);
        this.onSelectFile = this.onSelectFile.bind(this);
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
        var className = cnames('media-preview', {
            filled:(this.props.src !== null && this.props.src !== '')
        });
        return (
            <div className={className}>
                <canvas width="150" height="150" ref={this.CanvasItem}></canvas>
                <div className="name">{this.props.title}</div>
                <div className="buttons">
                    <Icon
                        src={IconDelete}
                        onClick={() => {
                            if(this.props.onChange)
                                this.props.onChange('');
                        }}
                    />
                    <Icon
                        src={IconFolder}
                        onClick={() => {
                            window.onSelectFile = this.onSelectFile;
                            window.client.showFileBrowser();
                        }}
                    />
                </div>
            </div>
        );
    }
}

export default MediaPreview;