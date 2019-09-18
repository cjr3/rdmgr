import React from 'react'
import cnames from 'classnames'
import {Icon} from 'components/Elements'
import './css/Panel.scss'

/**
 * Component for creating a panel
 */
class Panel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pinned:false,
            popup:false
        };

        this.ContentItem = React.createRef();

        //bindings
        this.open = this.open.bind(this);
        this.toggle = this.toggle.bind(this);
    }

    open() {
        this.setState((state) => {
            return {opened:true};
        });
    }

    toggle() {
        this.setState((state) => {
            return {opened:!state.opened};
        });
    }

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
            pinned:this.state.pinned,
            popup:(this.props.popup),
            'has-buttons':(this.props.buttons && this.props.buttons.length) ? true : false,
            'buttons-only':(this.props.buttons && !this.props.children)
        }, this.props.className);

        return (
            <div className={classNames}>
                <PanelTitle
                    onClose={this.props.onClose}
                    >{this.props.title}</PanelTitle>
                <PanelContent 
                    className={this.props.contentName}
                    scrollTop={this.props.scrollTop}
                    scrollBottom={this.props.scrollBottom}
                    >{this.props.children}</PanelContent>
                <PanelButtons>{this.props.buttons}</PanelButtons>
            </div>
        )
    }
}

/**
 * Titlebar for panels
 */
class PanelTitle extends React.Component {

    render() {
        const classes = cnames({
            title:true,
            shown:this.props.shown,
        })
        return (
            <div className={classes}>
                <div className="title-text">{this.props.children}</div>
                <div className="buttons">
                    <Icon
                        src={require('images/icons/x.png')}
                        onClick={this.props.onClose}
                        title="Close"/>
                </div>
            </div>
        )
    }
}

/**
 * Button container for panels.
 */
class PanelButtons extends React.Component {
    render() {
        return (
            <div className="buttons">{this.props.children}</div>
        )
    }
}

/**
 * Content container for panels.
 */
class PanelContent extends React.Component {
    constructor(props) {
        super(props);
        this.ScrollItem = React.createRef();
    }

    componentDidUpdate() {
        if(this.props.scrollBottom) {
            if(this.ScrollItem.current)
                this.ScrollItem.current.scrollIntoView({behavior:"smooth"});
        }
    }

    render() {
        var style = {};
        if(this.props.scrollTop)
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