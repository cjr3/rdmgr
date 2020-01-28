import React from 'react';
import {Icon, Button, IconButton, IconCheck, IconAttachment, ProgressBar, IconLoop, IconShown} from 'components/Elements';
import './css/FileBrowser.scss';
import Panel from 'components/Panel';
import ClientController from 'controllers/ClientController';
import { FileExtension, Basename, LoadFolder, LoadFolderFiles, UploadFile } from 'controllers/functions.io';
import { GetAspectSize, ShowOpenDialog } from 'controllers/functions';
import {Folders} from 'controllers/vars';

/**
 * A component for browsing media files.
 */
export default class FileBrowser extends React.PureComponent<{
    /**
     * true to show, false to hide
     */
    opened:boolean;
    /**
     * Triggered when the user closes the file browser
     */
    onClose:Function;
    /**
     * Triggered when the user selects a file
     */
    onSelect?:Function;
}, {
    /**
     * Current path of files to list
     */
    path:string;
    /**
     * Path of file to preview
     */
    previewSrc:string;
}> {
    readonly state = {
        path:Folders.Media,
        previewSrc:''
    }

    /**
     * Constructor
     * @param props 
     */
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
        let buttons:Array<React.ReactElement> = [
            <Button
                key="btn-close"
                onClick={() => {
                    ClientController.ToggleFileBrowser(false);
                    if(this.props.onClose)
                        this.props.onClose();
                }}
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

        let previewButtons:Array<React.ReactElement> = [
            <Button
                key="btn-select"
                onClick={() => {
                    ClientController.ToggleFileBrowser(false);
                    if(this.props.onSelect)
                        this.props.onSelect(this.state.previewSrc);
                    this.previewImage('');
                }}
                >Select</Button>
        ];

        let previewItem:React.ReactElement|null = null;
        if(this.state.previewSrc !== '')  {
            switch(FileExtension(this.state.previewSrc)) {
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
                    onSelect={(filename) => {
                        ClientController.ToggleFileBrowser(false);
                        if(this.props.onSelect)
                            this.props.onSelect(filename);
                    }}
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
class FileBrowserFolderList extends React.PureComponent<{
    /**
     * Path of folders to list
     */
    path:string;
    /**
     * Triggered when the user clicks a folder in the list
     */
    onClickPath:Function;
}, {
    /**
     * Collection of folders to list
     */
    folders:Array<any>;
    /**
     * Selected path
     */
    path:string;
    /**
     * Files uploaded
     */
    uploadedFiles:number;
    /**
     * Files remaining to be uploaded
     */
    filesToUpload:number;
}> {
    readonly state = {
        folders:[],
        path:'',
        uploadedFiles:0,
        filesToUpload:0
    }

    /**
     * Reference for upload timer
     */
    protected UploadTimer:number = 0

    /**
     * 
     * @param props 
     */
    constructor(props) {
        super( props );
        this.onClickLoad = this.onClickLoad.bind(this);
        this.onClickUpload = this.onClickUpload.bind(this);
        this.loadMediaFolders = this.loadMediaFolders.bind(this);
    }

    /**
     * Reloeads the media folders.
     */
    loadMediaFolders() {
        LoadFolder().then((folders) => {
            if(folders) {
                this.setState({folders:folders});
            }
        }).catch(() => {

        });
    }

    /**
     * Triggered when the user clicks the button to reload folders.
     */
    onClickLoad() {
        this.loadMediaFolders();
    }

    /**
     * Triggered when the user clicks the button to upload a file.
     * - Open file dialog (async ???)
     */
    onClickUpload() {
        ShowOpenDialog({
            properties:['openFile', 'multiSelections']
        }).then(async (files) => {
            //console.log(files);
            if(files && files.length) {
                this.setState(() => {
                    return {uploadedFiles:0,filesToUpload:files.length};
                }, async () => {
                    for(var key in files) {
                        await UploadFile(files[key])
                            .then(() => {
                                this.setState({uploadedFiles:this.state.uploadedFiles+1})
                            })
                            .catch((er) => {
                                //console.log("FAILED TO UPLOAD!");
                            });
                    }
                    this.loadMediaFolders();
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
                this.loadMediaFolders();
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

        let buttons:Array<React.ReactElement> = [
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

/**
 * Represents a folder
 */
class FileBrowserFolder extends React.PureComponent<{
    /**
     * Folder object
     */
    folder:any;
    /**
     * Full path of folder
     */
    path:string;
    /**
     * Triggered when the user clicks the folder
     */
    onClick:Function;
}> {
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
                    active={(this.props.folder.path === this.props.path)}
                    onClick={() => {
                        this.props.onClick(this.props.folder.path);
                    }}
                >{Basename(this.props.folder.path)}</Button>
                {folders}
            </div>
        );
    }
}

/**
 * Component to list files for a given path.
 */
class FileBrowserList extends React.PureComponent<{
    /**
     * Path of files to list
     */
    path:string;
    /**
     * Triggered when the user clicks to preview a file
     */
    onClickPreview?:Function;
    /**
     * Triggered when the user selects a file
     */
    onSelect?:Function;
}, {
    /**
     * Collection of files in the selected folder
     */
    files:Array<string>
}> {
    readonly state = {
        files:new Array<string>()
    }

    /**
     * Loads the files
     */
    loadFiles() {
        this.setState(() => {
            return {files:[]}
        }, () => {
            LoadFolderFiles(this.props.path).then((files) => {
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
        let files:Array<React.ReactElement> = [];
        let i = 0;
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
class FileBrowserFile extends React.PureComponent<{
    /**
     * Full path to the file
     */
    file:string;
    /**
     * Triggered when the user clicks to preview the file
     */
    onClickPreview?:Function;
    /**
     * Triggered when the user selects the file
     */
    onSelect?:Function;
}> {

    /**
     * Reference item to draw a thumbnail of an image
     */
    protected CanvasItem:React.RefObject<HTMLCanvasElement> = React.createRef();

    /**
     * Used to load image item
     */
    protected ImageItem:any = new Image();

    /**
     * Drawing brush
     */
    protected Brush:CanvasRenderingContext2D|null = null;

    /**
     * Constructor
     * @param props 
     */
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
            switch(FileExtension(this.props.file)) {
                case 'jpg' :
                case 'gif' :
                case 'jpeg' :
                case 'png' :
                case 'bmp' :
                    var size = GetAspectSize(this.CanvasItem.current.width, this.CanvasItem.current.height, this.ImageItem.width, this.ImageItem.height);
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
        switch(FileExtension(this.props.file)) {
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
                        if(this.props.onSelect !== undefined) {
                            if(this.props.onClickPreview !== undefined)
                                this.props.onClickPreview('');
                            this.props.onSelect(this.props.file);
                        }
                    }}
                >{Basename(this.props.file)}</div>
                <div className="buttons">
                    <Icon
                        src={IconShown}
                        onClick={() => {
                            if(this.props.onClickPreview !== undefined)
                                this.props.onClickPreview(this.props.file);
                        }}
                        title="Select File"
                        />
                </div>
            </div>
        )
    }
}