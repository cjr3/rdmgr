import React from 'react';
import  {
    IconX,
    IconCheck,
    IconButton,
    IconNo,
    IconHidden,
    IconShown,
    IconSave
} from 'components/Elements';
import AnthemsController from 'controllers/AnthemsController';
import { AnthemRecord } from 'tools/vars';
import keycodes from 'tools/keycodes';

import AnthemCaptureController from 'controllers/capture/Anthem';
import Panel from 'components/Panel';

/**
 * Component for configuring the national anthem singer.
 */
export default class AnthemPanel extends React.PureComponent<{
    opened:boolean;
}, {
    /**
     * Collection of national anthem singer records
     */
    Records:Array<AnthemRecord>;
    /**
     * Record ID of current national anthem singer
     */
    RecordID:number;
    /**
     * Determines if the national anthem is shown or not
     */
    Shown:boolean;
    /**
     * The className that determines how the national anthem is shown
     */
    className:string;

    /**
     * Name of anthem singer
     */
    Name:string;
    CurrentName:string;
}> {
    readonly state = {
        Records:AnthemsController.Get(),
        RecordID:AnthemCaptureController.GetState().Record.RecordID,
        Shown:AnthemCaptureController.GetState().Shown,
        className:AnthemCaptureController.GetState().className,
        CurrentName:AnthemCaptureController.GetState().Record.Name,
        Name:AnthemCaptureController.GetState().Record.Name
    }

    /**
     * Listener for capture controller
     */
    protected remoteCapture:Function|null = null;
    /**
     * Listener for Data controller
     */
    protected remoteData:Function|null = null;

    /**
     * 
     * @param props PCaptureControlPanel
     */
    constructor(props) {
        super(props);
        this.onChangeSinger = this.onChangeSinger.bind(this);
        this.onChangeName = this.onChangeName.bind(this);
        this.onKeyUpName = this.onKeyUpName.bind(this);
        this.updateData = this.updateData.bind(this);
        this.updateCapture = this.updateCapture.bind(this);
        this.onClickSubmit = this.onClickSubmit.bind(this);
    }

    /**
     * Updates the state to match the capture controller.
     */
    protected updateCapture() {
        this.setState(() => {
            return {
                Shown:AnthemCaptureController.GetState().Shown,
                className:AnthemCaptureController.GetState().className,
                RecordID:AnthemCaptureController.GetState().Record.RecordID,
                CurrentName:AnthemCaptureController.GetState().Record.Name
            }
        });
    }

    /**
     * Updates the state to match the data controller.
     */
    protected updateData() {
        this.setState(() => {
            return {Records:AnthemsController.Get()};
        }, () => {
            let singer:AnthemRecord = AnthemsController.GetRecord(this.state.RecordID);
            if(singer) {
                AnthemCaptureController.SetRecord(singer);
            }
        });
    }

    /**
     * Triggered when the user changes the default national anthem singer.
     * @param {Event} ev 
     */
    protected onChangeSinger(ev: React.ChangeEvent<HTMLSelectElement>) {
        let id:number = parseInt(ev.target.value);
        let singer:AnthemRecord = AnthemsController.GetRecord(id);
        if(!singer) {
            singer = AnthemsController.NewRecord();
            singer.Name = "National Anthem";
        }
        AnthemCaptureController.SetRecord( singer );
        this.setState({Name:singer.Name});
    }

    protected onChangeName(ev: React.ChangeEvent<HTMLInputElement>) {
        let value:string = ev.currentTarget.value;
        this.setState({Name:value});
    }

    protected onKeyUpName(ev: React.KeyboardEvent<HTMLInputElement>) {
        switch(ev.keyCode) {
            case keycodes.ENTER :
                AnthemCaptureController.SetName(this.state.Name);
            break;
            case keycodes.ESCAPE :
                this.setState({Name:this.state.CurrentName});
            break;
        }
    }

    protected onClickSubmit() {
        AnthemCaptureController.SetName(this.state.Name);
    }

    /**
     * Start listeners
     */
    componentDidMount() {
        this.remoteCapture = AnthemCaptureController.Subscribe(this.updateCapture);
        this.remoteData = AnthemsController.Subscribe(this.updateData);
    }

    /**
     * Remove listeners
     */
    componentWillUnmount() {
        if(this.remoteCapture !== null)
            this.remoteCapture();
        if(this.remoteData !== null)
            this.remoteData();
    }

    /**
     * Renders the component.
     */
    render() {
        let singers:Array<React.ReactElement> = new Array<React.ReactElement>(
            <option key="singer-def" value="0">(none)</option>
        );
        let iconToggle:string = (this.state.Shown) ? IconShown : IconHidden;
        let changed:boolean = (this.state.Name != this.state.CurrentName) ? true : false;

        this.state.Records.forEach((singer) => {
            singers.push(
                <option
                    key={`${singer.RecordType}-${singer.RecordID}`}
                    value={singer.RecordID}>
                        {singer.Name}
                    </option>
            );
        });

        let buttons:Array<React.ReactElement> = new Array<React.ReactElement>(
            <IconButton 
                key="btn-toggle"
                src={iconToggle} 
                onClick={AnthemCaptureController.Toggle}
                active={this.state.Shown}
                />,
            <IconButton
                key="btn-submit"
                src={IconSave}
                onClick={this.onClickSubmit}
                active={changed}
                />
        );

        return (
            <Panel
                opened={this.props.opened}
                popup={true}
                contentName="anthem"
                buttons={buttons}
                >
                <div className="record-list">
                    <IconButton
                        src={(this.state.className === 'banner') ? IconCheck : IconX}
                        active={(this.state.className === 'banner')}
                        onClick={() => {
                            AnthemCaptureController.SetClass('banner');
                        }}
                        >Banner</IconButton>
                    <IconButton
                        src={(this.state.className === '') ? IconCheck : IconX}
                        active={(this.state.className === '')}
                        onClick={() => {
                            AnthemCaptureController.SetClass('');
                        }}
                        >Full Screen</IconButton>
                </div>
                <select size={1}
                    value={this.state.RecordID}
                    onChange={this.onChangeSinger}
                    style={{width:"100%"}}
                    >{singers}</select>
                <p>Name</p>
                <p>
                    <input
                        type="text"
                        size={30}
                        maxLength={30}
                        value={this.state.Name}
                        onChange={this.onChangeName}
                        onKeyUp={this.onKeyUpName}
                        />
                </p>
            </Panel>
        );
    }
}