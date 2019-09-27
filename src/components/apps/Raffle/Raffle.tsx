import React from 'react';
import RaffleController, {SRaffleController} from 'controllers/RaffleController';
import CaptureController from 'controllers/CaptureController';
import Panel from 'components/Panel';
import { IconButton, Button, IconDelete, IconCheck, IconShown, IconHidden } from 'components/Elements'
import keycodes from 'tools/keycodes'
import './css/Raffle.scss'

interface SRaffle {
    Raffle:SRaffleController,
    Shown:boolean,
    TicketNumber:string
}

/**
 * Component for managing the raffle tickets
 */
class Raffle extends React.PureComponent<any, SRaffle> {
    readonly state:SRaffle = {
        Raffle:RaffleController.getState(),
        Shown:CaptureController.getState().Raffle.Shown,
        TicketNumber:''
    }

    TicketItem:React.RefObject<HTMLInputElement> = React.createRef()

    remoteState:Function
    remoteCapture:Function

    constructor(props) {
        super(props);

        //bindings
        this.onChangeTicket = this.onChangeTicket.bind(this);
        this.sendTicket = this.sendTicket.bind(this);
        this.onTicketKeyUp = this.onTicketKeyUp.bind(this);
        this.addDigit = this.addDigit.bind(this);

        this.updateState = this.updateState.bind(this);
        this.updateCapture = this.updateCapture.bind(this);
        this.remoteState = RaffleController.subscribe(this.updateState);
        this.remoteCapture = CaptureController.subscribe(this.updateCapture);
    }

    /**
     * Updates the state to match the controller.
     */
    updateState() {
        this.setState({Raffle:RaffleController.getState()});
    }

    /**
     * Updates the capture state to match the controller.
     */
    updateCapture() {
        this.setState({Shown:CaptureController.getState().Raffle.Shown});
    }

    /**
     * Triggered when the user changes the value of the ticket entry field.
     * @param {Event} ev 
     */
    onChangeTicket(ev) {
        var value = ev.target.value;
        this.setState(() => {
            return {TicketNumber:value}
        });
    }

    /**
     * Adds the given digit to the end of the ticket number.
     * @param {String} digit 
     */
    addDigit(digit) {
        var value = this.state.TicketNumber;
        var ml = 10;
        if(this.TicketItem != null && this.TicketItem.current !== null)
            ml = this.TicketItem.current.maxLength;
        if(digit === 'X') {
            if(value.length < 1)
                return;
            this.setState(() => {
                return {TicketNumber:value.substring(0, value.length - 1)};
            }, () => {
                if(this.TicketItem != null && this.TicketItem.current !== null)
                    this.TicketItem.current.focus();
            });
        } else {
            if(value.length >= ml)
                return;
            this.setState(() => {
                return {TicketNumber:value + digit};
            }, () => {
                if(this.TicketItem != null && this.TicketItem.current !== null)
                    this.TicketItem.current.focus();
            });
        }
    }

    /**
     * Sends the ticket to the controller / capture window.
     */
    sendTicket() {
        var value = this.state.TicketNumber;
        if(value === '') {
            RaffleController.Remove();
        } else {
            RaffleController.Add(value);
            this.setState(() => {
                return {TicketNumber:''}
            }, () => {
                if(this.TicketItem != null && this.TicketItem.current !== null)
                    this.TicketItem.current.focus();
            });
        }
    }

    /**
     * Triggered when the user presses a keyboard key in the ticket entry field.
     * @param {Event} ev 
     */
    onTicketKeyUp(ev) {
        ev.stopPropagation();
        switch(ev.keyCode) {
            //enter - send
            case keycodes.ENTER :
                this.sendTicket();
            break;

            //escape - clear
            case keycodes.ESCAPE :
                if(this.state.TicketNumber === '')
                    RaffleController.Remove();
                else {
                    this.setState(() => {
                        return {TicketNumber:''}
                    });
                }
            break;

            case keycodes.F12 :
                CaptureController.ToggleRaffle();
            break;

            default :
            break;
        }
    }

    /**
     * Renders the component
     */
    render() {
        var icon = IconHidden;
        if(this.state.Shown)
            icon = IconShown;
        var buttons = [
            <IconButton
                src={icon}
                active={this.state.Shown}
                onClick={CaptureController.ToggleRaffle}
                key="btn-toggle"
            >{(this.state.Shown) ? 'Hide' : 'Show'}</IconButton>,
            <IconButton
                src={IconDelete}
                onClick={() => {
                    CaptureController.SetRaffleVisibility(false);
                    RaffleController.Clear();
                }}
                key="btn-clear"
            >Clear</IconButton>,
            <IconButton
                src={IconCheck}
                onClick={this.sendTicket}
                key="btn-send"
                >Submit</IconButton>
        ];

        //list of tickets
        var tickets:Array<React.ReactElement> = [];
        var i = 0;
        this.state.Raffle.Tickets.forEach((ticket) => {
            let index = i;
            tickets.push(
                <div className="ticket" key={"ticket-" + i}>
                    <div 
                        className="ticket-number"
                        onClick={() => {RaffleController.Remove(index);}}
                        >{ticket}</div>
                </div>
            );
            i++;
        });

        //digits to push
        var digits = [
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
                <div className="tickets">{tickets}</div>
                <div className="entry">
                    <div className="digit-buttons">{digits}</div>
                    <input type="text" maxLength={10} 
                        onChange={this.onChangeTicket}
                        value={this.state.TicketNumber}
                        onKeyUp={this.onTicketKeyUp}
                        ref={this.TicketItem}
                        />
                </div>
            </Panel>
        )
    }
}

export default Raffle;