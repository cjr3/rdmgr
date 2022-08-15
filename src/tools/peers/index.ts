import { Peer, PeerCollection, SMainController } from "tools/vars";

const __Set = (state:SMainController, values:PeerCollection) : SMainController => {
    return {...state, Peers:values, UpdateTimePeers:Date.now()};
};

/**
 * Remove peer records
 * @param state 
 * @param ids 
 * @returns 
 */
export const Remove = (state:SMainController, ids:number[]) : SMainController => {
    return Set(state, Object.values(state.Peers).filter(r => typeof(r.RecordID) === 'number' && ids.indexOf(r.RecordID) < 0));
};

/**
 * 
 * @param state 
 * @param records 
 * @returns 
 */
export const Set = (state:SMainController, records:Peer[]) : SMainController => {
    const result:PeerCollection = {};
    records.forEach(r => {
        if(r.RecordID) {
            result['R-' + r.RecordID] = r;
        }
    });
    return __Set(state, result);
};

/**
 * 
 * @param state 
 * @returns 
 */
export const SetConnectionTime = (state:SMainController) :SMainController => {
    return {...state, PeerConnectionTime:Date.now()}
}

/**
 * Set the local IP Address
 * @param state 
 * @param ip 
 * @returns 
 */
export const SetLocalIP = (state:SMainController, ip:string) : SMainController => {
    return {...state, LocalIPAddress:ip};
};

/**
 * Write changes / add peer records.
 * @param state 
 * @param records 
 * @returns 
 */
export const Write = (state:SMainController, records:Peer[]) : SMainController => {
    const result = {...state.Peers};
    records.forEach(r => {
        if(r.RecordID) {
            result['R-' + r.RecordID] = {...result['R-' + r.RecordID], ...r};
        }
    })
    return __Set(state, result);
};