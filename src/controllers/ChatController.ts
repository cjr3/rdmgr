import {createStore} from 'redux';

const SET_STATE = 'SET_STATE';
const ADD_MESSAGE = 'ADD_MESSAGE';
const CLEAR_CHAT = 'CLEAR_CHAT';
const MARK_READ = 'MARK_READ';

export type MessageRecord = {
    name:string;
    line:string;
    time:string;
    read:boolean;
    self:boolean;
}

export interface SChatController {
    Messages:Array<MessageRecord>
}

const InitState:SChatController = {
    Messages:[]
};

function ChatReducer(state = InitState, action) {
    const date:Date = new Date();
    let messages:Array<MessageRecord> = [];
    switch(action.type) {
        //sets the state
        case SET_STATE :
            return Object.assign({}, state, action.values);

        //adds a message
        case ADD_MESSAGE :
            messages = state.Messages.slice();
            messages.push({
                name:action.message.name,
                line:action.message.line,
                time:action.message.date,
                read:action.message.read,
                self:action.message.self
            });
            return Object.assign({}, state, {Messages:messages});

        //mark all chat messages as read
        case MARK_READ :
            messages = state.Messages.slice();
            messages.forEach((m) => {m.read = true;});
            return Object.assign({}, state, {Messages:messages});

        //clears the chat messages
        case CLEAR_CHAT :
            return Object.assign({}, state, {Messages:[]});

        default :
            return state;
    }
}

const ChatStore = createStore( ChatReducer );

const ChatController = {
    /**
     * Sets the state of the chat controller.
     * @param {Object} state An object with key/value pairs
     */
    SetState(state) {
        ChatController.getStore().dispatch({
            type:SET_STATE,
            values:state
        });
    },

    /**
     * Adds a message to the chat.
     * Message object structure:
     * - line (the text of the message)
     * - name (username / peer ID)
     * - time (time of message)
     * - read (true/false if the message has been seen by the user or not)
     * - self (true/false if message sender is local user)
     * 
     * Messages are not permanent, and are cleared when closing the program.
     * 
     * @param {Object} message 
     */
    AddMessage(message:MessageRecord) {
        ChatController.getStore().dispatch({
            type:ADD_MESSAGE,
            message:message
        });
    },

    /**
     * Marks all messages as read.
     */
    ReadMesssages() {
        ChatController.getStore().dispatch({
            type:MARK_READ
        });
    },

    /**
     * Gets the number of unread messages.
     * @return {Number} The total number of unread messages.
     */
    GetUnreadMessageCount() {
        var total = 0;
        ChatController.getState().Messages.forEach((m:MessageRecord) => {
            total += (m.read) ? 0 : 1;
        });
        return total;
    },

    /**
     * CLears the chat room of messages.
     */
    Clear() {
        ChatController.getStore().dispatch({
            type:CLEAR_CHAT
        });
    },

    /**
     * Gets the current state of the chat controller.
     */
    getState() {
        return ChatStore.getState();
    },

    /**
     * Gets the store
     */
    getStore() {
        return ChatStore;
    },

    /**
     * Adds a listener for state changes.
     * @param {Function} f 
     */
    subscribe(f) {
        return ChatStore.subscribe(f);
    }
};

export default ChatController;