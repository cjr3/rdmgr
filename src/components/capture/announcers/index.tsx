import classNames from 'classnames';
import { IconMicrophone } from 'components/common/icons';
import React from 'react';
import { Unsubscribe } from 'redux';
import { Announcers } from 'tools/announcers/functions';
import { Capture } from 'tools/capture/functions';

interface Props extends React.HTMLProps<HTMLDivElement> {

}

interface State {
    label:string;
    visible:boolean;
}

/**
 * Display the announcer names.
 */
class AnnouncerCapture extends React.PureComponent<Props, State> {
    readonly state:State = {
        label:'',
        visible:false
    }

    protected remoteCapture?:Unsubscribe;
    protected remoteAnnouncers?:Unsubscribe;

    protected update = () => {
        this.setState({
            label:[Announcers.Get(1)?.Name || '', Announcers.Get(2)?.Name || ''].filter(v => v).join(' & '),
            visible:Capture.GetAnnouncer().visible || false
        });
    }

    componentDidMount() {
        this.update();
        this.remoteAnnouncers = Announcers.Subscribe(this.update);
        this.remoteCapture = Capture.Subscribe(this.update);
    }

    componentWillUnmount() {
        if(this.remoteAnnouncers)
            this.remoteAnnouncers();

        if(this.remoteCapture)
            this.remoteCapture();
    }

    render(): React.ReactNode {
        return <div {...this.props} className={classNames('capture-announcer', this.props.className, {active:this.state.visible})}>
            <IconMicrophone/>
            <div className='title'>Announcers</div>
            <div className='names'>{this.state.label}</div>
        </div>
    }
}

export {AnnouncerCapture};