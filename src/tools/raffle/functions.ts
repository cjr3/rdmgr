import { MainController } from "tools/MainController";
import { RaffleTicket, SRaffle } from "tools/vars";

namespace Raffle {
    export const Add = (ticket:RaffleTicket) => MainController.AddRaffleTicket(ticket);
    export const Clear = () => Update({CurrentTickets:[]});
    export const ClearHistory = () => Update({Tickets:[]});
    export const ClearPrizes = () => Update({Prizes:[]});
    export const Get = () => MainController.GetState().Raffle;
    export const GetHistory = () => Get().Tickets || [];
    export const GetPrizes = () => Get().Prizes || [];
    export const GetTickets = () => Get().CurrentTickets || [];
    export const GetUpdateTime = () => MainController.GetState().UpdateTimeRaffle;
    export const Remove = (index:number = -1) => MainController.RemoveRaffleTicket(index);
    export const Subscribe = (f:{():void}) => MainController.Subscribe(f);
    export const Update = (state:SRaffle) => MainController.UpdateRaffleState(state);
}

export {Raffle};