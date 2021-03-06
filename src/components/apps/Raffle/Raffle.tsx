import React from 'react';
import RaffleController from 'controllers/RaffleController';
import Panel from 'components/Panel';
import { IconButton, Button, IconDelete, IconCheck, IconShown, IconHidden } from 'components/Elements'
import keycodes from 'tools/keycodes'
import './css/Raffle.scss'
import { Unsubscribe } from 'redux';
import RaffleCaptureController from 'controllers/capture/Raffle';
import ClientController from 'controllers/ClientController';

/**
 * Component for managing the raffle tickets
 */
export default class Raffle extends React.PureComponent<any, {
    /**
     * True if visible, false if not
     */
    Shown:boolean;
}> {
    readonly state = {
        Shown:RaffleCaptureController.GetState().Shown
    }

    /**
     * Ticket number entry reference
     */
    protected TicketItem:React.RefObject<RaffleTicketEntry> = React.createRef();

    /**
     * CaptureController remote
     */
    protected remoteCapture:Function|null = null;

    constructor(props) {
        super(props);
        this.updateCapture = this.updateCapture.bind(this);
    }

    /**
     * Updates the capture state to match the controller.
     */
    protected async updateCapture() {
        this.setState({Shown:RaffleCaptureController.GetState().Shown});
    }

    /**
     * Start listeners
     */
    componentDidMount() {
        this.remoteCapture = RaffleCaptureController.Subscribe(this.updateCapture);
    }

    /**
     * Close listeners
     */
    componentWillUnmount() {
        if(this.remoteCapture !== null)
            this.remoteCapture();
    }

    /**
     * Renders the component
     */
    render() {
        let icon:string = IconHidden;
        if(this.state.Shown)
            icon = IconShown;
        let buttons:Array<React.ReactElement> = [
            <IconButton
                src={icon}
                active={this.state.Shown}
                onClick={() => {
                    RaffleCaptureController.Toggle();
                    if(this.TicketItem && this.TicketItem.current) {
                        this.TicketItem.current.focus();
                    }
                }}
                key="btn-toggle"
            >{(this.state.Shown) ? 'Hide' : 'Show'}</IconButton>,
            <IconButton
                src={IconDelete}
                onClick={() => {
                    RaffleCaptureController.Hide();
                    RaffleController.Clear();
                }}
                key="btn-clear"
            >Clear</IconButton>,
            <IconButton
                src={IconCheck}
                onClick={() => {
                    if(ClientController.GetState().RaffleTicketNumber) {
                        RaffleController.Add(ClientController.GetState().RaffleTicketNumber);
                        ClientController.SetRaffleTicketNumber('');
                    }
                }}
                key="btn-send"
                >Submit</IconButton>
        ];

        return (
            <Panel
                opened={this.props.opened}
                popup={true}
                buttons={buttons}
                className="RAF-panel"
                contentName="RAF-app"
                onOpen={() => {
                    if(this.TicketItem.current)
                        this.TicketItem.current.focus();
                }}
                onClose={this.props.onClose}
                title="Raffle Tickets"
                >
                <RaffleTickets
                    onClick={(index) => {
                        RaffleController.Remove(index);
                        if(this.TicketItem && this.TicketItem.current)
                            this.TicketItem.current.focus();
                    }}
                />
                <RaffleTicketEntry ref={this.TicketItem}/>
            </Panel>
        )
    }
}

class RaffleTickets extends React.PureComponent<{
    onClick:Function;
}, {
    Tickets:Array<string>;
}> {
    readonly state = {
        Tickets:RaffleController.GetState().Tickets
    }

    protected remoteRaffle:Unsubscribe|null = null;

    constructor(props) {
        super(props);
        this.updateRaffle = this.updateRaffle.bind(this);
    }

    protected async updateRaffle() {
        this.setState({Tickets:RaffleController.GetState().Tickets.slice(0)});
    }

    componentDidMount() {
        this.remoteRaffle = RaffleController.Subscribe(this.updateRaffle);
    }

    componentWillUnmount() {
        if(this.remoteRaffle !== null)
            this.remoteRaffle();
    }

    render() {
        let tickets:Array<React.ReactElement> = new Array<React.ReactElement>();
        this.state.Tickets.forEach((ticket, index) => {
            if(ticket) {
                tickets.push(
                    <div className="ticket" key={"ticket-"+index}>
                        <div
                            className="ticket-number"
                            onClick={() => {this.props.onClick(index)}}
                            >{ticket}</div>
                    </div>
                );
            }
        });

        return (
            <div className="tickets">{tickets}</div>
        )
    }
}

