import React from 'react';
import { Scoreboard } from 'tools/scoreboard/functions';

interface Props {

}

/**
 * 
 * @param props 
 * @returns 
 */
const PhaseName:React.FunctionComponent<Props> = props => {
    const [name, setName] = React.useState(Scoreboard.GetState().PhaseName || '');
    React.useEffect(() => Scoreboard.Subscribe(() => {
        setName(Scoreboard.GetState().PhaseName || '');
    }), []);
    return <div className='phase'>{name}</div>
};

export {PhaseName};