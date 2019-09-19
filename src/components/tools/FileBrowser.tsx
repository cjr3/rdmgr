import React from 'react';
import DataController from 'controllers/DataController';
import {Icon, Button, IconButton, IconCheck, IconSave, IconAttachment, ProgressBar, IconLoop} from 'components/Elements';
import './css/FileBrowser.scss';
import Panel from 'components/Panel';

interface SFileBrowser {
    path:string,
    previewSrc:string
}

interface PFileBrowser {
    opened:boolean,
    onClose:Function,
    onSelect?:Function,
}

/**
 * A component for browsing media files.
 */
class FileBrowser extends React.PureComponent<PFileBrowser, SFileBrowser> {
    readonly state:SFileBrowser = {
        path:DataController.MediaFolder,
        previewSrc:''
    }

    constructor(props) {
        super(props);
        this.previewImage = this.previewImage.bind(this);
    }

    /**
     * 
     */
    previewImage(src) {
        this.setState(() => {
            return {previewSrc:src}
        });
    }

    /**
     * Renders the component
     */
    render() {
        var buttons = [
            <Button
                key="btn-close"
                onClick={this.props.onClose}
                >Cancel</Button>
        ];

        if(window && window.onSelectFolder) {
            buttons.unshift(
                <IconButton
                    key="btn-select-folder"
                    src={IconCheck}
                    onClick={() => {
                        if(window.onSelectFolder !== undefined && window.onSelectFolder !== null)
                            window.onSelectFolder(this.state.path);
                    }}>Select Folder</IconButton>
            );
        }

        var previewButtons = [
            <Button
                key="btn-select"
                onClick={() => {
                    if(this.props.onSelect)
                        this.props.onSelect(this.state.previewSrc);
                    this.previewImage('');
                }}
                >Select</Button>
        ];

        var previewItem:React.ReactElement|null = null;
        if(this.state.previewSrc !== '' && DataController.PATH)  {
            switch(DataController.ext(this.state.previewSrc)) {
                case 'jpeg': 
                case 'jpg': 
                case 'gif': 
                case 'png': 
                case 'bmp': 
                    previewItem = <img src={this.state.previewSrc} alt="" onClick={() => {this.setState({previewSrc:''}) }}/>
                break;
                case 'mp4' :
                case 'webm' :
                    previewItem = <video muted width="360" height="120" src={this.state.previewSrc} onClick={() => {this.setState({previewSrc:''}) }}/>
                break;
            }
        }

        return (
            <Panel
                opened={this.props.opened}
                onClose={this.props.onClose}
                contentName="file-browser"
                className="file-browser-panel"
                buttons={buttons}
                title="Files"
                >
                <FileBrowserFolderList
                    path={this.state.path}
                    onClickPath={(path) => {
                        this.setState({path:path});
                    }}/>
                <FileBrowserList 
                    path={this.state.path} 
                    onClickPreview={this.previewImage}
                    onSelect={this.props.onSelect}
                    />
                <Panel
                    opened={(previewItem !== null)}
                    onClose={() => {
                        this.setState(() => {
                            return {previewSrc:''}
                        })
                    }}
                    popup={true}
                    className="preview"
                    buttons={previewButtons}
                >
                    {previewItem}
                </Panel>
            </Panel>
        );
    }
}

interface SFileBrowserFolderList {
    folders:Array<any>,
    path:string,
    uploadedFiles:number,
    filesToUpload:number
}

interface PFileBrowserFolderList {
    path:string,
    onClickPath:Function
}

/**
 * Component to list folders and controls to add files.
 */
class FileBrowserFolderList extends React.PureComponent<PFileBrowserFolderList, SFileBrowserFolderList> {
    readonly state:SFileBrowserFolderList = {
        folders:[],
        path:'',
        uploadedFiles:0,
        filesToUpload:0
    }

    UploadTimer:number = 0

    constructor(props) {
        super( props );
        this.onClickLoad = this.onClickLoad.bind(this);
        this.onClickUpload = this.onClickUpload.bind(this);
        this.loadFolders = this.loadFolders.bind(this);
    }

    /**
     * Reloeads the media folders.
     */
    loadFolders() {
        DataController.loadFolder().then((folders) => {
            if(folders) {
                this.setState({folders:folders});
            }
        }).catch(() => {
            //show error?
        });
    }

