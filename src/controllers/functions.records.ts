import { Record } from 'tools/vars';
import { IRecordController, IRecordControllerState, RecordControllerActions } from './vars';
import { createStore, Unsubscribe, Store } from 'redux';
import { GetRecordsFromFile, SaveRecordsFile, RecordSavers } from './functions.io';

const GetNextRecordID = (records:Array<Record>) => {
    let id:number = 0;
    records.forEach((record) => {
        if(record.RecordID)
            id = record.RecordID;
    })
    return id + 1;
};

const GetRecordIndex = (records:Array<Record>, record:Record) => {
    return records.findIndex(r => r.RecordID == record.RecordID);
};

const AddRecord = (records:Array<Record>, record:Record) => {
    if(GetRecordIndex(records, record) >= 0)
        return records;
    if(record.RecordID <= 0)
        record.RecordID = GetNextRecordID(records);
    return [...records, record];
};

const AddControllerRecord = async (controller:IRecordController, record:Record) : Promise<boolean> => {
    return new Promise((res, rej) => {
        controller.GetStore().dispatch({
            type:RecordControllerActions.ADD,
            record:record
        });
        res(true);
    });
};

const DeleteRecord = (records:Array<Record>, record:Record) => {
    let index:number = GetRecordIndex(records, record);
    if(index < 0)
        return [...records];
    return records.filter(r => r.RecordID != record.RecordID);
};

const DeleteControllerRecord = async (controller:IRecordController, record:Record) : Promise<boolean> => {
    return new Promise((res, rej) => {
        controller.GetStore().dispatch({
            type:RecordControllerActions.DELETE,
            record:record
        });
    });
}

const UpdateRecordInSet = (records:Array<Record>, record:Record) => {
    let index:number = GetRecordIndex(records, record);
    if(index < 0) {
        return AddRecord(records, record);
    }
    let urecords:Array<Record> = [...records];
    urecords[index] = {...urecords[index], ...record};
    return urecords;
};

const UpdateControllerRecord = async (controller:IRecordController, record:Record) : Promise<boolean> => {
    return new Promise((res, rej) => {
        controller.GetStore().dispatch({
            type:RecordControllerActions.UPDATE,
            record:record
        });
        res(true);
    });
};

/**
 * 
 * @param controller The controller to load records to
 * @param filter A function to callback to modify records
 */
const LoadControllerRecords = async (controller:IRecordController, filter?:Function) : Promise<boolean> => {
    return new Promise(async (res, rej) => {
        if(RecordSavers[controller.RecordType]) {
            GetRecordsFromFile(RecordSavers[controller.RecordType].FileName).then((records:Array<any>) => {
                if(filter)
                    filter(records);
                controller.Set(records).then(response => {
                    res(response);
                }).catch(() => {
                    rej(`Failed to set records`);
                });
            }).catch((er:string) => {
                rej(er);
            });
        } else {
            res(false);
        }
    });
};

const SaveControllerRecords = async (controller:IRecordController) : Promise<boolean> => {
    return new Promise(async (res, rej) => {
        let response:boolean|string = await SaveRecordsFile(controller.RecordType, controller.Get());
        if(response === true)
            res(true);
        else
            rej(response);
    });
};

const SetControllerRecords = async (controller:IRecordController, records:Array<any>) : Promise<boolean> => {
    return new Promise((res) => {
        controller.GetStore().dispatch({
            type:RecordControllerActions.SET,
            records:records
        });
        res(true)
    });
};

/**
 * Saves the updated controller records, and then updates the controller.
 * @param controller Controller to update once record is saved
 * @param type RecordType code
 * @param record Record to save
 * @param filter Function to call just before saving, after record has received its ID
 */
const SaveRecord = async (controller:IRecordController, record:Record, filter?:Function) : Promise<boolean> => {
    return new Promise((res, rej) => {
        if(record.RecordType != controller.RecordType) {
            rej("Failed to save record: Incompatible RecordType.");
            return;
        }

        if(record.RecordID <= 0) {
            record.RecordID = GetNextRecordID(controller.Get());
            if(filter)
                filter(record);
        }

        let records:Array<any> = UpdateRecordInSet(controller.Get(), record);

        SaveRecordsFile(record.RecordType, records).then(() => {
            controller.Update(record);
            res(true);
        }).catch((er) => {
            rej(er);
        });
    });
};

export const BaseReducer = (state:any, action:any) => {
    try {
        switch(action.type) {
            case RecordControllerActions.ADD :
                return {...state, Records:AddRecord(state.Records, action.record)}
            break;
            case RecordControllerActions.UPDATE :
                return {...state, Records:UpdateRecordInSet(state.Records, action.record)};
            break;
            case RecordControllerActions.DELETE :
                return {...state, Records:DeleteRecord(state.Records, action.record)}
            break;
            case RecordControllerActions.SET :
                return {...state, Records:action.records};
            case RecordControllerActions.SET_STATE :
                return {...state, ...action.state}
            default :
                return state;
            break;
        }
    } catch(er) {
        return state;
    }
};

const CreateController = (recordtype:string, filename:string, reducer?:any) : any => {
    let store:Store;
    if(reducer)
        store = createStore(reducer);
    else {
        store = createStore(BaseReducer, {
            Records:new Array<any>()
        });
    }
    const controller:IRecordController = {
        Key:recordtype + "C",
        RecordType:recordtype,
        Init(){},
        async Add(record:any) : Promise<boolean> {
            return AddControllerRecord(controller, record);
        },
    
        async Update(record:any) : Promise<boolean> {
            return UpdateControllerRecord(controller, record);
        },
    
        async Delete(record:any) : Promise<boolean> {
            return DeleteControllerRecord(controller, record);
        },
    
        async Set(records:Array<any>) : Promise<boolean> {
            return SetControllerRecords(controller, records);
        },
    
        async Load() : Promise<boolean> {
            return LoadControllerRecords(controller);
        },
    
        async Save() : Promise<boolean> {
            return SaveControllerRecords(controller);
        },
    
        async SaveRecord(record:any) : Promise<boolean> {
            return SaveRecord(controller, record);
        },
    
        NewRecord() : Record {
            let record:Record = {
                RecordID:0,
                RecordType:controller.RecordType,
                Name:'',
                ShortName:'',
                Number:'',
                Color:'',
                Thumbnail:'',
                Photo:'',
                Background:'',
                Slide:'',
                Acronym:''
            };
            return record;
        },
    
        Get() : Array<any> {
            return controller.GetState().Records;
        },
    
        GetRecord(id:number) : any {
            return controller.Get().find((r:any) => r.RecordID == id);
        },
    
        GetStore() : Store<IRecordControllerState, any> {
            return store;
        },
    
        async SetState(state:any) : Promise<boolean> {
            return new Promise((res) => res(true));
        },
    
        GetState() : IRecordControllerState {
            return store.getState();
        },
    
        Subscribe(f:any) : Unsubscribe {
            return store.subscribe(f);
        },

        Dispatch(action:any) {
            store.dispatch(action);
        },
        BuildAPI() {},
        _StateSaver(){}
    };

    controller._StateSaver = async () => controller.Subscribe(controller.Save);

    return controller;
}

export default CreateController;

export {
    GetRecordIndex,
    AddRecord,
    AddControllerRecord,
    DeleteRecord,
    DeleteControllerRecord,
    UpdateRecordInSet,
    UpdateControllerRecord,
    SaveControllerRecords,
    SaveRecord,
    LoadControllerRecords,
    SetControllerRecords,
    CreateController
};