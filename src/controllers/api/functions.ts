import {IAPIController, APIActions, SAPIController} from './vars';
import { Store, createStore } from 'redux';

//user defined endpoints - for integrating your own data
let API_AUTH_TOKEN:string = '';
let API_ENDPOINT_VALIDATE:string = '';
let API_ENDPOINT_AUTH:string = '';
let API_ENDPOINT:string = '';

//RDMGR endpoints
let RDMGR_API_ENDPOINT:string = '';
let RDMGR_AUTH_TOKEN:string = '';
let RDMGR_AUTH_ENDPOINT:string = '';
let RDMGR_VALIDATE_ENDPOINT:string = '';

export const SetAuthToken = (token:string) => {
    API_AUTH_TOKEN = token;
};

export const GetAuthToken = () : string => {
    return API_AUTH_TOKEN;
};

export const SetAuthEndpoint = (url:string) => {
    API_ENDPOINT_AUTH = url;
};

export const GetAuthEndpoint = () : string => {
    return API_ENDPOINT_AUTH;
};

export const SetValidateEndpoint = (url:string) => {
    API_ENDPOINT_VALIDATE = url;
};

export const GetValidateEndpoint = () : string => {
    return API_ENDPOINT_VALIDATE;
};

export const SetEndpoint = (url:string) => {
    API_ENDPOINT = url;
};

export const GetEndpoint = () : string => {
    return API_ENDPOINT;
};

export const GetHeaders = () : any => {
    let headers = {
        "Content-Type":"application/json"
    };

    if(API_AUTH_TOKEN)
        headers["Authorization"] = "Bearer " + API_AUTH_TOKEN;

    return headers;
};

const SendData = async (method:'POST'|'PUT'|'DELETE', target:string, body:any) : Promise<any> => {
    return new Promise((res, rej) => {
        if(!GetEndpoint())
            rej('Failed to send request: API Endpoint not set!');
        else if(!target)
            rej('Failed to send request: please provide a request path!')
        else if(!body)
            rej('Failed to send request: No data to send!');
        else if(!GetAuthToken())
            rej(false);
        else {
            fetch(GetEndpoint() + target, GetInit({
                method:method,
                body:JSON.stringify(body)
            })).then((response) => {
                return response.json();
            }).then((data) => {
                res(data);
            }).catch((er) => {
                rej(er);
            });
        }
    });
};

export const SendPost = async (target:string, body:any) => {
    return SendData('POST', target, body);
};

export const SendPut = async (target:string, body:any) => {
    return SendData('PUT', target, body);
};

export const SendDelete = async (target:string) => {
    return SendData('DELETE', target, {});
};

export const SendGet = async (target:string) : Promise<any> => {
    return new Promise((res, rej) => {
        if(!GetEndpoint())
            rej('Failed to send request: API Endpoint not set!');
        else if(!target)
            rej('Failed to send request: please provide a request path!')
        else {
            fetch(GetEndpoint() + target, GetInit({
                method:"GET"
            })).then((response) => {
                return response.json();
            }).then((data) => {
                res(data);
            }).catch((er) => {
                rej(er);
            });
        }
    });
};

export const GetInit = (...options) : RequestInit => {
    let i:RequestInit = {
        method:"GET",
        mode:"cors",
        cache:"no-cache",
        redirect:"manual",
        headers:GetHeaders()
    };
    if(options && options.length) {
        options.forEach((opt) => {
            i = {...i, ...opt};
        });
    }

    //override - we don't need our application redirecting
    i.redirect = "manual";
    return i;
};

export const ValidateToken = async () : Promise<boolean> => {
    return new Promise((res, rej) => {
        let url:string = API_ENDPOINT_VALIDATE;
        if(!url) {
            rej("Can't authorize token: API Validation Endpoint is not set.");
        } else if(!API_AUTH_TOKEN) {
            rej("Can't authorize token: Please get a token from the API Authorization Endpoint.");
        } else {
            fetch(url, {
                method:"POST",
                mode:"cors",
                cache:"no-cache",
                headers:GetHeaders()
            }).then(() => {
                res(true);
            }).catch(() => {
                rej('Failed!');
            });
        }
    });
};

/**
 * Sends a request to the APIAuthEndpoint to get an authorization token.
 * @param username username
 * @param password password 
 */
export const LoadToken = async (username:string, password:string) : Promise<boolean|string> => {
    return new Promise((res, rej) => {
        let url:string = API_ENDPOINT_AUTH;
        if(!url) {
            rej("Can't send authorization: API Authorization Endpoint is not set.");
        } else {
            fetch(url, {
                method:"POST",
                mode:"cors",
                cache:"no-cache",
                headers:{
                    "Content-Type":"application/json"
                },
                redirect:"manual",
                body:JSON.stringify({
                    username:username,
                    password:password
                })
            }).then((response) => {
                return response.json();
            }).then((data) => {
                if(data && data.token) {
                    API_AUTH_TOKEN = data.token;
                    res(true);
                } else {
                    rej("Login failed. Username/password may be incorrect.");
                }
            }).catch(() => {
                rej("Failed to login.");
            })
        }
    });
};


