import classNames from 'classnames';
import React from 'react';
import { UIController } from 'tools/UIController';
import { Team } from './team';

interface Props extends React.HTMLProps<HTMLDivElement> {

}

/**
 * 
 * @param props 
 */
const ScorekeeperReel:React.FunctionComponent<Props> = props => {
    const state = UIController.GetState().ScorekeeperReel;
    const [active, setActive] = React.useState(state?.visible || false);

    React.useEffect(() => UIController.Subscribe(() => {
        const state = UIController.GetState().ScorekeeperReel;
        setActive(state?.visible || false);
    }), []);

    return <div {...props} className={classNames('scorekeeper-reel', {active:active})}>
        <Team side='A'/>
        <Team side='B'/>
    </div>
};

export {ScorekeeperReel};