    /**
     * Triggered when the user clicks the button to reload folders.
     */
    onClickLoad() {
        this.loadFolders();
    }

    /**
     * Triggered when the user clicks the button to upload a file.
     * - Open file dialog (async ???)
     */
    onClickUpload() {
        DataController.showOpenDialog({
            properties:['openFile', 'multiSelections']
        }).then(async (files) => {
            //console.log(files);
            if(files && files.length) {
                this.setState(() => {
                    return {uploadedFiles:0,filesToUpload:files.length};
                }, async () => {
                    for(var key in files) {
                        await DataController.uploadFile(files[key])
                            .then(() => {
                                this.setState({uploadedFiles:this.state.uploadedFiles+1})
                            })
                            .catch((er) => {
                                //console.log("FAILED TO UPLOAD!");
                            });
                    }
                    this.loadFolders();
                    try {clearTimeout(this.UploadTimer);} catch(er) {}
                    this.UploadTimer = window.setTimeout(() => {
                        this.setState({uploadedFiles:0,filesToUpload:0});
                    }, 3000);
                });
            }
        }).catch((er) => {
            //show error
        });
    }

    /**
     * Triggered when the component is mounted to the DOM.
     */
    componentDidMount() {
        var timer = setInterval(() => {
            if(window && window.LocalServer) {
                this.loadFolders();
                clearInterval(timer);
            }
        }, 1000);
    }

    /**
     * Renders the component.
     * - Lists each folder as a tree.
     */
    render() {
        let folders:Array<React.ReactElement> = [];
        let i = 0;
        this.state.folders.forEach((folder) => {
            folders.push(
                <FileBrowserFolder 
                    key={`folder-${i}`}
                    folder={folder}
                    path={this.props.path}
                    onClick={this.props.onClickPath}
                    />
            );
            i++;
        });

        let buttons = [
            <Icon
            key="btn-reload"
            src={IconLoop}
            title="Reload Folders"
            onClick={this.onClickLoad}
            />,
            <Icon
                key="btn-upload"
                src={IconAttachment}
                title="Upload file"
                onClick={this.onClickUpload}
                />
        ];

        return (
            <Panel
                className="folder-list"
                opened={true}
                buttons={buttons}
                >
                <div className="folders">{folders}</div>
                <ProgressBar
                    value={(this.state.filesToUpload >= 1) ? this.state.uploadedFiles : 0}
                    max={(this.state.filesToUpload >= 1) ? this.state.filesToUpload : 100}
                    />
            </Panel>
        )
    }
}

interface SFileBrowserFolder {
    
}

interface PFileBrowserFolder {
    folder:any,
    path:string
    onClick:Function
}

/**
 * Represents a folder
 */
class FileBrowserFolder extends React.PureComponent<PFileBrowserFolder, SFileBrowserFolder> {
    /**
     * Renders the component
     */
    render() {
        var folders:Array<React.ReactElement> = [];
        var i = 0;
        this.props.folder.children.forEach((folder) => {
            folders.push(
                <FileBrowserFolder
                    key={`folder-${i}`}
                    folder={folder}
                    path={this.props.path}
                    onClick={this.props.onClick}
                    />
            );
            i++;
        });

        return (
            <div className="folder-item">
                <Button
                    active={(this.props.folder.path == this.props.path)}
                    onClick={() => {
                        this.props.onClick(this.props.folder.path);
                    }}
                >{DataController.basename(this.props.folder.path)}</Button>
                {folders}
            </div>
        );
    }
}

interface SFileBrowserList {
    files:Array<string>
}

interface PFileBrowserList {
    path:string,
    onClickPreview?:Function,
    onSelect?:Function
}

/**
 * Component to list files for a given path.
 */
class FileBrowserList extends React.PureComponent<PFileBrowserList, SFileBrowserList> {
    readonly state:SFileBrowserList = {
        files:[]
    }

    /**
     * Loads the files
     */
    loadFiles() {
        this.setState(() => {
            return {files:[]}
        }, () => {
            DataController.loadFolderFiles(this.props.path).then((files) => {
                this.setState({files:files});
            }).catch((er) => {
                //console.log(er);
            });
        })
    }

