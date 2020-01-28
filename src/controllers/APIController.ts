import {createStore} from 'redux';

interface State {
    
}

const InitState:State = {

}

const APIReducer = function(state:State = InitState, action) : State {
    try {
        switch(action.type) {


            default :
                return state;
        }
    } catch(er) {
        return state;
    }
}

const APIStore = createStore(APIReducer);

const APIController = {
    build() {
        
    }
};

export default APIController;