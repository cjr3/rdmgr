import { RaffleTicket, SMainController, SRaffle } from "tools/vars";


namespace RaffleStore {

    /**
     * Add a raffle ticket
     * @param state 
     * @param ticket 
     * @returns 
     */
    export const Add = (state:SMainController, ticket:RaffleTicket) : SMainController => {
        const tickets = (state.Raffle.CurrentTickets || []).slice();
        const records = (state.Raffle.Tickets || []).slice();
        //keep it simple - we only need three tickets
        if(tickets.length >= 3) {
            tickets.shift();
        }

        tickets.push({...ticket});
        records.push({...ticket});
        if(records.length > 100) {
            records.shift();
        }
        
        return {
            ...state,
            Raffle:{
                ...state.Raffle,
                CurrentTickets:tickets,
                Tickets:records
            },
            UpdateTimeRaffle:Date.now()
        }
    };

    /**
     * Remove a raffle ticket
     * @param state 
     * @param index 
     * @returns 
     */
    export const Remove = (state:SMainController, index:number = -1) : SMainController => {
        if(index === -1)
            index = (state.Raffle.CurrentTickets || []).length - 1;
        if(index >= 0 && state.Raffle.CurrentTickets && state.Raffle.CurrentTickets[index]) {
            const tickets = state.Raffle.CurrentTickets.slice();
            tickets.splice(index, 1);
            return {
                ...state,
                Raffle:{
                    ...state.Raffle,
                    CurrentTickets:tickets
                },
                UpdateTimeRaffle:Date.now()
            };
        }

        return state;
    }

    /**
     * Set all raffle ticket history records, and clear current tickets.
     * @param state 
     * @param tickets 
     * @returns 
     */
    export const SetRecords = (state:SMainController, tickets:RaffleTicket[]) : SMainController => {
        return {
            ...state,
            Raffle:{
                ...state.Raffle,
                Tickets:tickets,
                CurrentTickets:[]
            },
            UpdateTimeRaffle:Date.now()
        }
    };

    export const Update = (state:SMainController, values:SRaffle) : SMainController => {
        return {
            ...state,
            Raffle:{
                ...state.Raffle,
                ...values
            },
            UpdateTimeRaffle:Date.now()
        };
    }
}

export {RaffleStore};