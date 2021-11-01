import { TextInput } from 'components/common/inputs/textinput';
import React from 'react';
import { Announcers } from 'tools/announcers/functions';

interface Props extends React.HTMLProps<HTMLTableElement> {

}

let atimer1:any = 0;
let atimer2:any = 0;

/**
 * Input panel for announcer names.
 * @param props 
 * @returns 
 */
const AnnouncerControl:React.FunctionComponent<Props> = props => {
    const [announcer1, setAnnouncer1] = React.useState(Announcers.Get(1)?.Name || '');
    const [announcer2, setAnnouncer2] = React.useState(Announcers.Get(2)?.Name || '');

    const onChangeAnnouncer1 = React.useCallback((value:string) => {
        setAnnouncer1(value);
        try {
            clearTimeout(atimer1)
        } catch(er) {

        }
        atimer1 = setTimeout(() => {
            Announcers.SetName(value, 1);
        }, 100);
    }, []);
    
    const onChangeAnnouncer2 = React.useCallback((value:string) => {
        setAnnouncer2(value);
        try {
            clearTimeout(atimer2)
        } catch(er) {

        }
        atimer2 = setTimeout(() => {
            Announcers.SetName(value, 2);
        }, 100);
    }, []);

    React.useEffect(() => Announcers.Subscribe(() => {
        setAnnouncer1(Announcers.Get(1)?.Name || '');
        setAnnouncer2(Announcers.Get(2)?.Name || '');
    }), []);

    return <table {...props} className='table'>
            <tbody>
                <tr>
                    <td>
                        <TextInput value={announcer1} onChangeValue={onChangeAnnouncer1} placeholder='Announcer #1'/>
                    </td>
                </tr>
                <tr>
                    <td>
                        <TextInput value={announcer2} onChangeValue={onChangeAnnouncer2} placeholder='Announcer #2'/>
                    </td>
                </tr>
            </tbody>
        </table>;
};

export {AnnouncerControl};