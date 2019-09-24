import React from 'react';
import cnames from 'classnames';
import {Button} from 'components/Elements';
import DataController from 'controllers/DataController';
import './css/RecordList.scss';

interface SRecordList {
    DragIndex:number,
    DropIndex:number,
    records:Array<any>
}

interface PRecordList {
    records:Array<any>,
    keywords?:string,
    recordid?:number,
    onSelect?:Function,
    className?:string
}

class RecordList extends React.Component<PRecordList, SRecordList> {
    readonly state:SRecordList = {
        DragIndex:-1,
        DropIndex:-1,
        records:[]
    }
    constructor(props) {
        super(props);
        this.onDragOver = this.onDragOver.bind(this);
        this.onDragStart = this.onDragStart.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);
        this.onDragLeave = this.onDragLeave.bind(this);
        this.swapRecords = this.swapRecords.bind(this);
    }

    /**
     * Triggered when the user drags an item over a droppable item
     */
    async onDragOver(ev) {
        var index = ev.target.dataset.index;
        ev.preventDefault();
        this.setState(() => {
            return {DropIndex:index}
        });
    }

    /**
     * Triggered when the user begins dragging a slide.
     */
    async onDragStart(ev) {
        var index = ev.target.dataset.index;
        this.setState(() => {
            return {DragIndex:index}
        });
    }

    /**
     * Triggered when a slide is dropped onto a droppable item.
     */
    async onDrop() {
        if(this.state.DropIndex > -1 && this.state.DragIndex > -1 && this.state.DropIndex !== this.state.DragIndex) {
            this.swapRecords(this.state.DropIndex, this.state.DragIndex);
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

    swapRecords(dropIndex, dragIndex) {
        if(this.state.records) {
            var records = this.state.records.slice();
            [records[dropIndex], records[dragIndex]] = [records[dragIndex], records[dropIndex]];
            this.setState(() => {
                return {records:records}
            });
        }
    }

    /**
     * Determines if the component should update or not.
     * - Returns false if the passed 'records' property is different.
     * @param {Object} nextProps 
     * @param {Object} nextState 
     * @returns {Boolean} true to update, false to not update
     */
    shouldComponentUpdate(nextProps, nextState) {
        if(!DataController.compare(nextState, this.state))
            return true;
        if(nextProps.keywords !== this.props.keywords)
            return true;
        if(nextProps.recordid !== this.props.recordid)
            return true;
        if(DataController.compare(nextProps.records, this.props.records)) {
            return false;
        }
        return true;
    }

    /**
     * Renders the component.
     */
    render() {
        let items:Array<React.ReactElement> = [];
        var rx:RegExp|null = null;

        if(typeof(this.props.keywords) === 'string' && this.props.keywords) {
            rx = new RegExp(this.props.keywords, 'ig');
        }

        if(this.props.records) {

            var keys = Object.entries(this.props.records);
            keys.forEach((item) => {
                var hidden = false;
                let record = item[1];
                let key = item[0];
                if(rx !== null) {
                    hidden = true;
                    if(record.Name && record.Name.search && record.Name.search(rx) >= 0)
                        hidden = false;
                    else if(record.Number && record.Number.search && record.Number.search(rx) >= 0)
                        hidden = false;
                }
                
                var className = cnames({
                    active:(record.RecordID === this.props.recordid),
                    hidden:hidden
                });
                items.push(
                    <Button
                        className={className}
                        key={key}
                        onClick={() => {
                            if(this.props.onSelect)
                                this.props.onSelect(record);
                        }}
                        >{record.Name}</Button>
                );
            });
        }

        var className = cnames('record-list', this.props.className);

        return (
            <div className={className}>
                {items}
            </div>
        );
    }
}

export default RecordList;