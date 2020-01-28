import {CreateController, BaseReducer} from './functions.controllers';
import {IController, Files} from './vars';

interface IChatController extends IController {
    AddMessage:Function;
    ReadMessages:Function;
    GetUnreadMessageCount:Function;
    Clear:Function;
}

enum Actions {
    ADD_MESSAGE = 'ADD_MESSAGE',
    CLEAR_CHAT = 'CLEAR_CHAT',
    MARK_READ = 'MARK_READ'
};

export type MessageRecord = {
    name:string;
    line:string;
    time:string;
    read:boolean;
    self:boolean;
}

interface SChatController {
    Messages:Array<MessageRecord>;
}

export const InitState:SChatController = {
    Messages:[]
};

const AddMessage = (state:SChatController, message:MessageRecord) => {
    let records:Array<MessageRecord> = state.Messages.slice();
    records.push(message);
    if(records.length > 50)
        records.shift();
    return {...state, Messages:records};
};

const MarkAllRead = (state:SChatController) => {
    let records:Array<MessageRecord> = state.Messages.slice();
    records.forEach(m => m.read = true);
    return {...state, Messages:records};
};

const Clear = (state:SChatController) => {
    return {...state, Messages:new Array<MessageRecord>()};
};

const ChatReducer = (state:SChatController = InitState, action) => {
    try {
        switch(action.type) {
            //adds a message
            case Actions.ADD_MESSAGE : {
                return AddMessage(state, action.message);
            }
    
            //mark all chat messages as read
            case Actions.MARK_READ :
                return MarkAllRead(state);
    
            //clears the chat messages
            case Actions.CLEAR_CHAT :
                return Clear(state);
    
            default :
                return BaseReducer(state, action);
        }
    } catch(er) {
        return state;
    }
}

const ChatController:IChatController = CreateController('CHT', ChatReducer);

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
ChatController.AddMessage = async (message:MessageRecord) => {
    ChatController.Dispatch({
        type:Actions.ADD_MESSAGE,
        message:message
    });
};

/**
 * Marks all messages as read.
 */
ChatController.ReadMessages = () => {
    ChatController.Dispatch({
        type:Actions.MARK_READ
    });
};

/**
 * Gets the number of unread messages.
 * @return {Number} The total number of unread messages.
 */
ChatController.GetUnreadMessageCount = () :number => {
    let messages:Array<MessageRecord> = ChatController.GetState().Messages;
    if(messages.length <= 0)
        return 0;
    let total:number = 0;
    messages.forEach(m => {
        if(!m.read)
            total++;
    });
    return total;
};

/**
 * Clears all messages from the user's chat
 * Does not clear messages from other users.
 */
ChatController.Clear = () => {
    ChatController.Dispatch({
        type:Actions.CLEAR_CHAT
    });
};

ChatController.Get = () : Array<MessageRecord> => {
    return ChatController.GetState().Messages;
};

export default ChatController;