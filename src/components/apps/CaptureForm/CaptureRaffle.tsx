import React, { CSSProperties } from 'react';
import cnames from 'classnames';
import RaffleController from 'controllers/RaffleController'
import './css/CaptureRaffle.scss';
import RaffleCaptureController from 'controllers/capture/Raffle';
import { Unsubscribe } from 'redux';
import { AddMediaPath } from 'controllers/functions';
import DataController from 'controllers/DataController';

/**
 * Component for displaying raffle tickets on the capture window.
 */
export default class CaptureRaffle extends React.PureComponent<any, {
    Shown:boolean;
    className:string;
    BackgroundImage:string;
}> {

    /**
     * State
     */
    readonly state = {
        Shown:RaffleCaptureController.GetState().Shown,
        className:RaffleCaptureController.GetState().className,
        BackgroundImage:DataController.GetMiscRecord('RaffleBackground')
    }

    protected remoteCapture?:Unsubscribe;
    protected remoteData?:Unsubscribe;

    /**
     * Constructor
     * @param props PCaptureRaffle
     */
    constructor(props) {
        super(props);
        this.updateCapture = this.updateCapture.bind(this);
        this.updateData = this.updateData.bind(this);
    }

    protected updateCapture() {
        this.setState({
            Shown:RaffleCaptureController.GetState().Shown,
            className:RaffleCaptureController.GetState().className
        });
    }

    protected updateData() {
        this.setState({
            BackgroundImage:DataController.GetMiscRecord('RaffleBackground')
        });
    }

    /**
     * Start listeners
     */
    componentDidMount() {
        this.remoteCapture = RaffleCaptureController.Subscribe(this.updateCapture);
        this.remoteData = DataController.Subscribe(this.updateData);
    }

    /**
     * Close listeners
     */
    componentWillUnmount() {
        if(this.remoteCapture)
            this.remoteCapture();
        if(this.remoteData)
            this.remoteData();
    }

    /**
     * Renders the component
     */
    render() {
        let className:string = cnames('capture-raffle', {shown:this.state.Shown});
        let style:CSSProperties = {};
        if(this.state.BackgroundImage)
            style.backgroundImage = `url('${AddMediaPath(this.state.BackgroundImage)}')`;
        
        return (
            <div className={className} style={style}>
                <RaffleTicket index={1}/>
                <RaffleTicket index={0}/>
                <RaffleTicket index={2}/>
            </div>
        );
    }
}

class RaffleTicket extends React.PureComponent<{
    index:0|1|2;
}, {
    TicketNumber:string;
    Shown:boolean;
    BackgroundImage:string;
}> {
    readonly state = {
        TicketNumber:'',
        Shown:false,
        BackgroundImage:DataController.GetMiscRecord('RaffleTicketBackground')
    }

    protected Timer:any = 0;

    protected remoteRaffle?:Unsubscribe;
    protected remoteData?:Unsubscribe;

    constructor(props) {
        super(props);
        this.updateRaffle = this.updateRaffle.bind(this);
        this.updateData = this.updateData.bind(this);
        if(RaffleController.GetState().Tickets[this.props.index]) {
            this.state.TicketNumber = RaffleController.GetState().Tickets[this.props.index];
            this.state.Shown = true;
        }
    }

    protected updateRaffle() {
        let tickets:Array<string> = RaffleController.GetState().Tickets;
        let ticket:string = tickets[this.props.index];
        try {clearTimeout(this.Timer);} catch(er){}
        if(ticket) {
            this.setState({
                Shown:true,
                TicketNumber:ticket
            });
        } else if(this.state.Shown) {
            this.setState({
                Shown:false
            }, () => {
                this.Timer = setTimeout(() => {
                    this.setState({TicketNumber:''});
                }, 1000);
            });
        }
    }

    protected updateData() {
        this.setState({
            BackgroundImage:DataController.GetMiscRecord('RaffleTicketBackground')
        });
    }

    componentDidMount() {
        this.remoteData = DataController.Subscribe(this.updateData);
        this.remoteRaffle = RaffleController.Subscribe(this.updateRaffle);
    }

    componentWillUnmount() {
        if(this.remoteData)
            this.remoteData();
        if(this.remoteRaffle)
            this.remoteRaffle();
    }

    render() {
        let style:CSSProperties = {};
        let className = cnames('ticket', {shown:this.state.Shown});
        if(this.state.BackgroundImage) {
            style.backgroundImage = `url('${AddMediaPath(this.state.BackgroundImage)}')`;
            style.backgroundColor = "transparent";
        }
        
        return (
            <div className={className} style={style}>
                {this.state.TicketNumber}
            </div>
        )
    }
}