import { IconX } from 'components/common/icons';
import React from 'react';
import { Unsubscribe } from 'redux';
import { Raffle } from 'tools/raffle/functions';

interface Props {

}

interface State {
    updateTime:number;
}

class Main extends React.PureComponent<Props, State> {
    readonly state:State = {
        updateTime:0
    }

    protected remote?:Unsubscribe;

    protected update = () => {
        this.setState({
            updateTime:Raffle.GetUpdateTime()
        });
    }

    componentDidMount() {
        this.remote = Raffle.Subscribe(this.update);
    }

    componentWillUnmount() {
        if(this.remote)
            this.remote();
    }

    render() {
        const tickets = Raffle.GetTickets();

        return <div>
            {
                tickets.map((ticket, index) => {
                    return <div
                        className='button'
                        style={{
                            fontSize:'24px'
                        }}
                        title='Click to remove'
                        onClick={() => {
                            Raffle.Remove(index);
                        }}
                        key={`ticket-${index}-${ticket.Number}`}
                    >
                        <span>{ticket.Number}</span>
                    </div>
                })
            }
        </div>
    }
};

export {Main as RaffleTicketList};