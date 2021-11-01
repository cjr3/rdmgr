import classNames from 'classnames';
import { IconMicrophone } from 'components/common/icons';
import React from 'react';
import { Announcers } from 'tools/announcers/functions';
import { Capture } from 'tools/capture/functions';

interface Props extends React.HTMLProps<HTMLDivElement> {

}

const AnnouncerCapture:React.FunctionComponent<Props> = props => {
    const [visible, setVisible] = React.useState(Capture.GetAnnouncer().visible || false);
    const [name1, setName1] = React.useState(Announcers.Get(1)?.Name || '');
    const [name2, setName2] = React.useState(Announcers.Get(2)?.Name || '');

    React.useEffect(() => {
        return Announcers.Subscribe(() => {
            setName1(Announcers.Get(1)?.Name || '');
            setName2(Announcers.Get(2)?.Name || '');
        });
    }, []);

    React.useEffect(() => {
        return Capture.Subscribe(() => {
            setVisible(Capture.GetAnnouncer().visible || false);
        });
    }, []);

    let label:string = '';
    if(name1 && name2)
        label = name1 + ' & ' + name2;
    else if(name1)
        label = name1;
    else if(name2)
        label = name2;

    return <div {...props} className={classNames('capture-announcer', props.className, {active:visible})}>
        <IconMicrophone/>
        <div className='title'>Announcers</div>
        <div className='names'>{label}</div>
    </div>
}

export {AnnouncerCapture};