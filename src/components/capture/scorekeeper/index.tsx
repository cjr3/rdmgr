import classNames from 'classnames';
import React from 'react';
import { Capture } from 'tools/capture/functions';
import { Team } from './team';

interface Props extends React.HTMLProps<HTMLDivElement> {
    active:boolean;
}

/**
 * Display scorekeeper.
 * @param props 
 * @returns 
 */
const ScorekeeperCapture:React.FunctionComponent<Props> = props => {
    const {active, ...rprops} = {...props};
    const [visible, setVisible] = React.useState(Capture.GetScorekeeper().visible || false);

    React.useEffect(() => {
        return Capture.Subscribe(() => {
            setVisible(Capture.GetScorekeeper().visible || false);
        });
    }, []);
    return <div {...rprops} className={classNames('capture-scorekeeper', rprops.className, {active:(active && visible)})}>
        <Team side='A'/>
        <Team side='B'/>
    </div>
};

export {ScorekeeperCapture};