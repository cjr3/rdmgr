import React from 'react';
import cnames from 'classnames';
import './css/SortPanel.scss';

interface SSortPanel {
    DragIndex:number,
    DropIndex:number,
    DragEnterX:number,
    DropX:number,
    DropLeft:boolean,
    DropRight:boolean
}

interface PSortPanel {
    items:Array<any>,
    index?:number,
    className?:string,
    onDrop?:Function,
    onDoubleClick?:Function
}

class SortPanel extends React.PureComponent<PSortPanel, SSortPanel> {
    readonly state:SSortPanel = {
        DragIndex:-1,
        DropIndex:-1,
        DragEnterX:-1,
        DropX:-1,
        DropLeft:false,
        DropRight:false
    }

    constructor(props) {
        super(props);
        this.onDragEnd = this.onDragEnd.bind(this);
        this.onDragLeave = this.onDragLeave.bind(this);
        this.onDragOver = this.onDragOver.bind(this);
        this.onDragStart = this.onDragStart.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.onDoubleClick = this.onDoubleClick.bind(this);
    }

    /**
     * Triggered when the user drags an item over a droppable item
     */
    async onDragOver(ev) {
        var index = parseInt( ev.target.dataset.index );
        ev.preventDefault();
        this.setState(() => {
            return {DropIndex:index};
        });
    }

    /**
     * Triggered when the user begins dragging a slide.
     */
    async onDragStart(ev) {
        var index = parseInt( ev.target.dataset.index );
        this.setState(() => {
            return {DragIndex:index}
        });
    }

    /**
     * Triggered when a slide is dropped onto a droppable item.
     */
    async onDrop(ev) {
        if(this.state.DropIndex > -1 && this.state.DragIndex > -1 && this.state.DropIndex !== this.state.DragIndex) {
            if(this.props.onDrop) {
                this.props.onDrop(this.state.DropIndex, this.state.DragIndex, ev.ctrlKey);
            }
        }
    }

    /**
     * Triggered when dragging stops.
     */
    async onDragEnd() {
        this.setState(() => {
            return {DragIndex:-1, DropIndex:-1, DragEnterX:-1}
        });
    }

    /**
     * Triggered when a draggable is no longer over a droppable.
     */
    async onDragLeave() {
        this.setState(() => {
            return {DropIndex:-1, DragEnterX:-1}
        });
    }

    /**
     * Triggered when an item is double-clicked.
     * @param {Event} ev 
     */
    onDoubleClick(ev) {
        var index = ev.target.dataset.index;
        if(this.props.onDoubleClick)
            this.props.onDoubleClick(index);
    }

    /**
     * Renders the component.
     */
    render() {
        var items:Array<React.ReactElement> = [];
        var className = '';
        for(let i=0, len = this.props.items.length; i < len; i++) {
            let item = this.props.items[i];
            className = cnames('sortable', {
                active:(i === this.props.index),
                ['drop-target']:(i === this.state.DropIndex && i !== this.state.DragIndex),
                ['drag-target']:(i === this.state.DragIndex && i !== this.state.DropIndex),
                ['drop-left']:(i === this.state.DropIndex && this.state.DropLeft),
                ['drop-right']:(i === this.state.DropIndex && this.state.DropRight)
            }, item.className);
            items.push(<div
                className={className}
                key={`item-${i}`}
                draggable={true}
                onDragStart={this.onDragStart}
                onDragOver={this.onDragOver}
                onDragEnd={this.onDragEnd}
                onDrop={this.onDrop}
                onDragLeave={this.onDragLeave}
                onDoubleClick={this.onDoubleClick}
                data-index={i}
                >{item.label}</div>
            );
        }

        className = cnames('sortable-pane', this.props.className);
        return (
            <div className={className}>{items}</div>
        );
    }
}

export default SortPanel;