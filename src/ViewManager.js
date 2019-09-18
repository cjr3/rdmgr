import React from 'react'
import {BrowserRouter as Router, Route} from 'react-router-dom'
import Client from './components/apps/Client/Client'
import CaptureForm from './components/apps/CaptureForm/CaptureForm'

class ViewManager extends React.Component {
    static View(props) {
        let name = props.location.search.substr(1);
        let view = null;
        if(name === 'control') {
            view = <Client/>
        }
        else if(name === 'capture')
            view = <CaptureForm/>
        if(view === null)
            throw new Error("View '" + name + "' is undefined.");
        return view;
    }

    render() {
        return (
            <Router>
                <Route path="/" component={ViewManager.View}/>
            </Router>
        )
    }
}

export default ViewManager;