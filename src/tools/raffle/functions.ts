import { MainController } from "tools/MainController";
import { RaffleTicket, SRaffle } from "tools/vars";

/**
 * Add a ticket that was called
 * @param ticket 
 * @returns 
 */
const Add = (ticket:RaffleTicket) => MainController.AddRaffleTicket(ticket);

/**
 * Clear the current tickets
 * @returns 
 */
const Clear = () => Update({CurrentTickets:[]});

/**
 * Clear ticket history
 * @returns 
 */
const ClearHistory = () => Update({Tickets:[]});

/**
 * Clear prize list
 * @returns 
 */
const ClearPrizes = () => Update({Prizes:[]});

/**
 * Get current state
 * @returns 
 */
const Get = () => MainController.GetState().Raffle;

/**
 * Get history
 * @returns 
 */
const GetHistory = () => Get().Tickets || [];

/**
 * Get current prizes
 * @returns 
 */
const GetPrizes = () => Get().Prizes || [];

/**
 * Get current tickets
 * @returns 
 */
const GetTickets = () => Get().CurrentTickets || [];

/**
 * Get last update timestamp
 * @returns 
 */
const GetUpdateTime = () => MainController.GetState().UpdateTimeRaffle;

/**
 * Remove a ticket
 * @param index 
 * @returns 
 */
const Remove = (index:number = -1) => MainController.RemoveRaffleTicket(index);

/**
 * Subscribe for changes
 * @param f 
 * @returns 
 */
const Subscribe = (f:{():void}) => MainController.Subscribe(f);

/**
 * Update state
 * @param state 
 * @returns 
 */
const Update = (state:SRaffle) => MainController.UpdateRaffleState(state);

const Raffle = {
    Add:Add,
    Clear:Clear,
    ClearHistory:ClearHistory,
    ClearPrizes:ClearPrizes,
    Get:Get,
    GetHistory:GetHistory,
    GetPrizes:GetPrizes,
    GetTickets:GetTickets,
    GetUpdateTime:GetUpdateTime,
    Remove:Remove,
    Subscribe:Subscribe,
    Update:Update
}

export {Raffle};