import React from 'react';
import { BaseRecordForm } from './base';

interface Props {
    recordId:number;
    onSave:{():void};
}

interface State {
    
}

/**
 * Form for adding/editing a penalty record.
 */
class Main extends React.PureComponent<Props, State> {
    readonly state:State = {
        
    }

    render() {
        return <BaseRecordForm
            recordId={this.props.recordId}
            recordType='SPN'
            showMedia={true}
            showURL={true}
            showNumber={false}
            showCode={false}
            showDescription={true}
            showShortName={true}
            onCancel={this.props.onSave}
            onSave={this.props.onSave}
        >
        </BaseRecordForm>
    }
}

export {Main as SponsorForm};