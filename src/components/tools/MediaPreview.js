import React from 'react'
import cnames from 'classnames'
import { Icon } from 'components/Elements';
import DataController from 'controllers/DataController'
import './css/MediaPreview.scss'

class MediaPreview extends React.PureComponent {
    constructor(props) {
        super(props);

        //bindings
        this.onSelectFile = this.onSelectFile.bind(this);
        this.paint = this.paint.bind(this);
        
        this.CanvasItem = React.createRef();
        this.CurrentImage = new Image();
        this.CurrentImage.onload = this.paint;
    }

    paint() {
        if(this.Brush && this.CanvasItem.current) {
            var size = DataController.aspectSize(this.CanvasItem.current.width, this.CanvasItem.current.height, this.CurrentImage.width, this.CurrentImage.height);
            this.Brush.clearRect(0, 0, this.CanvasItem.current.width, this.CanvasItem.current.height);
            this.Brush.drawImage(this.CurrentImage, size.x, size.y, size.width, size.height);
        }
    }

    componentDidMount() {
        this.Brush = this.CanvasItem.current.getContext('2d');
        if(this.props.src !== null && this.props.src !== '')
            this.CurrentImage.src = DataController.mpath(this.props.src);
    }

    componentDidUpdate(prevProps) {
        if(prevProps.src !== this.props.src) {
            if(this.props.src !== null && this.props.src !== '')
                this.CurrentImage.src = DataController.mpath(this.props.src);
            else {
                if(this.Brush) {
                    this.Brush.clearRect(0, 0, this.CanvasItem.current.width, this.CanvasItem.current.height);
                }
            }
        }
    }

    onSelectFile(filename) {
        if(this.props.onChange)
            this.props.onChange(filename);
    }

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
                        src={require('images/icons/trash.png')}
                        onClick={() => {
                            if(this.props.onChange)
                                this.props.onChange('');
                        }}
                    />
                    <Icon
                        src={require('images/icons/folder.png')}
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