class RaffleTicketEntry extends React.PureComponent<any, {
    TicketNumber:string;
}> {
    readonly state = {
        TicketNumber:ClientController.GetState().RaffleTicketNumber
    }

    protected TicketItem:React.RefObject<HTMLInputElement> = React.createRef();

    protected remoteClient?:Unsubscribe;

    constructor(props) {
        super(props);
        this.updateClient = this.updateClient.bind(this);
        this.onChangeTicketNumber = this.onChangeTicketNumber.bind(this);
        this.onFocusTicketNumber = this.onFocusTicketNumber.bind(this);
        this.onKeyUpTicketNumber = this.onKeyUpTicketNumber.bind(this);
        this.onKeyDownTicketNumber = this.onKeyDownTicketNumber.bind(this);
    }

    protected updateClient() {
        this.setState({
            TicketNumber:ClientController.GetState().RaffleTicketNumber
        });
    }

    protected onKeyDownTicketNumber(ev) {
        switch(ev.keyCode) {
            case keycodes.ADD :
            case keycodes.BACKSPACE :
            case keycodes.DELETE :
            case keycodes.DIVIDE :
            case keycodes.MULTIPLY :
            case keycodes.SUBTRACT :
                ev.preventDefault();
                break;
        }
    }

    protected onKeyUpTicketNumber(ev) {
        ev.stopPropagation();
        switch(ev.keyCode) {
            case keycodes.ADD :
                if(!this.state.TicketNumber) {
                    RaffleController.Remove();
                } else {
                    ClientController.RemoveRaffleTicketCharacter();
                }
                ev.preventDefault();
                break;
            
            case keycodes.BACKSPACE :
            case keycodes.DELETE :
                ClientController.RemoveRaffleTicketCharacter();
                ev.preventDefault();
                break;

            case keycodes.MULTIPLY :
                RaffleCaptureController.Hide();
                ClientController.SetRaffleTicketNumber('');
                RaffleController.Clear();
                ev.preventDefault();
                break;

            case keycodes.DIVIDE :
                RaffleController.Remove();
                ev.preventDefault();
                break;

            case keycodes.SUBTRACT :
                RaffleCaptureController.Toggle();
            break;

            case keycodes.ENTER :
                if(this.state.TicketNumber) {
                    RaffleController.Add(this.state.TicketNumber);
                    ClientController.SetRaffleTicketNumber('');
                }
            break;
        }
    }

    protected onChangeTicketNumber(ev: React.ChangeEvent<HTMLInputElement>) {
        let value:string = ev.currentTarget.value;
        ClientController.SetRaffleTicketNumber(value);
    }

    protected onFocusTicketNumber(ev: React.FocusEvent<HTMLInputElement>) {
        ev.currentTarget.select();
    }

    /**
     * Adds the given digit to the end of the ticket number.
     * @param {String} digit 
     */
    protected addDigit(digit) {
        var value = this.state.TicketNumber;
        if(digit === 'X') {
            if(value.length < 1) {
                RaffleController.Remove();
                return;
            }
            ClientController.RemoveRaffleTicketCharacter();
        } else {
            ClientController.AddRaffleTicketCharacter(digit);
        }
    }

    focus() {
        if(this.TicketItem && this.TicketItem.current)
            this.TicketItem.current.focus();
    }

    componentDidMount() {
        this.remoteClient = ClientController.Subscribe(this.updateClient);
    }

    componentWillUnmount() {
        if(this.remoteClient)
            this.remoteClient();
    }

    render() {
        let digits:Array<React.ReactElement> = new Array<React.ReactElement>(
            <Button onClick={() => {this.addDigit('0');}} key="btn-0">0</Button>,
            <Button onClick={() => {this.addDigit('1');}} key="btn-1">1</Button>,
            <Button onClick={() => {this.addDigit('2');}} key="btn-2">2</Button>,
            <Button onClick={() => {this.addDigit('3');}} key="btn-3">3</Button>,
            <Button onClick={() => {this.addDigit('4');}} key="btn-4">4</Button>,
            <Button onClick={() => {this.addDigit('5');}} key="btn-5">5</Button>,
            <Button onClick={() => {this.addDigit('6');}} key="btn-6">6</Button>,
            <Button onClick={() => {this.addDigit('7');}} key="btn-7">7</Button>,
            <Button onClick={() => {this.addDigit('8');}} key="btn-8">8</Button>,
            <Button onClick={() => {this.addDigit('9');}} key="btn-9">9</Button>,
            <Button onClick={() => {this.addDigit('X');}} key="btn-x">X</Button>
        );

        return (
            <div className="entry">
                <div className="digit-buttons">{digits}</div>
                <input type="text" maxLength={10} 
                    onChange={this.onChangeTicketNumber}
                    value={this.state.TicketNumber}
                    onKeyUp={this.onKeyUpTicketNumber}
                    onKeyDown={this.onKeyDownTicketNumber}
                    onFocus={this.onFocusTicketNumber}
                    ref={this.TicketItem}
                    />
            </div>
        )
    }
}