    /**
     * Triggered when the component is updated.
     * @param {Object} prevProps 
     */
    componentDidUpdate(prevProps) {
        if(prevProps.path !== this.props.path) {
            this.loadFiles();
        }
    }

    /**
     * Triggered when the 
     */
    componentDidMount() {
        this.loadFiles();
    }

    /**
     * Renders the component.
     */
    render() {
        var files:Array<React.ReactElement> = [];
        var i = 0;
        this.state.files.forEach((file) => {
            files.push(
                <FileBrowserFile
                    file={file}
                    key={`file-${i}`}
                    onClickPreview={this.props.onClickPreview}
                    onSelect={this.props.onSelect}
                    />
            );
            i++;
        });

        return (
            <div className="file-list">{files}</div>
        )
    }
}

interface PFileBrowserFile {
    file:string,
    onClickPreview?:Function,
    onSelect?:Function
}

/**
 * Represents a file
 */
class FileBrowserFile extends React.PureComponent<PFileBrowserFile> {

    CanvasItem:React.RefObject<HTMLCanvasElement> = React.createRef();
    ImageItem:any = new Image();
    Brush:CanvasRenderingContext2D|null = null;

    constructor(props) {
        super(props);
        this.CanvasItem = React.createRef();
        this.showReplaceFileDialog = this.showReplaceFileDialog.bind(this);
        this.paint = this.paint.bind(this);
        this.ImageItem.onload = this.paint;
    }

    /**
     * Paints the file (or video) to the canvas thumbnail.
     */
    paint() {
        if(this.Brush && this.CanvasItem.current) {
            switch(DataController.ext(this.props.file)) {
                case 'jpg' :
                case 'gif' :
                case 'jpeg' :
                case 'png' :
                case 'bmp' :
                    var size = DataController.aspectSize(this.CanvasItem.current.width, this.CanvasItem.current.height, this.ImageItem.width, this.ImageItem.height);
                    this.Brush.clearRect(0, 0, this.CanvasItem.current.width, this.CanvasItem.current.height);
                    this.Brush.drawImage(this.ImageItem, size.x, size.y, size.width, size.height);
                    this.ImageItem.src = null;
                break;
                case 'mov' :
                case 'mp4' :
                case 'webm' :
                case 'wmv' :

                break;
            }
        }
    }

    /**
     * Show a dialog to select a file for replacing the existing file.
     */
    showReplaceFileDialog() {

    }

    /**
     * Loads the attached file
     */
    loadFile() {
        switch(DataController.ext(this.props.file)) {
            case 'jpg' :
            case 'gif' :
            case 'jpeg' :
            case 'png' :
            case 'bmp' :
                this.ImageItem.src = this.props.file;
            break;
            case 'mov' :
            case 'mp4' :
            case 'webm' :
            case 'wmv' :

            break;
        }
    }

    /**
     * Triggered when the component updates.
     * @param {Obejct} prevProps 
     */
    componentDidUpdate(prevProps) {
        if(prevProps.file !== this.props.file) {
            this.loadFile();
        }
    }

    /**
     * Triggered when the component is mounted to the DOM.
     */
    componentDidMount() {
        if(this.CanvasItem !== null && this.CanvasItem.current !== null)
            this.Brush = this.CanvasItem.current.getContext('2d');
        this.loadFile();
    }

    /**
     * Renders the component
     */
    render() {
        return (
            <div className="file-item">
                <canvas 
                    width="150" height="150" ref={this.CanvasItem}
                ></canvas>
                <div className="name"
                    onClick={() => {
                        if(this.props.onClickPreview !== undefined)
                            this.props.onClickPreview(this.props.file);
                    }}
                >{DataController.basename(this.props.file)}</div>
                <div className="buttons">
                    <Icon
                        src={IconSave}
                        onClick={this.showReplaceFileDialog}
                        title="Replace"
                        />
                    <Icon
                        src={IconCheck}
                        onClick={() => {
                            if(this.props.onSelect !== undefined) {
                                if(this.props.onClickPreview !== undefined)
                                    this.props.onClickPreview('');
                                this.props.onSelect(this.props.file);
                            }
                        }}
                        title="Select File"
                        />
                </div>
            </div>
        )
    }
}

export default FileBrowser;