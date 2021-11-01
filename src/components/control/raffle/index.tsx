import { IconCheck, IconHidden, IconTrash, IconVisible } from 'components/common/icons';
import React from 'react';
import { Unsubscribe } from 'redux';
import { Capture } from 'tools/capture/functions';
import { Raffle } from 'tools/raffle/functions';
import { RaffleButtons } from './buttons';
import { RaffleTicketList } from './tickets';

interface Props {
    autoFocus?:boolean;
    onClear?:{():void};
}

interface State {
    entry:string;
    updateTime:number;
    visible:boolean;
}

const max = 10;

/**
 * 
 */
class Main extends React.PureComponent<Props, State> {
    readonly state:State = {
        entry:'',
        updateTime:0,
        visible:false
    }

    protected remote?:Unsubscribe;

    protected EntryItem:React.RefObject<HTMLInputElement> = React.createRef<HTMLInputElement>();

    protected update = () => {
        const state = Capture.GetRaffle();
        this.setState({
            visible:state.visible || false
        })
    }

    /**
     * Add ticket
     */
    protected add = () => {
        const ticket = this.state.entry;
        if(ticket) {
            this.clear();
            Raffle.Add({
                Number:ticket
            });
            Capture.UpdateRaffle({visible:true});
        }
    }

    /**
     * Clear input and focus on text field
     */
    protected clear = () => {
        this.setState({entry:''});
        if(this.EntryItem && this.EntryItem.current)
            this.EntryItem.current.focus();
    }

    /**
     * Set value to user input
     * @param ev 
     */
    protected onChangeEntry = (ev:React.ChangeEvent<HTMLInputElement>) => {
        let value = ev.currentTarget.value;
        this.setState({entry:value});
    }
    
    /**
     * Add a ticket
     * @returns 
     */
    protected onClickAccept = () => this.add();

    /**
     * Clear the entry
     * @returns 
     */
    protected onClickClear = () => this.clear();

    /**
     * 
     */
    protected onClickClearAll = () => {
        this.clear();
        Raffle.Clear();
        Capture.UpdateRaffle({visible:false});
        if(this.props.onClear)
            this.props.onClear();
    }

    /**
     * Select value
     * @param ev 
     * @returns 
     */
    protected onFocusInput = (ev:React.FocusEvent<HTMLInputElement>) => ev.currentTarget.select();

    /**
     * Enter: Submit
     * Escape: Clear
     * @param ev 
     */
    protected onKeyUpInput = (ev:React.KeyboardEvent<HTMLInputElement>) => {
        ev.stopPropagation();
        switch(ev.keyCode) {
            case 13 :
                this.add();
            break;
            case 27 :
                this.clear();
                Raffle.Clear();
                Capture.UpdateRaffle({visible:false});
                if(this.props.onClear)
                    this.props.onClear();
            break;
        }
    }

    /**
     * 
     * @param value 
     */
    protected onSelectButton = (value:string) => {
        if(value === 'X' || value === 'x')
            this.setState({entry:''});
        else if(value === 'L' || value == 'l')
        {
            if(this.state.entry.length) {
                this.setState({entry:this.state.entry.substring(0, this.state.entry.length - 1)});
            }
        } else if(this.state.entry.length < max) {
            this.setState({entry:this.state.entry + value});
        }
    }

    componentDidMount() {
        this.remote = Capture.Subscribe(this.update);
        this.update();
    }

    componentWillUnmount() {
        if(this.remote)
            this.remote();
    }

    render() {
        return <div style={{
            display:'grid',
            gridTemplateRows:'1fr auto auto'
        }}>
            <RaffleTicketList/>
            <RaffleButtons onSelect={this.onSelectButton}/>
            <div
                style={{
                    display:'grid',
                    width:'100%',
                    gridTemplateColumns:'auto auto auto auto'
                }}
            >
            {
                (this.state.visible) &&
                <IconVisible active={true} title='Hide' onClick={Capture.ToggleRaffle}/>
            }
            {
                (!this.state.visible) &&
                <IconHidden title='Show' onClick={Capture.ToggleRaffle}/>
            }
                <input
                    type='text'
                    value={this.state.entry}
                    maxLength={max}
                    placeholder='Ticket #'
                    onChange={this.onChangeEntry}
                    onFocus={this.onFocusInput}
                    onKeyUp={this.onKeyUpInput}
                    onKeyDown={ev => ev.stopPropagation()}
                    onKeyPress={ev => ev.stopPropagation()}
                    style={{width:'100%'}}
                    autoFocus={this.props.autoFocus}
                    ref={this.EntryItem}
                />
                <IconCheck onClick={this.onClickAccept}/>
                <IconTrash onClick={this.onClickClearAll} title='Clear All Tickets'/>
            </div>
        </div>
    }
}

export {Main as RaffleControl};