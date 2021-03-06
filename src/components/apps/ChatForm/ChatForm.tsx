import React from 'react';
import ChatController, {MessageRecord} from 'controllers/ChatController';
import Panel from 'components/Panel';
import {Icon, IconCheck, IconDelete} from 'components/Elements';
import keycodes from 'tools/keycodes';
import cnames from 'classnames';
import './css/ChatForm.scss';
import { Unsubscribe } from 'redux';
import UIController from 'controllers/UIController';

/**
 * Component for displaying a chat room for peer connections.
 */
export default class ChatForm extends React.PureComponent<any, {
    Shown:boolean;
}> {

    readonly state = {
        Shown:UIController.GetState().Chat.Shown
    }
    
    /**
     * UIController listener
     */
    protected remoteUI?:Unsubscribe;

    /**
     * Constructor
     * @param props 
     */
    constructor(props) {
        super(props);
        this.onChatOpen = this.onChatOpen.bind(this);
        this.updateUI = this.updateUI.bind(this);
    }

    protected async updateUI() {
        this.setState({
            Shown:UIController.GetState().Chat.Shown
        });
    }

    protected async onChatOpen() {
        ChatController.ReadMessages();
    }

    componentDidMount() {
        this.remoteUI = UIController.Subscribe(this.updateUI);
    }

    componentWillUnmount() {
        if(this.remoteUI)
            this.remoteUI();
    }

    /**
     * Renders the component.
     */
    render() {
        return (
            <Panel
                popup={true}
                opened={this.state.Shown}
                className="CHT-app-panel"
                contentName="CHT-app"
                onClose={UIController.ToggleChat}
                onOpen={this.onChatOpen}
                buttons={[<ChatMessageEntry key="chat-entry" opened={this.state.Shown}/>]}
                scrollBottom={true}
                title="Chat - (All Users)"
                >
                <ChatMessages/>
            </Panel>
        )
    }
}

class ChatMessages extends React.PureComponent<any, {
    Messages:Array<MessageRecord>;
}> {
    readonly state = {
        Messages:ChatController.Get()
    };

    protected ScrollItem:React.RefObject<HTMLDivElement> = React.createRef();

    protected remoteChat?:Unsubscribe;

    constructor(props) {
        super(props);
        this.updateChat = this.updateChat.bind(this);
    }

    protected async updateChat() {
        this.setState({Messages:ChatController.Get()});
    }

    /**
     * Triggered when the component updates
     */
    componentDidUpdate() {
        if(this.ScrollItem !== null && this.ScrollItem.current !== null)
            this.ScrollItem.current.scrollIntoView({behavior:"smooth"});
    }

    componentDidMount() {
        this.remoteChat = ChatController.Subscribe(this.updateChat);
    }

    componentWillUnmount() {
        if(this.remoteChat)
            this.remoteChat();
    }

    render() {
        let lines:Array<React.ReactElement> = new Array<React.ReactElement>();
        this.state.Messages.forEach((message, index) => {
            lines.push(<ChatMessage message={message} key={`msg-${index}`}/>);
        });
        return (
            <React.Fragment>
                {lines}
                <div ref={this.ScrollItem}></div>
            </React.Fragment>
        )
    }
    
}

/**
 * 
 * @param props PChatMessage
 */
function ChatMessage(props:{message:MessageRecord}) {
    var className = cnames('chat-line', {self:props.message.self});
    return (
        <div className={className} title={props.message.time}>
            <div className="message-text">{props.message.line}</div>
            <div className="name">
                <span className="qm"></span>
                <span className="nd">{props.message.name}</span>
            </div>
        </div>
    )
}

/**
 * Component for entering a chat message
 */
class ChatMessageEntry extends React.PureComponent<{
    opened?:boolean;
}, {
    MessageText:string;
}>{
    readonly state = {
        MessageText:''
    };

    /**
     * Reference element for text entry
     */
    protected MessageItem:React.RefObject<HTMLInputElement> = React.createRef();

    /**
     * Constructor
     * @param props 
     */
    constructor(props) {
        super(props);
        this.onChangeMessage = this.onChangeMessage.bind(this);
        this.onKeyUpMessage = this.onKeyUpMessage.bind(this);
        this.addMessage = this.addMessage.bind(this);
        this.onClickClear = this.onClickClear.bind(this);
    }

    /**
     * Triggered when the user presses and releases a key in the chat box.
     * @param {KeyEvent} ev 
     */
    protected onKeyUpMessage(ev) {
        switch(ev.keyCode) {
            case keycodes.ENTER :
                this.addMessage();
            break;
            case keycodes.ESCAPE :
                this.setState(() => { return {MessageText:''} });
            break;
            default: break;
        }
    }

    protected onClickClear() {
        this.setState(() => {
            return {MessageText:''}
        }, () => {
            if(this.MessageItem !== null && this.MessageItem.current !== null)
                this.MessageItem.current.focus();
            ChatController.Clear();
        });
    }

    /**
     * Triggered when the user types in the message box.
     * @param {Event} ev 
     */
    protected onChangeMessage(ev: React.ChangeEvent<HTMLInputElement>) {
        var value = ev.currentTarget.value;
        this.setState(() => {return {MessageText:value};});
    }

    /**
     * Adds a message to the chat room, sending it to all connected peers.
     */
    protected addMessage() {
        if(this.state.MessageText === undefined)
            return;

        if(this.state.MessageText.trim().length <= 0)
            return;

        let date = new Date();
        let line:MessageRecord = {
            line:this.state.MessageText,
            name:window.LocalServer.LocalPeer.ID,
            read:true,
            self:true,
            time:date.getMinutes().toString().padStart(2,'0') + ":" + date.getSeconds().toString().padStart(2,'0')
        };

        this.setState({MessageText:''});
        ChatController.AddMessage(line);

        if(window && window.LocalServer) {
            window.LocalServer.LocalPeer.sendChatMessage(line);
        }
    }

    /**
     * Triggered when the component updates.
     * @param props any
     */
    componentDidUpdate(prevProps:any) {
        if(this.props.opened && !prevProps.opened) {
            if(this.MessageItem !== null && this.MessageItem.current !== null) {
                this.MessageItem.current.focus();
                this.MessageItem.current.select();
            }
        }
    }

    /**
     * Renders the component
     */
    render() {
        let messageLength:number = (this.state.MessageText) ? this.state.MessageText.length : 0;
        return (
            <React.Fragment>
                <input type="text" size={20} maxLength={140}
                    value={this.state.MessageText}
                    onChange={this.onChangeMessage}
                    onKeyUp={this.onKeyUpMessage}
                    ref={this.MessageItem}
                    key="txt-message"/>
                <Icon
                    key="btn-clear"
                    onClick={this.onClickClear}
                    title="Clear Chat"
                    src={IconDelete}
                />
                <Icon
                    key="btn-send"
                    onClick={this.addMessage}
                    title="Send"
                    active={(messageLength >= 1)}
                    src={IconCheck}
                />
            </React.Fragment>
        );
    }
}