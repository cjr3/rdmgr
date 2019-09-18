import React from 'react';
import ChatController from 'controllers/ChatController';
import Panel from 'components/Panel';
import {Icon, IconCheck, IconDelete} from 'components/Elements';
import keycodes from 'tools/keycodes';
import cnames from 'classnames';
import './css/ChatForm.scss';

/**
 * Component for displaying a chat room for peer connections.
 */
class ChatForm extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            Chat:Object.assign({}, ChatController.getState()),
            MessageText:''
        };

        this.MessageItem = React.createRef();

        //bindings
        this.onChatOpen = this.onChatOpen.bind(this);
        this.onChangeMessage = this.onChangeMessage.bind(this);
        this.onKeyUpMessage = this.onKeyUpMessage.bind(this);
        this.addMessage = this.addMessage.bind(this);

        this.updateChat = this.updateChat.bind(this);
        this.remoteChat = ChatController.subscribe(this.updateChat);
    }

    /**
     * Updates the state to match the chat controller.
     */
    updateChat() {
        this.setState(() => {
            return {Chat:Object.assign({}, ChatController.getState())};
        });
    }

    /**
     * Triggered when the chat panel is opened.
     * - Marks all messages as read.
     */
    onChatOpen() {
        ChatController.ReadMesssages();
        if(this.MessageItem.current) {
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
                if(this.state.MessageText === '' && this.props.onClose)
                    this.props.onClose();
                this.setState(() => { return {MessageText:''} });
            break;
            default: break;
        }
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
        if(this.state.MessageText.trim().length <= 0)
            return;

        var line = {
            line:this.state.MessageText,
            name:window.LocalServer.LocalPeer.ID,
            read:true,
            self:true
        };

        this.setState({MessageText:''});
        ChatController.AddMessage(line);

        if(window && window.LocalServer) {
            window.LocalServer.LocalPeer.sendChatMessage(line);
        }
    }

    /**
     * Renders the component.
     */
    render() {
        var lines = [];
        var i = 1;
        this.state.Chat.Messages.forEach((message) => {
            lines.push(<ChatMessage message={message} key={`msg-${i}`}/>);
            i++;
        });

        var buttons = [
            <input type="text" size="20" maxLength="140"
                value={this.state.MessageText}
                onChange={this.onChangeMessage}
                onKeyUp={this.onKeyUpMessage}
                ref={this.MessageItem}
                key="txt-message"/>,
            <Icon
                key="btn-clear"
                onClick={() => {
                    ChatController.Clear();
                    this.setState(() => {
                        return {MessageText:''}
                    }, () => {
                        this.MessageItem.current.focus();
                    });
                }}
                title="Clear Chat"
                src={IconDelete}
            />,
            <Icon
                key="btn-send"
                onClick={this.addMessage}
                title="Send"
                active={(this.state.MessageText.length >= 1)}
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

/**
 * Component for displaying a chat message.
 */
class ChatMessage extends React.PureComponent {
    render() {
        var className = cnames('chat-line', {self:this.props.message.self});
        return (
            <div className={className} title={this.props.message.time}>
                <div className="message-text">{this.props.message.line}</div>
                <div className="name">
                    <span className="qm"></span>
                    <span className="nd">{this.props.message.name}</span>
                </div>
            </div>
        )
    }
}

export default ChatForm;