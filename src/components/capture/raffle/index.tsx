import classNames from 'classnames';
import React from 'react';
import { Capture } from 'tools/capture/functions';
import Data from 'tools/data';
import { Raffle } from 'tools/raffle/functions';
import { UIController } from 'tools/UIController';

interface Props extends React.HTMLProps<HTMLDivElement> {

}

/**
 * Display raffle tickets.
 * @param props 
 * @returns 
 */
const RaffleCapture:React.FunctionComponent<Props> = props => {
    const [visible, setVisible] = React.useState(Capture.GetRaffle().visible || false);
    const [tickets, setTickets] = React.useState(Raffle.GetTickets());
    const [background, setBackground] = React.useState(Capture.GetRaffle().backgroundImage || '');
    const [ticketBG, setTicketBG] = React.useState(UIController.GetState().Config.Misc?.RaffleTicketBackground || '');

    React.useEffect(() => {
        return Raffle.Subscribe(() => {
            setTickets(Raffle.GetTickets());
        });
    }, []);

    React.useEffect(() => {
        return Capture.Subscribe(() => {
            setVisible(Capture.GetRaffle().visible || false);
            setBackground(Capture.GetRaffle().backgroundImage || '');
        });
    }, []);

    React.useEffect(() => {
        return UIController.Subscribe(() => {
            setTicketBG(UIController.GetState().Config?.Misc?.RaffleTicketBackground || '');
        });
    });

    const ticket1 = tickets[0]?.Number || '';
    const ticket2 = tickets[1]?.Number || '';
    const ticket3 = tickets[2]?.Number || '';
    const style:React.CSSProperties = {...props.style};
    if(background) {
        style.backgroundImage = "url('" + Data.GetMediaPath(background, 'file:///') + "')";
    }
    if(props.style && props.style.backgroundImage)
        style.backgroundImage = props.style.backgroundImage;

    // console.log(style.backgroundImage)

    return <div 
        {...props} 
        className={classNames('capture-raffle', {
            active:(visible)
        })}
        style={style}
        >
        <TicketItem background={ticketBG} num={ticket1} visible={visible}/>
        <TicketItem background={ticketBG} num={ticket2} visible={visible}/>
        <TicketItem background={ticketBG} num={ticket3} visible={visible}/>
    </div>
};

/**
 * Display a single raffle ticket.
 * @param props 
 * @returns 
 */
const TicketItem:React.FunctionComponent<{
    background:string;
    num:string;
    visible:boolean;
}> = props => {
    const style:React.CSSProperties = {};
    if(props.background) {
        style.backgroundImage = "url('" + Data.GetMediaPath(props.background) + "')";
        style.backgroundColor = 'transparent';
    }
    return <div 
        className={classNames('ticket', {active:props.num && props.num.length > 0 && props.visible})}
        style={style}
        >{props.num}</div>
}

export {RaffleCapture};