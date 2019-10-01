import React from 'react'
import Panel from 'components/Panel'
import ScoreboardController from 'controllers/ScoreboardController'
import {IconButton, IconNo, IconCheck} from 'components/Elements'

/**
 * 
 */
export interface PJamReset {
    /**
     * Hour when last jam started
     */
    hour:number,
    /**
     * Minute when last jam started
     */
    minute:number,
    /**
     * Second when last jam started
     */
    second:number,
    /**
     * true = shown, false = hidden
     */
    opened:boolean,
    /**
     * Triggered when closed
     */
    onClose:Function
}

/**
 * Component for displaying jam reset options
 * - Displays the game clock time when the previous jam started
 * @param props PJamReset
 */
export default function JamReset(props:PJamReset) {    
    let startClock:string = `${props.hour.toString().padStart(2,'0')}:${props.minute.toString().padStart(2,'0')}:${props.second.toString().padStart(2,'0')}`;
    return (
        <Panel 
            opened={props.opened}
            buttons={[
                <IconButton
                    key="button-submit"
                    onClick={() => {
                        ScoreboardController.ResetJam();
                        props.onClose();
                    }}
                    src={IconCheck}
                    >Yes</IconButton>,
                <IconButton
                    key="button-cancel"
                    onClick={props.onClose}
                    src={IconNo}
                    >No</IconButton>
            ]}
            popup={true}
            className="jam-reset-panel"
            contentName="jam-reset"
            >
            <p>
                Reset the game clock to the time below?
            </p>
            <h1>{startClock}</h1>
        </Panel>
    )
}