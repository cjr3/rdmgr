import React, { CSSProperties } from 'react';
import cnames from 'classnames';
import RaffleController, {SRaffleController} from 'controllers/RaffleController'
import './css/CaptureRaffle.scss';
import DataController from 'controllers/DataController';

interface PCaptureRaffle {
    /**
     * True to show the raffle tickets, false to hide
     */
    shown:boolean
}

/**
 * Component for displaying raffle tickets on the capture window.
 */
class CaptureRaffle extends React.PureComponent<PCaptureRaffle, SRaffleController> {

    /**
     * State
     */
    readonly state:SRaffleController = RaffleController.getState()

    /**
     * Listenre for changes to the raffle controller
     */
    protected remoteRaffle:Function

    /**
     * CSS Styles for individual tickets
     */
    protected TicketStyle:CSSProperties;
    
    /**
     * CSS Style for background
     */
    protected BackgroundStyle:CSSProperties;

    /**
     * Constructor
     * @param props PCaptureRaffle
     */
    constructor(props:PCaptureRaffle) {
        super(props);
        this.updateState = this.updateState.bind(this);
        this.remoteRaffle = RaffleController.subscribe(this.updateState);
        this.TicketStyle = {
            backgroundImage:`url('${DataController.mpath('/default/TicketBackground.png')}')`
        }

        this.BackgroundStyle = {
            backgroundImage:`url('${DataController.mpath('/default/RaffleTicketBackground.jpg')}')`
        }
    }

    /**
     * Updates the state to match the controller.
     */
    updateState() {
        this.setState(RaffleController.getState());
    }

    /**
     * Renders the component
     */
    render() {
        const tickets:Array<React.ReactElement<HTMLDivElement>> = [
            <div className={cnames('ticket', {shown:(this.state.Tickets.length >= 2)})}
                style={this.TicketStyle}
                key="ticket-2">{(this.state.Tickets[1]) ? this.state.Tickets[1] : ''}</div>,
            <div className={cnames('ticket', {shown:(this.state.Tickets.length >= 1)})}
                style={this.TicketStyle}
                key="ticket-1">{(this.state.Tickets[0]) ? this.state.Tickets[0] : ''}</div>,
            <div className={cnames('ticket', {shown:(this.state.Tickets.length >= 3)})}
                style={this.TicketStyle}
                key="ticket-3">{(this.state.Tickets[2]) ? this.state.Tickets[2] : ''}</div>
        ];
        
        var className = cnames('capture-raffle', {
            shown:this.props.shown
        });
        return (
            <div className={className} style={this.BackgroundStyle}>{tickets}</div>
        );
    }
}

export default CaptureRaffle;