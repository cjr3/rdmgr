import classNames from 'classnames';
import React from 'react';
import { Capture } from 'tools/capture/functions';
import Data from 'tools/data';
import { ScorebannerScoreboard } from './scoreboard';

interface Props extends React.HTMLProps<HTMLDivElement> {

}

/**
 * Displays the scoreboard as a banner.
 */
const StreamBanner:React.FunctionComponent<Props> = props => {
    const [visible, setVisible] = React.useState(Capture.GetScorebanner().visible || false);
    const [className, setClassName] = React.useState(Capture.GetScorebanner().className || '');
    const [background, setBackground] = React.useState(Capture.GetScorebanner().backgroundImage || '');

    React.useEffect(() => {
        return Capture.Subscribe(() => {
            const state = Capture.GetScorebanner();
            setVisible(state.visible || false);
            setClassName(state.className || '');
            setBackground(state.backgroundImage || '');
        });
    }, []);

    const style:React.CSSProperties = {};
    if(background) {
        style.backgroundImage = "url('" + Data.GetMediaPath(background, 'file:///') + "')"
    };
    
    return <div 
        {...props}
        className={classNames('capture-scorebanner', className, props.className, {active:visible})}
        style={style}
        >
        <ScorebannerScoreboard/>
    </div>
}

export {StreamBanner};