import Data from "tools/data";
import { MainController } from "tools/MainController";
import { Peer } from "tools/vars";

namespace Peers {
    export const Get = (id?:number|null) => MainController.GetState().Peers[`R-${id}`];
    export const GetRecords = () => Object.values(MainController.GetState().Peers);
    export const Load = () : Promise<Peer[]> => {
        return new Promise((res, rej) => {
            Data.LoadPeers().then(records => {
                Set(records);
                return res(records);
            }).catch(er => rej(er))
        });
    };

    export const Save = () => Data.SavePeers(GetRecords());
    export const Set = (records:Peer[]) => MainController.SetPeers(records);
    export const Write = (records:Peer[]) => MainController.WritePeers(records);
};

export {Peers};