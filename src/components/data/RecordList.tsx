import React from 'react';
import cnames from 'classnames';
import {Button} from 'components/Elements';
import './css/RecordList.scss';
import { Compare } from 'controllers/functions';

export default class RecordList extends React.Component<{
    records:Array<any>;
    keywords?:string;
    recordid?:number;
    onSelect?:Function;
    className?:string;
}, {
    DragIndex:number;
    DropIndex:number;
    records:Array<any>;
}> {
    readonly state = {
        DragIndex:-1,
        DropIndex:-1,
        records:[]
    }

    constructor(props) {
        super(props);
    }

    /**
     * Determines if the component should update or not.
     * - Returns false if the passed 'records' property is different.
     * @param {Object} nextProps 
     * @param {Object} nextState 
     * @returns {Boolean} true to update, false to not update
     */
    shouldComponentUpdate(nextProps, nextState) {
        if(!Compare(nextState, this.state))
            return true;
        if(nextProps.keywords !== this.props.keywords)
            return true;
        if(nextProps.recordid !== this.props.recordid)
            return true;
        if(nextProps.className != this.props.className)
            return true;
        if(Compare(nextProps.records, this.props.records)) {
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
                let hidden = false;
                let record = item[1];
                let key = item[0];
                if(rx !== null) {
                    hidden = true;
                    if(record.Name && record.Name.search && record.Name.search(rx) >= 0)
                        hidden = false;
                    else if(record.Number && record.Number.search && record.Number.search(rx) >= 0)
                        hidden = false;
                }
                
                let className = cnames({
                    active:(record.RecordID == this.props.recordid),
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

        return (
            <div className={cnames('record-list', this.props.className)}>
                {items}
            </div>
        );
    }
}