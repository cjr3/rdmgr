import classNames from 'classnames';
import { IconHidden, IconStar, IconTeam, IconUp, IconVisible, IconX } from 'components/common/icons';
import React from 'react';
import { Capture } from 'tools/capture/functions';
import { Scorekeeper } from 'tools/scorekeeper/functions';
import { ScorekeeperTeam } from './team';

interface Props extends React.HTMLProps<HTMLDivElement> {
    active:boolean;
    stream:boolean;
}

/**
 * Main scorekeeper control
 * @param props 
 * @returns 
 */
const ScorekeeperControl:React.FunctionComponent<Props> = props => {
    const {active, stream, ...rprops} = {...props};
    const [jammerOnly, setJammerOnly] = React.useState(true);
    const [visible, setVisible] = React.useState(Capture.GetScorekeeper().visible || false);
    
    const onClickShift = React.useCallback(() => {
        Scorekeeper.ShiftDecks();
    }, []);

    const onClickClear = React.useCallback(() => {
        Scorekeeper.Clear();
    }, []);

    React.useEffect(() => {
        return Capture.Subscribe(() => {
            setVisible(Capture.GetScorekeeper().visible || false);
        });
    }, []);

    const onClickJammerOnly = React.useCallback(() => setJammerOnly(!jammerOnly), [jammerOnly]);

    return <div {...rprops} className={classNames('scorekeeper-control app', props.className, {active:active, jammerOnly:jammerOnly})}>
        <div className='content'>
            <ScorekeeperTeam side='A' jammerOnly={jammerOnly || stream}/>
            <ScorekeeperTeam side='B' jammerOnly={jammerOnly || stream}/>
        </div>
        <div className='buttons'>
            <IconVisible 
                asButton={true} 
                active={true} 
                onClick={Capture.ToggleScorekeeper}
                style={{display:(visible) ? 'inline-flex' : 'none'}}
                >{(!stream) && <>VISIBLE</>}</IconVisible>
            <IconHidden 
                asButton={true} 
                onClick={Capture.ToggleScorekeeper}
                style={{display:(!visible) ? 'inline-flex' : 'none'}}
                >{(!stream) && <>HIDDEN</>}</IconHidden>
            <IconStar 
                asButton={true} 
                title='Assign On-Track Jammers Only' 
                onClick={onClickJammerOnly}
                style={{display:(jammerOnly && !stream) ? 'inline-flex' : 'none'}}
                >{(!stream) && <>Jammers Only</>}</IconStar>
            <IconTeam 
                asButton={true} 
                active={false} 
                title='Assign All Positions' 
                onClick={onClickJammerOnly}
                style={{display:(!jammerOnly && !stream) ? 'inline-flex' : 'none'}}
                >{(!stream) && <>All Positions</>}</IconTeam>
            <IconUp 
                asButton={true} 
                title='Shift Decks' 
                onClick={onClickShift}
                style={{display:(!jammerOnly) ? 'inline-flex' : 'none'}}
            >{(!stream) && <>Shift</>}</IconUp>
            <IconX asButton={true} title='Clear' onClick={onClickClear}>{(!stream) && <>Clear</>}</IconX>
        </div>
    </div>
};

export {ScorekeeperControl};