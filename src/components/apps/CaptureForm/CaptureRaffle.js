import React from 'react';
import cnames from 'classnames';
import RaffleController from 'controllers/RaffleController'
import './css/CaptureRaffle.scss';
import DataController from 'controllers/DataController';

/**
 * Component for displaying raffle tickets on the capture window.
 */
class CaptureRaffle extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = Object.assign({}, RaffleController.getState());
        this.updateState = this.updateState.bind(this);
        this.remote = RaffleController.subscribe(this.updateState);
    }

    /**
     * Updates the state to match the controller.
     */
    updateState() {
        this.setState(() => {
            return Object.assign({}, RaffleController.getState());
        })
    }

    /**
     * Renders the component
     */
    render() {
        var ticketStyle = {
            backgroundImage:`url('${DataController.mpath('/default/TicketBackground.png')}')`
        };
        var tickets = [
            <div className={cnames('ticket', {shown:(this.state.Tickets.length >= 2)})}
                style={ticketStyle}
                key="ticket-2">{(this.state.Tickets[1]) ? this.state.Tickets[1] : ''}</div>,
            <div className={cnames('ticket', {shown:(this.state.Tickets.length >= 1)})}
                style={ticketStyle}
                key="ticket-1">{(this.state.Tickets[0]) ? this.state.Tickets[0] : ''}</div>,
            <div className={cnames('ticket', {shown:(this.state.Tickets.length >= 3)})}
                style={ticketStyle}
                key="ticket-3">{(this.state.Tickets[2]) ? this.state.Tickets[2] : ''}</div>
        ];
        
        var className = cnames('capture-raffle', {
            shown:this.props.shown
        });

        var style = {
            backgroundImage:`url('${DataController.mpath('/default/Raffle-Tickets.jpg')}')`
        }

        return (
            <div className={className} style={style}>{tickets}</div>
        );
    }
}

export default CaptureRaffle;