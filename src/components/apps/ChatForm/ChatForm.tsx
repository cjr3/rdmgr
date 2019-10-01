import React from 'react';
import ChatController, {SChatController, MessageRecord} from 'controllers/ChatController';
import Panel from 'components/Panel';
import {Icon, IconCheck, IconDelete} from 'components/Elements';
import keycodes from 'tools/keycodes';
import cnames from 'classnames';
import './css/ChatForm.scss';

interface SChatForm extends SChatController {
    MessageText?:string
}

/**
 * Component for displaying a chat room for peer connections.
 */
export default class ChatForm extends React.PureComponent<any, SChatForm> {

    readonly state:SChatForm = ChatController.getState();
    /**
     * User text field input
     */
    protected MessageItem:React.RefObject<HTMLInputElement> = React.createRef();
    /**
     * ChatController remote
     */
    protected remoteChat:Function|null = null;

    /**
     * Constructor
     * @param props 
     */
    constructor(props) {
        super(props);
        this.state.MessageText = '';

        //bindings
        this.onChatOpen = this.onChatOpen.bind(this);
        this.onChangeMessage = this.onChangeMessage.bind(this);
        this.onKeyUpMessage = this.onKeyUpMessage.bind(this);
        this.onClickClear = this.onClickClear.bind(this);
        this.addMessage = this.addMessage.bind(this);
        this.updateChat = this.updateChat.bind(this);
    }

    /**
     * Updates the state to match the chat controller.
     */
    updateChat() {
        this.setState(ChatController.getState());
    }

    /**
     * Triggered when the chat panel is opened.
     * - Marks all messages as read.
     */
    onChatOpen() {
        ChatController.ReadMesssages();
        if(this.MessageItem !== null && this.MessageItem.current !== null) {
            this.MessageItem.current.focus();
            this.MessageItem.current.select();
        }
    }

    /**
     * Triggered when the user presses and releases a key in the chat box.
     * @param {KeyEvent} ev 
     */
    onKeyUpMessage(ev) {
        switch(ev.keyCode) {
            case keycodes.ENTER :
                this.addMessage();
            break;
            case keycodes.ESCAPE :
                if(this.state.MessageText === '' && this.props.onClose) {
                    this.props.onClose();
                    if(this.MessageItem !== null && this.MessageItem.current !== null) {
                        this.MessageItem.current.blur();
                    }
                }
                this.setState(() => { return {MessageText:''} });
            break;
            case keycodes.F9 :
                if(this.props.onClose) {
                    this.props.onClose();
                    if(this.MessageItem !== null && this.MessageItem.current !== null) {
                        this.MessageItem.current.blur();
                    }
                }
            break;
            default: break;
        }
    }

    /**
     * 
     */
    onClickClear() {
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
    onChangeMessage(ev) {
        var value = ev.target.value;
        this.setState(() => {return {MessageText:value};});
    }

    /**
     * Adds a message to the chat room, sending it to all connected peers.
     */
    addMessage() {
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
     * Start listeners
     */
    componentDidMount() {
        this.remoteChat = ChatController.subscribe(this.updateChat);
    }

    /**
     * Close listeners
     */
    componentWillUnmount() {
        if(this.remoteChat !== null)
            this.remoteChat();
    }

    /**
     * Renders the component.
     */
    render() {
        let lines:Array<React.ReactElement> = [];
        let i = 1;
        this.state.Messages.forEach((message) => {
            lines.push(<ChatMessage message={message} key={`msg-${i}`}/>);
            i++;
        });
        let messageLength:number = (this.state.MessageText !== undefined) ? this.state.MessageText.length : 0

        let buttons = [
            <input type="text" size={20} maxLength={140}
                value={this.state.MessageText}
                onChange={this.onChangeMessage}
                onKeyUp={this.onKeyUpMessage}
                ref={this.MessageItem}
                key="txt-message"/>,
            <Icon
                key="btn-clear"
                onClick={this.onClickClear}
                title="Clear Chat"
                src={IconDelete}
            />,
            <Icon
                key="btn-send"
                onClick={this.addMessage}
                title="Send"
                active={(messageLength >= 1)}
                src={IconCheck}
            />
        ];

        return (
            <Panel
                popup={true}
                opened={this.props.opened}
                className="CHT-app-panel"
                contentName="CHT-app"
                onClose={this.props.onClose}
                onOpen={this.onChatOpen}
                buttons={buttons}
                scrollBottom={true}
                title="Chat - (All Users)"
                >
                    {lines}
            </Panel>
        )
    }
}

interface PChatMessage {
    message:MessageRecord
}

/**
 * 
 * @param props PChatMessage
 */
function ChatMessage(props:PChatMessage) {
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