import React from 'react';
import { BaseRecordForm } from './base';

interface Props {
    recordId:number;
    onSave:{():void};
}

interface State {
    
}

/**
 * Form for adding/editing an anthem singer or announcer record.
 */
class Main extends React.PureComponent<Props, State> {
    readonly state:State = {
        
    }

    render() {
        return <BaseRecordForm
            recordId={this.props.recordId}
            recordType='ANT'
            showURL={false}
            showNumber={false}
            onCancel={this.props.onSave}
            onSave={this.props.onSave}
        >
        </BaseRecordForm>
    }
}

export {Main as AnthemForm};