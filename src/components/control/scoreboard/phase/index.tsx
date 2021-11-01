import React from 'react';
import { Scoreboard } from 'tools/scoreboard/functions';

interface Props extends React.HTMLProps<HTMLDivElement> {

}

/**
 * Control and display phase name.
 * @param props 
 * @returns 
 */
const ScoreboardPhase:React.FunctionComponent<Props> = props => {
    const [name, setName] = React.useState(Scoreboard.GetState().PhaseName || '');
    React.useEffect(() => Scoreboard.Subscribe(() => {
        setName(Scoreboard.GetState().PhaseName || '');
    }), []);

    const onClick = React.useCallback((ev:React.MouseEvent<HTMLDivElement>) => {
        ev.stopPropagation();
        Scoreboard.NextPhase()
    }, []);

    const onContextMenu = React.useCallback((ev:React.MouseEvent<HTMLDivElement>) => {
        ev.stopPropagation();
        ev.preventDefault();
        Scoreboard.PreviousPhase();
    }, []);
    
    return <div
        {...props}
        className='phase' 
        title={'Change phase name - Use Quarter menu to set time.'}
        onClick={onClick}
        onContextMenu={onContextMenu}
        >
        {name}
    </div>
}

export {ScoreboardPhase};