import React from 'react';
import cnames from 'classnames';
import {Icon, IconX} from 'components/Elements';
import './css/Panel.scss';

interface PPanel {
    opened:boolean;
    popup?:boolean;
    buttons?:Array<React.ReactElement>;
    className?:string;
    contentName?:string;
    scrollTop?:number;
    scrollBottom?:boolean;
    title?:any;
    error?:string;
    onOpen?:Function;
    onClose?:Function;
}

/**
 * Component for creating a panel
 */
class Panel extends React.Component<PPanel> {
    componentDidUpdate(prevProps) {
        if(prevProps.opened === false && this.props.opened === true) {
            if(this.props.onOpen)
                this.props.onOpen();
        }
    }

    /**
     * Renders the component.
     */
    render() {
        var classNames = cnames({
            panel:true,
            opened:this.props.opened,
            popup:(this.props.popup),
            'has-buttons':(this.props.buttons && this.props.buttons.length) ? true : false,
            'buttons-only':(this.props.buttons && !this.props.children)
        }, this.props.className);

        return (
            <div className={classNames}>
                <PanelTitle onClose={this.props.onClose}>{this.props.title}</PanelTitle>
                <PanelContent 
                    className={this.props.contentName}
                    scrollTop={this.props.scrollTop}
                    scrollBottom={this.props.scrollBottom}
                    >{this.props.children}</PanelContent>
                <div className="buttons">{this.props.buttons}</div>
            </div>
        )
    }
}

interface PPanelTitle {
    onClose?:Function,
    children?:any
}

/**
 * Titlebar for panels
 */
function PanelTitle(props:PPanelTitle) {
    return (
        <div className="title">
            <div className="title-text">{props.children}</div>
            <div className="buttons">
                <Icon
                    src={IconX}
                    onClick={props.onClose}
                    title="Close"/>
            </div>
        </div>
    )
}

/**
 * Content container for panels.
 */
class PanelContent extends React.Component<{
    scrollBottom?:boolean;
    scrollTop?:number;
    className?:string;
}> {
    ScrollItem:React.RefObject<HTMLDivElement> = React.createRef();
    /**
     * Triggered when the component updates
     */
    componentDidUpdate() {
        if(this.props.scrollBottom) {
            if(this.ScrollItem !== null && this.ScrollItem.current !== null)
                this.ScrollItem.current.scrollIntoView({behavior:"smooth"});
        }
    }

    /**
     * Renders the component.
     */
    render() {
        var style:any = {};
        if(this.props.scrollTop !== undefined)
            style.scrollTop = this.props.scrollTop;
        return (
            <div className={cnames('content', this.props.className)} style={style}>
                {this.props.children}
                <div ref={this.ScrollItem}></div>
            </div>
        )
    }
}

export default Panel;