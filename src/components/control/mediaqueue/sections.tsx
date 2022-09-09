import { Collapsable } from 'components/common/collapsable';
import React from 'react';
import { Capture } from 'tools/capture/functions';
import { AnnouncerControl } from '../sections/announcers';
import { AnthemControl } from '../sections/anthem';
import { ScheduleControl } from '../sections/schedule';
import { StandingsControl } from '../sections/standings';
import { AutoSlideshowControl } from './autoslideshow';

interface Props {

}

interface SectionProps {
    active:boolean;
    onToggle:{():void};
}

/**
 * Media Queue control sections.
 * @param props 
 * @returns 
 */
const MediaQueueSections:React.FunctionComponent<Props> = props => {
    const [section, setSection] = React.useState('announcers');
    const onToggleAnnouncer = React.useCallback(() => {setSection('announcers')}, []);
    const onToggleAnthem = React.useCallback(() => {setSection('anthem')}, []);
    const onToggleSchedule = React.useCallback(() => {setSection('schedule')}, []);
    const onToggleStandings = React.useCallback(() => {setSection('standings')}, []);
    return <>
        <AutoSlideshowControl/>
        <AnnouncerSection active={(section === 'announcers')} onToggle={onToggleAnnouncer}/>
        <AnthemSection active={(section === 'anthem')} onToggle={onToggleAnthem}/>
        <ScheduleSection active={(section === 'schedule')} onToggle={onToggleSchedule}/>
        <StandingsSection active={(section === 'standings')} onToggle={onToggleStandings}/>
    </>
};

/**
 * Announcer section
 * @param props 
 * @returns 
 */
const AnnouncerSection:React.FunctionComponent<SectionProps> = props => {
    const [visible, setVisible] = React.useState(Capture.GetAnnouncer().visible || false);
    React.useEffect(() => {
        return Capture.Subscribe(() => {
            setVisible(Capture.GetAnnouncer().visible || false);
        })
    }, []);
    return <Collapsable
        active={props.active}
        label='Announcers'
        visible={visible}
        onToggle={props.onToggle}
        onToggleVisibility={Capture.ToggleAnnouncers}
    >
        <AnnouncerControl/>
    </Collapsable>
};

/**
 * Anthem singer section.
 * @param props 
 * @returns 
 */
const AnthemSection:React.FunctionComponent<SectionProps> = props => {
    const [visible, setVisible] = React.useState(Capture.GetAnthem().visible || false);
    React.useEffect(() => {
        return Capture.Subscribe(() => {
            setVisible(Capture.GetAnthem().visible || false);
        })
    }, []);
    return <Collapsable
        active={props.active}
        label='Anthem Singer'
        visible={visible}
        onToggle={props.onToggle}
        onToggleVisibility={Capture.ToggleAnthem}
    >
        <AnthemControl active={visible}/>
    </Collapsable>
};

const ScheduleSection:React.FunctionComponent<SectionProps> = props => {
    const [visible, setVisible] = React.useState(Capture.GetSchedule().visible || false);
    React.useEffect(() => {
        return Capture.Subscribe(() => {
            setVisible(Capture.GetSchedule().visible || false);
        })
    }, []);
    return <Collapsable
        active={props.active}
        label='Schedule'
        visible={visible}
        onToggle={props.onToggle}
        onToggleVisibility={Capture.ToggleSchedule}
    >
        <ScheduleControl/>
    </Collapsable>
};


const StandingsSection:React.FunctionComponent<SectionProps> = props => {
    const [visible, setVisible] = React.useState(Capture.GetSchedule().visible || false);
    React.useEffect(() => {
        return Capture.Subscribe(() => {
            setVisible(Capture.GetStandings().visible || false);
        })
    }, []);
    return <Collapsable
        active={props.active}
        label='Standings'
        visible={visible}
        onToggle={props.onToggle}
        onToggleVisibility={Capture.ToggleStandings}
    >
        <StandingsControl/>
    </Collapsable>
};

export {MediaQueueSections, AnnouncerSection, StandingsSection, ScheduleSection};