import classNames from 'classnames';
import React from 'react';
import Data from 'tools/data';
import { Scoreboard } from 'tools/scoreboard/functions';
import { UIController } from 'tools/UIController';

interface Props extends React.HTMLProps<HTMLDivElement> {

}

/**
 * Display leauge logo.
 * @param props 
 * @returns 
 */
const ScoreboardLeagueLogo:React.FunctionComponent<Props> = props => {
    const [logo, setLogo] = React.useState(UIController.GetState().Config.Misc?.LeagueLogo || '');
    const [active, setActive] = React.useState(Scoreboard.GetState().ConfirmStatus || false);
    React.useEffect(() => {
        return UIController.Subscribe(() => {
            setLogo(UIController.GetState().Config.Misc?.LeagueLogo || '');
        });
    }, []);
    React.useEffect(() => {
        return Scoreboard.Subscribe(() => {
            setActive(Scoreboard.GetState().ConfirmStatus || false);
        })
    }, []);

    return <div {...props} className={classNames('league-logo', props.className, {active:active})}>
        {
            (logo && logo.length > 0) &&
            <img src={Data.GetMediaPath(logo)} alt=''/>
        }
    </div>
}

export {ScoreboardLeagueLogo};