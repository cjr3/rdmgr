import React from 'react';
import cnames from 'classnames';
import './css/SortPanel.scss';

/**
 * Component for sorting elements
 */
export default class SortPanel extends React.PureComponent<{
    /**
     * Items to sort
     */
    items:Array<any>;
    /**
     * Current item
     */
    index?:number;
    /**
     * additional class names
     */
    className?:string;
    /**
     * triggered when the user drops an item
     */
    onDrop?:Function;
    /**
     * Triggered when the user double-clicks an item
     */
    onDoubleClick?:Function;
    //triggered on context-menu click (right-click)
    onContextMenu?:Function;
    //triggered on shift+click
    onClick?:Function;
    max?:number;
}, {
    /**
     * Index of the current drag item
     */
    DragIndex:number;
    /**
     * Index of the drop target
     */
    DropIndex:number;
}> {
    readonly state = {
        DragIndex:-1,
        DropIndex:-1
    }

    /**
     * Reference to current item
     */
    protected CurrentItem:React.RefObject<HTMLDivElement> = React.createRef();

    /**
     * Constructor
     * @param props 
     */
    constructor(props) {
        super(props);
        this.onDragEnd = this.onDragEnd.bind(this);
        this.onDragLeave = this.onDragLeave.bind(this);
        this.onDragOver = this.onDragOver.bind(this);
        this.onDragStart = this.onDragStart.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.onDoubleClick = this.onDoubleClick.bind(this);
        this.onContextMenu = this.onContextMenu.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    protected async onClick(ev: React.MouseEvent<HTMLDivElement>, index:number){
        if(this.props.onClick)
            this.props.onClick(ev, index);
    }

    protected async onContextMenu(record:any, index:number) {
        if(this.props.onContextMenu)
            this.props.onContextMenu(record, index);
    }

    /**
     * Triggered when the user drags an item over a droppable item
     */
    async onDragOver(ev:React.DragEvent<HTMLDivElement>) {
        ev.preventDefault();
        if(ev.currentTarget.dataset.index !== undefined) {
            let value:number = parseInt( ev.currentTarget.dataset.index );
            this.setState(() => {
                return {DropIndex:value};
            });
        }
    }

    /**
     * Triggered when the user begins dragging a slide.
     */
    async onDragStart(ev:React.DragEvent<HTMLDivElement>) {
        if(ev.currentTarget.dataset.index !== undefined) {
            let value:number = parseInt( ev.currentTarget.dataset.index );
            this.setState(() => {
                return {DragIndex:value}
            });
        }
    }

    /**
     * Triggered when a slide is dropped onto a droppable item.
     */
    async onDrop(ev:React.DragEvent<HTMLDivElement>) {
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
            return {DragIndex:-1, DropIndex:-1}
        });
    }

    /**
     * Triggered when a draggable is no longer over a droppable.
     */
    async onDragLeave() {
        this.setState(() => {
            return {DropIndex:-1}
        });
    }

    /**
     * Triggered when an item is double-clicked.
     * @param {Event} ev 
     */
    protected async onDoubleClick(ev:React.MouseEvent<HTMLDivElement>) {
        if(ev.shiftKey || ev.ctrlKey || ev.altKey)
            return;
        if(ev.currentTarget.dataset.index !== undefined) {
            let value:number = parseInt( ev.currentTarget.dataset.index );
            if(this.props.onDoubleClick)
                this.props.onDoubleClick(value);
        }
    }

    /**
     * Triggered when the component updates
     * - Scroll the current item into view
     */
    componentDidUpdate() {
        if(this.CurrentItem !== null && this.CurrentItem.current !== null) {
            if(this.state.DragIndex === -1)
                this.CurrentItem.current.scrollIntoView({behavior:"smooth"});
        }
    }

    /**
     * Renders the component.
     */
    render() {
        let items:Array<React.ReactElement> = [];
        if(this.props.items && this.props.items.length) {
            let max:number = this.props.items.length;
            if(this.props.max)
                max = this.props.max;
            if(max > 100)
                max = 100;
            for(let i=0; i < max; i++) {
                let item = this.props.items[i];
                let className = cnames('sortable', {
                    active:(i === this.props.index),
                    'drop-target':(i === this.state.DropIndex && i !== this.state.DragIndex),
                    'drag-target':(i === this.state.DragIndex && i !== this.state.DropIndex)
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
                    onContextMenu={() => {
                        this.onContextMenu(item, i);
                    }}
                    onClick={(ev:React.MouseEvent<HTMLDivElement>) => {
                        this.onClick(ev, i);
                    }}
                    data-index={i}
                    ref={(i === this.props.index) ? this.CurrentItem : null}
                    >{item.label}</div>
                );
            }
        }

        let className:string = cnames('sortable-pane', this.props.className);
        return (
            <div className={className}>{items}</div>
        );
    }
}