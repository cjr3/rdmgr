import React from 'react';
import * as cnames from 'classnames';
import {
    IconShown,
    IconHidden,
    IconController,
    Icon,
    IconButton
} from 'components/Elements';
import Panel from 'components/Panel';

/**
 * Properties for the CaptureControlPanel component.
 */
export interface PCaptureControlPanel {
    /**
     * True if active, false if not
     */
    active:boolean;
    /**
     * Name to display on the button
     */
    name:string;
    /**
     * Icon to display on the button
     */
    icon?:any;
    /**
     * Function to toggle visibility of capture element
     */
    toggle?:Function;
    /**
     * Determines if the controlled capture element is visible or not
     */
    shown?:boolean;
    /**
     * Buttons to attach to the panel
     */
    buttons?:any;
    /**
     * Triggered when the user presses the accordion button
     */
    onClick:Function;
    /**
     * Child elements to put inside the panel
     */
    children?:any;
    /**
     * Determines if this panel is the one that receives input response from 
     * keyboard and gamepad input
     */
    controlled:boolean;
    /**
     * Triggered when the user presses the gamepad icon
     */
    onClickControl:Function;
}

/**
 * Wrapper component for accordion panels on the capture control screen.
 * @param props PCaptureControlPanel
 */
export default function CaptureControlPanel(props:PCaptureControlPanel) {
    return (
        <div className={cnames('config-panel', {shown:props.active})}>
            <div className="buttons">
                <IconButton
                    src={props.icon}
                    active={(props.active)}
                    onClick={props.onClick}
                    >{props.name}</IconButton>
                <Icon
                    src={IconController}
                    active={props.controlled}
                    onClick={props.onClickControl}/>
                <Icon
                    src={(props.shown) ? IconShown : IconHidden}
                    active={props.shown}
                    onClick={props.toggle}/>
            </div>
            <Panel 
                opened={props.active}
                buttons={props.buttons}
                >
                {props.children}
            </Panel>
        </div>
    );
}