export const LoadMatches = async (options:any = null) : Promise<any> => {
    return new Promise((res, rej) => {
        let url:string = API_ENDPOINT;
        if(!url) {
            rej("Can't get data: API endpoint is not set.");
        } else {

            url += "/matches";
            let params = new Array<any>();
            if(options) {
                if(options.sdate)
                    params.push("sdate=" + options.sdate);
                if(options.edate)
                    params.push("edate=" + options.edate);
                if(options.order) {
                    params.push("order=" + options.order);
                    params.push("orderby=meta_value");
                }
            }

            if(params.length >= 1) {
                url += "?" + params.join('&');
            }

            fetch(url).then((response) => {
                return response.json();
            }).then((data) => {
                if(data && data.records) {
                    res(data.records);
                } else {
                    res([]);
                }
            }).catch(() => {
                rej(`Failed to load scores from ${url}/matches`);
            });
        }
    });
};

const GetRecordIndex = (records:Array<any>, id:number) => {
    return records.findIndex((r => r.RecordID == id));
}

export const SetRecords = (state:SAPIController, records:Array<any>) => {
    return {...state, Records:records};
};

export const AddRecord = (state:SAPIController, record:any) => {
    if(GetRecordIndex(state.Records, record.RecordID) < 0)
        return {...state, Records:[...state.Records, record]};
    return state;
};

export const UpdateRecord = (state:SAPIController, record:any) => {
    let index:number = GetRecordIndex(state.Records, record.RecordID);
    if(index < 0)
        return state;
    return {...state, Records:[...state.Records, {...state.Records[index], ...record}]};
};

export const DeleteRecord = (state:SAPIController, id:number) => {
    let index:number = GetRecordIndex(state.Records, id);
    if(index < 0)
        return state;
    let records:Array<any> = state.Records.slice();
    records.splice(index, 1);
    return {...state, Records:records};
};

/** Controllers **/
export const BaseReducer = (state:any, action:any) : any => {
    try {
        switch(action.type) {
            case APIActions.SET :
                return SetRecords(state, action.records);
            case APIActions.ADD :
                return AddRecord(state, action.record);
            case APIActions.DELETE :
                return DeleteRecord(state, action.id);
            case APIActions.PURGE :
                return SetRecords(state, new Array<any>());
            case APIActions.UPDATE :
                return UpdateRecord(state, action.record);
            default :
                return state;
        }
    } catch(er) {
        return state;
    }
};

export const CreateController = (key:string, suffix:string, reducer?:any) : any => {
    let store:Store;
    if(reducer)
        store = createStore(reducer);
    else
        store = createStore(BaseReducer, {Records:new Array<any>()});
    let controller:IAPIController = {
        Key:key,
        EndpointSuffix:suffix,
        SetRecords:async (records:Array<any>) => {
            controller.Dispatch({
                type:APIActions.SET,
                records:records
            });
        },
        AddRecord:async (record:any) => {
            controller.Dispatch({
                type:APIActions.ADD,
                record:record
            });
        },
        UpdateRecord: async (record:any) => {
            return new Promise((res, rej) => {
                if(!record || record === null || typeof(record) !== 'object')
                    rej('Please provide a record to save!');
                else if(!record.RecordType)
                    rej('Please provide a RecordType code on your record.');
                else if(!record.RecordID || record.RecordID <= 0)
                    rej('You must provide a record ID greater than zero to update a record.');
                else {
                    SendPut(controller.EndpointSuffix + "/" + record.RecordID, record).then((response) => {
                        if(response && response.RecordID) {
                            controller.Dispatch({
                                type:APIActions.UPDATE,
                                record:response
                            });
                            res(response);
                        } else if(response && response.message) {
                            rej(response.message);
                        } else {
                            rej('Failed to update record: No response received from endpoint.');
                        }
                    }).catch((er) => {
                        rej(er);
                    });
                }
            });
        },
        DeleteRecord: async (id:number) => {
            return new Promise((res, rej) => {
                SendDelete(controller.EndpointSuffix + "/" + id).then((response) => {
                    controller.Dispatch({
                        type:APIActions.DELETE,
                        id:id
                    });
                    res(true);
                }).catch((er) => {
                    rej(er);
                });
            });
        },
        //should be overridden
        NewRecord: async () => {return {};},
        LoadRecord: async (id:number) => {
            return new Promise((res, rej) => {
                SendGet(controller.EndpointSuffix + "/" + id).then((response) => {
                    if(response && response.record) {
                        res(response.record);
                    } else {
                        rej('No record found');
                    }
                }).catch((er) => {
                    rej(er);
                })
            });
        },
        Load: async () : Promise<any> => {
            return new Promise((res, rej) => {
                SendGet(controller.EndpointSuffix).then((response) => {
                    if(response && response.records) {
                        controller.SetRecords(response.records);
                        res(response.records);
                    } else {
                        rej('No records found.');
                    }
                }).catch((er) => {
                    rej(er);
                });
            });
        },
        Get:() => {return store.getState().Records;},
        GetState:() => {return store.getState();},
        GetStore:() => {return store;},
        Dispatch:(action) => {store.dispatch(action);},
        Subscribe:(f) => {return store.subscribe(f);}
    };

    return controller;
};